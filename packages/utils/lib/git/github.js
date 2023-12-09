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
        headers: {},
      },
      requestConfigCallback: (config) => {
        // config.headers["Authorization"] = `Bearer ${this.token}`
        config.headers["Authorization"] = `Bearer xxx`
        config.headers["Accept"] = "application/vnd.github+json"

        return config
      },
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
