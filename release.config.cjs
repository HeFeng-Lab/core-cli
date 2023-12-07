/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ["main", "next"],
  plugins: ["@semantic-release/commit-analyzer", "@semantic-release/release-notes-generator", ["@semantic-release/npm", { npmPublish: true }], "@semantic-release/github"],
}
