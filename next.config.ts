import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable static export for now - we'll use a custom build process for GitHub Pages
  // output: 'export',
  // basePath: '/effective-garbanzo',
  // assetPrefix: '/effective-garbanzo/',
  devIndicators: false,
  reactStrictMode: false,
  reactCompiler: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    scrollRestoration: false
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json', 'css']
  },
  webpack: (config: any) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [{ loader: '@svgr/webpack', options: { svgo: false } }]
    })

    return config
  },

  async redirects() {
    return [
      {
        source: '/zh',
        destination: '/',
        permanent: true
      },
      {
        source: '/en',
        destination: '/',
        permanent: true
      }
    ]
  }
}

export default nextConfig