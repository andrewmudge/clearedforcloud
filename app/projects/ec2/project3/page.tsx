import Link from 'next/link';

export default function Project3Page() {
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
            <span className="text-gray-300">Project 3</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Infrastructure as Code
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{
            textWrap: 'balance',
            wordSpacing: '0.1em',
            lineHeight: '1.4'
          }}>
            Automate deployment using CloudFormation templates for repeatable infrastructure
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
            <p className="text-gray-300">3-5 hours</p>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Cost</h3>
            <p className="text-gray-300">~$10-20 (if left running)</p>
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
                Transform your manual infrastructure deployments into automated, repeatable processes 
                using AWS CloudFormation. This project teaches Infrastructure as Code (IaC) principles 
                and best practices for managing cloud resources.
              </p>
              <p>
                You&apos;ll recreate the Flask application infrastructure from Project 2 using CloudFormation 
                templates, implementing parameterization, nested stacks, and deployment automation for 
                enterprise-grade infrastructure management.
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
                <h3 className="text-xl font-bold text-red-500 mb-3">IaC Concepts</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• CloudFormation template design</li>
                  <li>• Parameter and output management</li>
                  <li>• Template modularity with nested stacks</li>
                  <li>• Stack lifecycle management</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Automation Skills</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Automated deployment pipelines</li>
                  <li>• Environment consistency</li>
                  <li>• Version control for infrastructure</li>
                  <li>• Rollback and disaster recovery</li>
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
                <div className="text-red-500 font-bold">CloudFormation</div>
                <div className="text-gray-400 text-sm">IaC Service</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">YAML</div>
                <div className="text-gray-400 text-sm">Template Language</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">AWS CLI</div>
                <div className="text-gray-400 text-sm">Deployment Tool</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">Git</div>
                <div className="text-gray-400 text-sm">Version Control</div>
              </div>
            </div>
          </section>

          {/* IaC Benefits */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Infrastructure as Code Benefits
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Consistency</h3>
                <p className="text-gray-300 text-sm">
                  Eliminate configuration drift and ensure identical environments 
                  across development, staging, and production.
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Repeatability</h3>
                <p className="text-gray-300 text-sm">
                  Deploy the same infrastructure stack multiple times with 
                  guaranteed consistency and reliability.
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Version Control</h3>
                <p className="text-gray-300 text-sm">
                  Track infrastructure changes, implement peer reviews, and 
                  enable easy rollbacks when needed.
                </p>
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
                <li>• Completion of Projects 1 & 2</li>
                <li>• AWS CLI installed and configured</li>
                <li>• Understanding of YAML syntax</li>
                <li>• Git for version control</li>
                <li>• Text editor or IDE for template editing</li>
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
                "Introduction to CloudFormation concepts",
                "Create VPC and networking templates",
                "Design security group templates",
                "Build RDS database template",
                "Create EC2 and Auto Scaling templates",
                "Implement nested stack architecture",
                "Add parameters and outputs",
                "Deploy and test the complete stack",
                "Implement stack updates and rollbacks"
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

          {/* Template Structure */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Template Structure
            </h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-red-500 font-bold mb-3">Core Templates</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• vpc-template.yaml - Network foundation</li>
                    <li>• security-template.yaml - Security groups</li>
                    <li>• rds-template.yaml - Database resources</li>
                    <li>• app-template.yaml - Application tier</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-500 font-bold mb-3">Master Template</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• main-template.yaml - Orchestrates all stacks</li>
                    <li>• parameters.json - Environment configurations</li>
                    <li>• deploy.sh - Deployment automation script</li>
                    <li>• cleanup.sh - Resource cleanup script</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Link href="/projects/ec2/project2" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
            ← Project 2: Flask App Deployment with CLI
          </Link>
          <Link href="/projects/ec2/project4" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition-colors">
            Project 4: Next.js App Deployment with CDK and P2M →
          </Link>
        </div>
      </main>
    </div>
  );
}
