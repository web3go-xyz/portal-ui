import request from "@/utils/request";
import utils from "@/utils/index";

let basApi = {
    basOverview: function (params) {
        return request({
            url: this.formatUrl('/openapi/bas/overview'),
            method: 'get',
            params
        })
    },
    basErc20Overview: function (params) {
        return request({
            url: this.formatUrl('/openapi/bas/erc20/overview'),
            method: 'get',
            params
        })
    },
    basContracts: function (params) {
        return request({
            url: this.formatUrl('/openapi/bas/erc721/contracts'),
            method: 'get',
            params
        })
    },
    basContractsOverview: function (params) {
        return request({
            url: this.formatUrl('/openapi/bas/erc721/contract/overview'),
            method: 'get',
            params
        })
    },
    formatUrl: function (url) {
        return utils.formatUrl(this.base_api || '/', url);
    },
    base_api: window.BASE_API
}

export default basApi;