"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import CodeBlock from '@/app/components/CodeBlock';

export default function Project3Page() {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const projectSteps = [
    {
      title: "Create the Flask App Bootstrap Script (with EBS mount)",
      content: (
        <div className="obsidian-content">
          <p>
            Create a user data script to install Python/Flask, mount a gp3 EBS volume at <code className="obsidian-inline-code">/mnt/ebs</code>, create a simple app, and run it as a systemd service. Save this as <code className="obsidian-inline-code">user-data.sh</code>.
          </p>

          <CodeBlock language="bash">
{`#!/bin/bash

# Log everything this script does
exec > /var/log/user-data.log 2>&1

set -euxo pipefail

# Install Python and Flask
dnf update -y
dnf install -y python3 python3-pip
python3 -m pip install --upgrade pip
python3 -m pip install flask

# EBS device and mount point
DEVICE="/dev/xvdb"
MOUNT_POINT="/mnt/ebs"

# Wait for block device
for i in {1..20}; do
  if [ -b "$DEVICE" ]; then
    break
  fi
  sleep 3
done

# Format if new
if file -s "$DEVICE" | grep -q "data$"; then
  mkfs -t ext4 "$DEVICE"
fi

mkdir -p "$MOUNT_POINT"
UUID=$(blkid -s UUID -o value "$DEVICE")
if ! grep -q "$UUID" /etc/fstab; then
  echo "UUID=$UUID $MOUNT_POINT ext4 defaults,nofail 0 2" >> /etc/fstab
fi

mount -a || mount "$DEVICE" "$MOUNT_POINT"
chown ec2-user:ec2-user "$MOUNT_POINT"

# Seed a file to prove persistence
if [ ! -f "$MOUNT_POINT/test.txt" ]; then
  echo "EBS volume mounted!" > "$MOUNT_POINT/test.txt"
fi

# Minimal Flask app
install -d -o ec2-user -g ec2-user /home/ec2-user/myapp
cat > /home/ec2-user/myapp/app.py << 'EOF'
from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    with open('/mnt/ebs/test.txt', 'r') as f:
        data = f.read()
    return f'Hello from Flask on EC2 with ALB, ASG, and EBS! Data: {data}'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF
chown -R ec2-user:ec2-user /home/ec2-user/myapp

# systemd service
cat > /etc/systemd/system/flask.service << 'EOF'
[Unit]
Description=Flask App
After=network.target

[Service]
User=ec2-user
Group=ec2-user
WorkingDirectory=/home/ec2-user/myapp
ExecStart=/usr/bin/python3 /home/ec2-user/myapp/app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now flask`}
          </CodeBlock>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">💡 Notes</div>
            <div className="obsidian-callout-content">
              The EBS volume is attached by the Launch Template at <code className="obsidian-inline-code">/dev/xvdb</code> and mounted to <code className="obsidian-inline-code">/mnt/ebs</code>. The app reads the file to prove persistence across restarts.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Write the Terraform Configuration (build main.tf in sections)",
      content: (
        <div className="obsidian-content">
          <p>
            We will create <code className="obsidian-inline-code">main.tf</code> in append-only steps. Each bash block appends a section using a here-doc. This mirrors the public configuration and avoids manual copying mistakes.
          </p>

          {/* Download main.tf button */}
          <div className="mt-4 mb-6">
            <a
              href="/main.tf"
              download
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors border border-red-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v8.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V4.5a.75.75 0 01.75-.75zm-7.5 12a.75.75 0 01.75-.75h11.25a.75.75 0 01.75.75v2.25A2.25 2.25 0 0115.75 20.25H8.25A2.25 2.25 0 016 18v-2.25z" clipRule="evenodd" />
              </svg>
              Download full main.tf
            </a>
            <p className="text-gray-400 text-sm mt-2">If your browser opens the file, right-click the link and choose “Save link as…”</p>
          </div>

          <h3 className="obsidian-h3">Create providers and variables</h3>
          <CodeBlock language="bash">
{`# Start main.tf with Terraform settings, AWS provider, and variables
cat > main.tf << 'HCL'
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

variable "region" { description = "AWS region" type = string default = "us-east-1" }
variable "vpc_cidr" { description = "VPC CIDR" type = string default = "10.0.0.0/16" }
variable "public_subnet_cidrs" { description = "Public subnets" type = list(string) default = ["10.0.1.0/24", "10.0.2.0/24"] }
variable "private_subnet_cidrs" { description = "Private subnets" type = list(string) default = ["10.0.101.0/24", "10.0.102.0/24"] }
variable "instance_type" { description = "EC2 type" type = string default = "t3.micro" }
variable "key_name" { description = "EC2 key pair" type = string default = "MyEC2KeyPair" }
variable "iam_instance_profile_name" { description = "Instance profile for SSM" type = string default = "EC2SSMRole" }
variable "ebs_volume_size" { description = "Extra EBS size" type = number default = 8 }
variable "tags" { description = "Common tags" type = map(string) default = { Project = "Project3", ManagedBy = "Terraform" } }
variable "domain_zone_name" { description = "Public hosted zone (e.g. clearedforcloud.com)" type = string default = "" }
variable "subdomain" { description = "Subdomain (e.g. ec2)" type = string default = "ec2" }
variable "create_dns_record" { description = "Create Route53 A-alias" type = bool default = true }

provider "aws" { region = var.region }
HCL`}
          </CodeBlock>

          <h3 className="obsidian-h3">Locals and data sources</h3>
          <CodeBlock language="bash">
{`# Add locals and data lookups (no interpolation to avoid escaping issues)
cat >> main.tf << 'HCL'
locals {
  name_prefix       = "ec2"
  common_tags       = var.tags
  zone_name_with_dot = endswith(var.domain_zone_name, ".") ? var.domain_zone_name : format("%s.", var.domain_zone_name)
  fqdn              = format("%s.%s", var.subdomain, trim(var.domain_zone_name, "."))
}

data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64"
}

data "aws_availability_zones" "available" { state = "available" }

data "aws_route53_zone" "primary" {
  name         = local.zone_name_with_dot
  private_zone = false
}
HCL`}
          </CodeBlock>

          <h3 className="obsidian-h3">VPC, subnets, IGW, NAT, and routing</h3>
          <CodeBlock language="bash">
{`cat >> main.tf << 'HCL'
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = merge(local.common_tags, { Name = "ec2-vpc" })
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[0]
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true
  tags = merge(local.common_tags, { Name = "ec2-public-a" })
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[1]
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true
  tags = merge(local.common_tags, { Name = "ec2-public-b" })
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[0]
  availability_zone = data.aws_availability_zones.available.names[0]
  tags = merge(local.common_tags, { Name = "ec2-private-a" })
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[1]
  availability_zone = data.aws_availability_zones.available.names[1]
  tags = merge(local.common_tags, { Name = "ec2-private-b" })
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, { Name = "ec2-igw" })
}

resource "aws_eip" "nat" { domain = "vpc" tags = merge(local.common_tags, { Name = "ec2-nat-eip" }) }

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public_a.id
  depends_on    = [aws_internet_gateway.gw]
  tags          = merge(local.common_tags, { Name = "ec2-nat" })
}

resource "aws_route_table" "public" { vpc_id = aws_vpc.main.id tags = merge(local.common_tags, { Name = "ec2-public-rt" }) }
resource "aws_route" "public_internet_access" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
}
resource "aws_route_table_association" "public_a" { subnet_id = aws_subnet.public_a.id route_table_id = aws_route_table.public.id }
resource "aws_route_table_association" "public_b" { subnet_id = aws_subnet.public_b.id route_table_id = aws_route_table.public.id }

resource "aws_route_table" "private" { vpc_id = aws_vpc.main.id tags = merge(local.common_tags, { Name = "ec2-private-rt" }) }
resource "aws_route" "private_nat" {
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}
resource "aws_route_table_association" "private_a" { subnet_id = aws_subnet.private_a.id route_table_id = aws_route_table.private.id }
resource "aws_route_table_association" "private_b" { subnet_id = aws_subnet.private_b.id route_table_id = aws_route_table.private.id }
HCL`}
          </CodeBlock>

          <h3 className="obsidian-h3">Security groups</h3>
          <CodeBlock language="bash">
{`cat >> main.tf << 'HCL'
resource "aws_security_group" "alb_sg" {
  name        = "ec2-alb-sg"
  description = "ALB SG allowing HTTP/HTTPS"
  vpc_id      = aws_vpc.main.id

  ingress { from_port = 80  to_port = 80  protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  ingress { from_port = 443 to_port = 443 protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  egress  { from_port = 0   to_port = 0   protocol = "-1"  cidr_blocks = ["0.0.0.0/0"] }

  tags = merge(local.common_tags, { Name = "ec2-alb-sg" })
}

resource "aws_security_group" "ec2_sg" {
  name        = "ec2-ec2-sg"
  description = "Allow ALB to reach app on 5000"
  vpc_id      = aws_vpc.main.id

  ingress { from_port = 5000 to_port = 5000 protocol = "tcp" security_groups = [aws_security_group.alb_sg.id] }
  egress  { from_port = 0    to_port = 0    protocol = "-1" cidr_blocks = ["0.0.0.0/0"] }

  tags = merge(local.common_tags, { Name = "ec2-ec2-sg" })
}
HCL`}
          </CodeBlock>

          <h3 className="obsidian-h3">ALB, target group, and listeners (HTTP→HTTPS)</h3>
          <CodeBlock language="bash">
{`cat >> main.tf << 'HCL'
resource "aws_lb" "alb" {
  name               = "ec2-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]
  tags               = merge(local.common_tags, { Name = "ec2-alb" })
}

resource "aws_lb_target_group" "ec2" {
  name     = "ec2-tg"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  health_check { path = "/" protocol = "HTTP" matcher = "200" interval = 30 timeout = 5 healthy_threshold = 2 unhealthy_threshold = 2 }
  tags = merge(local.common_tags, { Name = "ec2-tg" })
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action { type = "redirect" redirect { port = "443" protocol = "HTTPS" status_code = "HTTP_301" } }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.this.arn
  default_action { type = "forward" target_group_arn = aws_lb_target_group.ec2.arn }
  depends_on = [aws_acm_certificate_validation.this]
}
HCL`}
          </CodeBlock>

          <h3 className="obsidian-h3">Launch Template with EBS and user data</h3>
          <CodeBlock language="bash">
{`cat >> main.tf << 'HCL'
resource "aws_launch_template" "ec2" {
  name_prefix   = "ec2-lt-"
  image_id      = data.aws_ssm_parameter.al2023_ami.value
  instance_type = var.instance_type
  key_name      = var.key_name

  iam_instance_profile { name = var.iam_instance_profile_name }
  user_data = filebase64("user-data.sh")

  network_interfaces {
    associate_public_ip_address = false
    security_groups             = [aws_security_group.ec2_sg.id]
  }

  block_device_mappings {
    device_name = "/dev/xvdb"
    ebs { volume_size = var.ebs_volume_size volume_type = "gp3" delete_on_termination = true }
  }

  tag_specifications { resource_type = "instance" tags = merge(local.common_tags, { Name = "ec2-instance" }) }
}

resource "aws_autoscaling_group" "ec2" {
  name                      = "ec2-asg"
  max_size                  = 4
  min_size                  = 2
  desired_capacity          = 2
  vpc_zone_identifier       = [aws_subnet.private_a.id, aws_subnet.private_b.id]
  target_group_arns         = [aws_lb_target_group.ec2.arn]
  health_check_type         = "ELB"
  health_check_grace_period = 300

  launch_template { id = aws_launch_template.ec2.id version = "$Latest" }

  tag { key = "Name" value = "ec2-instance" propagate_at_launch = true }
}
HCL`}
          </CodeBlock>

          <h3 className="obsidian-h3">DNS (Route 53) and ACM certificate (HTTPS)</h3>
          <CodeBlock language="bash">
{`cat >> main.tf << 'HCL'
resource "aws_route53_record" "alb_alias" {
  count   = var.create_dns_record ? 1 : 0
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = local.fqdn
  type    = "A"
  allow_overwrite = true
  alias { name = aws_lb.alb.dns_name zone_id = aws_lb.alb.zone_id evaluate_target_health = true }
}

resource "aws_acm_certificate" "this" {
  domain_name       = local.fqdn
  validation_method = "DNS"
  tags              = merge(local.common_tags, { Name = local.fqdn })
  lifecycle { create_before_destroy = true }
}

resource "aws_route53_record" "acm_validation" {
  for_each = { for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => { name = dvo.resource_record_name, type = dvo.resource_record_type, value = dvo.resource_record_value } }
  zone_id = data.aws_route53_zone.primary.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 300
  allow_overwrite = true
  records = [each.value.value]
}

resource "aws_acm_certificate_validation" "this" {
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for r in aws_route53_record.acm_validation : r.fqdn]
}

output "alb_dns_name" { description = "ALB DNS" value = aws_lb.alb.dns_name }
output "alb_zone_id"  { description = "ALB Zone ID" value = aws_lb.alb.zone_id }
output "asg_name"     { description = "ASG name" value = aws_autoscaling_group.ec2.name }
HCL`}
          </CodeBlock>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">📌 Tip</div>
            <div className="obsidian-callout-content">
              These snippets are functionally equivalent to the public <code className="obsidian-inline-code">main.tf</code> and avoid interpolation syntax so they render cleanly here. You can also copy from <code className="obsidian-inline-code">/public/main.tf</code> directly.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Initialize and Apply Terraform",
      content: (
        <div className="obsidian-content">
          <p>Initialize providers, review the plan, and apply.</p>
          <CodeBlock language="bash">
{`terraform init -upgrade
terraform plan \
  -var "domain_zone_name=clearedforcloud.com" \
  -var "subdomain=ec2" \
  -out tfplan
terraform apply "tfplan"`}
          </CodeBlock>
          <div className="obsidian-callout">
            <div className="obsidian-callout-title">⏳ Certificate Validation</div>
            <div className="obsidian-callout-content">
              Terraform requests an ACM cert and creates DNS validation records; issuance can take a few minutes. The HTTPS listener is created only after validation.
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-3/ec2-3-2-tfapply.png" 
              alt="Flask application response behind ALB" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>
        </div>
      )
    },
    {
      title: "Test ALB and ASG Behavior",
      content: (
        <div className="obsidian-content">
          <p>Test the ALB DNS and verify the app returns data read from the EBS volume.
            In a browser visit the subdomain you created. In this example it is https://ec2.clearedforcloud.com
          </p>
          <br />
          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-3/ec2-3-4-confirmation.png" 
              alt="Flask application response behind ALB" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>
          <p>If you try and access the ALB directly it should give you this error because 
            the ACM does not match based on the subdomain.</p>
         <br />
          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-3/ec2-3-3-alb-error.png" 
              alt="Flask application response behind ALB" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>
          <br />
          <p>Verify HTTP forwarding works by entering the http address and watching the automatic redirect to https. 
            Network logs will show the 301 code and the redirect.
          </p>

          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-3/ec2-3-8-301.png" 
              alt="Flask application response behind ALB" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>
          <br />
        </div>
      )
    },
    {
      title: "Simulate Failure and Observe Auto Healing",
      content: (
        <div className="obsidian-content">
          <p>Terminate one instance and watch ASG replace it; target health will transition and recover.</p>
          <CodeBlock language="bash">
{`ASG_NAME=$(terraform output -raw asg_name)
REGION=us-east-1

# Pick one in-service instance
IID=$(aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names "$ASG_NAME" \
  --region $REGION \
  --query "AutoScalingGroups[0].Instances[?LifecycleState=='InService']|[0].InstanceId" \
  --output text)

aws autoscaling terminate-instance-in-auto-scaling-group \
  --instance-id "$IID" \
  --no-should-decrement-desired-capacity \
  --region $REGION

TG_ARN=$(aws elbv2 describe-target-groups \
  --names ec2-tg \
  --region $REGION \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text)

for i in {1..10}; do
  echo "--- Poll $i ---"
  aws autoscaling describe-auto-scaling-groups \
    --auto-scaling-group-names "$ASG_NAME" \
    --region $REGION \
    --query "AutoScalingGroups[0].Instances[].{Id:InstanceId,LC:LifecycleState,AZ:AvailabilityZone}" \
    --output table | sed -n '1,20p'
  aws elbv2 describe-target-health \
    --target-group-arn "$TG_ARN" \
    --region $REGION \
    --query 'TargetHealthDescriptions[].TargetHealth.State' \
    --output text || true
  curl -s -o /dev/null -w "%{http_code}\n" https://ec2.clearedforcloud.com/
  sleep 15
done`}
          </CodeBlock>
          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-3/ec2-3-7-instance-term.png" 
              alt="ASG replacement cycle view" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>

          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-3/ec2-3-6-asg-pre-term.png" 
              alt="ASG replacement cycle view" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>

          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-3/ec2-3-5-poll1.png" 
              alt="ASG replacement cycle view" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>
          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-3/ec2-3-9-poll4.png" 
              alt="ASG replacement cycle view" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>
          
        </div>
      )
    },
    {
      title: "Clean Up Resources",
      content: (
        <div className="obsidian-content">
          <p>Destroy the stack to avoid charges (NAT GW is billed hourly).</p>
          <CodeBlock language="bash">
{`terraform destroy`}
          </CodeBlock>
          <div className="obsidian-callout obsidian-warning">
            <div className="obsidian-callout-title">💰 Cost Reminder</div>
            <div className="obsidian-callout-content">
              NAT Gateway is the priciest component here. Destroy the stack when finished.
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-8">
      <style dangerouslySetInnerHTML={{
        __html: `
        .obsidian-content { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; line-height: 1.6; color: #dcddde; }
        .obsidian-h3 { font-size: 1.25rem; font-weight: 600; color: #f1f5f9; margin: 1.25rem 0 0.5rem 0; line-height: 1.3; }
        .obsidian-inline-code { background-color: #2d3748; color: #e2e8f0; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; font-size: 0.875em; border: 1px solid #4a5568; }
        .obsidian-callout { background-color: rgba(239, 68, 68, 0.1); border: 1px solid #fecaca; border-left: 4px solid #ef4444; border-radius: 0.5rem; margin: 1rem 0; padding: 1rem; }
        .obsidian-callout.obsidian-warning { background-color: rgba(245, 158, 11, 0.1); border-color: #f59e0b; border-left-color: #f59e0b; }
        .obsidian-callout-title { font-weight: 600; color: #ffffff; margin-bottom: 0.5rem; font-size: 0.875rem; }
        .obsidian-callout-content { color: #e2e8f0; font-size: 0.875rem; line-height: 1.5; }
        `
      }} />

      {/* Header */}
      <header className="text-center py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link href="/projects/ec2" className="text-red-500 hover:text-red-400 transition-colors">EC2 Series</Link>
            <span className="text-gray-500">→</span>
            <span className="text-gray-300">Project 3</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Flask on EC2 with ALB, ASG, EBS — Terraform</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ textWrap: 'balance', wordSpacing: '0.1em', lineHeight: '1.4' }}>
            Automate the Project 2 stack with Terraform and add persistent EBS storage plus HTTPS.
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6"><h3 className="text-red-500 font-bold mb-2">Difficulty</h3><span className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">Intermediate</span></div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6"><h3 className="text-red-500 font-bold mb-2">Duration</h3><p className="text-gray-300">1-2 hours</p></div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6"><h3 className="text-red-500 font-bold mb-2">Cost</h3><p className="text-gray-300">~$1 (more if left running)</p></div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 shadow-xl">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">Project Overview</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                This project automates the Flask app deployed in Project 2 by using Terraform to provision the VPC, ALB, Auto Scaling Group, and EC2 instances. It also adds a gp3 EBS volume to each instance for persistent storage and enables HTTPS with ACM.
              </p>
            </div>
          </section>

          {/* Learning Objectives */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Learning Objectives
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Technical Skills</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Provision AWS with Terraform (providers, variables, resources)</li>
                  <li>• Build user-data and a systemd service to run a Flask app</li>
                  <li>• Attach and mount EBS volumes for persistent application data</li>
                  <li>• Automate HTTPS and DNS using ACM and Route 53</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">AWS Concepts</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• VPC design with public/private subnets, IGW, and NAT Gateway</li>
                  <li>• Application Load Balancer, Target Groups, and health checks</li>
                  <li>• Auto Scaling Groups with Launch Templates and user data</li>
                  <li>• DNS alias records and ACM certificate validation flows</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technologies Used */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Technologies Used
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">Terraform</div>
                <div className="text-gray-400 text-sm">Infrastructure as Code</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">Flask</div>
                <div className="text-gray-400 text-sm">Web Framework</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">ALB</div>
                <div className="text-gray-400 text-sm">Load Balancer</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">Auto Scaling</div>
                <div className="text-gray-400 text-sm">Scaling Groups</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">VPC</div>
                <div className="text-gray-400 text-sm">Networking</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">EBS</div>
                <div className="text-gray-400 text-sm">Persistent Storage</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">Route 53</div>
                <div className="text-gray-400 text-sm">DNS</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">ACM</div>
                <div className="text-gray-400 text-sm">TLS Certificates</div>
              </div>
            </div>
          </section>

          {/* Prerequisites */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Prerequisites
            </h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <ul className="text-gray-300 space-y-2">
                <li>• Terraform installed and configured</li>
                <li>• AWS CLI installed (for verification and manual checks)</li>
                <li>• EC2 Key Pair created (e.g., <code className="obsidian-inline-code">MyEC2KeyPair</code>)<br />
                  <span className="text-gray-400 text-sm">See Appendix for instructions if you need to create</span>
                </li>
                <li>• IAM Role for EC2 with SSM permissions (e.g., <code className="obsidian-inline-code">EC2SSMRole</code>)<br />
                  <span className="text-gray-400 text-sm">See Appendix for instructions if you need to create</span>
                </li>
                <li>• Basic familiarity with EC2, VPCs, and Terraform</li>
                <li>• A domain you control in Route 53 (e.g., <code className="obsidian-inline-code">clearedforcloud.com</code>) for creating <code className="obsidian-inline-code">ec2.clearedforcloud.com</code> — Terraform will request/validate the ACM cert automatically</li>
              </ul>
            </div>
          </section>

          {/* Architecture */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">Architecture Overview</h2>
            <div className="bg-gray-700 rounded-lg p-6 flex justify-center items-center">
              <div className="flex justify-center items-center w-full">
                <Image src="/projects/ec2-project-series/project-3/ec2-3-architecture.png" alt="Architecture diagram for EC2 Terraform project" width={800} height={600} className="max-w-2xl rounded-lg border border-gray-600 shadow-lg" />
              </div>
            </div>
          </section>

          {/* Steps */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">Project Steps</h2>
            <div className="space-y-4">
              {projectSteps.map((step, index) => (
                <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-600 transition-colors" onClick={() => toggleStep(index)}>
                    <div className="flex items-center">
                      <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">{index + 1}</div>
                      <p className="text-gray-300">{step.title}</p>
                    </div>
                    <div className="text-gray-400">{expandedSteps.has(index) ? '−' : '+'}</div>
                  </div>
                  {expandedSteps.has(index) && (
                    <div className="px-4 pb-4 border-t border-gray-600">
                      <div className="mt-4 text-gray-300 max-w-none">{step.content}</div>
                      <div className="mt-6 pt-4 border-t border-gray-600 flex justify-end">
                        <button onClick={() => toggleStep(index)} className="text-gray-400 hover:text-gray-300 transition-colors text-lg font-semibold cursor-pointer">−</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/projects/ec2/project2" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">← Project 2: Flask App with ALB & ASG (CLI)</Link>
          <Link href="/projects/ec2/project4" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition-colors">Project 4: CDK and P2M →</Link>
        </div>
      </main>
    </div>
  );
}
