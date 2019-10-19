/**
 * 搜索接口相关强求模块
 */
import request from '@/utils/request'

export function getSearchSuggestions (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params
  })
}

/**
 * 获取请求搜索结果数据
 */
export function getSearch (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
