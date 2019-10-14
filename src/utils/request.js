// axios 请求相关的操作封装到这
// 引入
import axios from 'axios'
import JSONbig from 'json-bigint'
// 非组件模块访问容器，需要import from 引入
// 这里得到的store和组件中访问的this.$store是一个东西
import store from '@/store'

// axios.create 方法
// 建议使用 create 方式，我们可以拥有
// 说白了就是复制了一个 axios，拥有和 axios 完全一样的功能，但是配置可以不一样
// 例如我们可以创建多个请求对象，而不同的请求对象拥有不同的 baseURL
// 例如我们可以有 a 请求的拦截器，也可以专门定制 b 请求的拦截器
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn'
})

// ======配置处理后端返回数据中超出了JS安全整数范围
request.defaults.transformResponse = [function (data) {
  return data ? JSONbig.parse(data) : {}
}]

/**
 * 请求拦截器
 **/
request.interceptors.request.use(function (config) {
  // config是发送请求要配置的信息
  // 将令牌赋值给user
  const user = store.state.user
  // 判断令牌是否存在
  if (user) {
    // Authorization 是后端要求的名字，不能瞎写
    // 数据值 "Bearer空格token" 也是后端要求的数据格式，不能瞎写
    // 千万!千万!千万!注意，Bearer 和 token 之间的空格不能少
    // 什么意义？这是后端要求的，我们决定不了。
    config.headers['Authorization'] = `Bearer ${user.token}`
    // 统一注入token到headers,因为所有接口要求的token格式是一样的
  }
  return config
}, function (error) {
  // 对请求失败做处理
  return Promise.reject(error)
})
/**
  * 响应拦截器
  */
// 导出这个请求对象，哪里需要发请求，哪里就加载使用
export default request
