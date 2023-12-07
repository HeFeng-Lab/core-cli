import Command from "@code-lab/command"
import { initPlatform } from "@code-lab/utils"

class InstallCommand extends Command {
  constructor() {
    this.platformApi = null
  }

  get command() {
    return "install"
  }

  get description() {
    return "Install the specified project from github or gitee."
  }

  async action() {
    // 1.选择 git 平台
    await choosePlatform()

    // 2. 选择搜索模式：仓库/代码

    // 3. 输入关键词

    // 4. 选择开发语言

    // 5. 搜索

    // 6. 选择 Tag /version

    // 7. 下载

    // 8. 安装

    // 9. 启动
  }

  async choosePlatform() {
    this.platformApi = await initPlatform()
  }
}

export default function createInstallCommand(instance) {
  return new InstallCommand(instance)
}
