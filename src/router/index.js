import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        name: 'index',
        component: _ => import('../views/IndexView.vue')
    },{
        path: '/friends',
        name: 'friends',
        component: _ => import('../views/FriendsView.vue')
    },{
        path: '/chat/:id',
        name: 'chat',
        component: _ => import('../views/ChatView.vue')
    },{
        path: '/astro',
        name: 'astro',
        component: _ => import('../views/AstroView.vue')
    }
  ]
})

export default router
