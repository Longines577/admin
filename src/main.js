import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './assets/css/iconfont.css';
import "babel-polyfill";
import './utils/common.js'
import store from './vuex/store'

import Vuex from 'vuex'
Vue.use(Vuex)
import VueParticles from "vue-particles";
Vue.use(VueParticles);

import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
Vue.use(VueQuillEditor)

import http from './utils/http.js'
import fetch from './utils/fetch.js'
import 'swiper/dist/css/swiper.min.css';
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
// axios.defaults.headers.post['Content-Type'] = 'text/plain'
Vue.prototype.$axios = axios;
Vue.prototype.$http = http
Vue.prototype.$fetch = fetch
import { BASEURL } from '@/api/config';
window.$UPLOAD = BASEURL + 'system/api/fileUpload/uploadOssBySingle'
    //使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = sessionStorage.getItem('userName');
    const token = sessionStorage.getItem("token")
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')