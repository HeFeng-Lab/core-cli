import { log, makeList } from "@code-lab/utils"

const PROJECT = "project"
const PAGE = "page"
const PROJECT_TYPES = [
  {
    name: "project",
    value: PROJECT,
  },
  {
    name: "page",
    value: PAGE,
  },
]

const ADD_TEMPLATES = [
  {
    name: "vue3-template",
    value: "vue3-template",
    npmName: "@code-lab/vue3-template",
    version: "0.1.0",
  },
  {
    name: "react18-template",
    value: "react18-template",
    npmName: "@code-lab/react18-template",
    version: "0.1.0",
  },
  {
    name: "vue-admin-template",
    value: "vue-admin-template",
    npmName: "@code-lab/vue-admin-template",
    version: "0.1.0",
  },
]

async function createTemplate(name, options) {
  // 匹配 --template template-name
  const { template } = options

  const addType = await makeList({
    message: "Please select initialization type: ",
    choices: PROJECT_TYPES,
    defaultValue: PROJECT,
  })

  if (addType === PROJECT) {
    let templateName
    if (template) {
      const item = ADD_TEMPLATES.find((t) => t.value === template)

      if (!item) {
        throw new Error(`Couldn't find ${template}`)
      } else {
        templateName = item.value
      }
    } else {
      templateName = await makeList({
        choices: ADD_TEMPLATES,
        message: "Please select template name: ",
      })
    }

    log.verbose("templateName", templateName)

    const selectedTemplate = ADD_TEMPLATES.find((t) => t.value === templateName)

    return {
      type: addType,
      name: templateName,
      template: selectedTemplate,
    }
  } else {
    log.error("The creation of this type is not supported.")
  }
}

export default createTemplate