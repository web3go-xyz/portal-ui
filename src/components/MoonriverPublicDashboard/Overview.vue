<template>
  <div class="component-wrap">
    <div class="info-wrap">
      <div class="info">
        <div v-for="(v, i) in numData" :key="i" class="item">
          <div class="num">
            <countTo
              v-if="v.value !== undefined"
              :startVal="0"
              :endVal="v.value"
              :duration="3000"
            ></countTo>
            <span v-else>--</span>
          </div>
          <div class="label">
            {{ v.display
            }}<el-tooltip placement="top" trigger="hover">
              <div slot="content" class="tooltip-300px">
                <span v-html="v.comment"> </span>
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <iframe
          ref="unique-address"
          src="https://mb.web3go.xyz/public/question/85ccc88c-5b1c-447a-ac0b-80113dee9b7d?date=past30days"
          frameborder="0"
          width="100%"
          height="500"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          ref="active-address"
          src="https://mb.web3go.xyz/public/question/aa3cac4f-c4b2-4716-9f8b-2efee8814809?date=past30days"
          frameborder="0"
          width="100%"
          height="500"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          ref="tx-by-layers"
          src="https://mb.web3go.xyz/public/question/7c834069-ee41-4288-8aa7-524cf07bc815"
          frameborder="0"
          width="100%"
          height="500"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          ref="tx-by-category"
          src="https://mb.web3go.xyz/public/question/3a8b602a-2219-4aaf-b462-ec6c11b4015c"
          frameborder="0"
          width="100%"
          height="650"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          ref="tx-by-daily-trend"
          src="https://mb.web3go.xyz/public/question/573abf00-5a78-4ade-aa86-e354f6b41d28?date=past30days"
          frameborder="0"
          width="100%"
          height="600"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          ref="tx-by-daily-stack"
          src="https://mb.web3go.xyz/public/question/9881f737-b690-4fab-b126-89ee28d6e895?date=past30days"
          frameborder="0"
          width="100%"
          height="700"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          ref="gross-inflation-breakout"
          src="https://mb.web3go.xyz/public/question/d577f146-fed2-43f7-9e1e-644994e87c52?date=past30days"
          frameborder="0"
          width="100%"
          height="700"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          ref="dapp-activity"        
          src="https://analytix.web3go.xyz/public/dashboard/a2da093b-723c-4ea9-9e2d-f72dd49f3e57"
          frameborder="0"
          width="100%"
          height="700"
          allowtransparency
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import basApi from "@/api/moonriverDashboard";
export default {
  components: { countTo },
  data() {
    return {
      numData: [],
    };
  },
  methods: {
    scrollToElement(options) {
      const hash = new URL(decodeURIComponent(this.$route.fullPath), "http://web3go.xyz").hash;
      switch (hash) {
        case "#UniqueAddress":
          this.$refs["unique-address"].scrollIntoView(options);
          break;

        case "#ActiveAddress":
          this.$refs["active-address"].scrollIntoView(options);
          break;

        case "#TransactionByLayers":
          this.$refs["tx-by-layers"].scrollIntoView(options);
          break;

        case "#TransactionByCategory":
          this.$refs["tx-by-category"].scrollIntoView(options);
          break;

        case "#TransactionDailyTrend":
          this.$refs["tx-by-daily-trend"].scrollIntoView(options);
          break;

        case "#TransactionByDailyStack":
          this.$refs["tx-by-daily-stack"].scrollIntoView(options);
          break;

        case "#GrossInflationBreakout":
          this.$refs["gross-inflation-breakout"].scrollIntoView(options);
          break;

        case "#DappActivity":
          this.$refs["dapp-activity"].scrollIntoView(options);
          break;
      }
    }
  },
  created() {
    basApi.addressSummary().then((d) => {
      d.forEach((v) => {
        v.value = Number(v.value);
        v.comment = v.comment.replace("\n", "<br/>");
      });
      this.numData = d;
    });
  },
  mounted() { this.scrollToElement({behavior: "smooth", block: "center"}); },
};
</script>

<style lang="less" scoped>
.component-wrap {
  margin-top: 40px;
  .info-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 114px;
    padding: 0 20px;
    .info {
      background: #ffffff;
      box-shadow: 14px 17px 37px 18px rgba(112, 144, 176, 0.08);
      border-radius: 30px;
      width: 100%;
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
          font-size: 32px;
          color: #2b3674;
        }
        .label {
          height: 34px;
          display: block;
          margin-top: 12px;
          font-weight: 500;
          font-size: 14px;
          color: #a3aed0;
          .el-icon-warning-outline {
            margin-left: 4px;
          }
        }
      }
    }
  }
  .row {
    display: flex;
    margin-top: 20px;
    .col {
      flex: 1;
    }
  }
}
</style>
