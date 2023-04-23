
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/routes'
// 引入封装好的axios
import axios from './api/axios'

Vue.use(ElementUI);

Vue.config.productionTip = false
// 将引入的axios定义在原型上；使其在每个Vue实例中都能使用
Vue.prototype.$axios = axios;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
