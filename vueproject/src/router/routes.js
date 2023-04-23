import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from "@/views/Login";
import mainRouter from './main/main';
import RegisterPage from '@/views/Register';

Vue.use(VueRouter)

const routes = [
    mainRouter,
    {
        path: '/',
        redirect: '/login',//重定向，刚进入时进入登录页
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    console.log(to);
    // 判断路径是否是登录页
    if (to.path === '/login' || to.path === '/register') {
        // 是登录页，执行下一步
        next();
    } else {
        // 不是登录页，判断本地有无 token
        // let token = localStroage.getItem('Authorization');
        let token = sessionStorage.getItem('token');
        if (token === null || token === ' ') {
            // token 为空或不存在，跳转到登录页
            next('/login');
        } else {
            next();
        }
    }
})

export default router