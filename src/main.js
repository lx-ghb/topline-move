import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
import {
  Button,
  CellGroup,
  Toast,
  Cell,
  NavBar,
  Field } from 'vant'

Vue
  .use(CellGroup)
  .use(Cell)
  .use(Toast)
  .use(Button)
  .use(NavBar)
  .use(Field)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
