/**
 * 用户相关接口的封装模块
 * 最佳实践：可以将所有的请求都封装成一个一个的小函数，在炫耀的时候可以直接调用
 * 好处：好维护，统一管理，可以重复调用多次
 * 遵循一个原则：不要再组件中发送请求，都封装成函数直接调用
 */
import request from '@/utils/request'

// export function login (data) {
//     return request({
//     method: 'POST',
//     url: '/app/v1_0/authorizations',
//     data
//     })
// }

export const login = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
