import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import nprogress from 'nprogress'
import "nprogress/nprogress.css"
import { message } from "ant-design-vue";

const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000
})

service.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  nprogress.start()
  // const token = sessionStorage.getItem('token')
  // if (token) {
  // 需要在请求头当中添加token
  //   config.headers['Authorization'] = "Bearer " + token
  // }
  return config
}, (err: AxiosError) => {
  nprogress.done
  return Promise.reject(err)
})

service.interceptors.response.use((res: AxiosResponse): AxiosResponse => {
  nprogress.done()
  return res.data
}, (err: AxiosError) => {
  nprogress.done()
  if (err.response && err.response.status) {
    //   // 错误请求的状态码
    const status = err.response.status
    if (status === 400) {
      message.error(err.response.data.message)
    }
    if (status === 401) {
      message.error('登录过期,请重新登录')
    }
    if (status === 403) {
      message.error('没有权限')
    }
    if (status === 404) {
      message.error('接口路径错误')
    }
    if (status === 500) {
      message.error('服务器出错')
    }
    if (status === 503) {
      message.error('服务器在维护')
    }
  }

})

export default service