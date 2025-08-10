'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import CodeBlock from '@/app/components/CodeBlock';

export default function Project2Page() {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const projectSteps = [
    {
      title: "Create the Flask App Bootstrap Script",
      content: (
        <div className="obsidian-content">
          <p>
            Create a shell script to install dependencies, create the app.py, and run Flask on boot.
          </p>

          <h3 className="obsidian-h3">Create user-data.sh</h3>
          <p>
            From the <code className="obsidian-inline-code">/myapp</code> directory use <code className="obsidian-inline-code">nano user-data.sh</code> to open a terminal editor and paste in the following:
          </p>

          <CodeBlock language="bash">
{`#!/bin/bash
exec > /var/log/user-data.log 2>&1
set -x

# Update and install Python/Flask
dnf update -y
dnf install -y python3-pip -y
pip3 install --upgrade pip
pip3 install flask

# Create app directory
mkdir -p /home/ec2-user/myapp
cd /home/ec2-user/myapp

# Create Flask app
cat << 'EOF' > app.py
from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello from Flask on EC2 with ALB and ASG!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
EOF

# Run the app as ec2-user (important!)
runuser -l ec2-user -c 'nohup python3 /home/ec2-user/myapp/app.py > /home/ec2-user/myapp/flask.log 2>&1 &'`}
          </CodeBlock>

          <h3 className="obsidian-h3">Convert to Base64</h3>
          <p>
            Convert the script to base64 format for EC2 processing:
          </p>

          <CodeBlock language="bash">
{`base64 -w 0 user-data.sh > user-data.b64`}
          </CodeBlock>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">💡 Note</div>
            <div className="obsidian-callout-content">
              We will reference the &quot;user-data.b64&quot; script when creating our launch template.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Create a Custom VPC with Public and Private Subnets",
      content: (
        <div className="obsidian-content">
          <p>
            Create a complete VPC infrastructure with public and private subnets across multiple availability zones for high availability.
          </p>
          
          <div className="obsidian-callout">
            <div className="obsidian-callout-title">💡 CIDR Range</div>
            <div className="obsidian-callout-content">
              For this project we will use <code className="obsidian-inline-code">10.0.0.0/16</code> which provides 65,536 IP addresses and is part of the Private IP Range (RFC 1918).
            </div>
          </div>

          <h3 className="obsidian-h3">Create VPC</h3>
          <CodeBlock language="bash">
{`aws ec2 create-vpc \\
  --cidr-block 10.0.0.0/16 \\
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=MyVPC}]'`}
          </CodeBlock>

          <p>Save the VPC ID in a variable:</p>
          <CodeBlock language="bash">
{`VPC_ID=$(aws ec2 describe-vpcs \\
  --filters "Name=tag:Name,Values=MyVPC" \\
  --query "Vpcs[0].VpcId" \\
  --output text)`}
          </CodeBlock>

          <h3 className="obsidian-h3">Enable DNS Support</h3>
          <p>
            Enable DNS support and hostnames for instances within your VPC:
          </p>
          
          <CodeBlock language="bash">
{`aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames`}
          </CodeBlock>

          <h3 className="obsidian-h3">Create Public Subnets</h3>
          <p>
            Create 2 public subnets in different Availability Zones for high availability:
          </p>

          <CodeBlock language="bash">
{`# Public Subnet 1
PUBLIC_SUBNET_ID=$(aws ec2 create-subnet \\
  --vpc-id $VPC_ID \\
  --cidr-block 10.0.1.0/24 \\
  --availability-zone us-east-1a \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=PublicSubnet1}]' \\
  --query 'Subnet.SubnetId' \\
  --output text)

# Public Subnet 2
aws ec2 create-subnet \\
  --vpc-id $VPC_ID \\
  --cidr-block 10.0.2.0/24 \\
  --availability-zone us-east-1b \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=PublicSubnet2}]'`}
          </CodeBlock>

          <h3 className="obsidian-h3">Create Private Subnets</h3>
          <CodeBlock language="bash">
{`# Private Subnet 1
PRIVATE_SUBNET1_ID=$(aws ec2 create-subnet \\
  --vpc-id $VPC_ID \\
  --cidr-block 10.0.101.0/24 \\
  --availability-zone us-east-1a \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=PrivateSubnet1}]' \\
  --query 'Subnet.SubnetId' \\
  --output text)

# Private Subnet 2
PRIVATE_SUBNET2_ID=$(aws ec2 create-subnet \\
  --vpc-id $VPC_ID \\
  --cidr-block 10.0.102.0/24 \\
  --availability-zone us-east-1b \\
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=PrivateSubnet2}]' \\
  --query 'Subnet.SubnetId' \\
  --output text)`}
          </CodeBlock>

          <h3 className="obsidian-h3">Create Internet Gateway and Routing</h3>
          <CodeBlock language="bash">
{`aws ec2 create-internet-gateway \\
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=MyIGW}]'

IGW_ID=$(aws ec2 describe-internet-gateways \\
  --filters "Name=tag:Name,Values=MyIGW" \\
  --query "InternetGateways[0].InternetGatewayId" \\
  --output text)

aws ec2 attach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID`}
          </CodeBlock>

          <div className="obsidian-callout obsidian-warning">
            <div className="obsidian-callout-title">⚠️ Cost Alert</div>
            <div className="obsidian-callout-content">
              NAT Gateway charges $0.045/hour. Make sure to delete it when done testing!
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Create Security Groups for ALB and EC2",
      content: (
        <div className="obsidian-content">
          <p>
            Set up security groups to control traffic flow between the internet, load balancer, and EC2 instances.
          </p>

          <h3 className="obsidian-h3">Create ALB Security Group</h3>
          <p>
            The ALB security group allows inbound HTTP traffic from the internet:
          </p>

          <CodeBlock language="bash">
{`ALB_SG_ID=$(aws ec2 create-security-group \\
  --group-name MyALBSecurityGroup \\
  --description "Security group for Application Load Balancer" \\
  --vpc-id $VPC_ID \\
  --query 'GroupId' \\
  --output text)

# Allow HTTP traffic from anywhere
aws ec2 authorize-security-group-ingress \\
  --group-id $ALB_SG_ID \\
  --protocol tcp \\
  --port 80 \\
  --cidr 0.0.0.0/0

echo "ALB Security Group ID: $ALB_SG_ID"`}
          </CodeBlock>

          <h3 className="obsidian-h3">Create EC2 Security Group</h3>
          <p>
            The EC2 security group allows traffic only from the ALB and SSH access:
          </p>

          <CodeBlock language="bash">
{`EC2_SG_ID=$(aws ec2 create-security-group \\
  --group-name MyEC2SecurityGroup \\
  --description "Security group for EC2 instances" \\
  --vpc-id $VPC_ID \\
  --query 'GroupId' \\
  --output text)

# Allow Flask app traffic (port 5000) from ALB only
aws ec2 authorize-security-group-ingress \\
  --group-id $EC2_SG_ID \\
  --protocol tcp \\
  --port 5000 \\
  --source-group $ALB_SG_ID

# Allow SSH access (optional - for debugging)
aws ec2 authorize-security-group-ingress \\
  --group-id $EC2_SG_ID \\
  --protocol tcp \\
  --port 22 \\
  --cidr 0.0.0.0/0

echo "EC2 Security Group ID: $EC2_SG_ID"`}
          </CodeBlock>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">🔒 Security Best Practice</div>
            <div className="obsidian-callout-content">
              Notice that EC2 instances only accept traffic from the ALB, not directly from the internet. This creates a secure multi-tier architecture.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Create Application Load Balancer",
      content: (
        <div className="obsidian-content">
          <p>
            Set up an Application Load Balancer to distribute traffic across multiple EC2 instances.
          </p>

          <h3 className="obsidian-h3">Create Target Group</h3>
          <p>
            First, create a target group for the EC2 instances:
          </p>

          <CodeBlock language="bash">
{`TARGET_GROUP_ARN=$(aws elbv2 create-target-group \\
  --name MyFlaskTargetGroup \\
  --protocol HTTP \\
  --port 5000 \\
  --vpc-id $VPC_ID \\
  --health-check-path / \\
  --health-check-interval-seconds 30 \\
  --health-check-timeout-seconds 5 \\
  --healthy-threshold-count 2 \\
  --unhealthy-threshold-count 3 \\
  --query 'TargetGroups[0].TargetGroupArn' \\
  --output text)

echo "Target Group ARN: $TARGET_GROUP_ARN"`}
          </CodeBlock>

          <h3 className="obsidian-h3">Get Public Subnet IDs</h3>
          <CodeBlock language="bash">
{`SUBNET1_ID=$(aws ec2 describe-subnets \\
  --filters "Name=tag:Name,Values=PublicSubnet1" \\
  --query "Subnets[0].SubnetId" \\
  --output text)

SUBNET2_ID=$(aws ec2 describe-subnets \\
  --filters "Name=tag:Name,Values=PublicSubnet2" \\
  --query "Subnets[0].SubnetId" \\
  --output text)`}
          </CodeBlock>

          <h3 className="obsidian-h3">Create Application Load Balancer</h3>
          <CodeBlock language="bash">
{`ALB_ARN=$(aws elbv2 create-load-balancer \\
  --name MyFlaskALB \\
  --subnets $SUBNET1_ID $SUBNET2_ID \\
  --security-groups $ALB_SG_ID \\
  --scheme internet-facing \\
  --type application \\
  --ip-address-type ipv4 \\
  --query 'LoadBalancers[0].LoadBalancerArn' \\
  --output text)

echo "ALB ARN: $ALB_ARN"`}
          </CodeBlock>

          <h3 className="obsidian-h3">Create Listener</h3>
          <p>
            Configure the ALB to listen on port 80 and forward to the target group:
          </p>

          <CodeBlock language="bash">
{`aws elbv2 create-listener \\
  --load-balancer-arn $ALB_ARN \\
  --protocol HTTP \\
  --port 80 \\
  --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN`}
          </CodeBlock>

          <h3 className="obsidian-h3">Get ALB DNS Name</h3>
          <CodeBlock language="bash">
{`ALB_DNS=$(aws elbv2 describe-load-balancers \\
  --load-balancer-arns $ALB_ARN \\
  --query 'LoadBalancers[0].DNSName' \\
  --output text)

echo "ALB DNS Name: $ALB_DNS"`}
          </CodeBlock>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">📝 Save This Information</div>
            <div className="obsidian-callout-content">
              Keep track of your ALB DNS name - you&apos;ll use this to access your application once it&apos;s running.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Create Launch Template",
      content: (
        <div className="obsidian-content">
          <p>
            Create a launch template that defines the configuration for new EC2 instances in your Auto Scaling Group.
          </p>

          <h3 className="obsidian-h3">Read User Data Script</h3>
          <p>
            First, read the base64-encoded user data script we created earlier:
          </p>

          <CodeBlock language="bash">
{`USER_DATA=$(cat user-data.b64)
echo "User data loaded successfully"`}
          </CodeBlock>

          <h3 className="obsidian-h3">Create Launch Template</h3>
          <CodeBlock language="bash">
{`aws ec2 create-launch-template \\
  --launch-template-name MyFlaskLaunchTemplate \\
  --version-description "Initial version" \\
  --launch-template-data '{
    "ImageId": "ami-0453ec754f44f9a4a",
    "InstanceType": "t2.micro",
    "KeyName": "MyEC2KeyPair",
    "SecurityGroupIds": ["'$EC2_SG_ID'"],
    "UserData": "'$USER_DATA'",
    "IamInstanceProfile": {
      "Name": "EC2-SSM-Role"
    },
    "TagSpecifications": [
      {
        "ResourceType": "instance",
        "Tags": [
          {
            "Key": "Name",
            "Value": "Flask-ASG-Instance"
          }
        ]
      }
    ]
  }'`}
          </CodeBlock>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">🔧 Launch Template Benefits</div>
            <div className="obsidian-callout-content">
              Launch templates provide versioning, immutable infrastructure, and consistent instance configuration across your Auto Scaling Group.
            </div>
          </div>

          <h3 className="obsidian-h3">Verify Launch Template</h3>
          <CodeBlock language="bash">
{`aws ec2 describe-launch-templates \\
  --launch-template-names MyFlaskLaunchTemplate \\
  --query 'LaunchTemplates[0].LaunchTemplateId'`}
          </CodeBlock>
        </div>
      )
    },
    {
      title: "Create Auto Scaling Group",
      content: (
        <div className="obsidian-content">
          <p>
            An Auto Scaling Group (ASG) in AWS is a service that automatically manages a fleet of EC2 instances to meet demand and ensure availability. ASG automatically launches or terminates EC2 instances based on CPU usage, request count, schedules, or other CloudWatch metrics.
          </p>
          <p>
            ASGs can span multiple AZs within a region to protect against failure of a single AZ. If a health check fails the ASG automatically replaces it. It uses the Launch Template from step 4 to know how to create instances. It also sets the <code className="obsidian-inline-code">MinSize</code>, <code className="obsidian-inline-code">MaxSize</code>, and <code className="obsidian-inline-code">DesiredCapacity</code> for the instances.
          </p>

          <h3 className="obsidian-h3">Get Private Subnet IDs</h3>
          <p>
            The Auto Scaling Group will launch instances in private subnets for security:
          </p>

          <CodeBlock language="bash">
{`PRIVATE_SUBNET1_ID=$(aws ec2 describe-subnets \\
  --filters "Name=tag:Name,Values=PrivateSubnet1" \\
  --query "Subnets[0].SubnetId" \\
  --output text)

PRIVATE_SUBNET2_ID=$(aws ec2 describe-subnets \\
  --filters "Name=tag:Name,Values=PrivateSubnet2" \\
  --query "Subnets[0].SubnetId" \\
  --output text)

echo "Private Subnet 1: $PRIVATE_SUBNET1_ID"
echo "Private Subnet 2: $PRIVATE_SUBNET2_ID"`}
          </CodeBlock>

          <h3 className="obsidian-h3">Create Auto Scaling Group</h3>
          <CodeBlock language="bash">
{`aws autoscaling create-auto-scaling-group \\
  --auto-scaling-group-name MyFlaskASG \\
  --launch-template LaunchTemplateName=MyFlaskLaunchTemplate,Version='$Latest' \\
  --min-size 2 \\
  --max-size 4 \\
  --desired-capacity 2 \\
  --target-group-arns $TARGET_GROUP_ARN \\
  --health-check-type ELB \\
  --health-check-grace-period 300 \\
  --vpc-zone-identifier "$PRIVATE_SUBNET1_ID,$PRIVATE_SUBNET2_ID" \\
  --tags Key=Name,Value=Flask-ASG-Instance,PropagateAtLaunch=true Key=Project,Value=FlaskALB,PropagateAtLaunch=true`}
          </CodeBlock>

          <h3 className="obsidian-h3">Wait for Instances to Launch</h3>
          <p>
            Wait for the Auto Scaling Group to launch and configure the instances:
          </p>

          <CodeBlock language="bash">
{`echo "Waiting for instances to launch and become healthy..."
aws autoscaling wait group-in-service --auto-scaling-group-names MyFlaskASG
echo "Auto Scaling Group is now in service!"`}
          </CodeBlock>

          <h3 className="obsidian-h3">Check Instance Status</h3>
          <CodeBlock language="bash">
{`aws autoscaling describe-auto-scaling-groups \\
  --auto-scaling-group-names MyFlaskASG \\
  --query 'AutoScalingGroups[0].Instances[*].[InstanceId,LifecycleState,HealthStatus]' \\
  --output table`}
          </CodeBlock>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">⏱️ Patience Required</div>
            <div className="obsidian-callout-content">
              It may take 5-10 minutes for instances to fully launch, install Flask, and pass health checks.
            </div>
          </div>
          <br />

          
           <Image 
              src="/projects/ec2-project-series/project-2/ec2-2-1-instances.png" 
              alt="Flask application response showing Hello from Flask on EC2 with ALB and ASG" 
              width={1600}
              height={1200}
              className="w-full rounded-lg border border-gray-600 shadow-lg"
            />
          

        </div>
      )
    },
    {
      title: "Test Your Application",
      content: (
        <div className="obsidian-content">
          <p>
            Test your scalable Flask application and verify that the load balancer is working correctly.
          </p>

          <h3 className="obsidian-h3">Check Target Health</h3>
          <p>
            First, verify that your targets are healthy in the target group:
          </p>

          <CodeBlock language="bash">
{`aws elbv2 describe-target-health \\
  --target-group-arn $TARGET_GROUP_ARN \\
  --query 'TargetHealthDescriptions[*].[Target.Id,TargetHealth.State,TargetHealth.Description]' \\
  --output table`}
          </CodeBlock>

          <h3 className="obsidian-h3">Get ALB URL</h3>
          <CodeBlock language="bash">
{`ALB_DNS=$(aws elbv2 describe-load-balancers \\
  --load-balancer-arns $ALB_ARN \\
  --query 'LoadBalancers[0].DNSName' \\
  --output text)

echo "Your Flask app is available at: http://$ALB_DNS"`}
          </CodeBlock>

          <h3 className="obsidian-h3">Test the Application</h3>
          <p>
            Test your application using curl or a web browser:
          </p>

          <CodeBlock language="bash">
{`# Test with curl
curl http://$ALB_DNS

# Test multiple requests to see load balancing
for i in {1..5}; do
  echo "Request $i:"
  curl http://$ALB_DNS
  echo
done`}
          </CodeBlock>

          
            <Image 
              src="/projects/ec2-project-series/project-2/ec2-2-2-hello-world.png" 
              alt="Flask application response showing Hello from Flask on EC2 with ALB and ASG" 
              width={1600}
              height={1200}
              className="w-full rounded-lg border border-gray-600 shadow-lg"
            />
          


          <h3 className="obsidian-h3">Test Auto Scaling</h3>
          <p>
            Use CLI commands to view and terminate EC2 instances. Watch as the ASG replaces unhealthy or terminated instances automatically.
          </p>

          <p>
            To see the status of your instances use:
          </p>

          <CodeBlock language="bash">
{`aws ec2 describe-instances \\
  --filters "Name=tag:aws:autoscaling:groupName,Values=MyFlaskASG" \\
  --query "Reservations[*].Instances[*].[InstanceId,State.Name]" \\
  --output table`}
          </CodeBlock>

          <p>
            To see the target health of the instances you can run:
          </p>

          <CodeBlock language="bash">
{`aws elbv2 describe-target-health \\
  --target-group-arn $TARGET_GROUP_ARN \\
  --query 'TargetHealthDescriptions[*].[Target.Id,TargetHealth.State]' \\
  --output table`}
          </CodeBlock>

          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-2/ec2-2-3-target-health.png" 
              alt="Target health status showing healthy instances" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>

          <p>
            Choose one instance and terminate using the command below. In this example we terminated i-0eb8ba3584681226b:
          </p>

          <CodeBlock language="bash">
{`aws ec2 terminate-instances --instance-ids i-xxxxxxxxxxxxxxxxx`}
          </CodeBlock>

          <p>
            Watch it heal with the following command. You will see the instance terminate and be replaced with a new one:
          </p>

          <CodeBlock language="bash">
{`watch -n 5 "aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names MyFlaskASG --query 'AutoScalingGroups[0].Instances[*].[InstanceId,LifecycleState,HealthStatus]' --output table"`}
          </CodeBlock>

          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-2/ec2-2-4-asg.png" 
              alt="Auto Scaling Group instance status during termination" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>

          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-2/ec2-2-5-asg2.png" 
              alt="Auto Scaling Group showing instance replacement process" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>

          <div className="bg-gray-700 rounded-lg p-6 flex justify-center">
            <Image 
              src="/projects/ec2-project-series/project-2/ec2-2-6-asg3.png" 
              alt="Auto Scaling Group with new healthy instance" 
              width={800}
              height={300}
              className="rounded-lg border border-gray-600 shadow-lg"
            />
          </div>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">🎉 Success!</div>
            <div className="obsidian-callout-content">
              If you can access your Flask app via the ALB URL and see the ASG replace terminated instances, you&apos;ve successfully built a scalable, highly available web application!
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Monitor and Scale Your Application",
      content: (
        <div className="obsidian-content">
          <p>
            Learn how to monitor your application and configure automatic scaling based on metrics.
          </p>

          <h3 className="obsidian-h3">View ALB Metrics</h3>
          <p>
            Check Application Load Balancer metrics in CloudWatch:
          </p>

          <CodeBlock language="bash">
{`# Get request count for the last hour
aws cloudwatch get-metric-statistics \\
  --namespace AWS/ApplicationELB \\
  --metric-name RequestCount \\
  --dimensions Name=LoadBalancer,Value=$(echo $ALB_ARN | cut -d'/' -f2-) \\
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \\
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \\
  --period 300 \\
  --statistics Sum`}
          </CodeBlock>

          <h3 className="obsidian-h3">Create Scaling Policies</h3>
          <p>
            Configure automatic scaling based on CPU utilization:
          </p>

          <CodeBlock language="bash">
{`# Scale out policy (add instances when CPU > 70%)
SCALE_OUT_POLICY=$(aws autoscaling put-scaling-policy \\
  --auto-scaling-group-name MyFlaskASG \\
  --policy-name scale-out-policy \\
  --policy-type TargetTrackingScaling \\
  --target-tracking-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    },
    "ScaleOutCooldown": 300,
    "ScaleInCooldown": 300
  }' \\
  --query 'PolicyARN' \\
  --output text)

echo "Scaling policy created: $SCALE_OUT_POLICY"`}
          </CodeBlock>

          <h3 className="obsidian-h3">Test Load and Scaling</h3>
          <p>
            Generate load to test auto scaling (use with caution):
          </p>

          <CodeBlock language="bash">
{`# Simple load test - run this in the background
# WARNING: This will generate load and may trigger scaling
echo "Starting load test..."
for i in {1..1000}; do
  curl -s http://$ALB_DNS > /dev/null &
  if [ $((i % 100)) -eq 0 ]; then
    echo "Sent $i requests"
    wait
  fi
done`}
          </CodeBlock>

          <h3 className="obsidian-h3">Monitor Scaling Activity</h3>
          <CodeBlock language="bash">
{`# Watch scaling activities
aws autoscaling describe-scaling-activities \\
  --auto-scaling-group-name MyFlaskASG \\
  --max-items 5 \\
  --query 'Activities[*].[ActivityId,Cause,StatusCode,StartTime]' \\
  --output table`}
          </CodeBlock>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">📊 Monitoring Best Practices</div>
            <div className="obsidian-callout-content">
              Set up CloudWatch alarms for key metrics like response time, error rate, and target health to get notified of issues before they impact users.
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Clean Up Resources",
      content: (
        <div className="obsidian-content">
          <p>
            Clean up all resources to avoid ongoing charges. <span className="obsidian-bold">Follow this order to avoid dependency errors.</span>
          </p>

          <h3 className="obsidian-h3">Delete Auto Scaling Group</h3>
          <CodeBlock language="bash">
{`# Set desired capacity to 0 and delete ASG
aws autoscaling update-auto-scaling-group \\
  --auto-scaling-group-name MyFlaskASG \\
  --desired-capacity 0 \\
  --min-size 0

# Wait for instances to terminate
aws autoscaling wait group-not-exists --auto-scaling-group-names MyFlaskASG

# Delete the ASG
aws autoscaling delete-auto-scaling-group \\
  --auto-scaling-group-name MyFlaskASG \\
  --force-delete`}
          </CodeBlock>

          <h3 className="obsidian-h3">Delete Load Balancer and Target Group</h3>
          <CodeBlock language="bash">
{`# Delete ALB
aws elbv2 delete-load-balancer --load-balancer-arn $ALB_ARN

# Wait for ALB to be deleted
aws elbv2 wait load-balancer-not-exists --load-balancer-arns $ALB_ARN

# Delete target group
aws elbv2 delete-target-group --target-group-arn $TARGET_GROUP_ARN`}
          </CodeBlock>

          <h3 className="obsidian-h3">Delete Launch Template</h3>
          <CodeBlock language="bash">
{`aws ec2 delete-launch-template --launch-template-name MyFlaskLaunchTemplate`}
          </CodeBlock>

          <h3 className="obsidian-h3">Delete NAT Gateway and Elastic IP</h3>
          <div className="obsidian-callout obsidian-warning">
            <div className="obsidian-callout-title">💰 Important</div>
            <div className="obsidian-callout-content">
              Don&apos;t forget to delete the NAT Gateway - it&apos;s the most expensive component!
            </div>
          </div>

          <CodeBlock language="bash">
{`# Delete NAT Gateway
aws ec2 delete-nat-gateway --nat-gateway-id $NAT_GW_ID

# Wait for NAT Gateway to be deleted
aws ec2 wait nat-gateway-deleted --nat-gateway-ids $NAT_GW_ID

# Release Elastic IP
aws ec2 release-address --allocation-id $EIP_ALLOC_ID`}
          </CodeBlock>

          <h3 className="obsidian-h3">Delete VPC and Associated Resources</h3>
          <CodeBlock language="bash">
{`# Delete security groups
aws ec2 delete-security-group --group-id $ALB_SG_ID
aws ec2 delete-security-group --group-id $EC2_SG_ID

# Detach and delete internet gateway
aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID
aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID

# Delete subnets
aws ec2 delete-subnet --subnet-id $SUBNET1_ID
aws ec2 delete-subnet --subnet-id $SUBNET2_ID
aws ec2 delete-subnet --subnet-id $PRIVATE_SUBNET1_ID
aws ec2 delete-subnet --subnet-id $PRIVATE_SUBNET2_ID

# Delete route tables (main route table is deleted with VPC)
aws ec2 delete-route-table --route-table-id $RT_ID
aws ec2 delete-route-table --route-table-id $PRIVATE_RT_ID

# Finally, delete VPC
aws ec2 delete-vpc --vpc-id $VPC_ID`}
          </CodeBlock>

          <div className="obsidian-callout">
            <div className="obsidian-callout-title">✅ Cleanup Complete</div>
            <div className="obsidian-callout-content">
              All resources have been deleted. Check your AWS console to verify that no resources are still running and incurring charges.
            </div>
          </div>
        </div>
      )
    }
  ];

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-8">
      <style dangerouslySetInnerHTML={{
        __html: `
        .obsidian-content {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
          line-height: 1.6;
          color: #dcddde;
        }
        
        .obsidian-h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #ffffff;
          margin: 1.5rem 0 0.75rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #ef4444;
          line-height: 1.3;
        }
        
        .obsidian-h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f1f5f9;
          margin: 1.25rem 0 0.5rem 0;
          line-height: 1.3;
        }
        
        .obsidian-bold {
          font-weight: 600;
          color: #ffffff;
        }
        
        .obsidian-inline-code {
          background-color: #2d3748;
          color: #e2e8f0;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 0.875em;
          border: 1px solid #4a5568;
        }
        
        .code-block {
          background-color: #1e293b !important;
          border: 1px solid #475569;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          overflow-x: auto;
          font-family: 'Courier New', Consolas, monospace !important;
          color: #e2e8f0 !important;
          white-space: pre;
          display: block;
        }
        
        .obsidian-callout {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid #fecaca;
          border-left: 4px solid #ef4444;
          border-radius: 0.5rem;
          margin: 1rem 0;
          padding: 1rem;
        }
        
        .obsidian-callout.obsidian-warning {
          background-color: rgba(245, 158, 11, 0.1);
          border-color: #f59e0b;
          border-left-color: #f59e0b;
        }
        
        .obsidian-callout-title {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }
        
        .obsidian-callout-content {
          color: #e2e8f0;
          font-size: 0.875rem;
          line-height: 1.5;
        }
        
        .obsidian-list-item {
          margin: 0.5rem 0;
          color: #e2e8f0;
          line-height: 1.5;
        }
        
        .obsidian-bullet-item {
          display: inline;
          color: #e2e8f0;
          line-height: 1.5;
        }
        
        .obsidian-link {
          color: #60a5fa;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.2s ease;
        }
        
        .obsidian-link:hover {
          color: #93c5fd;
          border-bottom-color: #60a5fa;
        }
        
        .obsidian-content p {
          margin: 0.75rem 0;
          line-height: 1.6;
        }
        
        .obsidian-content > div {
          margin: 0.5rem 0;
        }
        `
      }} />
      {/* Header Section */}
      <header className="text-center py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link href="/projects/ec2" className="text-red-500 hover:text-red-400 transition-colors">
              EC2 Series
            </Link>
            <span className="text-gray-500">→</span>
            <span className="text-gray-300">Project 2</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Flask App with Load Balancer
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{
            textWrap: 'balance',
            wordSpacing: '0.1em',
            lineHeight: '1.4'
          }}>
            Deploy a scalable Flask application with Application Load Balancer and Auto Scaling Groups
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Project Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Difficulty</h3>
            <span className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">Intermediate</span>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Duration</h3>
            <p className="text-gray-300">4-6 hours</p>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Cost</h3>
            <p className="text-gray-300">~$15-25 (if left running)</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 shadow-xl">
          {/* Project Overview */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Project Overview
            </h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Build upon your EC2 knowledge by deploying a scalable Flask web application with 
                an Application Load Balancer. This project introduces advanced networking concepts, 
                auto-scaling, and high availability patterns. We acknowledge this is not the prefered method
                to create this application, however the manual setup will help to comprehend the services being
                created.
              </p>
              <p>
                You&apos;ll create a custom VPC, deploy multiple EC2 instances running a Flask application, 
                configure an Application Load Balancer for high availability, and implement Auto Scaling 
                Groups for automatic scaling and healing.
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
                  <li>• Deploy Python Flask applications</li>
                  <li>• Create custom VPC networking</li>
                  <li>• Configure Application Load Balancers</li>
                  <li>• Set up Auto Scaling Groups</li>
                  
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">AWS Concepts</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Custom VPC design and implementation</li>
                  <li>• Multi-AZ deployment strategies</li>
                  <li>• Launch Templates and versioning</li>
                  <li>• Target Groups and health checks</li>
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
            </div>
          </section>

          {/* Prerequisites */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Prerequisites
            </h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <ul className="text-gray-300 space-y-2">
                <li>• Complete <Link href="/projects/ec2/project1" className="text-red-500 hover:text-red-400 transition-colors">EC2 Project 1</Link> or have equivalent EC2 experience</li>
                <li>• AWS CLI configured with appropriate permissions</li>
                <li>• Basic understanding of networking concepts (subnets, routing)</li>
                <li>• Familiarity with Flask or similar web frameworks</li>
                <li>• Understanding of load balancing concepts</li>
              </ul>
            </div>
          </section>

          {/* Architecture Overview */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Architecture Overview
            </h2>
            <div className="bg-gray-700 rounded-lg p-6 flex justify-center items-center">
                <div className="flex justify-center items-center w-full">
                    <Image 
                    src="/projects/ec2-project-series/project-2/ec2-project2-architecture.png" 
                    alt="Architecture diagram for EC2 Project 2" 
                    width={800}
                    height={600}
                    className="max-w-2xl rounded-lg border border-gray-600 shadow-lg"
                    />
                </div>
            </div>
          </section>

          {/* Project Steps with Expandable Content */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Project Steps
            </h2>
            <div className="space-y-4">
              {projectSteps.map((step, index) => (
                <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-600 transition-colors"
                    onClick={() => toggleStep(index)}
                  >
                    <div className="flex items-center">
                      <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                        {index + 1}
                      </div>
                      <p className="text-gray-300">{step.title}</p>
                    </div>
                    <div className="text-gray-400">
                      {expandedSteps.has(index) ? '−' : '+'}
                    </div>
                  </div>
                  {expandedSteps.has(index) && (
                    <div className="px-4 pb-4 border-t border-gray-600">
                      <div className="mt-4 text-gray-300 max-w-none">
                        {step.content}
                      </div>
                      {/* Bottom minimize button */}
                      <div className="mt-6 pt-4 border-t border-gray-600 flex justify-end">
                        <button
                          onClick={() => toggleStep(index)}
                          className="text-gray-400 hover:text-gray-300 transition-colors text-lg font-semibold cursor-pointer"
                        >
                          −
                        </button>
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
          <Link href="/projects/ec2/project1" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
            ← Project 1: EC2 Web Server
          </Link>
          <Link href="/projects/ec2/project3" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition-colors">
            Project 3: Flask App Deployment with EBS and Terraform →
          </Link>
        </div>
      </main>
    </div>
  );
}
