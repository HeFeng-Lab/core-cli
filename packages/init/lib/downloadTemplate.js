import path from "node:path"
import { homedir } from "node:os"
import { pathExistsSync } from "path-exists"
import { execa } from "execa"
import fse from "fs-extra"
import ora from "ora"
import { log, printErrorLog } from "@code-lab/utils"

function getCacheDir(targetPath) {
  return path.resolve(targetPath, "node_modules")
}

function makeCacheDir(targetPath) {
  const cacheDir = getCacheDir(targetPath)
  if (!pathExistsSync(cacheDir)) {
    fse.mkdirpSync(cacheDir)
  }
}

async function downloadAddTemplate(targetPath, template) {
  const { npmName, version } = template

  await execa("npm", ["install", `${npmName}@${version}`], { cwd: targetPath })
}

const TEMP_HOME = ".core-cli"

function makeTargetPath() {
  return path.resolve(`${homedir()}/${TEMP_HOME}`, "addTemplate")
}

export default async function downloadTemplate(selectedTemplate) {
  const { template } = selectedTemplate
  const { npmName, version } = template

  const targetPath = makeTargetPath()

  makeCacheDir(targetPath)

  const spinner = ora(`${npmName}@${version} is downloading...`).start()

  try {
    await downloadAddTemplate(targetPath, template)

    spinner.stop()

    log.success("Download successfully!")
  } catch (error) {
    printErrorLog(error)

    spinner.stop()
  }
}
