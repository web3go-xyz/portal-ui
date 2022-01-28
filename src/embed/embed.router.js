import Vue from "vue";
import Router from "vue-router";

import chart1 from "./nft-chart/chart1.vue";
import chart2 from "./nft-chart/chart2.vue";
import chart3 from "./nft-chart/chart3.vue";
import chart4 from "./nft-chart/chart4.vue";

Vue.use(Router);

//fix  NavigationDuplicated: Avoided redundant navigation to current location
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
}
export default new Router({
    routes: [
        {
            path: "/chart1",
            name: "chart1",
            component: chart1
        },
        {
            path: "/chart2",
            name: "chart2",
            component: chart2
        },
        {
            path: "/chart3",
            name: "chart3",
            component: chart3
        },
        {
            path: "/chart4",
            name: "chart4",
            component: chart4
        },
    ]
});