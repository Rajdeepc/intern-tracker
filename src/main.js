import Vue from 'vue'
import App from './App.vue'
import VeeValidate from 'vee-validate';
import router from './router';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSessionStorage from 'vue-sessionstorage'

Vue.use(VueSessionStorage)
Vue.use(BootstrapVue);
Vue.use(VeeValidate);

axios.defaults.baseURL = 'http://demo6727947.mockable.io/loginValidation';
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
