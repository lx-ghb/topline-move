/**
 * 专门处理时间的工具模块
 */

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 全局使用中文语言包
import rTime from 'dayjs/plugin/relativeTime' // 将日期格式设置为相对时间字符串（例如3小时前）
import Vue from 'vue'

dayjs.extend(rTime)
dayjs.locale('zh-cn')
// 全局的过滤器，
Vue.filter('relativeTime', value => {
  return dayjs().from(dayjs(value))
})
