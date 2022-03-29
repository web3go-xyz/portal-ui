import request from "@/utils/request";

let aprUtlis = {

    async calculate(paraChainName, params) {
        console.log(paraChainName, '\taprUtlis.calculate:', JSON.stringify(params));
        if (paraChainName.toLowerCase() === 'bifrost') {
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

        return -1;
    },
    getRoundPerYear(blockTargetSeconds, blockPerRound) {
        let roundPerYear = Math.ceil(
            (365 * 24 * 3600) / (blockTargetSeconds * blockPerRound)
        );
        return roundPerYear;
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
