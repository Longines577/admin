import axios from 'axios'
import router from '../router'


//添加请求拦截器
axios.interceptors.request.use(function(config) {
    config.timeout = 10000
        // config.headers['Conter-Type'] = 'application/x-www-form-urlencoded'
    return config
}, function(error) {
    return Promise.reject(error)
})

//添加响应拦截器
axios.interceptors.response.use(response => {
        if (response.data.status === 30000) {
            console.log('跳转到登录')
            router.push({ path: `/login` })
        }
        return response
    }, error => {
        return Promise.reject(error)
    })
export default axios