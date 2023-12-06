import { makeList } from "../inquirer"

async function initPlatform() {
  await makeList({
    message: "Please select git platform"
  })
}

export {
  initPlatform
}