export default class Command {
  constructor(instance) {
    if (!instance) {
      throw new Error("command instance must not be null!")
    }

    this.instance = instance

    const command = this.instance.command(this.command).description(this.description)

    this.options?.forEach((option) => {
      command.option(...option)
    })

    command.hook("preAction", () => {
      this.preAction()
    })

    command.action((...params) => {
      this.action(params)
    })

    command.hook("postAction", () => {
      this.preAction
    })
  }

  get command() {
    throw new Error("command must be implements")
  }

  get description() {
    throw new Error("description must be implements")
  }

  get options() {
    return []
  }

  get action() {
    throw new Error("action must be implements")
  }

  preAction() {}

  postAction() {}
}
