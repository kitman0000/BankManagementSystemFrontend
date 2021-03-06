import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import md5 from 'js-md5';
import  qs from 'qs';
import VCharts from 'v-charts'
Vue.prototype.$md5 = md5;
Vue.prototype.$qs = qs;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VCharts);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
