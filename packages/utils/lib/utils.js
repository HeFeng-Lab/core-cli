import path from "node:path"
import fse from "fs-extra"
import { dirname } from "dirname-filename-esm"

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
