import Vue from 'vue'
import App from './App.vue'
import a from "@/libs/vuetify"
import store from "@/store/store"
import router from "@/router/router"

Vue.config.productionTip = false

new Vue({
  vuetify:a,
  store,
  router,
  render: h => h(App),
}).$mount('#app')
