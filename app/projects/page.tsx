export default function ProjectsPage() {
  return (
    <section className="px-6 py-16 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-center mt-10 mb-10 text-red-500 tracking-wide">
        🛠️ Featured Projects in Detail
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">

        {/* Project 1 */}
        <div className="bg-gray-800 p-6 rounded-lg border border-red-700 shadow-md hover:border-red-500 transition">
          <h2 className="text-2xl text-red-400 font-bold mb-2">Scalable Serverless Web App</h2>
          <p className="mb-2">
            Built a fully serverless event booking system capable of handling thousands of concurrent requests with minimal latency.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> Traditional server-based apps required scaling and high maintenance for peak traffic. Serverless allowed automatic scaling and cost efficiency.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> Users authenticate with Cognito, submit bookings via a Next.js frontend. Requests hit API Gateway which invokes Lambda functions. Bookings are stored in DynamoDB. SES sends confirmation emails.
          </p>
          <p className="text-sm text-gray-400">
            <strong>Tech Stack:</strong> Next.js, AWS Lambda, API Gateway, DynamoDB, SES, Cognito, S3, CloudWatch
          </p>
        </div>

        {/* Project 2 */}
        <div className="bg-gray-800 p-6 rounded-lg border border-red-700 shadow-md hover:border-red-500 transition">
          <h2 className="text-2xl text-red-400 font-bold mb-2">Multi-Tier Web App in a VPC</h2>
          <p className="mb-2">
            Deployed a 3-tier Flask application inside a secure VPC, segmented by subnets and protected by security groups and NACLs.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> Needed isolation between app layers, secure DB access, and controlled internet exposure for the frontend only.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> Public subnet hosts ALB, which routes to EC2 app servers in private subnets. RDS PostgreSQL lives in isolated DB subnet. Bastion host enables SSH for admin.
          </p>
          <p className="text-sm text-gray-400">
            <strong>Tech Stack:</strong> EC2, RDS, Flask, VPC, Subnets, ALB, IAM, CloudWatch
          </p>
        </div>

        {/* Project 3 */}
        <div className="bg-gray-800 p-6 rounded-lg border border-red-700 shadow-md hover:border-red-500 transition">
          <h2 className="text-2xl text-red-400 font-bold mb-2">CI/CD Pipeline with Infrastructure as Code</h2>
          <p className="mb-2">
            Designed an automated blue/green deployment pipeline to eliminate downtime during updates.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> Manual deployments caused downtime and human error. Needed faster, safer delivery of updates.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> CodePipeline triggers on GitHub commits. Terraform provisions infra. CodeBuild compiles code, CodeDeploy handles traffic shift with rollback on failure.
          </p>
          <p className="text-sm text-gray-400">
            <strong>Tech Stack:</strong> CodePipeline, CodeBuild, CodeDeploy, Terraform, GitHub, S3, IAM
          </p>
        </div>

        {/* Project 4 */}
        <div className="bg-gray-800 p-6 rounded-lg border border-red-700 shadow-md hover:border-red-500 transition">
          <h2 className="text-2xl text-red-400 font-bold mb-2">Real-Time Cloud Security Dashboard</h2>
          <p className="mb-2">
            Built a monitoring system for detecting suspicious behavior across AWS services and alerting in real-time.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> AWS accounts lacked centralized security visibility. Teams needed real-time alerts for misconfigurations and threats.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> GuardDuty and CloudTrail events trigger EventBridge rules. Lambda processes events and stores in DynamoDB. Custom frontend dashboard built with Next.js.
          </p>
          <p className="text-sm text-gray-400">
            <strong>Tech Stack:</strong> GuardDuty, CloudTrail, EventBridge, Lambda, DynamoDB, Next.js
          </p>
        </div>

        {/* Project 5 */}
        <div className="bg-gray-800 p-6 rounded-lg border border-red-700 shadow-md hover:border-red-500 transition md:col-span-2">
          <h2 className="text-2xl text-red-400 font-bold mb-2">Global Content Delivery System</h2>
          <p className="mb-2">
            Designed a globally available and resilient web content delivery system with failover across AWS regions.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> Needed low-latency access to content worldwide with disaster recovery capability.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> Content stored in S3 behind CloudFront distribution. Route 53 health checks perform automatic failover between active and standby S3 buckets in different regions.
          </p>
          <p className="text-sm text-gray-400">
            <strong>Tech Stack:</strong> S3, CloudFront, Route 53, Lambda@Edge, IAM, Terraform
          </p>
        </div>

      </div>
    </section>
  );
}
