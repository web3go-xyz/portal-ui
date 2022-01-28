import request from "./request";
import utils from "./utils";

function formatUrl4Rmrk(url) {
    return utils.formatUrl(window.RMRK_API || '/rmrk', url);
}
// 详情
export function getCollectionStatistic(data) {
    return request({
        url: formatUrl4Rmrk('/rmrk-analysis/getCollectionStatistic'),
        method: 'post',
        data
    })
}

export function getAvgPriceVolumeOfCollection(data) {
    return request({
        url: formatUrl4Rmrk('/rmrk-analysis/getAvgPriceVolumeOfCollection'),
        method: 'post',
        data
    })
}
export function getPriceRangeOfCollection(data) {
    return request({
        url: formatUrl4Rmrk('/rmrk-analysis/getPriceRangeOfCollection'),
        method: 'post',
        data
    })
}
export function getTransactionsOfCollection(data) {
    return request({
        url: formatUrl4Rmrk('/rmrk-analysis/getTransactionsOfCollection'),
        method: 'post',
        data
    })
}
export function getTransactionCountOfCollection(data) {
    return request({
        url: formatUrl4Rmrk('/rmrk-analysis/getTransactionCountOfCollection'),
        method: 'post',
        data
    })
} 