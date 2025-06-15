export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: "Scalable Serverless Web App",
      description: (
        <>
          <p className="mb-2">
            Built a fully serverless event booking system capable of handling thousands of concurrent requests with minimal latency.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> Traditional server-based apps required scaling and high maintenance for peak traffic. Serverless allowed automatic scaling and cost efficiency.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> Users authenticate with Cognito, submit bookings via a Next.js frontend. Requests hit API Gateway which invokes Lambda functions. Bookings are stored in DynamoDB. SES sends confirmation emails.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> Next.js, AWS Lambda, API Gateway, DynamoDB, SES, Cognito, S3, CloudWatch
          </p>
        </>
      ),
      link: "/projects/serverless-event-booking",
      documentation: "/docs/serverless-event-booking.pdf",
      imgSrc: "/project1.png",
      imgAlt: "Serverless Event Booking Architecture Diagram",
      year: "2025",
      techStack: ["Next.js", "AWS Lambda", "API Gateway", "DynamoDB", "SES", "Cognito", "S3", "CloudWatch"],
      externalLink: "https://github.com/andrewmudge/serverless-event-booking",
    },
    {
      id: 2,
      title: "Multi-Tier Web App in a VPC",
      description: (
        <>
          <p className="mb-2">
            Deployed a 3-tier Flask application inside a secure VPC, segmented by subnets and protected by security groups and NACLs.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> Needed isolation between app layers, secure DB access, and controlled internet exposure for the frontend only.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> Public subnet hosts ALB, which routes to EC2 app servers in private subnets. RDS PostgreSQL lives in isolated DB subnet. Bastion host enables SSH for admin.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> EC2, RDS, Flask, VPC, Subnets, ALB, IAM, CloudWatch
          </p>
        </>
      ),
      link: "/projects/multi-tier-web-app",
      documentation: "/docs/multi-tier-web-app.pdf",
      imgSrc: "/project2.png",
      imgAlt: "Multi-Tier VPC Architecture Diagram",
      year: "2024",
      techStack: ["EC2", "RDS", "Flask", "VPC", "Subnets", "ALB", "IAM", "CloudWatch"],
      externalLink: "https://github.com/andrewmudge/cloud-resume",
    },
    {
      id: 3,
      title: "CI/CD Pipeline with Infrastructure as Code",
      description: (
        <>
          <p className="mb-2">
            Designed an automated blue/green deployment pipeline to eliminate downtime during updates.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> Manual deployments caused downtime and human error. Needed faster, safer delivery of updates.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> CodePipeline triggers on GitHub commits. Terraform provisions infra. CodeBuild compiles code, CodeDeploy handles traffic shift with rollback on failure.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> CodePipeline, CodeBuild, CodeDeploy, Terraform, GitHub, S3, IAM
          </p>
        </>
      ),
      link: "/projects/cicd-pipeline-iac",
      documentation: "/docs/cicd-pipeline-iac.pdf",
      imgSrc: "/project3.png",
      imgAlt: "CI/CD Pipeline Architecture Diagram",
      year: "2023",
      techStack: ["CodePipeline", "CodeBuild", "CodeDeploy", "Terraform", "GitHub", "S3", "IAM"],
      externalLink: "https://github.com/andrewmudge/devsecops-pipeline",
    },
    {
      id: 4,
      title: "Real-Time Cloud Security Dashboard",
      description: (
        <>
          <p className="mb-2">
            Built a monitoring system for detecting suspicious behavior across AWS services and alerting in real-time.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> AWS accounts lacked centralized security visibility. Teams needed real-time alerts for misconfigurations and threats.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> GuardDuty and CloudTrail events trigger EventBridge rules. Lambda processes events and stores in DynamoDB. Custom frontend dashboard built with Next.js.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> GuardDuty, CloudTrail, EventBridge, Lambda, DynamoDB, Next.js
          </p>
        </>
      ),
      link: "/projects/cloud-security-dashboard",
      documentation: "/docs/cloud-security-dashboard.pdf",
      imgSrc: "/project4.png",
      imgAlt: "Cloud Security Dashboard UI",
      year: "2024",
      techStack: ["GuardDuty", "CloudTrail", "EventBridge", "Lambda", "DynamoDB", "Next.js"],
      externalLink: "",
    },
    {
      id: 5,
      title: "Global Content Delivery System",
      description: (
        <>
          <p className="mb-2">
            Designed a globally available and resilient web content delivery system with failover across AWS regions.
          </p>
          <p className="mb-2">
            <strong>Problem Solved:</strong> Needed low-latency access to content worldwide with disaster recovery capability.
          </p>
          <p className="mb-2">
            <strong>Architecture:</strong> Content stored in S3 behind CloudFront distribution. Route 53 health checks perform automatic failover between active and standby S3 buckets in different regions.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> S3, CloudFront, Route 53, Lambda@Edge, IAM, Terraform
          </p>
        </>
      ),
      link: "/projects/global-content-delivery",
      documentation: "/docs/global-content-delivery.pdf",
      imgSrc: "/project5.png",
      imgAlt: "Global CDN Architecture Diagram",
      year: "2023",
      techStack: ["S3", "CloudFront", "Route 53", "Lambda@Edge", "IAM", "Terraform"],
      externalLink: "",
    },
  ];

  const summaryProjects = projects.map(({ year, title, techStack, externalLink }) => ({
    year,
    name: title,
    techStack,
    link: externalLink || "#",
  }));

  return (
    <section className="px-6 py-16 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-center mt-10 mb-10 text-red-500 tracking-wide">
        🛠️ Featured Projects in Detail
      </h1>

      <div className="text-center mb-8">
        <a
          href="#project-table"
          className="inline-block px-4 py-2 text-sm font-semibold text-red-400 border border-red-500 rounded hover:bg-red-500 hover:text-white transition duration-300"
        >
          View All Projects →
        </a>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        {projects.map(({ id, title, description, link, documentation, imgSrc, imgAlt }) => (
          <div
            key={id}
            className="flex flex-col-reverse md:flex-row bg-gray-800 p-6 rounded-lg border border-red-700 shadow-md hover:border-red-500 transition"
          >
            {/* Text Section */}
            <div className="flex-1 pr-0 md:pr-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl text-red-400 font-bold mb-4">{title}</h2>
                {description}
              </div>
              <div className="mt-4 space-x-6">
                <a
                  href={link}
                  className="inline-block text-red-500 hover:underline font-semibold"
                >
                  Link
                </a>
                <a
                  href={documentation}
                  download
                  className="inline-block text-red-500 hover:underline font-semibold"
                >
                  Documentation
                </a>
              </div>
            </div>

            {/* Image Section */}
            <div className="hidden md:block mt-6 md:mt-0 flex-shrink-0">
              <img
                src={imgSrc}
                alt={imgAlt}
                className="max-w-xs rounded-lg"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Table Section */}
      <h2
        id="project-table"
        className="text-3xl font-bold text-center mt-20 mb-8 text-red-500 tracking-wide"
      >
        All Projects
      </h2>

      <div className="max-w-7xl mx-auto overflow-x-auto">
        <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Year</th>
              <th className="px-4 py-3 text-left">Project</th>
              <th className="px-4 py-3 text-left">Tech Stack</th>
              <th className="px-4 py-3 text-left">Link</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700 text-gray-200">
            {summaryProjects.map((project, index) => (
              <tr key={index} className="hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3">{project.year}</td>
                <td className="px-4 py-3 font-medium">{project.name}</td>
                <td className="px-4 py-3 space-x-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="inline-block bg-red-700/20 text-red-400 text-xs font-semibold px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3">
                  {project.link !== "#" ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-500 hover:underline"
                    >
                      View →
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
