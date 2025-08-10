'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import CodeBlock from '@/app/components/CodeBlock';

export default function Project1Page() {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  const projectSteps = [
    {
      title: "Create a key pair (for SSH) via CLI",
      content: (
        <div>
          <h3 className="text-xl font-semibold text-gray-100 mb-3 mt-6">Create Key Pair</h3>
          <p className="text-gray-300 mb-4">
            First, we&apos;ll create an SSH key pair that will allow secure access to your EC2 instance:
          </p>

          <CodeBlock language="bash">
{`aws ec2 create-key-pair --key-name MyEC2KeyPair --query 'KeyMaterial' --output text > MyEC2KeyPair.pem
chmod 400 MyEC2KeyPair.pem`}
          </CodeBlock>

          <div className="text-gray-300 space-y-2 mt-4">
            <p>• Saves your private key locally as <code className="bg-gray-700 px-2 py-1 rounded text-sm">MyEC2KeyPair.pem</code> with proper permissions</p>
            <p>• The command <code className="bg-gray-700 px-2 py-1 rounded text-sm">chmod 400 MyEC2KeyPair.pem</code> sets file permissions on your EC2 private key file so it can be used securely with SSH</p>
          </div>
        </div>
      )
    },
    {
      title: "Create a security group that allows HTTP (port 80) and SSH (port 22)",
      content: (
        <div>
          <p className="text-gray-300 mb-4">
            Create a security group for your EC2 instance. This is a virtual firewall that provides access rules for the EC2 instance. 
            It defines who can connect from where and on which ports/protocols.
          </p>
          
          <div className="bg-blue-900/30 border border-blue-600 border-l-4 border-l-blue-500 rounded p-4 mb-4">
            <p className="text-blue-200">
              <span className="font-semibold">💡 Note:</span> Security groups are stateful - if you allow inbound traffic, the return traffic is also allowed automatically.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-100 mb-3">Create Security Group</h3>
          <CodeBlock language="bash">
{`aws ec2 create-security-group --group-name MyEC2SG --description "Allow SSH and HTTP access"`}
          </CodeBlock>

          <p className="text-gray-300 mb-4">
            You will see a response with the GroupID and ARN for your Security Group:
          </p>

          <CodeBlock language="bash">
{`{
    "GroupId": "sg-xxxxxxxxxxxxx",
    "SecurityGroupArn": "arn:aws:ec2:us-east-1:XXXXXXXXXXXX:security-group/sg-XXXXXXXXXXXXXXXXXX"
}`}
          </CodeBlock>

          <h3 className="text-xl font-semibold text-gray-100 mb-3 mt-6">Configure Security Group Rules</h3>
          
          <div className="mb-4">
            <p className="text-white font-semibold mb-2">1. Capture the Security Group ID</p>
            <CodeBlock language="bash">
{`SG_ID=$(aws ec2 describe-security-groups --group-names MyEC2SG --query "SecurityGroups[0].GroupId" --output text)`}
            </CodeBlock>
          </div>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">2. Allow SSH from your IP</p>
            <p className="text-gray-300 mb-2">Get your public IP and store it in a variable:</p>
            <CodeBlock language="bash">
{`MY_IP=$(curl -s https://checkip.amazonaws.com)`}
            </CodeBlock>
            
            <p className="text-gray-300 mb-2 mt-4">Authorize inbound SSH from your public IP:</p>
            <CodeBlock language="bash">
{`aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr \${MY_IP}/32`}
            </CodeBlock>
          </div>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">3. Allow HTTP from anywhere</p>
            <p className="text-gray-300 mb-2">Create a security group rule for port 80 allowing HTTP access from any IP address:</p>
            <CodeBlock language="bash">
{`aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      title: "Launch an EC2 instance",
      content: (
        <div>
          <p className="text-gray-300 mb-4">
            Launch an Amazon Linux 2023 instance using the free tier t2.micro instance type:
          </p>

          <CodeBlock language="bash">
{`aws ec2 run-instances \\
  --image-id ami-07caf09b362be10b8 \\
  --count 1 \\
  --instance-type t2.micro \\
  --key-name MyEC2KeyPair \\
  --security-group-ids $SG_ID \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=MyWebServer}]' \\
  --query 'Instances[0].InstanceId' \\
  --output text`}
          </CodeBlock>

          <div className="text-gray-300 space-y-2 mt-4">
            <p>• The instance ID will be output as text: <code className="bg-gray-700 px-2 py-1 rounded text-sm">&quot;i-XXXXXXXXXXXXXXXXXX&quot;</code></p>
            <p>• Save the instance ID for later use:</p>
          </div>

          <CodeBlock language="bash">
{`INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=MyWebServer" --query "Reservations[0].Instances[0].InstanceId" --output text)`}
          </CodeBlock>
        </div>
      )
    },
    {
      title: "Get the public IP of the instance",
      content: (
        <div>
          <p className="text-gray-300 mb-4">
            Wait a few minutes for the instance to fully boot, then retrieve its public IP address:
          </p>

          <CodeBlock language="bash">
{`PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[0].Instances[0].PublicIpAddress" --output text)`}
          </CodeBlock>

          <p className="text-gray-300 mb-2 mt-4">Display the public IP:</p>
          <CodeBlock language="bash">
{`echo "Instance public IP is: $PUBLIC_IP"`}
          </CodeBlock>

          <div className="bg-yellow-900/30 border border-yellow-600 border-l-4 border-l-yellow-500 rounded p-4 mt-4">
            <p className="text-yellow-200">
              <span className="font-semibold">⚠️ Important:</span> Make sure the instance is in &quot;running&quot; state before proceeding to the next step.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "SSH into the instance",
      content: (
        <div>
          <p className="text-gray-300 mb-4">
            Connect to your EC2 instance using SSH:
          </p>

          <CodeBlock language="bash">
{`ssh -i MyEC2KeyPair.pem ec2-user@$PUBLIC_IP`}
          </CodeBlock>

          <div className="bg-blue-900/30 border border-blue-600 border-l-4 border-l-blue-500 rounded p-4 mt-4">
            <p className="text-blue-200 mb-2">
              <span className="font-semibold">💡 First-time connection:</span>
            </p>
            <p className="text-blue-200 text-sm">
              If this is the first time connecting, you&apos;ll see a message about host authenticity. 
              This is normal - type &quot;yes&quot; to continue.
            </p>
            <code className="block text-blue-300 text-sm mt-2 bg-blue-800/50 p-2 rounded">
              The authenticity of host &apos;XXX.XX.XXX.XXX&apos; can&apos;t be established.<br/>
              XXXXXX key fingerprint is SHA256:gXXXXXXXXXXXXXXXXXXXXXX.<br/>
              This key is not known by any other names.
            </code>
          </div>
        </div>
      )
    },
    {
      title: "Install Nginx and create a static 'Hello World' page",
      content: (
        <div>
          <p className="text-gray-300 mb-4">
            Once connected to your EC2 instance, install and configure Nginx:
          </p>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">1. Update system packages</p>
            <CodeBlock language="bash">
{`sudo dnf update -y`}
            </CodeBlock>
            <p className="text-gray-300 text-sm mt-2">Updates all packages to the latest version. Amazon Linux 2023 uses dnf instead of yum.</p>
          </div>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">2. Install Nginx</p>
            <CodeBlock language="bash">
{`sudo dnf install nginx -y`}
            </CodeBlock>
            <p className="text-gray-300 text-sm mt-2">Installs the NGINX web server from the default package repository.</p>
          </div>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">3. Enable and start Nginx</p>
            <CodeBlock language="bash">
{`sudo systemctl enable nginx
sudo systemctl start nginx`}
            </CodeBlock>
            <p className="text-gray-300 text-sm mt-2">Enables Nginx to start at boot time and starts the service immediately.</p>
          </div>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">4. Create custom index page</p>
            <CodeBlock language="bash">
{`echo "Hello World from EC2 Web Server!" | sudo tee /usr/share/nginx/html/index.html`}
            </CodeBlock>
            <p className="text-gray-300 text-sm mt-2">
              Creates a custom &quot;Hello World&quot; message and overwrites the default Nginx index page. 
              The <code className="bg-gray-700 px-1 rounded">tee</code> command writes to the file with sudo privileges.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Verify Nginx is running",
      content: (
        <div>
          <p className="text-gray-300 mb-4">
            Check that Nginx is running properly:
          </p>

          <CodeBlock language="bash">
{`sudo systemctl status nginx`}
          </CodeBlock>

          <p className="text-gray-300 mb-4">If everything was configured correctly, you should see output similar to:</p>

          <CodeBlock language="bash">
{`nginx.service - The nginx HTTP and reverse proxy server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: disabled)
   Active: active (running) since Sun 2025-08-03 21:17:22 UTC; 51s ago
   Process: 26332 ExecStartPre=/usr/bin/rm -f /run/nginx.pid (code=exited, status=0/SUCCESS)
   Process: 26333 ExecStartPre=/usr/sbin/nginx -t (code=exited, status=0/SUCCESS)
   Process: 26334 ExecStart=/usr/sbin/nginx (code=exited, status=0/SUCCESS)`}
          </CodeBlock>

          <div className="bg-green-900/30 border border-green-600 border-l-4 border-l-green-500 rounded p-4 mt-4">
            <p className="text-green-200">
              <span className="font-semibold">✅ Success indicator:</span> Look for &quot;Active: active (running)&quot; in the status output.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Exit SSH and test your webpage",
      content: (
        <div>
          <p className="text-gray-300 mb-4">
            Exit the SSH session and test your web server from your local machine:
          </p>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">1. Exit SSH</p>
            <CodeBlock language="bash">
{`exit`}
            </CodeBlock>
          </div>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">2. Test your webpage</p>
            <p className="text-gray-300 mb-2">Open the following URL in your browser:</p>
            <CodeBlock language="bash">
{`http://$PUBLIC_IP`}
            </CodeBlock>
            <p className="text-gray-300 text-sm mt-2">
              Or use curl to test from the command line:
            </p>
            <CodeBlock language="bash">
{`curl http://$PUBLIC_IP`}
            </CodeBlock>
          </div>

          <div className="bg-green-900/30 border border-green-600 border-l-4 border-l-green-500 rounded p-4 mt-4">
            <p className="text-green-200">
              <span className="font-semibold">✅ Expected result:</span> You should see &quot;Hello World from EC2 Web Server!&quot; displayed in your browser or terminal.
            </p>
          </div>

          <div className="mt-6">
            <Image 
              src="/projects/ec2-project-series/project-1/ec2-1-2-hello-world.png" 
              alt="Hello World webpage displayed in browser" 
              width={800}
              height={600}
              className="w-full max-w-2xl mx-auto rounded-lg border border-gray-600 shadow-lg"
            />
          </div>
        </div>
      )
    },
    {
      title: "Clean up resources",
      content: (
        <div>
          <p className="text-gray-300 mb-4">
            When you&apos;re finished with the project, clean up your AWS resources to avoid ongoing charges:
          </p>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">1. Terminate the EC2 instance</p>
            <CodeBlock language="bash">
{`aws ec2 terminate-instances --instance-ids $INSTANCE_ID`}
            </CodeBlock>
          </div>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">2. Delete the security group (optional)</p>
            <CodeBlock language="bash">
{`aws ec2 delete-security-group --group-id $SG_ID`}
            </CodeBlock>
            <p className="text-gray-300 text-sm mt-2">Wait for the instance to fully terminate before deleting the security group.</p>
          </div>

          <div className="mb-4">
            <p className="text-white font-semibold mb-2">3. Delete the key pair (optional)</p>
            <CodeBlock language="bash">
{`aws ec2 delete-key-pair --key-name MyEC2KeyPair
rm MyEC2KeyPair.pem`}
            </CodeBlock>
            <p className="text-gray-300 text-sm mt-2">Removes the key pair from AWS and deletes the local private key file.</p>
          </div>

          <div className="bg-red-900/30 border border-red-600 border-l-4 border-l-red-500 rounded p-4 mt-4">
            <p className="text-red-200">
              <span className="font-semibold">⚠️ Cost Management:</span> Always terminate resources when finished to avoid unexpected charges. 
              Even free tier resources can incur costs if left running beyond the free tier limits.
            </p>
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
            <span className="text-gray-300">Project 1</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Basic EC2 Web Server
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{
            textWrap: 'balance',
            wordSpacing: '0.1em',
            lineHeight: '1.4'
          }}>
            Deploy and configure a basic NGINX web server on EC2 with proper security configurations
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Project Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Difficulty</h3>
            <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">Beginner</span>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Duration</h3>
            <p className="text-gray-300">1 hour</p>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Cost</h3>
            <p className="text-gray-300">~$1</p>
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
                In this foundational project, you&apos;ll learn to deploy a web server on Amazon EC2. 
                This project introduces core AWS concepts including EC2 instances, security groups, 
                and basic networking fundamentals.
              </p>
              <p>
                By completing this project, you&apos;ll understand how to launch, configure, and secure 
                a basic web server in the AWS cloud, setting the foundation for more complex projects.
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
                  <li>• Launch and configure EC2 instances</li>
                  <li>• Configure security groups and firewall rules</li>
                  <li>• Install and configure NGINX web server</li>
                  <li>• Manage SSH key pairs for secure access</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">AWS Concepts</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Understanding EC2 instance types</li>
                  <li>• Basic VPC and subnet concepts</li>
                  <li>• Security group configuration</li>
                  <li>• SSH connectivity and key management</li>
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
                <div className="text-red-500 font-bold">AWS EC2</div>
                <div className="text-gray-400 text-sm">Compute Service</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">NGINX</div>
                <div className="text-gray-400 text-sm">Web Server</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">Security Groups</div>
                <div className="text-gray-400 text-sm">Firewall Rules</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">SSH</div>
                <div className="text-gray-400 text-sm">Secure Access</div>
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
                <li>• AWS Account (Free Tier eligible)</li>
                <li>• Basic understanding of Linux command line</li>
                <li>• SSH client (Terminal on Mac/Linux, PuTTY on Windows)</li>
                <li>• Basic networking concepts</li>
              </ul>
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
          <Link href="/projects/ec2" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
            ← Back to Series
          </Link>
          <Link href="/projects/ec2/project2" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition-colors">
            Project 2: Flask App Deployment with CLI →
          </Link>
        </div>
      </main>
    </div>
  );
}
