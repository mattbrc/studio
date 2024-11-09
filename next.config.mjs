/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  rules: {
    // General rules apply to both dev and prod
    "@typescript-eslint/no-unused-vars": "warn",
  },
  overrides: [
    {
      // Only applies in production
      files: ["*.ts", "*.tsx"],
      env: { production: true },
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  swcMinify: true,
};

export default config;
