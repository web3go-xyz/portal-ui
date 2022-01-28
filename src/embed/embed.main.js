

import Vue from 'vue';
import embed from './embed';
import router from './embed.router';
import moment from 'moment';

Vue.prototype.$moment = moment;

// register global utility filters
import * as utils from './lib/utils';
Vue.prototype.$utils = utils;

import * as filters from './lib/filters'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(embed)
})