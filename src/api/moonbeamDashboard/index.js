import request from "@/utils/request";
import utils from "@/utils/index";

let basApi = {
    addressSummary: function (params) {
        return request({
            url: this.formatUrl('/moonbeam/public-data/address-summary'),
            method: 'get',
            params
        })
    },
    formatUrl: function (url) {
        return utils.formatUrl(this.base_api || '/', url);
    },
    base_api: 'http://18.139.21.203:20010/'
}

export default basApi;