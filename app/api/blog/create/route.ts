import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const BLOG_DATA_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

type BlogEntry = {
  id: string;
  title: string;
  date: string;
  category: string;
  image?: string;
  body: string;
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authorization = request.headers.get('authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authorization.substring(7);
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, category, body, image } = await request.json();

    if (!title || !category || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure data directory exists
    const dataDir = path.dirname(BLOG_DATA_FILE);
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Read existing blog posts
    let blogPosts: BlogEntry[] = [];
    if (existsSync(BLOG_DATA_FILE)) {
      const data = await readFile(BLOG_DATA_FILE, 'utf-8');
      blogPosts = JSON.parse(data);
    }

    // Create new blog post
    const newPost: BlogEntry = {
      id: (blogPosts.length + 1).toString(),
      title,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      category,
      body,
      image: image || undefined,
    };

    blogPosts.unshift(newPost); // Add to beginning

    // Save to file
    await writeFile(BLOG_DATA_FILE, JSON.stringify(blogPosts, null, 2));

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}