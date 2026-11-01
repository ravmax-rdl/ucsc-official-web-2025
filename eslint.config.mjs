import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "out/**", "node_modules/**"] },
  ...nextVitals,
  {
    // Blog posts are data files: `export default { … }` is the documented format.
    files: ["content/blog/posts/**/*.js"],
    rules: { "import/no-anonymous-default-export": "off" },
  },
];

export default config;
