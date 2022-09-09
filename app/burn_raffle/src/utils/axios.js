import axios from 'axios'
import { Toast } from 'vant'

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '//127.0.0.1:8090/api' : '/api'
axios.defaults.withCredentials = true
// axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers['token'] = localStorage.getItem('token') || ''
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    return Promise.reject(res)
  }

  return res.data
})

export default axios
