import axios from "axios"

const createAxiosInstance = ({ axiosOptions, requestConfigCallback, responseInterceptorsCallback }) => {
  const { baseURL, headers } = axiosOptions

  const instance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    paramsSerializer: (params) => {
      return Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&")
    },
  })

  instance.interceptors.request.use(
    function (config) {
      return requestConfigCallback ? requestConfigCallback(config) : config
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    function (response) {
      return responseInterceptorsCallback(response)
    },
    function (error) {
      return Promise.reject(error)
    }
  )

  return instance
}

export default createAxiosInstance
