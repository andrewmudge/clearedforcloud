# Blog Admin System Setup

## Overview
I've added a complete admin system to your blog that allows you (and only you) to create new blog posts through a user interface instead of coding them manually.

## What's New

### 1. Admin Authentication
- **Login System**: Password-based authentication with JWT tokens
- **Secure Access**: Only authenticated users can create blog posts
- **Session Management**: Tokens persist in localStorage for convenience

### 2. Create Blog Post Interface
- **Rich Form**: Title, category, content, and optional image URL fields
- **Category Selection**: Dropdown with predefined categories (General, Learning, Project, Tutorial, AWS, Cloud, DevOps)
- **Large Text Area**: For writing detailed blog content
- **Real-time Updates**: New posts appear immediately after creation

### 3. API Endpoints
- `POST /api/auth/login` - Admin authentication
- `POST /api/blog/create` - Create new blog posts (requires authentication)
- `GET /api/blog/list` - List all blog posts

### 4. Data Storage
- **JSON File Storage**: Blog posts are saved to `data/blog-posts.json`
- **Fallback System**: Falls back to hardcoded entries if no file exists
- **Automatic ID Generation**: Sequential IDs for new posts

## How to Use

### 1. Access Admin Controls
1. Go to your blog page (`/blog`)
2. Click the "Admin" button in the top right
3. Enter the admin password (default: `admin123`)
4. Once logged in, you'll see "Create Post" and "Logout" buttons

### 2. Create a New Blog Post
1. Click "Create Post" button
2. Fill out the form:
   - **Title**: Your blog post title
   - **Category**: Select from dropdown
   - **Image URL**: Optional image for the post
   - **Content**: Your blog post content (supports line breaks)
3. Click "Create Post"
4. The new post will appear immediately on your blog

### 3. Security Features
- JWT token authentication
- Password protection
- Automatic token expiration (24 hours)
- Server-side validation

## Configuration

### Environment Variables
Create or update `.env.local` with:
```
JWT_SECRET=your-secure-jwt-secret-key-change-this-in-production
ADMIN_PASSWORD=your-secure-admin-password
```

### Default Password
- **Current password**: `admin123`
- **⚠️ IMPORTANT**: Change this in production by updating `ADMIN_PASSWORD` in `.env.local`

### JWT Secret
- **Current secret**: Default development key
- **⚠️ IMPORTANT**: Use a strong, random 32+ character string in production

## File Structure
```
app/
├── api/
│   ├── auth/login/route.ts          # Admin login endpoint
│   └── blog/
│       ├── create/route.ts          # Create blog post endpoint
│       └── list/route.ts            # List blog posts endpoint
├── components/
│   ├── AdminLogin.tsx               # Login modal component
│   └── CreateBlogPost.tsx           # Create post modal component
└── blog/page.tsx                    # Updated blog page with admin controls

data/
└── blog-posts.json                  # Blog posts storage (created automatically)
```

## Security Considerations

1. **Change Default Password**: Update `ADMIN_PASSWORD` in `.env.local`
2. **Secure JWT Secret**: Use a cryptographically secure random string
3. **HTTPS in Production**: Ensure your site uses HTTPS
4. **Environment Variables**: Never commit `.env.local` to version control

## Features

### Current Features
- ✅ Password-based admin authentication
- ✅ JWT token management
- ✅ Create new blog posts via UI
- ✅ Rich form with validation
- ✅ Automatic date assignment
- ✅ Real-time blog updates
- ✅ Mobile-responsive design
- ✅ Integration with existing blog design

### Future Enhancement Ideas
- Edit existing blog posts
- Delete blog posts
- Draft system
- Image upload functionality
- Rich text editor (WYSIWYG)
- Categories management
- User management
- Database integration (DynamoDB)

## Troubleshooting

### Can't Login
- Check that `ADMIN_PASSWORD` in `.env.local` matches what you're entering
- Restart the development server after changing environment variables

### Posts Not Saving
- Check file permissions in the `data/` directory
- Verify the server has write access to the project directory

### Token Expired
- Click "Logout" and log back in
- Tokens expire after 24 hours for security

## Development

To test the system:
1. Run `npm run dev`
2. Go to `/blog`
3. Click "Admin" and use password `admin123`
4. Try creating a test blog post

The system is production-ready but remember to update the security settings before deploying!