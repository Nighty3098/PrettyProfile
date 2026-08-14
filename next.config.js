/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  async headers() {
    // Apply CSP only in production to avoid blocking dev scripts
    if (process.env.NODE_ENV !== "production") return []

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'none'; " +
              "img-src 'self' https://camo.githubusercontent.com data:; " +
              "script-src-elem 'sha256-ZswfTY7H35rbv8WC7NXBoiC7WNu86vSzCDChNWwZZDM=' " +
              "'sha256-yei5Fza+Eyx4G0smvN0xBqEesIKumz6RSyGsU3FJowI='; " +
              "style-src 'self' 'unsafe-inline'; " +
              "font-src 'self' data:;",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=86400",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
