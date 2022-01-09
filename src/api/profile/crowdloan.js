import request from "@/utils/request";
import utils from "@/utils/index";


// 获取所有链
export function getPolkadotCrowdloanContributions(data) {
    return request({
        url: `${window.BASE_API}/polkadot/parachain-analysis/getCrowdloanContributions`,
        method: 'post',
        data
    })
}

// 获取所有链
export function getKusamaCrowdloanContributions(data) {
    return request({
        url: `${window.BASE_API}/kusama/parachain-analysis/getCrowdloanContributions`,
        method: 'post',
        data
    })
}