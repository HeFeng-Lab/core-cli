import { log, makeList } from "@code-lab/utils";

export default function createInitCommand(program) {
  const PROJECT = "project";
  const PAGE = "page";
  const PROJECT_TYPES = [
    {
      name: "project",
      value: PROJECT
    },
    {
      name: "page",
      value: PAGE
    }
  ]

  const ADD_TEMPLATES = [
    {
      name: "Vue3 Template",
      value: "vue3-template"
    },
    {
      name: "React18 Template",
      value: "react18-template"
    },
    {
      name: "Vue Admin Template",
      value: "vue-admin-template"
    },
  ]

  program
    .command("init [name]")
    .description("init project")
    .option("-t, --type <type>", "Init project type project or page.")
    .option("-tp, --template <template-name>", "Template name to use")
    .hook("preAction", () => {
      log.verbose("preAction");
    })
    .hook("postAction", () => {
      log.verbose("postAction");
    })
    .action(async (str, options) => {
      console.log(str, options);

      const addType = await makeList({
        choices: PROJECT_TYPES
      })

      console.log(addType)

      if (addType === PROJECT) {
        const templateType = await makeList({
          choices: ADD_TEMPLATES
        })

        console.log(templateType)

      } else {
        log.error("The creation of this type is not supported.")
      }
    });
}