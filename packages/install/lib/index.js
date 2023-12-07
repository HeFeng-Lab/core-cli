import Command from "@code-lab/command"
import { initPlatform, makeInput, makeList, makeRawList, log } from "@code-lab/utils"

class InstallCommand extends Command {
  constructor(instance) {
    super(instance)

    this.platformApi = null
    this.condition = {}
    this.searchResult = []

    this.pagination = {
      per_page: 10,
      page: 1,
      total: 0,
    }
  }
  get command() {
    return "install"
  }

  get description() {
    return "Install the specified project from github or gitee."
  }

  async action() {
    // 1.选择 git 平台
    await this.choosePlatform()

    // 2.提示输入搜索相关条件
    await this.promptSearchCondition()

    // 3. 搜索
    await this.search()

    // 4. 选择项目、Tag/version
    await this.chooseProject()

    // 5. 下载

    // 6. 安装

    // 7. 启动
  }

  async choosePlatform() {
    this.platformApi = await initPlatform()
  }

  async promptSearchCondition() {
    // 1. 选择搜索模式：仓库/代码
    const searchMode = await makeList({
      message: "Please select search mode repository or code",
      choices: [
        {
          name: "Repository",
          value: "repository",
        },
        { name: "Code", value: "code" },
      ],
    })
    log.verbose("search mode", searchMode)

    // 2. 输入关键词
    const searchKeyword = await makeInput({
      message: "Please enter keyword",
      validate(value) {
        if (!value.length) {
          return false
        }
        return true
      },
    })
    log.verbose("search keyword", searchKeyword)

    // 3. 选择开发语言
    const language = await makeInput({
      message: "Please enter language",
    })
    log.verbose("language", language)

    this.condition = {
      searchMode,
      searchKeyword,
      language,
    }

    this.resetPagination()

    await this.search()
  }

  async search() {
    this.searchResult = await (this.platformApi.plateform === "github" ? this.searchGithub() : this.searchGitee())
    return this.searchResult
  }

  async searchGithub() {
    const { searchMode, searchKeyword, language } = this.condition
    const { per_page, page } = this.pagination

    let result = []

    if (searchMode === "repository") {
      const params = {
        q: language ? `q=${encodeURIComponent(`${searchKeyword}+language:${language}`)}` : searchKeyword,
        sort: "stars",
        order: "desc",
        per_page,
        page,
      }
      log.verbose("params", params)
      result = await this.platformApi.searchRepositories(params)
    } else if (searchMode === "code") {
      const params = {
        q: language ? `q=${searchKeyword}+language:${language}` : searchKeyword,
        sort: "stars",
        order: "desc",
        per_page,
        page,
      }
      result = await this.platformApi.searchCode(params)
    }

    const { items, total_count } = result

    this.pagination.total = total_count

    return items
  }

  searchGitee() {}

  resetPagination() {
    this.pagination = {
      per_page: 10,
      page: 1,
      total: 0,
    }
  }

  async chooseProject() {
    const { name: fullName } = await makeRawList({
      message: "Please select a project",
      choices: this.searchResult.map(({ full_name, description, clone_url, tags_url }) => {
        return {
          name: `${full_name}(${description?.length > 100 ? description.slice(100) : description || ""})`,
          value: {
            name: full_name,
            description,
            gitUrl: clone_url,
            tagUrl: tags_url,
          },
        }
      }),
    })

    await this.searchTags(fullName)

    await makeRawList({
      message: "Please select a tag",
      choices: this.tagList.map(({ name }) => {
        return {
          name,
          value: name,
        }
      }),
    })
  }

  async searchTags(fullName) {
    this.resetPagination()

    const params = {
      per_page: 9999,
      page: 1,
    }

    const result = await this.platformApi.searchTags(fullName, params)

    // this.pagination.total = result.length

    this.tagList = result

    return result
  }
}

export default function createInstallCommand(instance) {
  return new InstallCommand(instance)
}
