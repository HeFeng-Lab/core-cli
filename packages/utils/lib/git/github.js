import GitServer from "./gitServer.js"
import createAxiosInstance from "../request.js"

export default class Github extends GitServer {
  constructor() {
    super()

    this.service = {}

    this.initService()
  }

  initService() {
    this.service = createAxiosInstance({
      axiosOptions: {
        baseURL: "https://api.github.com",
        headers: {
          "Authorization": `Bearer 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`,
          "Accept": "application/vnd.github+json"
        }
      },
      // requestConfigCallback: (config) => {
      //   console.log("config", config)
      //   // config.headers["Authorization"] = `Bearer ${this.token}`
      //   config.headers["Authorization"] = `Bearer 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`
      //   // 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
      //   config.headers["Accept"] = "application/vnd.github+json"

      //   return config
      // },
      responseInterceptorsCallback: (response) => {
        if (response.status === 200) {
          return response.data
        }
        return Promise.reject(`Response Error: code ${response.status}`)
      },
    })
  }

  searchRepositories(params) {
    return this.get("/search/repositories", params)
  }

  searchCode(params) {
    return this.get("/search/code", params)
  }

  searchTags(fullName, params) {
    return this.get(`/repos/${fullName}/tags`, params)
  }
}
