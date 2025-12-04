# ChainBlogger Deployment Guide

This guide explains how to deploy your chainBlogger application to GitHub Pages using the generated build files.

## Build Process Summary

The build process has been successfully completed and generated files in the `out` directory. These files are ready for deployment to GitHub Pages with proper path corrections for subdirectory hosting.

## Deployment Steps

### 1. Deploy to GitHub Pages

You have three options for deploying to GitHub Pages:

#### Option A: Automated Deployment (Easiest)

Run the automated deployment script:
```bash
cd /path/to/chainBlogger
pnpm deploy:gh
```

This script will:
1. Clone your public repository (`effective-garbanzo`)
2. Copy all files from the `out` directory
3. Commit and push to deploy automatically
4. Clean up temporary files

#### Option B: Manual Deployment (Recommended for initial setup)

1. Clone your public repository (`effective-garbanzo`) to your local machine:
   ```bash
   git clone https://github.com/clkhoo5211/effective-garbanzo.git
   cd effective-garbanzo
   ```

2. Copy all files from the `out` directory to your local repository:
   ```bash
   # From the chainBlogger directory
   cp -r out/* /path/to/effective-garbanzo/
   ```

3. Commit and push the files to GitHub:
   ```bash
   cd /path/to/effective-garbanzo
   git add .
   git commit -m "Deploy chainBlogger build"
   git push origin main
   ```

4. Configure GitHub Pages in your repository settings:
   - Go to your repository's Settings
   - Click on "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click "Save"

#### Option C: Automated Deployment with GitHub Actions

1. Ensure your GitHub Actions workflow is properly configured in `.github/workflows/deploy.yml`
2. Push changes to trigger the workflow automatically

### 2. Environment Configuration

Make sure your GitHub repository has the following secrets configured:

- `NEXT_PUBLIC_CONTENT_REPO_OWNER`: clkhoo5211
- `NEXT_PUBLIC_CONTENT_REPO_NAME`: friendly-enigma
- `NEXT_PUBLIC_CONTENT_REPO_BRANCH`: main

These values are already configured in your `.env` file.

### 3. Verification

After deployment:

1. Visit your GitHub Pages URL (typically `https://clkhoo5211.github.io/effective-garbanzo/`)
2. Verify that the homepage loads correctly
3. Test navigation to different sections
4. Try accessing a blog post to ensure dynamic content loading works

## Updating Your Blog

To update your blog with new content:

1. Make changes to your chainBlogger source code (if needed)
2. Run the build and export process:
   ```bash
   cd /path/to/chainBlogger
   pnpm build
   pnpm prepare:gh
   ```
3. Deploy using one of the methods above

## Important Notes

1. **Dynamic Content**: Blog posts are dynamically loaded from your private repository (`friendly-enigma`) at runtime, not during the build process.

2. **Authentication**: When writing new blog posts, you'll need to provide your GitHub Personal Access Token (PAT) through the application interface.

3. **Security**: Never commit your PAT to version control. The token should only be entered through the application interface.

4. **Repository Structure**:
   - Public Repository (`effective-garbanzo`): Hosts the static website files
   - Private Repository (`friendly-enigma`): Stores blog content (markdown files, images, etc.)

5. **GitHub Pages Path Handling**: All asset paths are automatically corrected to work with the `/effective-garbanzo/` subdirectory.

6. **Asset Optimization**: To work around GitHub Pages limitations with large numbers of files, assets are flattened into a single `/assets/` directory.

## Troubleshooting

If you encounter issues:

1. **Page Not Found**: Ensure GitHub Pages is properly configured in your repository settings
2. **Missing Styles**: Check that all static assets were copied correctly
3. **Blog Content Not Loading**: Verify your PAT has the correct permissions and repository access
4. **Build Errors**: Check the console output during the build process for specific error messages

## Support

For additional help, refer to the main README.md file or contact the project maintainers.