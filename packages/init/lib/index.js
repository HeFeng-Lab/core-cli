import { log, makeList } from "@code-lab/utils";

export default function createInitCommand(program) {
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