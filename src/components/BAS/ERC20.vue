<template>
  <div class="component-wrap">
    <div class="info-wrap">
      <div class="info">
        <div class="item">
          <div class="num">
            <countTo
              v-if="numData.total_transfer_tokens"
              :decimals="2"
              :startVal="0"
              :endVal="numData.total_transfer_tokens"
              :duration="3000"
            ></countTo>
            <span v-else>--</span>
          </div>
          <span class="label">Total Transfers</span>
        </div>
        <div class="item">
          <div class="num">
            <countTo
              v-if="numData.total_transfer_transactions"
              :startVal="0"
              :endVal="numData.total_transfer_transactions"
              :duration="3000"
            ></countTo>
            <span v-else>--</span>
          </div>
          <span class="label">Tansfer Volume</span>
        </div>
        <div class="item">
          <div class="num">
            <countTo
              v-if="numData.total_addresses"
              :startVal="0"
              :endVal="numData.total_addresses"
              :duration="3000"
            ></countTo>
            <span v-else>--</span>
          </div>
          <span class="label">Total Addresses</span>
        </div>
      </div>
    </div>
    <div class="chart">
      <iframe
        src="https://mb.web3go.xyz/public/question/35331a65-524e-48f7-9c8a-32d448342ff4"
        frameborder="0"
        width="100%"
        height="588"
        allowtransparency
      ></iframe>
    </div>
    <div class="chart">
      <iframe
        src="https://mb.web3go.xyz/public/question/70aaec26-ed58-400b-8cbf-bc7f68982ff3"
        frameborder="0"
        width="100%"
        height="588"
        allowtransparency
      ></iframe>
    </div>
    <div class="chart">
      <iframe
        src="https://mb.web3go.xyz/public/question/292cff20-dce2-4a53-98e2-a6298326580e"
        frameborder="0"
        width="100%"
        height="588"
        allowtransparency
      ></iframe>
    </div>
    <div class="chart">
      <iframe
        src="https://mb.web3go.xyz/public/question/379c21c5-55d8-49c0-8d10-cc02482536b8"
        frameborder="0"
        width="100%"
        height="588"
        allowtransparency
      ></iframe>
    </div>
    <div class="chart">
      <iframe
        src="https://mb.web3go.xyz/public/question/34bcef85-3b49-4f81-aede-5730eccc9e68"
        frameborder="0"
        width="100%"
        height="588"
        allowtransparency
      ></iframe>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import basApi from "@/api/bas";

export default {
  components: { countTo },
  data() {
    return {
      numData: {},
    };
  },
  created() {
    basApi
      .basErc20Overview({
        apikey: 123456,
      })
      .then((d) => {
        d.total_transfer_tokens = this.$utils.formatTokenNumber(
          d.total_transfer_tokens,
          Math.pow(10, d.token_decimals)
        );
        this.numData = d;
      });
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.component-wrap {
  margin-top: 40px;
  .info-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 114px;
    .info {
      background: #ffffff;
      box-shadow: 14px 17px 37px 18px rgba(112, 144, 176, 0.08);
      border-radius: 30px;
      width: 1185px;
      height: 141px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .item {
        flex: 1;
        position: relative;
        &:last-child {
          &::after {
            display: none;
          }
        }
        &::after {
          content: "";
          height: 54px;
          width: 2px;
          background: #e9edf7;
          display: block;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        .num {
          font-weight: 700;
          font-size: 36px;
          color: #2b3674;
        }
        .label {
          display: block;
          margin-top: 12px;
          font-weight: 500;
          font-size: 16px;
          color: #a3aed0;
        }
      }
    }
  }
  .chart {
    margin-bottom: 24px;
    iframe {
      border-radius: 8px;
    }
  }
}
</style>