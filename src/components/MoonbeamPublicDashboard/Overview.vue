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
          src="https://mb.web3go.xyz/public/question/89ceab6e-9028-4fb5-9ec8-60ad9a9dcf6a?date=past30days"
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
          src="https://mb.web3go.xyz/public/question/4ba55dfa-f461-4a5d-beb7-6d5654fd2161?date=past30days"
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
          src="https://mb.web3go.xyz/public/question/4b884dee-285c-482b-94e8-6297b3c02a16"
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
          src="https://mb.web3go.xyz/public/question/ac6d3130-dea4-4990-9eb0-89a52d2ee44f"
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
          src="https://mb.web3go.xyz/public/question/185cff5d-9baa-4056-94d7-e0cb6d7c4ee2?date=past30days"
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
          src="https://mb.web3go.xyz/public/question/4d703600-a8ff-4217-a21d-beef5918c649?date=past30days"
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
          src="https://mb.web3go.xyz/public/question/4ce00ac3-17a3-4e8e-b749-58ad2bf59d3a?date=past30days"
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
          src="https://mb.web3go.xyz/public/dashboard/b4cb729e-7e9b-4cc0-a634-f477c767bdd9"
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
import basApi from "@/api/moonbeamDashboard";

export default {
  components: { countTo },
  data() {
    return {
      numData: [],
    };
  },
  methods: {
    scrollToElement(options) {
      const hash = this.$route.hash;
      if (decodeURIComponent(hash) === "#DappActivity") {
        this.$refs["dapp-activity"].scrollIntoView(options);
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
  mounted() { this.scrollToElement({behavior: "smooth"}); },
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
  // .chart {
  //   margin-bottom: 24px;
  //   iframe {
  //     border-radius: 8px;
  //   }
  // }
}
</style>