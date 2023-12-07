export default class GitServer {
  constructor() {
    this.token = null

    this.init()
  }

  init() {
    // 读取 token
  }

  get(url, params, headers) {
    return this.service({
      method: "GET",
      url,
      params,
      headers,
    })
  }

  post(url, data, headers) {
    return this.service({
      method: "GET",
      url,
      params: {
        access_token: this.token,
      },
      data,
      headers,
    })
  }
}
