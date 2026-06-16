/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // static site (SSG) — deploy to GitHub Pages / Netlify / Vercel
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
