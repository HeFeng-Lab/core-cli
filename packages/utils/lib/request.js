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
  })

  instance.interceptors.request.use(
    function (config) {
      console.log(config)
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
