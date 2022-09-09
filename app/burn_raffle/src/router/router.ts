// @ts-ignore
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(), // hash：createWebHashHistory，history：createWebHistory
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('@/view/home.vue'),
            meta: {
                index: 1
            }
        }
    ]
})

export default router
