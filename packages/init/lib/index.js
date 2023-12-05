import { log } from "@code-lab/utils"
import Command from "@code-lab/command"

import createTemplate from "./createTemplate.js"
import downloadTemplate from "./downloadTemplate.js"
import installTemplate from "./installTemplate.js"

class InitCommand extends Command {
  get command() {
    return "init [name]"
  }

  get description() {
    return "init your project"
  }

  get options() {
    return [["-t, --template <template>", "template name"]]
  }

  async action([name, options]) {
    log.verbose("name", name)
    log.verbose("options", options)

    // 1. 选择模板
    const selectedTemplate = await createTemplate(name, options)

    log.verbose("selectedTemplate", selectedTemplate)

    // 2. 下载模板
    downloadTemplate(selectedTemplate)

    // 3. 安装模板
    installTemplate(selectedTemplate, options)
  }
}

const init = (instance) => {
  return new InitCommand(instance)
}

export default init
