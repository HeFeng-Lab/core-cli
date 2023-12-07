import GitServer from "./gitServer.js"
import createAxiosInstance from "../request.js"

export default class Gitee extends GitServer {
  constructor() {
    super()
  }

  get service() {
    return createAxiosInstance({
      axiosOptions: {
        baseURL: "https://api.github.com",
      },
      requestConfigCallback(config) {
        config.headers["Authorization"] = `Bearer ${this.token}`
        config.headers["Accept"] = "application/vnd.github+json"

        return config
      },
    })
  }

  searchRepositories(params) {
    return this.get("/search/repositories", params)
  }

  searchCode(params) {
    return this.get("/search/code", params)
  }
}
