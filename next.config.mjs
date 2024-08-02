/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "rl80-43fed.web.app" },
      { hostname: "pbs.twimg.com" },
      { hostname: "img.clerk.com" },
      { hostname: "ourlady.io" },
    ],
  },
  async headers() {
    return [
      {
        // Match all files
        source: "/:all*(webp|svg|jpg|png|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, must-revalidate", // 1 year
          },
        ],
      },
    ];
  },
};

export default nextConfig;
