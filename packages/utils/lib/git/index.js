import { makeList } from "../inquirer.js"
import Github from "./github.js"
import Gitee from "./github.js"

async function initPlatform() {
  const plateform = await makeList({
    message: "Please select git platform",
    choices: [
      {
        name: "Github",
        value: "github",
      },
      {
        name: "Gitee",
        value: "gitee",
      },
    ],
  })

  let gitServerApi = {}

  if (plateform === "github") {
    gitServerApi = new Github()
  } else if (plateform === "gitee") {
    gitServerApi = new Gitee()
  }

  gitServerApi.plateform = plateform

  return gitServerApi
}

export { initPlatform }
