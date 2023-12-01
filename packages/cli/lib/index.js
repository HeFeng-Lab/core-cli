import createCli from "./createCli.js"
import createInitCommand from "@code-lab/init"
import createInstallCommand from "@code-lab/install"

export default function () {
  const program = createCli()

  createInitCommand(program)
  createInstallCommand(program);
  
  program.parse(process.argv);
}
