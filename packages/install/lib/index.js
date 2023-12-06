import Command from "@code-lab/command"

class InstallCommand extends Command {
  get command() {
    return "install"
  }

  get description() {
    return "Install the specified project from github or gitee."
  }

  async action() {}
}

export default function createInstallCommand(instance) {
  return new InstallCommand(instance)
}
