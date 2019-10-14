/**
 * 一个专门操作本地存储的API模块
 */
// 获取数据
export const getItem = name => {
  return JSON.parse(window.localStorage.getItem(name))
}
// 存储数据
export const setItem = (name, data) => {
  return window.localStorage.setItem(name, JSON.stringify(data))
}
// 移除数据
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
