/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true, ...(process.env.STATIC_EXPORT ? { output: 'export', images: { unoptimized: true } } : {}) };
export default nextConfig;
