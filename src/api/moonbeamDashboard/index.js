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
    base_api: window.MOONBEAM_PUBLIC_DASHBOARD_BASE_API || 'https://app.web3go.xyz/moonbeam-public-data/' 
}

export default basApi;