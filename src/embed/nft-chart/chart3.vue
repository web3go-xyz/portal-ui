<template>
  <div class="layout" :class="stylemode">
    <div class="chart-wrap">
      <div class="row">
        <div id="chart3" class="chart-item" v-loading="chart3Loading">
          <div class="title">
            <span> Individual Transactions </span>
            <el-tooltip
              placement="top"
              trigger="hover"
              content="Tracks the latest individual transactions. Click into them to see the NFT detail. "
            >
              <img class="info-icon" src="@/assets/images/info-icon.png" />
            </el-tooltip>

            <!-- <div class="checkbox-wrap">
              <el-checkbox v-model="checked">Drop extreme outliers</el-checkbox>
            </div> -->
          </div>
          <div class="chart chart3" ref="chart3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCollectionStatistic,
  getAvgPriceVolumeOfCollection,
  getPriceRangeOfCollection,
  getTransactionsOfCollection,
  getTransactionCountOfCollection,
} from "./../lib/api";
export default {
  data() {
    return {
      priceRangeList: [],

      chart3Loading: false,
      chart4Loading: false,
      checked: false,
      infoData: {},
      latest7daysStart: "",
      latest7daysEnd: "",
      latest7days: [],
      averagePriceList: [],
      volumeList: [],
      priceAvgList: [],
      priceMaxList: [],
      priceMinList: [],
      transaction_countList: [],
      buyer_countList: [],
      transactionsList: [],
      sanDianList: [],
    };
  },
  created() {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      arr.push(this.$moment().subtract(i, "days").format("YYYY-MM-DD"));
    }
    this.latest7days = arr;
    this.latest7daysStart = arr[0];
    this.latest7daysEnd = arr[arr.length - 1];
    this.stylemode = this.$route.query.style || "";
  },
  mounted() {
    this.loadData3();
  },
  methods: {
    shorterAddress(address) {
      if (address && address.length > 20) {
        // debugger
        let subLength = 5;
        return (
          address.substring(0, subLength) +
          "..." +
          address.substring(address.length - subLength)
        );
      } else {
        return address;
      }
    },

    loadData3() {
      this.chart3Loading = true;
      getTransactionsOfCollection({
        collection_id: this.$route.query.id,
        start_time: this.latest7daysStart,
        end_time: this.latest7daysEnd,
      }).then((d) => {
        this.chart3Loading = false;
        this.transactionsList = d;
        this.sanDianList = d.map((v) => {
          return [
            v.timestamp,
            this.$utils.formatTokenNumber(v.nft_price, this.$utils.KSM_RATIO),
          ];
        });
        this.initChart3();
      });
    },

    initChart3() {
      const chart = echarts.init(this.$refs.chart3, {
        locale: "EN",
      });
      const option = {
        color: [
          "rgba(58, 118, 240, 1)",
          "rgba(95, 204, 186, 1)",
          "rgba(255, 125, 0, 1)",
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            show: true,
            type: "cross",
            lineStyle: {
              type: "dashed",
              width: 1,
            },
          },
          formatter: (params) => {
            const index = params[0].dataIndex;
            const obj = this.transactionsList[index];
            return `
            <div class="echart-tooltip-formatter-popover">
              ${this.$moment(obj.timestamp).format("YYYY-MM-DD HH:mm:ss")}
              <div class="row">
                <div class="label">price:</div> 
                <div class="value">${this.$utils.formatToken(
                  obj.nft_price,
                  this.$utils.KSM_RATIO
                )} KSM</div>
              </div>
              <div class="row">
                <div class="label">NFT:</div> 
                <div class="value">${this.shorterAddress(
                  obj.interaction_n_f_t
                )}</div>
              </div>
              <div class="row">
                <div class="label">Account:</div> 
                <div class="value">${this.shorterAddress(
                  obj.interaction_account
                )}</div>
              </div>
            </div>
                `;
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 100,
          },
        ],
        legend: {
          data: ["buyer"],
          icon: "circle",
          left: 0,
          top: 20,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 40,
          itemStyle: {},
          textStyle: {
            color: "#7F7E7E",
            fontSize: 14,
          },
        },
        grid: {
          containLabel: true,
          left: 10,
          top: 70,
          bottom: 50,
          right: 10,
        },
        xAxis: [
          {
            type: "time",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#A9A9A9",
              fontSize: 14,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#A9A9A9",
              fontSize: 14,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "rgba(232, 232, 232, 1)",
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "buyer",
            symbolSize: 10,
            itemStyle: {
              color: "rgba(22, 93, 255, 0.1)",
              borderWidth: 1,
              borderColor: "#3A76F0",
            },
            data: this.sanDianList,
            type: "scatter",
          },
        ],
      };
      chart.setOption(option);
      chart.on("click", "series.scatter", (params) => {
        const index = params.dataIndex;
        const obj = this.transactionsList[index];
      });
    },
  },
};
</script>
<style lang="less">
.nft-detail-page-popover {
  font-size: 14px !important;
}
</style>
<style lang="less" scoped>
.layout {
  margin: 0 auto;
}

.chart-wrap {
  .row {
    display: flex;
    .chart-item {
      text-align: left;
      padding: 32px;
      flex: 1;
      height: 425px;
      margin-right: 24px;
      margin-bottom: 24px;
      background: #ffffff;
      border-radius: 10px;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        .code-img {
          display: block !important;
        }
      }
      .title {
        position: relative;
        font-size: 20px;
        color: #292828;
        span {
          vertical-align: middle;
        }
        .info-icon {
          vertical-align: middle;
          width: 16px;
          height: 16px;
        }
        .code-img {
          opacity: 0.2;
          display: none;
          position: absolute;
          right: 0;
          top: 0;
          width: 24px;
          height: 24px;
          padding: 3px 5px;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            background: #ccc;
            opacity: 0.4;
          }
        }
        .checkbox-wrap {
          position: absolute;
          right: 0;
          top: 0;
          /deep/ .el-checkbox__label {
            color: #7f7e7e;
          }
        }
      }
      .chart {
        height: calc(100% - 32px);
        width: 100%;
      }
    }
  }
}
</style>