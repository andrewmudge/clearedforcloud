import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const BLOG_DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

type BlogEntry = {
  id: string;
  title: string;
  date: string;
  category: string;
  image?: string;
  body: string;
};

// Hardcoded fallback entries
const HARDCODED_BLOG_ENTRIES: BlogEntry[] = [
  {
    id: "1",
    title: "Welcome to Cleared for Cloud!",
    date: "2024-06-18",
    category: "General",
    image: "/firstblog.png",
    body: `There's something deeply satisfying about building systems that solve real problems—especially when those systems are scalable, secure, and entirely virtual. That's what drew me to cloud computing.

This blog is my personal platform to document my cloud journey: the lessons I'm learning, the projects I'm building, and the tools and technologies I'm using along the way. I created it not only to track my own progress, but to contribute to the larger community of learners, builders, and professionals who are also figuring things out one service at a time.
Right now, I'm focused on mastering the AWS ecosystem—Lambda, API Gateway, DynamoDB, Cognito, S3, and more. I'm using tools like the Serverless Framework and Terraform to automate infrastructure and build applications the way modern cloud-native teams do it. As I go, I'll be writing up the technical breakdowns, deployment strategies, architecture decisions, and hard lessons that come with hands-on learning.
You won't find generic cloud theory here. This blog will be project-driven, code-backed, and focused on practical implementation. Whether I'm building an event booking system, a portfolio app, or securing a serverless API, I'll explain the what, why, and how.
If you're someone who's learning cloud, switching careers, or just curious how real-world cloud solutions are built—this blog is for you. Thanks for reading, and stay tuned.

— Andrew`,
  },
  {
    id: "2",
    title: "LINUX CLI Bootcamp Day 1",
    date: "2024-06-20",
    category: "Learning",
    image: "/Linux_Blog_Post.png",
    body: "Today I started my Linux CLI bootcamp course. I created a Ubuntu EC2 instance with a pem key allowing me to SSH into the instance. I created a .bat file that I placed on the desktop so all I have to do is click the file and a new windows command prompt will open and directly connect me to the server. The sudo apt install ncal didn't work so I had to use sudo apt udate to update the apt package lists. It worked after applying the update and running sudo apt install ncal.",
  },
];

export async function GET() {
  try {
    let blogPosts: BlogEntry[] = [];
    
    if (existsSync(BLOG_DATA_FILE)) {
      const data = await readFile(BLOG_DATA_FILE, 'utf-8');
      blogPosts = JSON.parse(data);
    } else {
      blogPosts = HARDCODED_BLOG_ENTRIES;
    }

    return NextResponse.json({ posts: blogPosts });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json({ posts: HARDCODED_BLOG_ENTRIES });
  }
}