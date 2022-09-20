<template>
  <div class="component-wrap">
    <div class="small-tab-wrap">
      <div class="small-tab">
        <div
          v-for="(v, i) in tabList"
          :key="i"
          class="item"
          @click="clickSmallTab(v)"
          :class="{ active: smallTab.name == v.name }"
        >
          {{ v.name }}
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="col">
        <div class="label">Contract Address</div>
        <div class="value">
          {{ smallTab.contract_address }}
        </div>
      </div>
      <div class="col">
        <div class="label">Creator Address</div>
        <div class="value">
          {{ smallTab.creator }}
        </div>
      </div>
    </div>
    <div class="chart-row">
      <div class="left">
        <div class="info-wrap">
          <img src="@/assets/images/iframeIcon1.png" alt="" />
          <div class="right">
            <div class="num">
              <countTo
                v-if="numData.total_minted !== undefined"
                :startVal="0"
                :endVal="numData.total_minted"
                :duration="3000"
              ></countTo>
              <span v-else>--</span>
            </div>
            <div class="label">Total Minted</div>
          </div>
        </div>
        <div class="l-chart">
          <iframe
            :src="
              addQuery(
                'https://mb.web3go.xyz/public/question/57bb86d9-b2a5-49bc-84dc-3cc1417aa7c7'
              )
            "
            frameborder="0"
            width="100%"
            height="369"
            allowtransparency
          ></iframe>
        </div>
      </div>
      <div class="right">
        <div class="r-chart">
          <iframe
            :src="
              addQuery(
                'https://mb.web3go.xyz/public/question/e7879479-cafa-4633-b571-aa813149e0d1'
              )
            "
            frameborder="0"
            width="100%"
            height="595"
            allowtransparency
          ></iframe>
        </div>
      </div>
    </div>
    <div class="chart-row">
      <div class="left">
        <div class="info-wrap">
          <img src="@/assets/images/iframeIcon1.png" alt="" />
          <div class="right">
            <div class="num">
              <countTo
                v-if="numData.total_burnt !== undefined"
                :startVal="0"
                :endVal="numData.total_burnt"
                :duration="3000"
              ></countTo>
              <span v-else>--</span>
            </div>
            <div class="label">Total Burnt</div>
          </div>
        </div>
        <div class="l-chart">
          <iframe
            :src="
              addQuery(
                'https://mb.web3go.xyz/public/question/8facdb90-2269-408b-b757-3d73ac6fa422'
              )
            "
            frameborder="0"
            width="100%"
            height="369"
            allowtransparency
          ></iframe>
        </div>
      </div>
      <div class="right">
        <div class="r-chart">
          <iframe
            :src="
              addQuery(
                'https://mb.web3go.xyz/public/question/39429d2a-b97d-4eb6-b374-542a2209bd9d'
              )
            "
            frameborder="0"
            width="100%"
            height="595"
            allowtransparency
          ></iframe>
        </div>
      </div>
    </div>
    <div class="chart">
      <iframe
        :src="
          addQuery(
            'https://mb.web3go.xyz/public/question/72fc65e3-187e-4a76-9b74-bb07bf45308b'
          )
        "
        frameborder="0"
        width="100%"
        height="588"
        allowtransparency
      ></iframe>
    </div>
    <div class="half-row">
      <div class="h-chart">
        <iframe
          :src="
            addQuery(
              'https://mb.web3go.xyz/public/question/62862451-0177-4a3b-9fd7-6f2e362fa687'
            )
          "
          frameborder="0"
          width="100%"
          height="588"
          allowtransparency
        ></iframe>
      </div>
      <div class="h-chart">
        <iframe
          :src="
            addQuery(
              'https://mb.web3go.xyz/public/question/99fc7114-3671-47ee-9d42-3b95b05fb674'
            )
          "
          frameborder="0"
          width="100%"
          height="588"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="half-row">
      <div class="h-chart">
        <iframe
          :src="
            addQuery(
              'https://mb.web3go.xyz/public/question/89aba2bd-ba35-4639-bba9-c6d340e3d18a'
            )
          "
          frameborder="0"
          width="100%"
          height="588"
          allowtransparency
        ></iframe>
      </div>
      <div class="h-chart">
        <iframe
          :src="
            addQuery(
              'https://mb.web3go.xyz/public/question/2f339a7c-2bb7-4140-a0a3-c95ac5cf4a53'
            )
          "
          frameborder="0"
          width="100%"
          height="588"
          allowtransparency
        ></iframe>
      </div>
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
      tabList: [],
      smallTab: {},
      numData: {},
    };
  },
  created() {
    basApi
      .basContracts({
        apikey: 123456,
      })
      .then((d) => {
        this.tabList = d;
        if (d.length) {
          this.smallTab = d[0];
          this.getNumData();
        }
      });
  },
  mounted() {},
  methods: {
    addQuery(str) {
      return str + "?contract_address=" + this.smallTab.contract_address;
    },
    getNumData() {
      basApi
        .basContractsOverview({
          apikey: 123456,
          contract_address: this.smallTab.contract_address,
        })
        .then((d) => {
          this.numData = d;
        });
    },
    clickSmallTab(v) {
      this.smallTab = v;
      this.numData = {};
      this.getNumData();
    },
  },
};
</script>

<style lang="less" scoped>
.component-wrap {
  margin-top: 40px;
  .small-tab-wrap {
    display: flex;
    justify-content: center;
  }
  .small-tab {
    display: flex;
    justify-content: center;
    .item {
      margin-right: 32px;
      font-weight: 500;
      font-size: 14px;
      line-height: 24px;
      color: #a3aed0;
      width: 127px;
      height: 30px;
      border: 1px solid #a3aed0;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        cursor: pointer;
        color: #4318ff;
      }
      &.active {
        color: #4318ff;
        border: 1px solid #4318ff;
      }
    }
  }
  .form-row {
    margin-top: 32px;
    text-align: left;
    display: flex;
    .col {
      flex: 1;
      & + .col {
        margin-left: 32px;
      }
      .label {
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: #2b3674;
      }
      .value {
        padding-left: 19px;
        height: 60px;
        line-height: 60px;
        font-weight: 400;
        font-size: 14px;
        border: 1px solid #e9edf7;
        box-shadow: 0px 50px 40px -34px rgba(112, 144, 176, 0.16);
        border-radius: 16px;
      }
    }
  }
  .chart-row {
    margin-top: 24px;
    display: flex;
    & > .left {
      background: #ffffff;
      box-shadow: 14px 17px 40px 4px rgba(112, 144, 176, 0.08);
      border-radius: 20px;
      flex: 1;
      .info-wrap {
        margin: 28px;
        height: 141px;
        background: #ffffff;
        /* Shadows/Soft Shadow/Soft Shadow - Style 1 */
        box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 56px;
          margin-right: 24px;
        }
        .right {
          .num {
            font-weight: 700;
            font-size: 36px;
          }
          .label {
            margin-top: 12px;
            font-weight: 500;
            font-size: 16px;
            color: #a3aed0;
          }
        }
      }
      .l-chart {
        margin: 28px;
      }
    }
    & > .right {
      margin-left: 24px;
      flex: 2;
    }
  }
  .chart {
    margin-bottom: 24px;
  }
  .half-row {
    margin-bottom: 24px;
    display: flex;
    .h-chart {
      flex: 1;
      & + .h-chart {
        margin-left: 24px;
      }
    }
  }
  iframe {
    display: block;
    border-radius: 8px;
  }
}
</style>