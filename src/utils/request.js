// axios 请求相关的操作封装到这
// 引入
import axios from 'axios'
import JSONbig from 'json-bigint'

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

/**
  * 响应拦截器
  */
// 导出这个请求对象，哪里需要发请求，哪里就加载使用
export default request
