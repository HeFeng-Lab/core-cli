import path from "node:path"
import fse from "fs-extra"
import ora from "ora"
import chalk from "chalk"
import { pathExistsSync } from "path-exists"
import { log } from "@code-lab/utils"

function getCacheFilePath(targetPath, template) {
  return path.join(targetPath, "node_modules", `${template.npmName}`, "template")
}

function copyFileIntoDirectory(targetPath, template, installDir) {
  const originFilePath = getCacheFilePath(targetPath, template)

  const fileList = fse.readdirSync(originFilePath)

  log.verbose(fileList)

  const spinner = ora("Start copy file into current directory").start()

  fileList.forEach((file) => {
    fse.copySync(`${originFilePath}/${file}`, `${installDir}/${file}`)
  })

  spinner.stop()

  log.success("Templates copied successfully!")
}

function runningTips(name) {
  console.log("\n")

  console.log("Running Tips: \n")

  console.log(chalk.blue(`cd ${name} \n`))

  console.log(chalk.blue(`npm install \n`))

  console.log(chalk.blue(`npm run dev`))
}

export default function installTemplate({ name, selectedTemplate, options, targetPath }) {
  const { template } = selectedTemplate

  const { force } = options

  // fse.ensureDirSync(targetPath)

  const rootDir = process.cwd()
  const installDir = path.resolve(`${rootDir}/${name}`)
  log.verbose("installDir", installDir)

  if (pathExistsSync(installDir)) {
    if (!force) {
      log.error("Failed to create project because of this directory: " + installDir + " already exists.")
      return
    } else {
      fse.removeSync(installDir)
      fse.ensureDirSync(installDir)
    }
  } else {
    fse.ensureDirSync(installDir)
  }

  log.verbose(targetPath)
  log.verbose(installDir)

  copyFileIntoDirectory(targetPath, template, installDir)

  runningTips(name)
}
