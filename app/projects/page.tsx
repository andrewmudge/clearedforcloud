import ExpandProject from "../components/expand_project";
import Image from "next/image";

export default function ProjectsPage() {
  const projects = [
       {
      id: 1,
      title: "Full Stack Next.js + AWS Web App for Family Reunion",
      description: (
        <>
          <p className="mb-2 text-gray-200">
            Created a secure, scalable AWS app for a personal Family Reunion using CDK to enable authentication, data storage, and notification. Optimized for growth, security and reliability.
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Problem Solved:</strong> The platform solves a real-world challenge of securely sharing sensitive family-only content—photos, schedules, and a private family tree—by enforcing authentication, authorization, and automated user management workflows. Cognito handles user registration and email verification, with JWTs stored in HttpOnly cookies for secure sessions. A DynamoDB whitelist table ensures that only pre-approved family members can access private content. 
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Architecture:</strong> A custom auth modal with email verification links to cognito which handles user authentication. A dynamoDB table stores a list of pre-approved family member emails. S3 bucket stores user uploaded photos. Lambda is used to retrieve and upload photos.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> CDK, Cognito, S3, DynamoDB, Lambda, SES, CloudFront
          </p>
          <p className="text-gray-300 mt-2">
  <strong>Full Description:</strong> CFR Next is a secure, full-stack web app built for the Churchwell Family Reunion. This project demonstrates my ability to architect, build, and deploy cloud-native applications using serverless technologies and AWS infrastructure-as-code via CDK.
  <br /><br />
  Authentication is managed by Amazon Cognito with email verification and secure JWTs stored in HttpOnly cookies. Access is restricted to pre-approved users, stored in a DynamoDB whitelist. Here’s a snippet of the client logic that checks if a user is approved:
  <div className="flex justify-center">
    <pre className="bg-gray-100 text-gray-800 rounded p-4 overflow-x-auto text-sm my-4 inline-block">
      <code>
{`const res = await fetch(\`/api/auth/check-approval?email=\${encodeURIComponent(email)}\`);
if (!res.ok) throw new Error(\`API error: \${res.status}\`);
const data = await res.json();
return !!data.approved;`}
      </code>
    </pre>
  </div>
  The frontend is built with Next.js and uses API routes that communicate directly with AWS Lambda functions. List Photos, Upload Photos and Delete Photos all connect to a CloudFront distribution that serves the CFR photo bucket to manage family photos. This S3 Admin-only features like user management are secured with role-based logic so only authorized users can access them.
  <br /><br />
  <div className="flex-1 flex justify-center">
    <Image
      src="/photogallery.png"
      alt="Snip of Photo Gallery"
      width={500}
      height={320}
      className="rounded shadow-lg object-contain transition-transform duration-300 md:hover:scale-175 z-10"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  </div>
  <br />
  Infrastructure is fully defined in CDK. Below is a portion of the stack provisioning Cognito and DynamoDB:
   <div className="flex justify-center">
    <pre className="bg-gray-100 text-gray-800 rounded p-4 overflow-x-auto text-sm my-4 inline-block">
    <code>
{`const approvedUsersTable = new dynamodb.Table(this, 'ApprovedEmails', {
  partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
  tableName: 'ApprovedEmails'
});

const userPool = new cognito.UserPool(this, 'UserPool', {
  userPoolName: 'CfrUserPool',
  selfSignUpEnabled: true,
  signInAliases: { email: true },
  autoVerify: { email: true },
  accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
});`}
    </code>
  </pre>
  </div>
  <br />
  The project is deployed to Vercel, with CI/CD integrated via GitHub. Pushes to the <code>main</code> branch trigger automatic production deployments. Feature development happens in the <code>dev</code> branch, which generates Vercel preview deployments—allowing me to test changes in isolation without affecting live users.
  <br /><br />
  All environment variables—Cognito client IDs, S3 buckets, and SES email settings—are managed securely in Vercel’s dashboard, enabling seamless zero-downtime deployments across dev and prod environments.
  <br /><br />
  <div className="flex-1 flex justify-center">
    <Image
      src="/architecture.png"
      alt="Architecture Diagram"
      width={500}
      height={320}
      className="rounded shadow-lg object-contain transition-transform duration-300 md:hover:scale-175 z-10"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  </div>
  <br /><br />
  The system aligns with the AWS Well-Architected Framework:
  <ul className="list-disc list-inside mt-2">
    <li><strong>Operational Excellence:</strong> CDK-based deployments with CloudWatch monitoring</li>
    <li><strong>Security:</strong> Cognito MFA, secure JWT storage, least privilege IAM roles</li>
    <li><strong>Reliability:</strong> Fully managed AWS components ensure high availability</li>
    <li><strong>Performance Efficiency:</strong> Serverless compute scales with demand</li>
    <li><strong>Cost Optimization:</strong> Pay-per-use architecture, no idle resources</li>
    <li><strong>Sustainability:</strong> Lightweight stack minimizes environmental footprint</li>
  </ul>
  <br /><br />
  This project showcases my hands-on experience with secure authentication flows, infrastructure automation, and event-driven architecture—all delivered in a clean, responsive UI using Next.js and AWS.
</p>

        </>
      ),
      link: { url: "https://churchwellreunion.com", target: "_blank" },
      imgSrc: "/project2.png",
      imgAlt: "Churchwell Family Reunion Website",
      year: "2025",
      techStack: ["CDK", "Cognito", "S3", "DynamoDB", "Lambda", "SES", "CloudFront"],
      externalLink: "https://github.com/andrewmudge/cfr-next-cdk-app/blob/main/cfr-next/README.md",
    },
    {
      id: 2,
      title: "Scalable Serverless Event Booking System",
      description: (
        <>
          <p className="mb-2 text-gray-200">
            Built a fully serverless event booking system capable of handling thousands of concurrent requests with minimal latency.
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Problem Solved:</strong> Traditional server-based apps required scaling and high maintenance for peak traffic. Serverless allowed automatic scaling and cost efficiency.
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Architecture:</strong> Users authenticate with Cognito, submit bookings via a Next.js frontend. Requests hit API Gateway which invokes Lambda functions. Bookings are stored in DynamoDB. SES sends confirmation emails.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> Next.js, AWS Lambda, API Gateway, DynamoDB, SES, Cognito, S3, CloudWatch
          </p>
          <p className="text-gray-300 mt-2">
            <strong>Full Description:</strong>This project showcases my ability to architect and deliver a robust, fully serverless web application for a technical conference platform. The solution enables users to securely register, authenticate, browse available lectures, manage event bookings, and receive automated confirmations—all within a highly available and scalable AWS environment.
            <br /><br />
            <div className="w-full my-8">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/booking_loginui.png"
                    alt="Booking Login UI"
                    width={500}
                    height={320}
                    className="rounded shadow-lg object-contain transition-transform duration-300 md:hover:scale-125 z-10"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/booking_pre_login.png"
                    alt="Booking Pre Login"
                    width={500}
                    height={320}
                    className="rounded shadow-lg object-contain transition-transform duration-300 md:hover:scale-125 z-10"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
            <br /><br />
            The frontend is built with Next.js, while AWS Lambda functions handle authentication via Cognito and all backend interactions with DynamoDB. Infrastructure is provisioned using Serverless Framework and AWS CloudFormation, ensuring repeatable and automated deployments. API Gateway orchestrates communication between the frontend and backend services. CI/CD is implemented with GitHub Actions, automating builds and deployments to S3.
            <br /><br />
               <div className="flex-1 flex justify-center">
                  <Image
                    src="/github_actions.png"
                    alt="Github Actions CI/CD"
                    width={500}
                    height={320}
                    className="rounded shadow-lg object-contain transition-transform duration-300 md:hover:scale-175 z-10"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
            <br /><br />
            The application flow is designed for both security and user experience: users register or log in, confirm their email, and are then presented with a dynamic events page. Lecture data is retrieved from DynamoDB, and users can book available sessions. Registrations are managed in a dedicated DynamoDB table, with logic to prevent duplicate bookings and enforce seat limits. Upon successful registration, users receive a confirmation email through AWS SES. Additionally, users can view their current registrations at any time.
            <br /><br />
              <div className="w-full my-8">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/booking_post_login.png"
                    alt="Booking Post Login"
                    width={500}
                    height={320}
                    className="rounded shadow-lg object-contain transition-transform duration-300 md:hover:scale-125 z-10"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
                <div className="flex-1 flex justify-center">
                  <Image
                    src="/booking_email.png"
                    alt="booking email confirmation"
                    width={500}
                    height={320}
                    className="rounded shadow-lg object-contain transition-transform duration-300 md:hover:scale-175 z-10"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
            <br /><br />
            This project demonstrates my expertise in designing cloud-native, event-driven architectures, implementing secure authentication, automating infrastructure and deployments, and delivering production-ready solutions that address real-world business requirements.
          </p>
        </>
      ),
link: { url: "http://serverless-booking.s3-website-us-east-1.amazonaws.com/", target: "_blank" },
      imgSrc: "/project1.png",
      imgAlt: "Serverless Event Booking Architecture Diagram",
      year: "2025",
      techStack: ["Next.js", "AWS Lambda", "API Gateway", "DynamoDB", "SES", "Cognito", "S3", "CloudWatch"],
      externalLink: "https://github.com/andrewmudge/serverless_booking",
    },
    {
      id: 3,
      title: "CI/CD Pipeline with Infrastructure as Code",
      description: (
        <>
          <p className="mb-2 text-gray-200">
            Designed an automated blue/green deployment pipeline to eliminate downtime during updates.
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Problem Solved:</strong> Manual deployments caused downtime and human error. Needed faster, safer delivery of updates.
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Architecture:</strong> CodePipeline triggers on GitHub commits. Terraform provisions infra. CodeBuild compiles code, CodeDeploy handles traffic shift with rollback on failure.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> CodePipeline, CodeBuild, CodeDeploy, Terraform, GitHub, S3, IAM
          </p>
          <p className="text-gray-300 mt-2">
            <strong>Full Description:</strong>This project showcases my ability to ......
            <br /><br />
          </p>
        </>
      ),
      link: "/projects/cicd-pipeline-iac",
      imgSrc: "/project3.png",
      imgAlt: "CI/CD Pipeline Architecture Diagram",
      year: "2025",
      techStack: ["CodePipeline", "CodeBuild", "CodeDeploy", "Terraform", "GitHub", "S3", "IAM"],
      externalLink: "https://github.com/andrewmudge/devsecops-pipeline",
    },
    {
      id: 4,
      title: "Real-Time Cloud Security Dashboard",
      description: (
        <>
          <p className="mb-2 text-gray-200">
            Built a monitoring system for detecting suspicious behavior across AWS services and alerting in real-time.
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Problem Solved:</strong> AWS accounts lacked centralized security visibility. Teams needed real-time alerts for misconfigurations and threats.
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Architecture:</strong> GuardDuty and CloudTrail events trigger EventBridge rules. Lambda processes events and stores in DynamoDB. Custom frontend dashboard built with Next.js.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> GuardDuty, CloudTrail, EventBridge, Lambda, DynamoDB, Next.js
          </p>
          <p className="text-gray-300 mt-2">
            <strong>Full Description:</strong>This project showcases my ability to ......
            <br /><br />
          </p>
        </>

      ),
      link: "/projects/cloud-security-dashboard",
      imgSrc: "/project4.png",
      imgAlt: "Cloud Security Dashboard UI",
      year: "2025",
      techStack: ["GuardDuty", "CloudTrail", "EventBridge", "Lambda", "DynamoDB", "Next.js"],
      externalLink: "",
    },
    {
      id: 5,
      title: "Global Content Delivery System",
      description: (
        <>
          <p className="mb-2 text-gray-200">
            Designed a globally available and resilient web content delivery system with failover across AWS regions.
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Problem Solved:</strong> Needed low-latency access to content worldwide with disaster recovery capability.
          </p>
          <p className="mb-2 text-gray-200">
            <strong>Architecture:</strong> Content stored in S3 behind CloudFront distribution. Route 53 health checks perform automatic failover between active and standby S3 buckets in different regions.
          </p>
          <p className="text-sm text-gray-400 mb-4">
            <strong>Tech Stack:</strong> S3, CloudFront, Route 53, Lambda@Edge, IAM, Terraform
          </p>
          <p className="text-gray-300 mt-2">
            <strong>Full Description:</strong>This project showcases my ability to ......
            <br /><br />
          </p>
        </>
      ),
      link: "/projects/global-content-delivery",
      imgSrc: "/project5.png",
      imgAlt: "Global CDN Architecture Diagram",
      year: "2025",
      techStack: ["S3", "CloudFront", "Route 53", "Lambda@Edge", "IAM", "Terraform"],
      externalLink: "",
    },
  ];

  // Prepare summaryProjects for the table
  const summaryProjects = projects.map((project) => ({
    year: project.year,
    name: project.title,
    link: typeof project.link === "string" ? project.link : (project.link?.url || "#"),
    linkTarget: typeof project.link === "object" && project.link?.target ? project.link.target : undefined,
    externalLink: project.externalLink || "",
    techStack: project.techStack,
  }));

  return (
    <section className="px-6 py-16 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-center mt-10 mb-10 text-red-500 tracking-wide">
        Featured Projects in Detail
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
        {projects.map(({ id, title, description, link, imgSrc, imgAlt, externalLink }) => (
          <div id={id.toString()} key={id}>
            <ExpandProject
              title={title}
              description={description}
              link={typeof link === "string" ? link : link?.url}
              imgSrc={imgSrc}
              imgAlt={imgAlt}
              externalLink={externalLink}
            />
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
                <th className="px-4 py-3 text-left">GitHub Repo</th>
                <th className="px-4 py-3 text-left">Link</th>
                <th className="px-4 py-3 text-left">Tech Stack</th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700 text-gray-200">
              {summaryProjects.map((project, index) => (
                <tr key={index} className="hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3">{project.year}</td>
                  <td className="px-4 py-3 font-medium">{project.name}</td>
                  <td className="px-4 py-3">
                    {project.externalLink ? (
                      <a
                        href={project.externalLink}
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
                  <td className="px-4 py-3">
                    {project.link !== "#" ? (
                      <a
                        href={project.link}
                        target={project.linkTarget || undefined}
                        rel={project.linkTarget ? "noopener noreferrer" : undefined}
                        className="text-red-500 hover:underline"
                      >
                        <span className="whitespace-nowrap">App&nbsp;→</span>
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </section>
  );
}
