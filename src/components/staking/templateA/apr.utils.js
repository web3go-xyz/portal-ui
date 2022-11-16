import request from "@/utils/request";

let aprUtlis = {

    async calculate(paraChainName, params) {
        let formula = this.getFormula(paraChainName);
        console.log(paraChainName, '\taprUtlis.calculate:', JSON.stringify(params), `formula:`, formula);
        if (formula === 'common') {
            let blockTargetSeconds = await this.getBlockTargetSeconds(paraChainName);
            console.log('blockTargetSeconds:', blockTargetSeconds);

            let roundPerYear = this.getRoundPerYear(blockTargetSeconds, params.blockPerRound);
            let stake = params.collatorStake;
            let reward = params.collatorRewardInRounds;
            let rounds = params.rounds;
            return (
                (reward / rounds / stake) *
                roundPerYear *
                100
            );
        }
        if (formula === 'moonbeam') {

            // 0.00001388888888888889 * <total_supply>  * <avg_blocks_per_round> / <collator_counted_stake>
            let total_supply = Number(params.totalSupply);
            let collator_counted_stake = Number(params.collatorStake);
            let avg_blocks_per_round = Number(params.averageBlocks);
            console.log('total_supply:', total_supply, ' collator_counted_stake:', collator_counted_stake, ' avg_blocks_per_round:', avg_blocks_per_round);
            return (
                ((0.00001388888888888889 * total_supply * avg_blocks_per_round) /
                    collator_counted_stake) *
                100
            );

        }

        return -1;
    },
    getRoundPerYear(blockTargetSeconds, blockPerRound) {
        let roundPerYear = Math.ceil(
            (365 * 24 * 3600) / (blockTargetSeconds * blockPerRound)
        );
        return roundPerYear;
    },
    getFormula(paraChainName) {
        if (paraChainName.toLowerCase() === 'moonriver'
            || paraChainName.toLowerCase() === 'moonbeam') {
            return 'moonbeam';
        }
        return 'common';
    },

    async getBlockTargetSeconds(paraChainName) {
        let key = "averageBlockTime" + paraChainName;
        if (this[key]) {
            return this[key];
        }
        else {
            if (paraChainName.toLowerCase() === 'bifrost') {
                let url = 'https://api.bifrost.app/api/dapp/averageBlockTime';
                let response = await request({
                    url: url
                });
                console.log('getBlockTargetSeconds response:', response);
                if (response) {
                    let time = response.result.main;
                    this[key] = time;
                    return time;
                }
            }
        }
        return 12;
    }
}
export default aprUtlis;
