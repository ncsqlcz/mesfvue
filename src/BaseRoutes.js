/* 定义所有异步组件 */

// 登录页面
const Login = r => require.ensure([], () => r(require('./views/Login')), 'Login')
// 404页面
const NotFound = r => require.ensure([], () => r(require('./views/404.vue')), 'NotFound')
// home页
const Home = r => require.ensure([], () => r(require('./views/Home.vue')), 'Home')
// 首页
const Index = r => require.ensure([], () => r(require('./views/Index.vue')), 'Index')
// 空白页，为第三级菜单预留的
// const Blank = r => require.ensure([], () => r(require('./views/Blank.vue')), 'Blank')

let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: 'Home',
    hidden: true,
    children: [
      {path: '/index', component: Index, name: '首页', hidden: true}
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  }
]

export default routes
