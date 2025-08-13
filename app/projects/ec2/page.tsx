import Link from 'next/link';

export default function EC2ProjectPage() {
  const projects = [
    {
      id: 1,
      title: "Basic EC2 Web Server",
      description: "Deploy and configure a basic NGINX web server on EC2 with proper security configurations",
      technologies: ["AWS EC2", "NGINX", "Security Groups", "SSH"],
      difficulty: "Beginner",
      href: "/projects/ec2/project1",
      status: "Available"
    },
    {
      id: 2,
      title: "Flask App with Load Balancer",
      description: "Host a Flask application with Application Load Balancer in a custom VPC setup",
      technologies: ["Flask", "ALB", "ASG", "VPC", "RDS"],
      difficulty: "Intermediate",
      href: "/projects/ec2/project2",
      status: "Available"
    },
    {
      id: 3,
      title: "Infrastructure as Code",
      description: "Automate deployment using CloudFormation templates for repeatable infrastructure",
      technologies: ["CloudFormation", "YAML", "IaC", "Parameters"],
      difficulty: "Intermediate",
      href: "/projects/ec2/project3",
      status: "Available"
    },
    {
      id: 4,
      title: "Infrastructure as Code - CDK",
      description: "Re-build project 3 using AWS CDK and P2M",
      technologies: ["VPC", "NAT Gateway", "Route Tables", "CDK"],
      difficulty: "Advanced",
      href: "/projects/ec2/project4",
      status: "In Creation"
    },
    {
      id: 5,
      title: "Containerized with ECS",
      description: "Deploy containerized applications using ECS and Fargate with auto-scaling",
      technologies: ["ECS", "Fargate", "Docker", "ECR", "Auto Scaling"],
      difficulty: "Advanced",
      href: "/projects/ec2/project5",
      status: "Pending"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-8">
      {/* Header Section */}
      <header className="text-center py-12 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          EC2 Project Series
        </h1>
        <p className="text-xl text-gray-300 max-w-5xl mx-auto">
          This is a 5 part project series that will help to gain familiarity with EC2 and associated resources. It will progress throughout the series from theoretical understanding to real world application using industry best practices. 
        </p>
        <br />
        <p className="text-xl text-gray-300 max-w-4xl mx-auto">
          By the end of the series you will be familiar with EC2 instances and their associated resources. You will also understand basic AWS networking and how to deploy EC2 instances to private subnets. 
        You will deploy a NGINX web server, Host a Flask App with Load Balancing in a custom VPC, Automate with Infrastructure as Code, and deploy containerized applications with ECS and Fargate.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Series Overview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 shadow-xl mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-red-700 pb-3">
            Series Overview
          </h2>
          <div className="text-gray-300 space-y-4">
            <p>
              This comprehensive project series takes you from EC2 basics to advanced cloud architecture patterns. 
              Each project builds upon the previous one, introducing new concepts and best practices used in 
              enterprise environments.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-red-500 font-bold mb-2">Learning Path</h3>
                <p className="text-sm">Progressive difficulty from beginner to advanced concepts</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-red-500 font-bold mb-2">Real-World Skills</h3>
                <p className="text-sm">Industry best practices and production-ready configurations</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-red-500 font-bold mb-2">Hands-On Practice</h3>
                <p className="text-sm">Step-by-step implementations with detailed explanations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={project.href} className="group">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-red-500 font-bold text-lg">Project {project.id}</span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      project.difficulty === 'Beginner' ? 'bg-green-600 text-white' :
                      project.difficulty === 'Intermediate' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {project.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-blue-600 text-white">
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300 border border-gray-600">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <div className="bg-gradient-to-r from-red-800 to-red-600 text-white px-4 py-2 rounded text-center font-medium group-hover:from-red-700 group-hover:to-red-500 transition-all">
                    Start Project →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
