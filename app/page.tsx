import Image from "next/image";
import profilePic from "@/public/profile.jpg";
import HeaderWithToggle from "./components/HeaderWithToggle";


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 font-sans">
      
      {/* Header (Responsive with toggle) */}
      <HeaderWithToggle />
   

     {/* Hero */}
<section className="py-20 px-4 bg-gradient-to-r from-red-900 via-gray-900 to-black">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center mt-15 gap-10">
    {/* Left: Larger Profile Image only */}
    <div className="flex flex-col items-center">
      <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-full overflow-hidden border-4 border-gray-900 shadow-lg flex-shrink-0">
        <Image
          src={profilePic}
          alt="Andrew Mudge Headshot"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      {/* Removed the three <p> tags here */}
    </div>

    {/* Right: Text Content with Centered Buttons Below */}
    <div className="flex-1 text-center md:text-left">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-wide text-white drop-shadow-lg">
        From Fighter Pilot to Cloud Professional
      </h1>
      <p className="text-xl max-w-xl mx-auto md:mx-0 mb-6 text-gray-300">
        Bringing mission-focused precision, leadership, and systems thinking from the cockpit to the cloud.
      </p>

      {/* Buttons aligned under the text content */}
      <div className="flex justify-center md:justify-start space-x-4">
        <a
          href="/Resume.pdf"
          download
          className="bg-red-700 text-white px-6 py-2 rounded shadow hover:bg-red-800 transition"
        >
          Download Resume
        </a>
        <a
          href="#projects"
          className="border border-red-700 text-red-700 px-6 py-2 rounded hover:bg-red-700 hover:text-white transition"
        >
          View Projects
        </a>
      </div>
    </div>
  </div>
</section>


      {/* About & Certifications Container */}
      <div className="max-w-6xl mx-auto px-6 mt-8 mb-8 flex flex-col lg:flex-row gap-12">

        {/* About Section */}
        <section id="about" className="flex-1 py-16 bg-gray-800 rounded-lg shadow-lg border border-red-700 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-red-500 tracking-wide">
            <span className="inline-flex items-center justify-center gap-2">
              <Image src="/jet2.svg" alt="Jet Icon" width={32} height={32} className="w-8 h-8" />
              Meet Andrew Mudge
            </span>
          </h2>
        <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 flex flex-col gap-12">
          <div className="text-lg text-center text-gray-300">
            <p>
            I’m a U.S. Marine Corps F-35B pilot with 12 years of active duty service and over 800 flight hours, 
            including combat operations. My career in aviation demanded precision, high-stakes decision-making, 
            and systems-level thinking, skills I now apply to cloud architecture and infrastructure design.
            </p>
            <p className="mt-4"><b>Skills: </b>AWS | Terraform | Python | Linux | DevOps | Cloud Security</p>

            {/* Centered Horizontal Contact Links */}
            {/* Centered Contact Links */}
          <div className="mt-6 flex flex-col items-center gap-2 sm:gap-4">

            {/* Top Row: Email & Github */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-center break-words">
              <a
                href="mailto:mudge.andrew@gmail.com"
                className="text-red-600 hover:underline flex items-center gap-2"
              >
                <img src="/gmail.png" alt="Email Icon" className="w-5 h-5" />
                mudge.andrew@gmail.com
              </a>
              <a
                href="https://github.com/andrewmudge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline flex items-center gap-2"
              >
                <img src="/github.png" alt="GitHub Icon" className="w-5 h-5" />
                GitHub
              </a>
              </div>
            

            {/* Bottom Row: Phone & LinkedIn */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-center break-words">
               <a
                  href="tel:+16618080385"
                  className="text-red-600 hover:underline flex items-center gap-2"
                >
                  <span role="img" aria-label="Phone" className="text-white text-lg">📱</span>
                  +1 (661) 808-0385
                </a>
              

              <a
                href="https://www.linkedin.com/in/andrew-mudge-78274133a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:underline flex items-center gap-2"
              >
                <img src="/linkedin.png" alt="LinkedIn Icon" className="w-5 h-5" />
                LinkedIn
              </a>
            </div>

          </div>
        </div>
      </div>
      </section>



        {/* Certifications Section */}
        <section id="certifications" className="flex-1 py-16 bg-gray-800 rounded-lg shadow-lg border border-red-700">
          <h2 className="text-3xl font-bold text-center mb-6 text-red-500 tracking-wide">☁️ Cloud Certifications</h2>
          <ul className="list-disc list-inside text-left space-y-2 max-w-md mx-auto text-gray-300 px-4">
            <li>AWS Certified Solutions Architect Associate (in progress)</li>
            <li>AWS Certified Security – Specialty (in progress)</li>
            <li>Google Cybersecurity Professional Certificate - Feb 2025</li>
          </ul>
          <h2 className="text-3xl font-bold text-center mt-15 mb-6 text-red-500 tracking-wide">🏫 Education</h2>
          <ul className="text-center space-y-2 max-w-md mx-auto text-gray-300">
            <li>Bachelors of Science - Mechanical Engineering</li>
            <li>San Diego State University, 2014</li>
           
          </ul>
        </section>
      </div>

{/* Projects */}
<section id="projects" className="py-16 px-6 bg-gray-900">
  <h2 className="text-3xl font-bold text-center mb-6 text-red-500 tracking-wide">🛠️ Featured Projects</h2>

  {/* Link to full projects page */}
  <div className="text-center mb-8">
    <a
      href="/projects"
      className="inline-block px-4 py-2 text-sm font-semibold text-red-400 border border-red-500 rounded hover:bg-red-500 hover:text-white transition duration-300"
    >
      View All Projects →
    </a>
  </div>

  {/* Grid container */}
  <div className="grid gap-8 max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Project Card 1 */}
  <div className="border border-red-700 rounded shadow-lg bg-gray-800 text-gray-300 transition duration-300 hover:shadow-2xl hover:border-red-500 hover:bg-gray-700 flex flex-col">
    <div className="p-2">
      <a href="/projects#1">
        <img
          src="/project1.png"
          alt="Scalable Serverless Web App"
          className="w-full h-64 object-contain rounded bg-gray-900"
        />
      </a>
    </div>
    <div className="p-4 flex flex-col justify-center flex-grow">
      <a href="/projects#1">
        <h3 className="text-xl font-semibold text-red-400 mb-2 hover:underline">Scalable Serverless Web App</h3>
      </a>
      <p>Built an event booking system using fully serverless architecture with real-time email notifications and CI/CD pipelines.</p>
      <p className="text-sm text-gray-400 mt-2">Tech: Next.js, API Gateway, Lambda, DynamoDB, SES, Cognito</p>
    </div>
  </div>

  {/* Project Card 2 */}
  <div className="border border-red-700 rounded shadow-lg bg-gray-800 text-gray-300 transition duration-300 hover:shadow-2xl hover:border-red-500 hover:bg-gray-700 flex flex-col">
    <div className="p-2">
      <a href="/projects#2">
        <img
          src="/project2.png"
          alt="Multi-Tier Web App in a VPC"
          className="w-full h-64 object-contain rounded bg-gray-900"
        />
      </a>
    </div>
    <div className="p-4 flex flex-col justify-center flex-grow">
      <a href="/projects#2">
        <h3 className="text-xl font-semibold text-red-400 mb-2 hover:underline">Multi-Tier Web App in a VPC</h3>
      </a>
      <p>Deployed a 3-tier Flask app using EC2, RDS, and ALB with secure private networking and a bastion host setup.</p>
      <p className="text-sm text-gray-400 mt-2">Tech: EC2, ALB, RDS, VPC, S3, CloudWatch</p>
    </div>
  </div>

  {/* Project Card 3 */}
  <div className="border border-red-700 rounded shadow-lg bg-gray-800 text-gray-300 transition duration-300 hover:shadow-2xl hover:border-red-500 hover:bg-gray-700 flex flex-col">
    <div className="p-2">
      <a href="/projects#3">
        <img
          src="/project3.png"
          alt="CI/CD Pipeline with IaC"
          className="w-full h-64 object-contain rounded bg-gray-900"
        />
      </a>
    </div>
    <div className="p-4 flex flex-col justify-center flex-grow">
      <a href="/projects#3">
        <h3 className="text-xl font-semibold text-red-400 mb-2 hover:underline">CI/CD Pipeline with IaC</h3>
      </a>
      <p>Created a fully automated pipeline using CodePipeline and Terraform with blue/green deployments and secure secrets management.</p>
      <p className="text-sm text-gray-400 mt-2">Tech: CodePipeline, Terraform, CodeBuild, CodeDeploy</p>
    </div>
  </div>

  {/* Project Card 4 */}
  <div className="border border-red-700 rounded shadow-lg bg-gray-800 text-gray-300 transition duration-300 hover:shadow-2xl hover:border-red-500 hover:bg-gray-700 flex flex-col">
    <div className="p-2">
      <a href="/projects#4">
        <img
          src="/project4.png"
          alt="Real-Time Cloud Security Dashboard"
          className="w-full h-64 object-contain rounded bg-gray-900"
        />
      </a>
    </div>
    <div className="p-4 flex flex-col justify-center flex-grow">
      <a href="/projects#4">
        <h3 className="text-xl font-semibold text-red-400 mb-2 hover:underline">Real-Time Cloud Security Dashboard</h3>
      </a>
      <p>Monitors AWS account for anomalies using GuardDuty and CloudTrail, visualized in a custom frontend with alerting.</p>
      <p className="text-sm text-gray-400 mt-2">Tech: GuardDuty, EventBridge, Lambda, DynamoDB, Next.js</p>
    </div>
  </div>

  {/* Project Card 5 */}
  <div className="border border-red-700 rounded shadow-lg bg-gray-800 text-gray-300 transition duration-300 hover:shadow-2xl hover:border-red-500 hover:bg-gray-700 flex flex-col">
    <div className="p-2">
      <a href="/projects#5">
        <img
          src="/project5.png"
          alt="Global Content Delivery System"
          className="w-full h-64 object-contain rounded bg-gray-900"
        />
      </a>
    </div>
    <div className="p-4 flex flex-col justify-center flex-grow">
      <a href="/projects#5">
        <h3 className="text-xl font-semibold text-red-400 mb-2 hover:underline">Global Content Delivery System</h3>
      </a>
      <p>Delivered globally available website using CloudFront with S3 origin and Route 53 failover across AWS regions.</p>
      <p className="text-sm text-gray-400 mt-2">Tech: CloudFront, S3, Route 53, Lambda, Terraform</p>
    </div>
  </div>
</div>
</section>









      {/*  /////////////   Place Holder for Contact Section 
      <section id="contact" className="py-16 px-6 bg-gradient-to-t from-black via-gray-900 to-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6 text-red-600 tracking-wide">📬 Let’s Connect</h2>
        <p className="text-center max-w-xl mx-auto mb-6 text-gray-300">
          Interested in working together? Let’s talk about how I can help your team take flight in the cloud.
        </p>
        <div className="text-center space-x-4">
          <a href="mailto:andrew@example.com" className="text-red-600 hover:underline">Email</a>
          <a href="https://github.com/yourgithub" className="text-red-600 hover:underline">GitHub</a>
          <a href="https://linkedin.com/in/yourlinkedin" className="text-red-600 hover:underline">LinkedIn</a>
        </div>
      </section>

      //////////////////////*/}

     
    </main>
  );
}
