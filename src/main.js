import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import BaseRoutes from './BaseRoutes'
import PermissionRoutes from './PermissionRoutes'
import 'font-awesome/css/font-awesome.min.css'
import {SET_TOKEN, SET_RETURN_PATH, SET_USER} from './vuex/mutation-types'
import MesUI from './components/index'
import VueCookie from 'vue-cookie'
// 国际化
import VueI18n from 'vue-i18n'
import langs from './common/lang/index.js'
import myPlugin from './common/js/plugin'

// 本地模拟api
// import Mock from './mock'
// Mock.bootstrap()

Vue.use(myPlugin)
Vue.use(VueI18n)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.use(MesUI)
Vue.use(VueCookie)

NProgress.configure({ showSpinner: false })

window.i18n = new VueI18n({
  locale: store.getters.getLocale, // 设置语言
  messages: langs
})

let routes = [...BaseRoutes, ...PermissionRoutes]
store.state.routes = routes
const router = new VueRouter({
  // mode: 'history', // 去掉url后面的#
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
  return

  // 设置token, 避免刷新丢失token
  if (localStorage.getItem('token')) {
    store.commit(SET_TOKEN, localStorage.getItem('token'))
  }
  if (to.path === '/login') {
    sessionStorage.removeItem('user')
  }
  let user = {}
  try {
    user = JSON.parse(sessionStorage.getItem('user'))
  } catch (e) {
    next({path: '/login'})
  }
  if (!user && to.path !== '/login') {
    next({path: '/login'})
  } else {
    store.commit(SET_USER, user)
    // 设置登录之后返回的路径, 登录和首页不保存
    if (to.fullPath !== '/login' && to.fullPath !== '/404') {
      store.commit(SET_RETURN_PATH, to.fullPath)
    }
    next()
  }
})

router.afterEach(transition => {
  NProgress.done()
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
