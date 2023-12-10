import Command from "@code-lab/command"
import { initPlatform, makeInput, makeList, makeRawList, log, printErrorLog } from "@code-lab/utils"
import ora, { spinners } from 'ora';

class InstallCommand extends Command {
  constructor(instance) {
    super(instance)

    this.platformApi = null
    this.condition = {}
    this.searchResult = []

    this.pagination = {
      per_page: 30,
      page: 1,
      total: 0,
    }

    this.selectProject = {}
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

    // 3. 搜索并选择 repo
    await this.search()

    // 4. 搜索并选择 tag
    await this.searchTags()

    // 5. 下载仓库
    await this.downloadRepository(this.selectProject.name, this.selectProject.tag)

    // 6. 安装依赖
    await this.installDependencies()

    // 7. 启动
    await this.running()
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
        {name: "Code", value: "code"},
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
  }

  async search() {
    this.searchResult = await (this.platformApi.plateform === "github" ? this.searchGithub() : this.searchGitee())

    this.searchResult = this.searchResult.map(({full_name, description}, index) => {
      const simpleDescription = description?.length > 100 ? `${description.slice(0, 100)}...` : description

      const newIndex = (this.pagination.page - 1) * this.pagination.per_page + index + 1

      return {
        name: `${newIndex}) ${full_name}(${simpleDescription})`,
        value: full_name,
      }
    })

    if (this.pagination.page > 1) {
      this.searchResult.unshift({
        name: "Prev Page",
        value: "prev",
      })
    }

    const totalPage = parseInt(this.pagination.total / this.pagination.per_page)

    if (this.pagination.page < totalPage) {
      this.searchResult.push({
        name: "Next Page",
        value: "next",
      })
    }

    const selectProjectName = await makeList({
      message: "Please select a project",
      choices: this.searchResult,
    })

    log.verbose("selectProjectName", selectProjectName)

    if (selectProjectName === "prev") {
      this.pagination.page -= 1
      await this.search()
    } else if (selectProjectName === "next") {
      this.pagination.page += 1
      await this.search()
    } else {
      this.selectProject.name = selectProjectName
    }

    return selectProjectName
  }

  async searchGithub() {
    const {searchMode, searchKeyword, language} = this.condition
    const {per_page, page} = this.pagination

    let result = []

    if (searchMode === "repository") {
      const params = {
        q: language ? `${searchKeyword}+language:${language}` : searchKeyword,
        sort: "stars",
        order: "desc",
        per_page,
        page,
      }
      log.verbose("params", params)
      result = await this.platformApi.searchRepositories(params)
    } else if (searchMode === "code") {
      const params = {
        q: language ? `${searchKeyword}+language:${language}` : searchKeyword,
        sort: "stars",
        order: "desc",
        per_page,
        page,
      }
      result = await this.platformApi.searchCode(params)
    }

    const {items, total_count} = result

    this.pagination.total = total_count

    return items
  }

  searchGitee() {
  }

  resetPagination() {
    this.pagination = {
      per_page: 30,
      page: 1,
      total: 0,
    }
  }

  async searchTags() {
    const {per_page, page} = this.pagination
    const params = {
      per_page,
      page,
    }

    const result = await this.platformApi.searchTags(this.selectProject.name, params)

    this.tagList = result.map(({name}, index) => {
      const newIndex = (this.pagination.page - 1) * this.pagination.per_page + index + 1

      return {
        name: `${newIndex}) ${name}`,
        value: name,
      }
    })

    if (this.pagination.page > 1) {
      this.tagList.unshift({
        name: "Prev Page",
        value: "prev",
      })
    }

    this.tagList.push({
      name: "Next Page",
      value: "next",
    })

    let tag = await makeList({
      message: "Please select a tag",
      choices: this.tagList,
    })

    log.verbose("tag", tag)

    if (tag === "prev") {
      this.pagination.page -= 1
      await this.searchTags()
    } else if (tag === "next") {
      this.pagination.page += 1
      await this.searchTags()
    } else {
      this.selectProject.tag = tag
    }


    return tag
  }

  async downloadRepository(fullName, tag) {

    const spinner = ora("git clone is starting...").start()

    try {
      await this.platformApi.cloneRepository(fullName, tag)

      spinner.stop();

      log.info(`${fullName} is already downloaded in current directory.\n`)

      log.info("Enjoy your time!")
    } catch (err) {
      spinner.stop();
      printErrorLog(err)
    }
  }

  async installDependencies() {
    const spinner = ora("Install dependencies is starting...").start()

    try {
      await this.platformApi.installDependencies(process.cwd(), this.selectProject.name)

      spinner.stop();

      log.info("Install dependencies complete~")
    } catch (err) {
      spinner.stop();
      printErrorLog(err)
    }
  }

  async running() {
    await this.platformApi.runRepository(process.cwd(), this.selectProject.name)
  }
}

export default function createInstallCommand(instance) {
  return new InstallCommand(instance)
}
