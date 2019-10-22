import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import tabbar from '@/views/tabbar'
import Home from '@/views/home'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
import Article from '@/views/article'
import My from '@/views/my'
import User from '@/views/user'
import Chat from '@/views/chat'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'search',
      path: '/search',
      component: Search
    },
    {
      name: 'search-result',
      path: '/search/:q',
      component: SearchResult
    },
    {
      name: 'article',
      path: '/article/:articleId',
      component: Article
    },
    {
      name: 'user',
      path: '/user',
      component: User
    },
    {
      name: 'chat',
      path: '/chat',
      component: Chat
    },
    {
      path: '/',
      component: tabbar,
      children: [
        {
          name: 'home',
          path: '', // 默认子路由
          component: Home
        },
        {
          name: 'my',
          path: '/my',
          component: My
        }
      ]
    }
  ]
})

export default router
