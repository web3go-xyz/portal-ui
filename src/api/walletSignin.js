import request from "@/utils/request";


// 获取challenge
export function web3_nonce(data) {
    return request({
        url: `/user/web3_nonce`,
        method: 'post',
        data
    })
}
// 获取token
export function web3_challenge(data) {
    return request({
        url: `/user/web3_challenge`,
        method: 'post',
        data
    })
}
export function getAddressBundle(data) {
    return request({
        url: `user/getAddressBundle`,
        method: 'post',
        data
    })
}
export function addAddressBundle(data) {
    return request({
        url: `user/addAddressBundle`,
        method: 'post',
        data
    })
}
export function removeAddressBundle(data) {
    return request({
        url: `user/removeAddressBundle`,
        method: 'post',
        data
    })
}