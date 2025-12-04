# GitHub Pages Deployment Guide for chainBlogger

This guide explains how to set up deployment of your chainBlogger to GitHub Pages, where you manually build the project and only push the built distribution files without exposing your source code.

## Prerequisites

1. A GitHub account
2. This chainBlogger project set up locally
3. Node.js and pnpm installed

## GitHub Repository Setup

### 1. Create Your Public Repository for GitHub Pages

1. Create a new **public** repository on GitHub (e.g., `my-blog`)
2. Note the repository name as you'll need it for the deployment configuration

### 2. Configure GitHub Pages

1. Go to your repository's **Settings**
2. Click on **Pages** in the left sidebar
3. Under **Source**, select:
   - Source: GitHub Actions
   - This tells GitHub to use your workflow for deployment

## Manual Build Process

Instead of having GitHub Actions build your project, you will build it locally and only commit the distribution files:

1. **Build the project locally**:
   ```bash
   cd chainBlogger
   pnpm install
   pnpm build
   ```
   This generates the built files in the `./out` directory.

2. **Commit only the built files**:
   You have two options:
   
   Option A: Use a separate branch for built files:
   ```bash
   # Create a new branch for the built files
   git checkout -b gh-pages
   
   # Remove everything except the out directory
   # (This is just an example - be careful with these commands)
   # git rm -rf .
   # cp -r out/* .
   # git add .
   # git commit -m "Deploy built files"
   # git push origin gh-pages
   ```
   
   Option B: Replace the workflow with a simpler approach (recommended):
   - Keep your source code in the `main` branch
   - Create a separate repository just for the built files

## GitHub Actions Workflow

The workflow file (`.github/workflows/deploy.yml`) is configured to deploy pre-built files:

- Assumes you've already built the project locally
- Only deploys files from the `./out` directory to GitHub Pages
- Does not perform any building itself

## Environment Variables

You may need to set up environment variables in your GitHub repository:

1. Go to your repository's **Settings**
2. Click on **Secrets and variables** → **Actions**
3. Add the following variables:
   - `NEXT_PUBLIC_CONTENT_REPO_OWNER`: Your GitHub username
   - `NEXT_PUBLIC_CONTENT_REPO_NAME`: Your private repository name for blog content
   - `NEXT_PUBLIC_CONTENT_REPO_BRANCH`: Usually `main`
   - `NEXT_PUBLIC_GITHUB_APP_ID`: Your GitHub App ID

## Deployment Process

1. **Initial Setup**:
   - Build your project locally with `pnpm build`
   - Commit and push the built files to your repository
   - GitHub Actions will deploy the site

2. **Subsequent Updates**:
   - Make changes to your chainBlogger source code
   - Build locally with `pnpm build`
   - Commit and push only the built files
   - GitHub Actions will automatically deploy your updated site

3. **Manual Deployment**:
   - You can also trigger the workflow manually from the **Actions** tab in your repository

## Recommended Approach: Two Repositories

For the cleanest separation, we recommend using two repositories:

1. **Source Repository** (Private):
   - Contains your chainBlogger source code
   - Never pushes built files to this repository

2. **Deployment Repository** (Public):
   - Contains only the built files from `./out` directory
   - Used for GitHub Pages deployment
   - GitHub Actions workflow monitors this repository

Workflow:
1. Develop in your private source repository
2. Build locally with `pnpm build`
3. Copy the contents of `./out` to your public deployment repository
4. Commit and push to the deployment repository
5. GitHub Actions automatically deploys to GitHub Pages

## Benefits of This Approach

- **Security**: Your source code remains private
- **Control**: You control exactly what gets deployed
- **Performance**: Only optimized build files are served
- **Flexibility**: You can review built files before deployment
- **Separation**: Clear distinction between source and deployment

## Troubleshooting

If your deployment fails:

1. Check the **Actions** tab in your repository for error messages
2. Ensure all environment variables are correctly set
3. Verify that your built files are in the `./out` directory
4. Check that your GitHub Pages source is set to "GitHub Actions"

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to your `public` directory with your domain name
2. Configure your DNS provider to point to your GitHub Pages URL
3. Update the custom domain settings in your repository's Pages settings

Your chainBlogger will now deploy to GitHub Pages whenever you push the built files to your repository!