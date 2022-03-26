import request from "@/utils/request";
import utils from "@/utils/index";

let stakingApi = {
    //get reward statistic of delegator
    getDelegatorRewardStatistic: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getDelegatorRewardStatistic'),
            method: 'post',
            data
        })
    },
    //get reward statistic of collator
    getCollatorRewardStatistic: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getCollatorRewardStatistic'),
            method: 'post',
            data
        })
    },
    // 获取当前区块高度
    getLatestBlockNumber: function (params) {
        return request({
            url: this.formatUrl('/staking-analysis/getLatestBlockNumber'),
            method: 'get',
            params
        })
    },
    // get current round info;获取当前round的信息， 包含roundIndex, 起始区块高度， 区块长度
    getCurrentRoundInfo: function (params) {
        return request({
            url: this.formatUrl('/staking-analysis/getCurrentRoundInfo'),
            method: 'get',
            params
        })
    },
    // get max nominators count for each collator;获取每个Collator节点最多的nominator数量
    getMaxNominatorsPerCollator(params) {
        return request({
            url: this.formatUrl('/staking-analysis/getMaxNominatorsPerCollator'),
            method: 'get',
            params
        })
    },
    // get all collator candidates in realtime;获取实时的collator的候选列表，包含了所有的collator节点，可以根据这个列表数据来实时判断 collator节点的排位
    getRealtimeCollatorCandidatePool: function (params) {
        return request({
            url: this.formatUrl('/staking-analysis/getRealtimeCollatorCandidatePool'),
            method: 'get',
            params
        })
    },
    // get selected collators when the round start;获取在当前round开始运行前，已经选中的若干个collator节点列表
    getSelectedCollators4CurrentRound: function (params) {
        return request({
            url: this.formatUrl('/staking-analysis/getSelectedCollators4CurrentRound'),
            method: 'get',
            params
        })
    },
    // get all states include collators and nominators in realtime;获取实时的collator和nominator关联的列表，可以根据这个列表数据来实时判断 如果参加当前collator节点后， nominator的排位
    getRealtimeCollatorState: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getRealtimeCollatorState'),
            method: 'post',
            data
        })
    },
    // get the scheduled exit of collators/nominators;获取这是计划要离开的collator节点和nominator，离开不是立刻生效的， 需要等待指定的roundIndex，可以根据该列表在预测下一个round的排位时， 注意检查如果roundIndex匹配， 需要排除掉对应的数据。
    getScheduledExitQueue: function (params) {
        return request({
            url: this.formatUrl('​/staking-analysis​/getScheduledExitQueue'),
            method: 'get',
            params
        })
    },
    // get max collators count per round;获取每个round最多的collator数量
    getMaxCollatorsPerRound: function (params) {
        return request({
            url: this.formatUrl('/staking-analysis/getMaxCollatorsPerRound'),
            method: 'get',
            params
        })
    },
    //get nominator reward statistic of the specified round index;获取指定roundIndex的nominator reward统计信息，目前nominator的reward还无法按照collator分开
    getNominatorReward: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getNominatorReward'),
            method: 'post',
            data
        })
    },
    // get collator reward statistic of the specified round index;获取指定roundIndex的collator reward统计信息
    getCollatorReward: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getCollatorReward'),
            method: 'post',
            data
        })
    },

    //get produced blocks count for a range of round index;获取指定范围的roundIndex的生产的Blocks数量信息
    getCollatorProducedBlocks: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getCollatorProducedBlocks'),
            method: 'post',
            data
        })
    },
    // //get total reward statistic of the specified collators;获取collator所有的reward总和
    getCollatorTotalReward: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getCollatorTotalReward'),
            method: 'post',
            data
        })
    },
    // 获取指定roundIndex的stake统计信息（collator stake, nominator stake）
    atStake: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/atStake'),
            method: 'post',
            data
        })
    },
    // //获取collator的历史事件记录
    getCollatorActionHistory: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getCollatorActionHistory'),
            method: 'post',
            data
        })
    },
    // 显示 当前Collator的所有的Reward History信息
    getCollatorRewardHistory: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getCollatorRewardHistory'),
            method: 'post',
            data
        })
    },
    // 显示 当前Delegator的所有的Action History信息
    getDelegatorActionHistory: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getDelegatorActionHistory'),
            method: 'post',
            data
        })
    },
    // 显示 当前Delagator的所有的Reward History信息
    getDelegatorRewardHistory: function (data) {
        return request({
            url: this.formatUrl('/staking-analysis/getDelegatorRewardHistory'),
            method: 'post',
            data
        })
    },
    //获取订阅信息
    getMySubscribe: function (data) {
        return request({
            url: this.formatUrl('/staking-monitor/getMySubscribe'),
            method: 'post',
            data
        })
    },
    //从订阅中移除某些地址
    unsubscribe: function (data) {
        return request({
            url: this.formatUrl('/staking-monitor/unsubscribe'),
            method: 'post',
            data
        })
    },
    //订阅某些地址,订阅后当该Collator地址处于节点排序的边缘（位置在靠后10%时），会收到提示消息。
    subscribe: function (data) {
        return request({
            url: this.formatUrl('/staking-monitor/subscribe'),
            method: 'post',
            data
        })
    },
    formatUrl: function (url) {
        return utils.formatUrl(this.base_api || '/', url);
    },
    base_api: '/'
}

export default stakingApi;