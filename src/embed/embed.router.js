import Vue from "vue";
import Router from "vue-router";

import NftDetail from "@/components/nft/NftDetail";

Vue.use(Router);

//fix  NavigationDuplicated: Avoided redundant navigation to current location
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
}
export default new Router({
    routes: [
        {
            path: "/NftDetail",
            name: "NftDetail",
            component: NftDetail
        },
    ]
});