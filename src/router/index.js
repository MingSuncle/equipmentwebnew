import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Manage',
    component: () => import('../views/Manage.vue'),
    redirect: "/home",
    meta:{
      title:'首页'
    },
    children: [
    {
        path:'model',
        name:'model',
        meta:{
            title:'模型管理'
        },
        component:() => import('../views/modelManage/model.vue')
    },
    {
        path:'versionManage',
        name:'versionManage',
        meta:{
            title:'版本管理'
        },
        component:() => import('../views/modelManage/versionManage.vue')
    },
    {
        path:'dataManage',
        name:'dataManage',
        meta:{
            title:'模型管理'
        },
        component:() => import('../views/dataManage/data.vue')
    },
    {
      path: 'box',
      name: 'box',
      meta:{
        title:'盒子管理'
      },
      component: () => import('../views/box.vue'),
        props: true,
    },
    {
      path: '/ipc/:boxId',
      name: 'ipc',
      component: () => import('../views/ipc.vue'),
      meta: { title: '摄像头配置' }
  },
  {
    path: '/channel',
    name: 'channel',
    component: () => import('../views/channel.vue'),
    meta: { title: '通道配置' }
},
{
    path: '/area',
    name: 'area',
    component: () => import('../views/area.vue'),
    meta: { title: '区域配置' }
},
    {
      path: 'home',
      name: 'Home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/dataManage',
      name: 'dataManage',
      meta:{
        title:'数据管理'
      },
      component: () => import('../views/dataManage/data.vue')
    },
    {
        path: '/boxConfig',
        name: 'boxConfig',
        meta:{
          title:'数据管理'
        },
        component: () => import('../views/boxConfig.vue'),
        props: true,
      },
        {
            path: '/label',
            name: 'label',
            component:() => import('../views/LabelView')
        }

    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    alias: '/antipidemic',
    component: () => import('../views/Login.vue')
  },
  // {
  //   path:'/antiepidemic',
  //   name:'antiepidemic',
  //   redirect:'/login'
  // }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
