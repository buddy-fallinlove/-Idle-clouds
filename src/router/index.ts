import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Layout from '../views/layout/Layout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    redirect: "/"
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    children: [
    {
      path: '',
      name: 'Home',
      component: Home
    },
    {
      path: '/user/login',
      name: 'Login',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/travel',
      name: 'Travel',
      component: () => import('../views/travel/Travel.vue')
    },
    {
      path: '/detail',
      name: 'Detail',
      component: () => import('../views/detail/Detail.vue')
    },
    {
      path: "/user/personal",
      name: "Personal",
      component: () => import('../views/personal/Personal.vue')
    },
    {
      path: "/hotel",
      name: "Hotel",
      component: () => import('../views/hotel/Hotel.vue')
    },
    {
      path: "/ticket",
      name: "Ticket",
      component: () => import('../views/ticket/Ticket.vue')
    },
    {
      path: "/chooseAir",
      name: "ChooseAir",
      component: () => import('../views/chooseAir/chooseair.vue')
    },
    {
      path: "/buyTicket",
      name: "BuyTicket",
      component: () => import('../views/buyTicket/buytitck.vue')
    },
    {
      path: "/settlement",
      name: "Settlement",
      component: () => import('../views/settlement/Settlement.vue')
    },
    {
      path: "/pickhotel",
      name: "Pickhotel",
      component: () => import("../views/pickhotel.vue")
    },
    {
      path: "/create",
      name: "Create",
      component: () => import("../views/create/create.vue")
    },
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
