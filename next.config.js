/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Every remote host used by next/image must be whitelisted here.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" }, // post images (Cloudinary)
      { protocol: "https", hostname: "images.unsplash.com" }, // placeholder/blog covers
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
      { protocol: "https", hostname: "graph.facebook.com" }, // Facebook avatars
    ],
  },
};

module.exports = nextConfig;
