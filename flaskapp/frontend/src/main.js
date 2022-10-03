import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import uuid from 'vue-uuid';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import store from './store'
import VueNumberInput from '@chenfengyuan/vue-number-input'; //https://vuejsexamples.com/number-input-component-for-vue-js/
import VueQrcodeReader from "vue-qrcode-reader";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/js/all.js'


Vue.use(BootstrapVue);
Vue.use(IconsPlugin)
Vue.use(uuid);
Vue.use(VueNumberInput);
Vue.use(VueQrcodeReader);


Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
