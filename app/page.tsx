import Image from "next/image";
import profilePic from "@/public/profile.jpg";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 shadow-lg bg-gray-900 border-b-4 border-red-800">
      <div className="flex items-center text-xl font-bold tracking-widest text-white gap-2">
    <img src="/jet2.svg" alt="Jet Icon" className="w-8 h-8" />Cleared for Cloud</div>
        <nav className="space-x-6">
          <a href="#about" className="hover:text-red-600 transition-colors">About</a>
          <a href="#projects" className="hover:text-red-600 transition-colors">Projects</a>
          <a href="#certifications" className="hover:text-red-600 transition-colors">Certifications</a>
          <a href="#contact" className="hover:text-red-600 transition-colors">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-900 via-gray-900 to-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Left: Larger Profile Image */}
          <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-full overflow-hidden border-4 border-gray-900 shadow-lg flex-shrink-0">
            <Image
              src={profilePic}
              alt="Andrew Mudge Headshot"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          {/* Right: Text Content with Centered Buttons Below */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-wide text-white drop-shadow-lg">
              From Fighter Pilot to Cloud Architect
            </h1>
            <p className="text-xl max-w-xl mx-auto md:mx-0 mb-6 text-gray-300">
              Bringing mission-focused precision, leadership, and systems thinking from the cockpit to the cloud.
            </p>

            {/* Buttons aligned under the text content */}
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="/resume.pdf"
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
        <section id="about" className="flex-1 py-16 bg-gray-800 rounded-lg shadow-lg border border-red-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500 tracking-wide">
          <span className="inline-flex items-center justify-center gap-2">
            <img src="/jet2.svg" alt="Jet Icon" className="w-8 h-8 inline-block" />
            Meet Andrew Mudge
          </span>
        </h2>
        <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-6 flex flex-col gap-12">
          <div className="text-lg text-center text-gray-300">
            <p>
            I’m a former U.S. Marine Corps F-35B pilot with 12 years of active duty service and over 800 flight hours, 
            including combat operations. My career in aviation demanded precision, high-stakes decision-making, 
            and systems-level thinking—skills I now apply to cloud architecture and infrastructure design.
            </p>
            <p className="mt-4">Skills: AWS | Terraform | Python | Linux | DevOps | Cloud Security</p>

            {/* Centered Horizontal Contact Links */}
            <div className="mt-6 flex justify-center gap-6">
              <a href="mailto:mudge.andrew@gmail.com" className="text-red-600 hover:underline flex items-center gap-2">
                <img src="/gmail.png" alt="Email Icon" className="w-5 h-5" />
                Email
              </a>
              <a href="https://github.com/andrewmudge" className="text-red-600 hover:underline flex items-center gap-2">
                <img src="/github.png" alt="GitHub Icon" className="w-5 h-5" />
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/andrew-mudge-78274133a/" className="text-red-600 hover:underline flex items-center gap-2">
                <img src="/linkedin.png" alt="LinkedIn Icon" className="w-5 h-5" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>



        {/* Certifications Section */}
        <section id="certifications" className="flex-1 py-16 bg-gray-800 rounded-lg shadow-lg border border-red-700">
          <h2 className="text-3xl font-bold text-center mb-6 text-red-500 tracking-wide">☁️ Cloud Certifications</h2>
          <ul className="text-center space-y-2 max-w-md mx-auto text-gray-300">
            <li>AWS Certified Solutions Architect – Associate (in progress)</li>
            <li>AWS Certified Security – Specialty (in progress)</li>
            <li>Google Cybersecurity Professional Certificate</li>
          </ul>
          <h2 className="text-3xl font-bold text-center mt-6 mb-6 text-red-500 tracking-wide">🏫 Education</h2>
          <ul className="text-center space-y-2 max-w-md mx-auto text-gray-300">
            <li>Bachelors of Science - Mechanical Engineering</li>
            <li>San Diego State University, 2014</li>
           
          </ul>
        </section>
      </div>

      {/* Projects */}
      <section id="projects" className="py-16 px-6 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500 tracking-wide">🛠️ Featured Projects</h2>
        <div className="grid gap-8 max-w-4xl mx-auto">
          <div className="p-4 border border-red-700 rounded shadow-lg bg-gray-800 text-gray-300">
            <h3 className="text-xl font-semibold text-red-400">FlightOps to CloudOps</h3>
            <p>Migrated a legacy on-prem app to AWS using EC2, RDS, and ALB.</p>
            <p className="text-sm text-gray-400">Tech: AWS, Terraform, GitHub Actions</p>
          </div>
          <div className="p-4 border border-red-700 rounded shadow-lg bg-gray-800 text-gray-300">
            <h3 className="text-xl font-semibold text-red-400">CloudSec Dashboard</h3>
            <p>Real-time dashboard for AWS security monitoring using CloudWatch, Lambda, SNS.</p>
            <p className="text-sm text-gray-400">Tech: CloudWatch, Python</p>
          </div>
          <div className="p-4 border border-red-700 rounded shadow-lg bg-gray-800 text-gray-300">
            <h3 className="text-xl font-semibold text-red-400">Serverless Briefing App</h3>
            <p>Generates mission-style briefs from cloud APIs using a serverless architecture.</p>
            <p className="text-sm text-gray-400">Tech: Next.js, Lambda, DynamoDB</p>
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

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 bg-gray-900 border-t border-red-700">
        © 2025 Andrew Mudge | ClearedForCloud.com · Built with Next.js · Deployed on AWS
      </footer>
    </main>
  );
}
