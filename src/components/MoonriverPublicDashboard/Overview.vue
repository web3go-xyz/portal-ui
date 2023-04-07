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
          src="https://mb.web3go.xyz/public/question/85ccc88c-5b1c-447a-ac0b-80113dee9b7d"
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
          src="https://mb.web3go.xyz/public/question/aa3cac4f-c4b2-4716-9f8b-2efee8814809"
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
          src="https://mb.web3go.xyz/public/question/573abf00-5a78-4ade-aa86-e354f6b41d28"
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
          src="https://mb.web3go.xyz/public/question/9881f737-b690-4fab-b126-89ee28d6e895"
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
          src="https://mb.web3go.xyz/public/question/d577f146-fed2-43f7-9e1e-644994e87c52"
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
  created() {
    basApi.addressSummary().then((d) => {
      d.forEach((v) => {
        v.value = Number(v.value);
        v.comment = v.comment.replace("\n", "<br/>");
      });
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
