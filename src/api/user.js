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
/**
 * 关注用户
 */
export function followUser (userId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId // 用户id
    }
  })
}
/**
 * 取消关注用户（参数id）
 */
export function unFollowUser (userId) {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/user/followings/' + userId
  })
}

/**
 * 获取用户自己信息
 */
export function getSelf (userId) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}
/**
 * 获取用户个人资料
 */
export function getProfile (userId) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}
/**
 * 更新用户头像
 */
export function updateUserPhoto (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}
/**
 * 更新用户基本信息
 */
export function updateUserProfile (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}
