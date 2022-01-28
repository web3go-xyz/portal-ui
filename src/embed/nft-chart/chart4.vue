<template>
  <div class="layout" :class="stylemode">
    <div class="chart-wrap">
      <div class="row">
        <div id="chart4" class="chart-item" v-loading="chart4Loading">
          <div class="title">
            <span> Transactions & Buyers </span>
            <el-tooltip
              popper-class="nft-detail-page-popover"
              placement="top"
              trigger="hover"
              content="Track the amount of transactions and unique buyers on any given day."
            >
              <img class="info-icon" src="@/assets/images/info-icon.png" />
            </el-tooltip>
          </div>
          <div class="chart chart4" ref="chart4"></div>
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
} from "../lib/api";
export default {
  data() {
    return {
      priceRangeList: [],

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
    this.loadData4();
  },
  methods: {
    loadData4() {
      this.chart4Loading = true;

      getTransactionCountOfCollection({
        collection_id: this.$route.query.id,
        start_time: this.latest7daysStart,
        end_time: this.latest7daysEnd,
      }).then((d) => {
        this.chart4Loading = false;
        // 补全数据
        d = this.latest7days.map((v) => {
          const find = d.find((sv) => sv.timestamp_byday === v);
          if (find) {
            return find;
          }
          return {
            buyer_count: null,
            transaction_count: null,
            timestamp_byday: v,
          };
        });
        this.transaction_countList = d.map((v) => v.transaction_count);
        this.buyer_countList = d.map((v) => v.buyer_count);

        this.initChart4();
      });
    },

    initChart4() {
      const chart = echarts.init(this.$refs.chart4);
      const option = {
        color: [
          "rgba(58, 118, 240, 1)",
          "rgba(95, 204, 186, 1)",
          "rgba(255, 125, 0, 1)",
        ],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Total Transactions", "Unique buyers"],
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
          bottom: 0,
          right: 10,
        },
        xAxis: [
          {
            type: "category",
            data: this.latest7days,
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
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#A9A9A9",
              fontSize: 14,
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
            name: "Total Transactions",
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
            },
            data: this.transaction_countList,
          },
          {
            name: "Unique buyers",
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
            },
            data: this.buyer_countList,
          },
        ],
      };
      chart.setOption(option);
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