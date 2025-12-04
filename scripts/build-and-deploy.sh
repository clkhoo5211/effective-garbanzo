#!/bin/bash

# Build and Deploy Script for chainBlogger
# This script helps you build the project and prepare it for deployment

echo "=== chainBlogger Build and Deploy Script ==="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the chainBlogger root directory."
    exit 1
fi

echo "1. Installing dependencies..."
pnpm install

echo "2. Building the project..."
pnpm build

if [ $? -ne 0 ]; then
    echo "Error: Build failed. Please check the output above."
    exit 1
fi

echo "3. Build completed successfully!"
echo ""
echo "Next steps for deployment:"
echo "- The built files are in the 'out' directory"
echo "- Copy these files to your public GitHub Pages repository"
echo "- Commit and push to deploy to GitHub Pages"
echo ""
echo "For detailed instructions, see GITHUB_PAGES_DEPLOYMENT.md"