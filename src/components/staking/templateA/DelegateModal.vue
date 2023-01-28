<template>
  <div>
    <el-dialog
      :title="isDelegateMore ? 'DelegateMore' : 'Delegate'"
      :visible.sync="visible"
      width="30%"
    >
      <div class="wallet-wrap">
        <!-- <img class="icon" :src="paraChainIcon" alt="" /> -->
        <identity-icon-plus :addressInfo="receiverAccount"></identity-icon-plus>

        <div class="number">
          （{{ linkAccount.freeBalance | roundNumber(2) }} {{ symbol }}）
        </div>
      </div>
      <div class="input-wrap">
        <el-input-number
          v-model="num"
          :min="minBondRequired"
          :max="Number(linkAccount.freeBalance)"
          label="Input Num"
        ></el-input-number>
        <span class="symbol">{{ symbol }}</span>
      </div>
      <div class="btn-wrap">
        <el-button
          :loading="btnLoading"
          @click="confirm"
          type="primary"
          :disabled="canNotConfirm"
          >Confirm</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { BigNumber } from "bignumber.js";
import { web3FromSource } from "@polkadot/extension-dapp";
import IdentityIconPlus from "@/components/ui-elements/IdentityIconPlus.vue";
export default {
  props: ["api", "symbol", "linkAccount", "currentWalletAccount", "minBond"],
  components: {
    IdentityIconPlus,
  },
  data() {
    return {
      disabled: false,
      isDelegateMore: false,
      num: 1,
      visible: false,
      receiverAccount: {},
      btnLoading: false
    };
  },
  computed: {
    minBondRequired() {
      return this.num;
    },
    canNotConfirm() {
      return this.linkAccount.freeBalance <= this.minBondRequired;
    },
    parachain() {
      if (this.$route.meta && this.$route.meta.parachain) {
        return this.$route.meta.parachain;
      }
      return {};
    },
    delegateParameterCount() {
      if (
        this.$route.meta &&
        this.$route.meta.parachain.delegateParameterCount
      ) {
        return parseInt(this.$route.meta.parachain.delegateParameterCount);
      }
      return 4;
    },
    decimals() {
      return this.parachain.decimals || 0;
    },
    decimalsFormat() {
      return new BigNumber("1e" + this.decimals);
    },
  },
  methods: {
    formatWithDecimals(value) {
      return BigNumber(value).multipliedBy(this.decimalsFormat).toString();
    },
    async getDelegationInfo(delegator) {
      const result = {
        delegationCount: 0,
      };
      if (this.symbol === "DHX") { // unavailabe for the Tanganika, but it doesn't matter
        // const delegationCount = (
        //   await this.api.query.parachainStaking.counterForCandidatePool(
        //     delegator
        //   )
        // ).toHuman();
        result.delegationCount = 0; // delegationCount;
      } else {
        const candidateInfo = (
          await this.api.query.parachainStaking.candidateInfo(delegator)
        ).toHuman();
        result.delegationCount = candidateInfo.delegationCount;
      }
      return result;
    },
    getTxStatus(events) {
      let flag = { success: false, fail: false };
      events.forEach(({ phase, event: { data, method, section } }) => {
        console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        if (method === "ExtrinsicFailed") {
          flag.fail = true;
        } else if (method === "ExtrinsicSuccess") {
          flag.success = true;
        }
      });
      return flag;
    },
    async confirm() {
      if (this.num <= 0) {
        this.$message.error("Please enter a number greater than 0");
        return;
      }
      if (!this.isDelegateMore && this.num < this.minBond) {
        this.$message.error("The minimum delegate is " + this.minBond);
        return;
      }
      this.btnLoading = true;
      const injector = await web3FromSource(
        this.currentWalletAccount.meta.source
      );
      if (this.isDelegateMore) {
        const specialMethod = {
            DHX: 'delegatorStakeMore'
          }
        const method = specialMethod[this.symbol] || 'delegatorBondMore';
        const unsub = await this.api.tx.parachainStaking[method](
            this.receiverAccount.address,
            this.formatWithDecimals(this.num)
          )
          .signAndSend(
            this.linkAccount.address,
            { signer: injector.signer },
            ({ events = [], status }) => {
              status && console.log(`Current status: ${status.type}`);
              if (status && (status.isInBlock || status.isFinalized)) {
                const txStatus = this.getTxStatus(events);
                this.btnLoading = false;
                if (txStatus.success) {
                  this.visible = false;
                  this.$message.success("Delegate success");
                  this.$emit("success");
                  console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                  //this.decision.loading = false;
                } else if (txStatus.fail) {
                  this.$message.error("transaction failed");
                }
                unsub();
              }
            }
          )
          .catch((error) => {
            this.btnLoading = false;
            this.$message.error("transaction failed" + error);
            console.log(":( transaction failed", error);
          });
      } else {
        const delegatorInfo =
          await this.api.query.parachainStaking.delegatorState(
            this.linkAccount.address
          );
        let myDelegationCount = 0;
        if (delegatorInfo.toHuman()) {
          myDelegationCount = delegatorInfo.toHuman()["delegations"].length;
        }
        console.log(
          "111",
          this.receiverAccount.address,
          this.formatWithDecimals(this.num),
          // delegationCount,
          myDelegationCount
        );
        console.log(`delegateParameterCount:${this.delegateParameterCount}`);
        let delegateTx = null;
        const specialMethod = {
            DHX: 'joinDelegators'
          }
        const method = specialMethod[this.symbol] || 'delegate';
        if (this.delegateParameterCount < 4) {
          delegateTx = await this.api.tx.parachainStaking[method](
            this.receiverAccount.address,
            this.formatWithDecimals(this.num)
          );
        } else {
          const { delegationCount } = await this.getDelegationInfo(
          this.receiverAccount.address
        );
          delegateTx = await this.api.tx.parachainStaking[method](
            this.receiverAccount.address,
            this.formatWithDecimals(this.num),
            delegationCount,
            myDelegationCount
          );
        }

        const unsub = await delegateTx
          .signAndSend(
            this.linkAccount.address,
            { signer: injector.signer },
            ({ events = [], status }) => {
              status && console.log(`Current status: ${status.type}`);
              if (status && (status.isInBlock || status.isFinalized)) {
                const txStatus = this.getTxStatus(events);
                this.btnLoading = false;
                if (txStatus.success) {
                  this.visible = false;
                  this.$message.success("Delegate success");
                  this.$emit("success");
                  console.log(`Completed at block hash #${status.asInBlock.toString()}`);
                } else if (txStatus.fail) {
                  this.$message.error("transaction failed");
                }
                unsub();
              }
            }
          )
          .catch((error) => {
            this.btnLoading = false;
            this.$message.error("transaction failed" + error);
            console.log(":( transaction failed", error);
          });
      }
    },
    init(address, isMore) {
      if (isMore) {
        this.num = 1;
      } else {
        this.num = this.minBond;
      }
      this.isDelegateMore = isMore;
      this.receiverAccount = { ...this.linkAccount, address };
      this.visible = true;
    },
  }
};
</script>

<style lang="less" scoped>
.wallet-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: initial;
  margin-bottom: 20px;
  .icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
  }
  .number {
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    vertical-align: middle;
    font-size: 16px;
    color: rgba(41, 40, 40, 0.6);
  }
}
.input-wrap {
  margin-left: 10px;
  /deep/ .el-input-number__decrease,
  body.white-theme .el-input-number__decrease {
    border-left: 0 !important;
  }
  .symbol {
    margin-left: 10px;
  }
}
.btn-wrap {
  margin-top: 20px;
  text-align: center;
}
</style>