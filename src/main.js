// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import 'element-ui/lib/theme-chalk/index.css';


// import Vue from 'vue'
// import ElementUI from 'element-ui';  // import js scripts from CDN

import './style/theme/index.less'
import './style/whiteTheme/index.less'
// element公共组件自定义样式
import './style/whiteTheme.less';


import App from './App'
import router from './router'
import store from './store'

import * as filters from './filters' // global filters
import * as utils from './utils';
import moment from 'moment';

Vue.prototype.$eventBus = new Vue()
Vue.prototype.$moment = moment;
Vue.prototype.$utils = utils;
// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// token若过期就清掉
const tokenExpireTime = localStorage.getItem('tokenExpireTime');
if (!tokenExpireTime || moment().valueOf() > moment(tokenExpireTime).valueOf()) {
    localStorage.removeItem("userInfo");
}
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})