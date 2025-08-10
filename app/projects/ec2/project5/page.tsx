import Link from 'next/link';

export default function Project5Page() {
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
            <span className="text-gray-300">Project 5</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Containerized with ECS
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{
            textWrap: 'balance',
            wordSpacing: '0.1em',
            lineHeight: '1.4'
          }}>
            Deploy containerized applications using ECS and Fargate with auto-scaling
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
            <p className="text-gray-300">8-10 hours</p>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-red-500 font-bold mb-2">Cost</h3>
            <p className="text-gray-300">~$30-50 (if left running)</p>
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
                Modernize your application deployment using containerization with Amazon ECS and AWS Fargate. 
                This capstone project brings together all previous concepts while introducing container 
                orchestration, microservices architecture, and serverless container deployment.
              </p>
              <p>
                You&apos;ll containerize the Flask application, deploy it using ECS with Fargate, implement 
                auto-scaling based on metrics, set up CI/CD pipelines, and establish comprehensive 
                monitoring and logging for a production-ready containerized application.
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
                <h3 className="text-xl font-bold text-red-500 mb-3">Container Technologies</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Docker containerization techniques</li>
                  <li>• ECS service and task definitions</li>
                  <li>• Fargate serverless container deployment</li>
                  <li>• ECR container registry management</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">DevOps Practices</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• CI/CD pipeline implementation</li>
                  <li>• Blue-green deployment strategies</li>
                  <li>• Container health monitoring</li>
                  <li>• Automated scaling policies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technologies Used */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Technologies Used
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">ECS</div>
                <div className="text-gray-400 text-sm">Container Service</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">Fargate</div>
                <div className="text-gray-400 text-sm">Serverless Containers</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">Docker</div>
                <div className="text-gray-400 text-sm">Containerization</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">ECR</div>
                <div className="text-gray-400 text-sm">Container Registry</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-red-500 font-bold">CodePipeline</div>
                <div className="text-gray-400 text-sm">CI/CD</div>
              </div>
            </div>
          </section>

          {/* Container Architecture */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Container Architecture
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Application Layer</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Multi-stage Docker builds</li>
                  <li>• Flask application containerization</li>
                  <li>• Environment-based configurations</li>
                  <li>• Health check implementations</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Orchestration Layer</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• ECS cluster management</li>
                  <li>• Fargate task definitions</li>
                  <li>• Service discovery integration</li>
                  <li>• Load balancer target groups</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Advanced Features */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
              Advanced Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Auto Scaling</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• CPU/Memory-based scaling</li>
                  <li>• Custom CloudWatch metrics</li>
                  <li>• Predictive scaling policies</li>
                  <li>• Cost optimization strategies</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">CI/CD Pipeline</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Automated testing and builds</li>
                  <li>• Container image scanning</li>
                  <li>• Blue-green deployments</li>
                  <li>• Rollback mechanisms</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-500 mb-3">Monitoring</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Container insights</li>
                  <li>• Application performance monitoring</li>
                  <li>• Distributed tracing</li>
                  <li>• Custom dashboards</li>
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
                <li>• Completion of all previous projects (1-4)</li>
                <li>• Docker installed and configured locally</li>
                <li>• Understanding of containerization concepts</li>
                <li>• Familiarity with CI/CD principles</li>
                <li>• Experience with Git and version control</li>
                <li>• Basic knowledge of microservices architecture</li>
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
                "Containerize Flask application with Docker",
                "Create ECR repository and push images",
                "Design ECS cluster and task definitions",
                "Configure Fargate services and networking",
                "Implement Application Load Balancer integration",
                "Set up auto-scaling policies and metrics",
                "Create CI/CD pipeline with CodePipeline",
                "Configure container monitoring and logging",
                "Implement blue-green deployment strategy",
                "Optimize costs and performance",
                "Establish disaster recovery procedures"
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
          <Link href="/projects/ec2/project4" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
            ← Project 4: Next.js App Deployment with CDK and P2M
          </Link>
          <Link href="/projects/ec2" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors">
            Complete Series ✓
          </Link>
        </div>
      </main>
    </div>
  );
}
