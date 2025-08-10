import Link from 'next/link';

export default function Project4Page() {
  return (
    <div className="min-h-screen pt-20 pb-8">
      {/* Header Section */}
      <header className="text-center py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link href="/projects/ec2" className="text-red-500 hover:text-red-400 transition-colors">
              EC2 Series
            </Link>
            <span className="text-gray-500">→</span>
            <span className="text-gray-300">Project 4</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Advanced Networking
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{
            textWrap: 'balance',
            wordSpacing: '0.1em',
            lineHeight: '1.4'
          }}>
            Implement advanced networking with private subnets, NAT Gateway, and bastion hosts
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Project Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Difficulty</h3>
            <span className="bg-red-600 text-white px-3 py-1 rounded text-sm">Advanced</span>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Duration</h3>
            <p className="text-gray-300">6-8 hours</p>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Cost</h3>
            <p className="text-gray-300">~$25-40 (if left running)</p>
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
                Design and implement enterprise-grade network architecture with advanced security 
                features. This project focuses on production-ready networking patterns used in 
                enterprise environments with emphasis on security and isolation.
              </p>
              <p>
                You&apos;ll deploy applications in private subnets, implement secure access patterns 
                with bastion hosts, configure NAT Gateways for outbound connectivity, and establish 
                comprehensive network monitoring and logging.
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
                <h3 className="text-xl font-bold text-red-500 mb-3">Network Security</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Private subnet architecture design</li>
                  <li>• Bastion host configuration and hardening</li>
                  <li>• Network ACLs and security groups</li>
                  <li>• VPC Flow Logs implementation</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Advanced Networking</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• NAT Gateway configuration</li>
                  <li>• Route table optimization</li>
                  <li>• Multi-AZ network resilience</li>
                  <li>• Network monitoring and alerting</li>
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
                <div className="text-red-500 font-bold">VPC</div>
                <div className="text-gray-400 text-sm">Virtual Private Cloud</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">NAT Gateway</div>
                <div className="text-gray-400 text-sm">Outbound Connectivity</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">Bastion Host</div>
                <div className="text-gray-400 text-sm">Secure Access</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">VPC Flow Logs</div>
                <div className="text-gray-400 text-sm">Network Monitoring</div>
              </div>
            </div>
          </section>

          {/* Network Architecture */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Network Architecture
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Public Tier</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Application Load Balancer</li>
                  <li>• NAT Gateway for outbound traffic</li>
                  <li>• Bastion host for secure access</li>
                  <li>• Internet Gateway connectivity</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Private Tier</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Application servers in private subnets</li>
                  <li>• RDS database in isolated subnets</li>
                  <li>• No direct internet connectivity</li>
                  <li>• Outbound access via NAT Gateway</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security Features */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Security Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Network Isolation</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Private subnet deployment</li>
                  <li>• Network ACL restrictions</li>
                  <li>• Security group layering</li>
                  <li>• Subnet route isolation</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Access Control</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Bastion host with MFA</li>
                  <li>• SSH key rotation</li>
                  <li>• Session logging</li>
                  <li>• Time-based access</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Monitoring</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• VPC Flow Logs</li>
                  <li>• CloudTrail logging</li>
                  <li>• GuardDuty integration</li>
                  <li>• Custom alerting</li>
                </ul>
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
                <li>• Completion of Projects 1, 2, and 3</li>
                <li>• Strong understanding of networking concepts</li>
                <li>• Experience with Linux system administration</li>
                <li>• Knowledge of security best practices</li>
                <li>• Familiarity with AWS CLI and CloudFormation</li>
              </ul>
            </div>
          </section>

          {/* Project Steps Preview */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Project Steps
            </h2>
            <div className="space-y-4">
              {[
                "Design multi-tier network architecture",
                "Create VPC with public and private subnets",
                "Configure NAT Gateway and route tables",
                "Deploy and harden bastion host",
                "Implement Network ACLs and security groups",
                "Deploy applications in private subnets",
                "Configure VPC Flow Logs and monitoring",
                "Set up automated security scanning",
                "Test security and access controls",
                "Implement disaster recovery procedures"
              ].map((step, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-center">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/projects/ec2/project3" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
            ← Project 3: Flask App deployment with Terraform
          </Link>
          <Link href="/projects/ec2/project5" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition-colors">
            Project 5: Containerized App on EC2 with EFS →
          </Link>
        </div>
      </main>
    </div>
  );
}
