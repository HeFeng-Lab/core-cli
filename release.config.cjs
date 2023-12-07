/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  repositoryUrl: "https://github.com/HeFeng-Lab/core-cli.git",
  branches: ["main"],
  plugins: ["@semantic-release/commit-analyzer", "@semantic-release/release-notes-generator", ["@semantic-release/npm", { npmPublish: true }], "@semantic-release/github"],
  debug: true,
}
