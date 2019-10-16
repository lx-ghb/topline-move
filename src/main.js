import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
import './utils/date' // 加载一下，让这个代码执行
import {
  Button,
  CellGroup,
  Toast,
  Cell,
  NavBar,
  Tabbar,
  TabbarItem,
  List,
  Tab,
  Tabs,
  PullRefresh,
  Field,
  Grid,
  Image,
  GridItem,
  Lazyload,
  Popup,
  Search,
  Icon } from 'vant'

import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包
import * as rules from 'vee-validate/dist/rules'

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}

// 注册为全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
// 扩展自定义校验规则
// extend('规则名称'，配置对象)
extend('phone', {
  validate: function (value) {
    return /^1\d{10}$/.test(value)
  },
  // 错误提示信息
  message: '请输入有效的手机号'
})

Vue
  .use(CellGroup)
  .use(Cell)
  .use(Toast)
  .use(Button)
  .use(NavBar)
  .use(Field)
  .use(Tabbar)
  .use(TabbarItem)
  .use(List)
  .use(Tab)
  .use(Tabs)
  .use(PullRefresh)
  .use(Grid)
  .use(GridItem)
  .use(Image)
  .use(Lazyload)
  .use(Popup)
  .use(Icon)
  .use(Search)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
