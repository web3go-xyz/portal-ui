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
      btnLoading: false,
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
        await this.api.tx.parachainStaking
          .delegatorBondMore(
            this.receiverAccount.address,
            this.formatWithDecimals(this.num)
          )
          .signAndSend(
            this.linkAccount.address,
            { signer: injector.signer },
            ({ status }) => {
              if (status.isInBlock) {
                this.visible = false;
                this.btnLoading = false;
                this.$message.success("Delegate success");
                this.$emit("success");
                console.log(
                  `Completed at block hash #${status.asInBlock.toString()}`
                );
              } else {
                console.log(`Current status: ${status.type}`);
              }
            }
          )
          .catch((error) => {
            this.btnLoading = false;
            this.$message.error("transaction failed" + error);
            console.log(":( transaction failed", error);
          });
      } else {
        const candidateInfoBack =
          await this.api.query.parachainStaking.candidateInfo(
            this.receiverAccount.address
          );
        const candidateInfo = candidateInfoBack.toHuman();
        const delegationCount = candidateInfo.delegationCount;
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
          delegationCount,
          myDelegationCount
        );
        console.log(`delegateParameterCount:${this.delegateParameterCount}`);
        let delegateTx = null;
        if (this.delegateParameterCount < 4) {
          delegateTx = await this.api.tx.parachainStaking.delegate(
            this.receiverAccount.address,
            this.formatWithDecimals(this.num)
          );
        } else {
          delegateTx = await this.api.tx.parachainStaking.delegate(
            this.receiverAccount.address,
            this.formatWithDecimals(this.num),
            delegationCount,
            myDelegationCount
          );
        }

        delegateTx
          .signAndSend(
            this.linkAccount.address,
            { signer: injector.signer },
            ({ status }) => {
              if (status.isInBlock) {
                this.visible = false;
                this.btnLoading = false;
                this.$message.success("Delegate success");
                this.$emit("success");
                console.log(
                  `Completed at block hash #${status.asInBlock.toString()}`
                );
              } else {
                console.log(`Current status: ${status.type}`);
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
  },
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