<template>
  <div class="unstake-root" ref="root">
    <!--  v-if="!disabled" -->
    <div
      class="table-btn revoke"
      @click="handleRevoke"
      v-if="status.current === status.TO_REVOKE"
      v-loading="ui.revokeBtnLoading"
      title="you can schedule to revoke delegation from current collator."
    >
      Revoke
    </div>
    <div
      class="countdown-wrap"
      v-if="status.current === status.TO_WAIT"
      v-loading="countdown.loading"
    >
      <div class="num">
        Est. <span>{{ countdown.formatTime }}</span>
      </div>
      <div class="tip"><span>till exectue revoke task </span></div>
      <div class="btn" @click="countdownDecline" title="you will cancel previous scheduled request and continue with delegation.">
        <i class="el-icon-error"></i>
      </div>
    </div>
    <div
      class="countdown-wrap"
      v-if="status.current === status.TO_EXECUTE"
      v-loading="decision.loading"
    >
      <div class="decision">
        <el-select
          v-model="decision.v"
          placeholder="Execute"
          @change="countdownDecisionMaker"
        >
          <el-option label="Execute" value="Execute" title="now you can execute previous scheduled request to get your tokens back from delegation."></el-option>
          <el-option label="Cancel" value="Cancel" title="you will cancel previous scheduled request and continue with delegation."></el-option>
        </el-select>
      </div>
    </div>
    <el-dialog
      v-if="ui.confirm.current"
      :title="ui.confirm.current.title"
      :visible.sync="ui.confirm.show"
      :close-on-click-modal="false"
      append-to-body
      width="460px"
      class="revoke-dialog"
    >
      <h2>{{ ui.confirm.current.subtitle }}</h2>
      <span class="context">{{ ui.confirm.current.context }}</span>
      <span slot="footer" class="dialog-footer">
        <div
          class="btn cancel"
          @click="confirmDialogActionBridge(ui.confirm.current.noAction)"
        >
          Cancel
        </div>
        <div
          class="btn confirm"
          @click="confirmDialogActionBridge(ui.confirm.current.yesAction)"
        >
          OK
        </div>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import { web3FromSource } from "@polkadot/extension-dapp";
import aprUtlis from "./apr.utils";

export default {
  props: [
    "api",
    "linkAccount",
    "collator",
    "currentWalletAccount",
    "roundInfo",
    "blockNumber",
    "paraChainName",
  ],
  components: {
    // IdentityIconPlus,
  },
  data() {
    return {
      status: {
        current: 0, // indicating the current status from one of the below definitions
        TO_REVOKE: 1, // showing revoke the btn
        TO_WAIT: 2, // starting the countdown
        TO_EXECUTE: 3, // showing the decision maker dropdown menus
        REVOKED: 4, // finishing the revoke operation and needs to be delisted
      },
      ui: {
        revokeBtnLoading: false,
        confirm: {
          show: false,
          revoke: {
            title: "Revoke",
            subtitle:
              "Are you sure you want to revoke your delegation to this collator?",
            context: `This action will be scheduled for the next {leaveDelegatorsDelay} round and then it will have to be manually executed`,
            yesAction: "doRevoke",
            noAction: "closeDialog",
          },
          cancel: {
            title: "Cancel Revoke",
            subtitle: "Are you sure you want to cancel your revoke request?",
            context: "",
            yesAction: "doHandleCancelRevoke",
            noAction: "closeDialog",
          },
          current: null,
        },
      },
      countdown: {
        timer: null,
        remainingSeconds: 0,
        formatTime: "",
        loading: false,
      },
      decision: {
        v: "",
        loading: false,
        //list: ["Exceute", "Cancel"],
      },
      confirmWin: {
        show: false,
      },

      countdownTimer: null,

      // the number of rounds that must be waited
      // before a scheduled request for a delegator to leave
      // the set of delegators can be executed
      leaveDelegatorsDelay: 28,

      targetSecondsPerBlock: 12, //seconds
      disabled: false,
    };
  },
  created() {},
  mounted() {
    // fixed表头会导致重复, 所以用这个来记录 用于优化
    // this.$nextTick(() => {
    const parentDoms = document.body.querySelectorAll(
      "#my-stake-table .el-table__fixed-body-wrapper .unstake-root"
    );
    let disabled = true;
    parentDoms &&
      parentDoms.forEach((it) => it === this.$refs.root && (disabled = false));
    this.disabled = disabled;

    this.leaveDelegatorsDelay =
      this.api.consts.parachainStaking.leaveDelegatorsDelay;
    this.ui.confirm.revoke.context = this.ui.confirm.revoke.context.replace(
      "{leaveDelegatorsDelay}",
      this.leaveDelegatorsDelay
    );
    if (this.disabled) return;
    aprUtlis
      .getBlockTargetSeconds(this.paraChainName)
      .then((d) => {
        this.targetSecondsPerBlock = d;
      })
      .then(this.initCountdown);
    // });
  },
  methods: {
    handleRevoke() {
      if (this.ui.revokeBtnLoading) return;

      this.ui.confirm.current = this.ui.confirm.revoke;
      this.ui.confirm.show = true;
    },
    signalStatus(to) {
      if (this.status.TO_REVOKE === to) {
        this.ui.revokeBtnLoading = false;
      } else if (this.status.TO_WAIT === to) {
        this.countdown.loading = false;
      } else if (this.status.TO_EXECUTE === to) {
        this.decision.loading = false;
      }
      this.status.current = to;
      this.$emit("statusChanged", { status: to, collator: this.collator });
    },
    async getSign() {
      const injector = await web3FromSource(
        this.currentWalletAccount.meta.source
      );
      return { signer: injector.signer };
    },
    async doRevoke() {
      this.ui.revokeBtnLoading = true;
      this.ui.confirm.show = false;
      const unsub = await this.api.tx.parachainStaking
        .scheduleRevokeDelegation(this.collator)
        .signAndSend(
          this.linkAccount.address,
          await this.getSign(),
          ({ events = [], status, txHash }) => {
            // console.log(`Transaction included at blockHash ${status.asFinalized}`);
            txHash && console.log(`Transaction hash ${txHash.toHex()}`);
            console.info(status, ".................");

            if (status && (status.isInBlock || status.isFinalized)) {
              const txStatus = this.getTxStatus(events);
              if (txStatus.success) {
                this.initCountdown();
              } else if (txStatus.fail) {
                // this.$message.error("operation failed");
                this.$message({
                  showClose: true,
                  message: "Something is wrong.",
                  type: "error",
                  duration: 8000,
                });
              }
              unsub();
            }
          }
        )
        .catch((error) => {
          this.ui.revokeBtnLoading = false;
          this.$message.error("transaction failed" + error);
          // console.log(":( transaction failed", error);
        });
    },
    // to inspect the countdown status
    async initCountdown() {
      let res = [];
      try {
        res = (
          await this.api.query.parachainStaking.delegationScheduledRequests(
            this.collator
          )
        ).toHuman();
      } catch (e) {
        console.warn("encountered errors while fetching the revoking status");
      }

      const matched = res.filter(
        (it) => it.whenExecutable && it.delegator === this.linkAccount.address
      );
      if (!matched.length) {
        this.signalStatus(this.status.TO_REVOKE);
        return;
      }

      /*
        est_blocks_v1= (whenExecutable_roundIndex - current_roundIndex ) * blocks_per_round
        est_blocks_v2= est_blocks_v1 - ( blocks_finished_in_current_round )
        */
      //   this.api.consts.parachainStaking.blocks_per_round;
      const whenExecutableRoundIndex = Number(
        matched[0].whenExecutable.replace(/,/g, "")
      );
      const blocksPerRound = this.roundInfo.length;
      const currentRoundIndex = this.roundInfo.current;
      const blocksFinishedInCurrentRound =
        this.blockNumber - this.roundInfo.first;

      const estBlocksV1 =
        (whenExecutableRoundIndex - currentRoundIndex) * blocksPerRound;
      const estBlocksV2 = estBlocksV1 - blocksFinishedInCurrentRound;
      const estSeconds = estBlocksV2 * this.targetSecondsPerBlock;

      if (estSeconds > 0) {
        this.doCountdown(estSeconds);
        this.signalStatus(this.status.TO_WAIT);
      } else {
        this.signalStatus(this.status.TO_EXECUTE);
      }
    },
    doCountdown(s, startTimestamp) {
      startTimestamp = startTimestamp || new Date().getTime();
      const remainingSeconds = s - parseInt((new Date().getTime() - startTimestamp)/1000);
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      //const seconds = remainingSeconds - minutes * 60;
      if (minutes < 1 && seconds < 1) {
        this.signalStatus(this.status.TO_EXECUTE);
        this.countdown.formatTime = "";
        if (!this.countdown.timer) {
          clearInterval(this.countdown.timer);
          this.countdown.timer = null;
          startTimestamp = null;
        }
      } else {
        this.countdown.formatTime = `${hours}h ${minutes}m`; // `${minutes}m ${String(seconds).padStart('0', 2)}s`
        if (!this.countdown.timer) {
          this.countdown.timer = setInterval(() => {
            this.doCountdown(s, startTimestamp);
          }, 10000);
        }
      }
    },
    async doHandleCancelRevoke() {
      this.doRequestCancelRevoke();
    },
    async doRequestCancelRevoke() {
      const div =
        this.status.current === this.status.TO_WAIT
          ? this.countdown
          : this.decision;
      this.ui.confirm.show = false;
      div.loading = true;
      const unsub = await this.api.tx.parachainStaking
        .cancelDelegationRequest(this.collator)
        .signAndSend(
          this.linkAccount.address,
          await this.getSign(),
          ({ events = [], status, txHash }) => {
            txHash && console.log(`Transaction hash ${txHash.toHex()}`);
            console.info(status, ".................");
            if (status && (status.isInBlock || status.isFinalized)) {
              const txStatus = this.getTxStatus(events);
              if (txStatus.success) {
                this.signalStatus(this.status.TO_REVOKE);
                div.loading = false;
              } else if (txStatus.fail) {
                // this.$message.error("operation failed");
                div.loading = false;
                this.$message({
                  showClose: true,
                  message: "Something is wrong.",
                  type: "error",
                  duration: 8000,
                });
              }
              unsub();
            }
          }
        )
        .catch((error) => {
          div.loading = false;
          this.$message.error("transaction failed" + error);
          // console.log(":( transaction failed", error);
        });
    },
    closeDialog() {
      this.ui.confirm.show = false;
    },
    confirmDialogActionBridge(methodName) {
      this[methodName]();
    },
    countdownDecisionMaker(v) {
      console.info("...........", v);
      if (v === "Execute") {
        this.doRequestExecuteRevoke();
      } else {
        this.countdownDecline();
      }
      this.decision.v = null; //reset the dropdown status, so we can do choose again
    },
    async doRequestExecuteRevoke() {
      this.decision.loading = true;
      const unsub = await this.api.tx.parachainStaking
        .executeDelegationRequest(this.linkAccount.address, this.collator)
        .signAndSend(
          this.linkAccount.address,
          await this.getSign(),
          ({ events = [], status, txHash }) => {
            // console.log(`Transaction included at blockHash ${status.asFinalized}`);
            txHash && console.log(`Transaction hash ${txHash.toHex()}`);
            console.info(status, ".................");

            if (status && (status.isInBlock || status.isFinalized)) {
              const txStatus = this.getTxStatus(events);
              if (txStatus.success) {
                this.signalStatus(this.status.REVOKED);
                this.$message.success("Revoke successfully");
                //this.decision.loading = false;
              } else if (txStatus.fail) {
                // this.$message.error("operation failed");
                this.$message({
                  showClose: true,
                  message: "Something is wrong.",
                  type: "error",
                  duration: 8000,
                });
                this.decision.loading = false;
              }
              unsub();
            }
          }
        )
        .catch((error) => {
          this.decision.loading = false;
          this.$message.error("transaction failed" + error);
          // console.log(":( transaction failed", error);
        });
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
    countdownDecline() {
      this.ui.confirm.current = this.ui.confirm.cancel;
      this.ui.confirm.show = true;
    },

    test() {},
  },
  beforeDestroy() {
    this.countdown.timer && clearInterval(this.countdown.timer);
    this.countdown.timer = null;
  },
};
</script>
  
<style lang="less">
.revoke-dialog {
  .el-dialog__body {
    padding: 15px 20px;
  }
  h2 {
    //   font-family: "Inter";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: rgba(38, 38, 38, 0.8);
  }
  span.context {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgba(38, 38, 38, 0.6);
  }
  div.btn {
    display: inline-block;
    text-align: center;
    padding: 0 8px;
    width: 70px;
    height: 40px;
    line-height: 40px;
    background: #38cb98;
    border-radius: 6px;
    font-size: 14px;
    color: white;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
  div.btn.cancel {
    margin-right: 8px;
    background: #ffffff;
    color: rgba(41, 40, 40, 0.8);
    border: 1px solid rgba(41, 40, 40, 0.3);
  }
}
</style>
<style lang="less" scoped>
.unstake-root {
  display: inline-block;
  .table-btn {
    display: inline-block;
    position: relative;
    text-align: center;
    padding: 0 8px;
    height: 40px;
    line-height: 40px;
    background: #38cb98;
    border-radius: 6px;
    font-size: 14px;
    color: white;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
  .table-btn.revoke {
    margin-left: 8px;
    background: #ffffff;
    color: rgba(41, 40, 40, 0.8);
    border: 1px solid rgba(41, 40, 40, 0.3);
  }

  .countdown-wrap {
    // display: inline-block;
    position: absolute;
    width: 140px;
    margin-left: 15px;
    //position: relative;
    font-style: normal;
    font-weight: 400;
    > div {
      position: absolute;
    }
    div.num {
      font-size: 14px;
      line-height: 20px;
      color: rgba(41, 40, 40, 0.8);
      top: -22px;
    }
    div.tip {
      font-size: 10px;
      line-height: 16px;
      color: rgba(41, 40, 40, 0.3);
      top: -2px;
    }
    div.btn {
      color: rgba(41, 40, 40, 0.6);
      position: absolute;
      right: 8px;
      top: -16px;
      font-size: 18px;
      cursor: pointer;
    }
    div.btn:hover {
      color: #38cb98;
    }
    div.decision {
      width: 100%;
      height: 40px;

      z-index: 2;
      bottom: -15px;
      background: transparent;
    }
  }
}
</style>