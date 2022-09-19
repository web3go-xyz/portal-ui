import request from "@/utils/request";


// 获取所有链
export function queryDataBoardList(data) {
    return request({
        url: `/analytics-insight/queryDataBoardList`,
        method: 'post',
        data
    })
}
export function publishDashboard(data) {
    return request({
        url: `/analytics-insight/publishDashboard`,
        method: 'post',
        data
    })
}
export function removeDashboard(data) {
    return request({
        url: `/analytics-insight/removeDashboard`,
        method: 'post',
        data
    })
}
export function snapshotUpload(data) {
    return request({
        url: `/analytics-insight/snapshotUpload`,
        method: 'post',
        data
    })
}