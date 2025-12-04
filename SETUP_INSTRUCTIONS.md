# ChainBlogger Two-Repository Setup Instructions

This document explains how to set up your chainBlogger project with two separate GitHub repositories:

1. **Public Repository**: Hosts the chainBlogger application via GitHub Pages
2. **Private Repository**: Stores all your blog posts content

## Step 1: Create Your GitHub Repositories

### Public Repository (for GitHub Pages)
1. Create a new public repository on GitHub (e.g., `my-blog-frontend`)
2. Set up GitHub Pages in the repository settings to deploy from the `main` branch

### Private Repository (for blog content)
1. Create a new private repository on GitHub (e.g., `my-blog-content`)
2. Keep this repository private to protect your blog content

## Step 2: Configure Environment Variables

Update the `.env.local` file with your specific values:

```env
NEXT_PUBLIC_CONTENT_REPO_OWNER=your-github-username
NEXT_PUBLIC_CONTENT_REPO_NAME=your-private-blog-repo-name  # This should be your PRIVATE repo
NEXT_PUBLIC_CONTENT_REPO_BRANCH=main
```

## Step 3: Create a Personal Access Token (PAT)

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Blog Content Manager"
4. Select the `repo` scope (this gives full access to private repositories)
5. Click "Generate token"
6. **Copy the token immediately** - you won't be able to see it again

## Step 4: Start Writing Blogs

1. Run the chainBlogger application locally:
   ```bash
   cd chainBlogger
   pnpm install
   pnpm dev
   ```

2. Navigate to the write page (usually `/write`)
3. Enter your Personal Access Token when prompted
4. Start writing and publishing your blog posts

## Security Notes

- Never commit your `.env.local` file or PAT to version control
- The `.env.local` file is already in `.gitignore` to prevent accidental commits
- Keep your PAT secure and never share it
- If you suspect your token has been compromised, regenerate it immediately