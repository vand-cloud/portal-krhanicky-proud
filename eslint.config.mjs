import nextConfig from "eslint-config-next";

export default [
  ...nextConfig,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      ".firecrawl-cache/**",
      "playwright-report/**",
      "test-results/**",
      "storybook-static/**",
      ".vercel/**",
    ],
  },
];
