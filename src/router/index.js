import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from "../store";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: "Home Page",
        },
        beforeEnter: (to, from, next) => {
            if (!store.state.auth.isAuthenticated) {
                next({ name: 'Login' })
            } else {
                next()
            }
        }
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: "Login",
        },
        component: () => import('../views/auth/Login.vue'),
        beforeEnter: (to, from, next) => {
            if (store.state.auth.isAuthenticated) {
                next({ name: 'Home' })
            } else {
                next()
            }
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/auth/Register.vue'),
        beforeEnter: (to, from, next) => {
            if (store.state.auth.isAuthenticated) {
                next({ name: 'Home' })
            } else {
                next()
            }
        }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/auth/ForgotPassword.vue'),
        beforeEnter: (to, from, next) => {
            if (store.state.auth.isAuthenticated) {
                next({ name: 'Home' })
            } else {
                next()
            }
        }
    },
    {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue'),
        beforeEnter: (to, from, next) => {
            if (store.state.auth.isAuthenticated) {
                next()
            } else {
                next()
            }
        }
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
