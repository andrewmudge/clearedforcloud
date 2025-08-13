# Terraform settings block
# - required_version: ensures you run with a recent Terraform CLI.
# - required_providers: pins provider source and minimum version for reproducible builds.
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

## -------------------------
## Inputs (variables)
## These let you customize the deployment without editing resource blocks.
## -------------------------
variable "region" {
  description = "AWS region to deploy into (e.g., us-east-1)"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC (address space). Must not overlap with your on-prem or other networks if peering/VPN is planned."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Two public subnets (one per AZ) for ALB/NAT. Public subnets auto-assign public IPs."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Two private subnets (one per AZ) for EC2/ASG. No public IPs; outbound only via NAT."
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "instance_type" {
  description = "EC2 instance type for app servers (CPU/RAM). t3.micro qualifies for free-tier in many regions."
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Existing EC2 key pair name (used for SSH if you allow it in SGs)."
  type        = string
  default     = "MyEC2KeyPair"
}

variable "iam_instance_profile_name" {
  description = "IAM Instance Profile attached to EC2 (should include AmazonSSMManagedInstanceCore for Session Manager access)."
  type        = string
  default     = "EC2SSMRole"
}

variable "ebs_volume_size" {
  description = "Size (GiB) of the extra gp3 EBS volume attached to each instance for app data."
  type        = number
  default     = 8
}

variable "tags" {
  description = "Common tags applied to all resources (cost allocation, ownership, etc.)."
  type        = map(string)
  default = {
    Project   = "Project3"
    ManagedBy = "Terraform"
  }
}

variable "domain_zone_name" {
  description = "Public hosted zone name in Route 53 (e.g., clearedforcloud.com.)"
  type        = string
  default     = ""
}

variable "subdomain" {
  description = "Subdomain to create in Route 53 (e.g., \"ec2\" for ec2.example.com)."
  type        = string
  default     = "ec2"
}

variable "create_dns_record" {
  description = "Whether to create/update the Route 53 A-alias record for the app FQDN. Set to false if the record already exists and you don't want Terraform to manage it."
  type        = bool
  default     = true
}

# AWS provider configuration: uses the chosen region.
provider "aws" {
  region = var.region
}

# Locals: convenience values used in multiple places
# - name_prefix standardizes resource names
# - common_tags merges user-provided tags everywhere
locals {
  name_prefix = "ec2"
  common_tags = var.tags
  # Ensure the hosted zone name ends with a dot for Route 53 APIs
  zone_name_with_dot = endswith(var.domain_zone_name, ".") ? var.domain_zone_name : "${var.domain_zone_name}."
  # Fully qualified domain name for the app (subdomain + base domain)
  fqdn = "${var.subdomain}.${trim(var.domain_zone_name, ".")}"
}

# Data source: fetches the latest official Amazon Linux 2023 AMI ID
# Why: AMI IDs change frequently. Using the SSM Parameter keeps images up-to-date automatically.
data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64"
}

# Data source: lists available Availability Zones in the region
# We pick the first two to spread resources for high availability.
data "aws_availability_zones" "available" {
  state = "available"
}

# Route 53 Hosted Zone lookup (public zone)
data "aws_route53_zone" "primary" {
  name         = local.zone_name_with_dot
  private_zone = false
}

# VPC (Virtual Private Cloud)
# - Provides isolated networking for your application.
# - /16 CIDR gives room for many subnets (/24 each).
# - DNS support/hostnames are required for features like ALB targets and SSM.
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = merge(local.common_tags, { Name = "${local.name_prefix}-vpc" })
}

# Public Subnet A
# - Lives in AZ[0].
# - map_public_ip_on_launch=true means instances launched here get public IPs by default.
# - We'll place the ALB and NAT Gateway in public subnets.
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[0]
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true
  tags                    = merge(local.common_tags, { Name = "${local.name_prefix}-public-a" })
}

# Public Subnet B
# - Lives in AZ[1] to give the ALB cross-AZ resilience.
resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[1]
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true
  tags                    = merge(local.common_tags, { Name = "${local.name_prefix}-public-b" })
}

# Private Subnet A
# - Lives in AZ[0].
# - For EC2/ASG instances; no public IPs for better security posture.
resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[0]
  availability_zone = data.aws_availability_zones.available.names[0]
  tags              = merge(local.common_tags, { Name = "${local.name_prefix}-private-a" })
}

# Private Subnet B
# - Lives in AZ[1] to allow ASG to span multiple AZs for availability.
resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[1]
  availability_zone = data.aws_availability_zones.available.names[1]
  tags              = merge(local.common_tags, { Name = "${local.name_prefix}-private-b" })
}

# Internet Gateway (IGW)
# - Attaches to the VPC and provides a path to the public internet for public subnets.
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, { Name = "${local.name_prefix}-igw" })
}

# Elastic IP (EIP)
# - Allocated for the NAT Gateway to use a stable public IP for outbound traffic from private subnets.
resource "aws_eip" "nat" {
  domain = "vpc"
  tags   = merge(local.common_tags, { Name = "${local.name_prefix}-nat-eip" })
}

# NAT Gateway
# - Lives in a public subnet.
# - Lets instances in private subnets reach the internet for updates (yum/pip), SSM, etc.
# - Has hourly and data processing costs—remember to destroy when done.
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id
  depends_on    = [aws_internet_gateway.gw]
  tags          = merge(local.common_tags, { Name = "${local.name_prefix}-nat" })
}

# Public Route Table
# - Contains a default route to the Internet Gateway; associated to both public subnets.
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, { Name = "${local.name_prefix}-public-rt" })
}

# Default route for public subnets: all traffic (0.0.0.0/0) via IGW
resource "aws_route" "public_internet_access" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
}

# Associate the public subnets with the public route table
resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

# Private Route Table
# - Has a default route to the NAT Gateway for outbound-only internet access from private subnets.
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, { Name = "${local.name_prefix}-private-rt" })
}

# Default route for private subnets: all traffic (0.0.0.0/0) via NAT GW
resource "aws_route" "private_nat" {
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}

# Associate the private subnets with the private route table
resource "aws_route_table_association" "private_a" {
  subnet_id      = aws_subnet.private_a.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_b" {
  subnet_id      = aws_subnet.private_b.id
  route_table_id = aws_route_table.private.id
}

# Security Group for ALB
# - Inbound: allow HTTP (80) and HTTPS (443) from anywhere. Consider restricting by CIDR/WAF in production.
# - Outbound: allow all so ALB can reach targets and health check endpoints.
resource "aws_security_group" "alb_sg" {
  name        = "${local.name_prefix}-alb-sg"
  description = "ALB SG allowing HTTP/HTTPS"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, { Name = "${local.name_prefix}-alb-sg" })
}

# Security Group for EC2 instances
# - Inbound: only allow app traffic (5000) from the ALB security group, not from the internet.
# - Outbound: allow all so instances can update packages and reach AWS services via NAT/SSM.
resource "aws_security_group" "ec2_sg" {
  name        = "${local.name_prefix}-ec2-sg"
  description = "Allow ALB to reach app on port 5000"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, { Name = "${local.name_prefix}-ec2-sg" })
}

# Application Load Balancer (ALB)
# - Public-facing (internal=false) so users on the internet can connect.
# - Spans two public subnets (different AZs) for availability.
# - Uses the ALB security group defined above.
resource "aws_lb" "alb" {
  name               = "${local.name_prefix}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
  tags               = merge(local.common_tags, { Name = "${local.name_prefix}-alb" })
}

# Target Group
# - Registers EC2 instances (via ASG) behind the ALB on port 5000 (HTTP).
# - Health checks probe '/' every 30s; if checks fail, the target is removed and traffic stops being sent.
resource "aws_lb_target_group" "ec2" {
  name     = "${local.name_prefix}-tg"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
  tags = merge(local.common_tags, { Name = "${local.name_prefix}-tg" })
}

# Listener on port 80 (HTTP)
# - Performs a 301 redirect to HTTPS (443) so all traffic is encrypted end-to-end to the ALB.
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Listener on port 443 (HTTPS)
# - Terminates TLS using your ACM certificate (provided via variable).
# - Forwards requests to the target group on HTTP:5000.
# - ssl_policy sets allowed ciphers/protocols (here: modern TLS 1.2/1.3 policy).
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.this.arn

  default_action {
    type             = "forward"
  target_group_arn = aws_lb_target_group.ec2.arn
  }

  # Ensure the certificate is validated before creating the HTTPS listener
  depends_on = [aws_acm_certificate_validation.this]
}

# Launch Template (compute configuration template)
# - image_id comes from the SSM parameter (latest AL2023).
# - network is private (no public IP); instances are reachable via SSM Session Manager.
# - user_data bootstraps the app and mounts EBS persistently.
# - block_device_mappings adds a gp3 EBS volume at /dev/xvdb for app data.
resource "aws_launch_template" "ec2" {
  name_prefix   = "${local.name_prefix}-lt-"
  image_id      = data.aws_ssm_parameter.al2023_ami.value
  instance_type = var.instance_type
  key_name      = var.key_name

  iam_instance_profile {
    name = var.iam_instance_profile_name
  }

  user_data = filebase64("user-data.sh")

  network_interfaces {
    associate_public_ip_address = false
  security_groups             = [aws_security_group.ec2_sg.id]
  }

  block_device_mappings {
    device_name = "/dev/xvdb"
    ebs {
      volume_size           = var.ebs_volume_size
      volume_type           = "gp3"
      delete_on_termination = true
    }
  }

  tag_specifications {
    resource_type = "instance"
    tags          = merge(local.common_tags, { Name = "${local.name_prefix}-instance" })
  }
}

# Auto Scaling Group (ASG)
# - Maintains desired_capacity instances across two private subnets/AZs.
# - Registers instances with the target group automatically.
# - health_check_type="ELB" means instance health is tied to ALB target health (better for web apps).
# - health_check_grace_period allows time for bootstrapping before health checks count.
resource "aws_autoscaling_group" "ec2" {
  name                      = "${local.name_prefix}-asg"
  max_size                  = 4
  min_size                  = 2
  desired_capacity          = 2
  vpc_zone_identifier       = [aws_subnet.private_a.id, aws_subnet.private_b.id]
  target_group_arns         = [aws_lb_target_group.ec2.arn]
  health_check_type         = "ELB"
  health_check_grace_period = 300

  launch_template {
  id      = aws_launch_template.ec2.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "${local.name_prefix}-instance"
    propagate_at_launch = true
  }
}

# DNS (Route 53): create an A-record alias pointing your subdomain to the ALB
resource "aws_route53_record" "alb_alias" {
  count   = var.create_dns_record ? 1 : 0
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.fqdn
  type    = "A"
  allow_overwrite = true
  alias {
    name                   = aws_lb.alb.dns_name
    zone_id                = aws_lb.alb.zone_id
    evaluate_target_health = true
  }
}

# ACM Certificate: public certificate for the app FQDN, validated via DNS (managed in Route 53)
resource "aws_acm_certificate" "this" {
  domain_name       = local.fqdn
  validation_method = "DNS"
  tags              = merge(local.common_tags, { Name = local.fqdn })

  lifecycle {
    create_before_destroy = true
  }
}

# Create DNS validation records for the ACM certificate
resource "aws_route53_record" "acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  }
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 300
  allow_overwrite = true
  records = [each.value.value]
}

# Tell ACM to validate the certificate using the Route 53 records we created
resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for r in aws_route53_record.acm_validation : r.fqdn]
}

# Outputs
# - alb_dns_name: copy/paste to browse your app (or use for Route 53 alias).
# - alb_zone_id: needed when creating alias records in Route 53.
# - asg_name: handy for CLI queries and troubleshooting.
output "alb_dns_name" {
  description = "Public DNS name of the ALB"
  value       = aws_lb.alb.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the ALB (for Route 53 alias records)"
  value       = aws_lb.alb.zone_id
}

output "asg_name" {
  description = "Auto Scaling Group name"
  value       = aws_autoscaling_group.ec2.name
}
