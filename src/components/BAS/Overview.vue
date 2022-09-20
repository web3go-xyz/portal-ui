<template>
  <div class="component-wrap">
    <div class="info-wrap">
      <div class="info">
        <div class="item">
          <div class="num">
            <countTo
              v-if="numData.block_number!==undefined"
              :startVal="0"
              :endVal="numData.block_number"
              :duration="3000"
            ></countTo>
            <span v-else>--</span>
          </div>
          <span class="label">Blocks</span>
        </div>
        <div class="item">
          <div class="num">
            <countTo
              v-if="numData.total_transactions!==undefined"
              :startVal="0"
              :endVal="numData.total_transactions"
              :duration="3000"
            ></countTo>
            <span v-else>--</span>
          </div>
          <span class="label">Total Transactions</span>
        </div>
        <div class="item">
          <div class="num">
            <countTo
              v-if="numData.total_addresses!==undefined"
              :startVal="0"
              :endVal="numData.total_addresses"
              :duration="3000"
            ></countTo>
            <span v-else>--</span>
          </div>
          <span class="label">Total Addresses</span>
        </div>
        <div class="item">
          <div class="num">
            <countTo
              v-if="numData.total_gas!==undefined"
              :decimals="2"
              :startVal="0"
              :endVal="numData.total_gas"
              :duration="3000"
            ></countTo>
            <span v-else>--</span>
          </div>
          <span class="label">Total Gas</span>
        </div>
      </div>
    </div>
    <div class="chart">
      <iframe
        src="https://mb.web3go.xyz/public/question/084ca9f1-fd6b-43a1-800a-a4978513d1be"
        frameborder="0"
        width="100%"
        height="588"
        allowtransparency
      ></iframe>
    </div>
    <div class="chart">
      <iframe
        src="https://mb.web3go.xyz/public/question/5089ad48-8bad-4a77-a41d-5f503fdc7f39"
        frameborder="0"
        width="100%"
        height="588"
        allowtransparency
      ></iframe>
    </div>
    <div class="chart">
      <iframe
        src="https://mb.web3go.xyz/public/question/224d0107-f665-423e-b60b-44ef0cd85e3e"
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
      .basOverview({
        apikey: 123456,
      })
      .then((d) => {
        d.total_gas = this.$utils.formatTokenNumber(
          d.total_gas,
          Math.pow(10, d.gas_token_decimals)
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