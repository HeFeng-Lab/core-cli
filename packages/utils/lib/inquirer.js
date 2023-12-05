import inquirer from "inquirer"

export function make(options) {
  const questions = { name: "name", mask: "*", default: options.defaultValue, ...options }

  if (options.type === "list") {
    questions.choices = options.choices
  }
  if (options.type === "input") {
    questions.message = options.message
  }
  if (options.type === "password") {
    questions.message = options.message
  }

  return inquirer
    .prompt(questions)
    .then((answers) => {
      return answers.name
    })
    .catch((error) => {
      console.log(error)
    })
}

const makeList = (params) => {
  return make({
    type: "list",
    ...params,
  })
}

const makeInput = (params) => {
  return make({
    type: "input",
    ...params,
  })
}

const markPassword = (params) => {
  return make({
    type: "password",
    ...params,
  })
}

export { makeList, makeInput, markPassword }
