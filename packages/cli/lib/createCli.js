import { program } from "commander"
import { log, readFileInfo } from "@code-lab/utils"

const pkg = readFileInfo("../package.json")

export default function () {
  program
    .name("core-cli")
    .usage("command [global options]")
    .description("Code Labs core CLI.")
    .version(`v${pkg.version}`)
    .option("-d, --debug", "Enable open debugger mode.", false)
    .option("-v, --version", "Cli version.")
    .option("-s, --separator <char>")
    .hook("preAction", () => {
      log.info("core-cli", "preAction")
    })

  program.on("option:debug", function () {
    if (program.opts().debug) {
      log.verbose("Launch debugger mode")
    }
  })

  program.on("command:*", function (obj) {
    log.error("Command not found: " + obj[0])
  })

  return program
}
