import path from "node:path"
import { homedir } from 'node:os';
import fse from "fs-extra"
import { dirname } from "dirname-filename-esm"

const TEMP_HOME = '.core-cli';
const TEMP_TOKEN = '.git_token';

export const isDebug = () => process.argv.includes("-d") || process.argv.includes("--debug")

export const readFileInfo = (relativePath) => {
  const __dirname = dirname(import.meta)

  const filePath = path.resolve(__dirname, relativePath)
  const file = fse.readJsonSync(filePath)
  return file
}

export const getProjectPath = (cwd, fullName) => {
  const projectName = fullName.split('/')[1];

  return path.resolve(cwd, projectName);
}

export const createTokenPath = () => {
  return path.resolve(homedir(), TEMP_HOME, TEMP_TOKEN);
}