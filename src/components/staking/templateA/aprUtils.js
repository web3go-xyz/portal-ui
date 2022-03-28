let aprUtlis = {
    calculate: function (paraChainName, params) {

        console.log(paraChainName, '\taprUtlis.calculate:', JSON.stringify(params));
        if (paraChainName.toLowerCase() === 'bifrost') {
            let averageBlocks = params.averageBlocks;
            if (averageBlocks <= 0) {
                return 0;
            }
            let roundPerYear = this.getRoundPerYear(params.blockTargetSeconds, params.blockPerRound);
            let totalStake = params.totalCollatorStake;
            //let totalStake = this.getTotalStake(currentCollator).toNumber();
            let totalReward = params.collatorReward;
            let targetBlocks = (params.blockPerRound * 1.0) / params.maxCollector;
            return (
                (totalReward / totalStake) *
                roundPerYear *
                100 *
                (targetBlocks / averageBlocks)
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
}
export default aprUtlis;
