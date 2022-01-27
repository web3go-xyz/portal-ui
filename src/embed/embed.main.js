
import './../style/theme/index.less'
import './../style/whiteTheme/index.less'
// element公共组件自定义样式
import './../style/whiteTheme.less';

import Vue from 'vue';
import embed from './embed';
import router from './embed.router';
import mixin from './../utils/mixin';
import moment from 'moment';

Vue.prototype.$moment = moment;
Vue.mixin(mixin)

// register global utility filters

import * as utils from './../utils';
Vue.prototype.$utils = utils;

import * as filters from './../filters' // global filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(embed)
})