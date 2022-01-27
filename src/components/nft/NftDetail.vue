<template>
  <div class="layout">
    <div class="back-title">
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">{{ infoData.name }}</span>
      <span class="time">{{
        $moment(infoData.timestamp_created_at).format("YYYY-MM-DD")
      }}</span>
    </div>
    <div class="nftNav-wrap">
      <div class="nftNav">
        <span class="active hover-item">Overview</span>
        <span class="hover-item" @click="goToBreakdown">Breakdown</span>
      </div>
    </div>

    <div class="info-wrap">
      <div class="row">
        <div class="item">
          <div class="top">Min Price&nbsp;(Buy/List)</div>
          <div class="middle">
            {{ infoData.min_price | formatKUSAMA }}/{{
              infoData.min_price_list | formatKUSAMA
            }}
            KSM
          </div>
          <!-- <div class="bottom">
            <i class="el-icon-bottom"></i>
            <span class="red">338%</span>
            <span class="text">· was&lt;.0001 KSM last day</span>
          </div> -->
        </div>
        <div class="item">
          <div class="top">Average Price&nbsp;(Buy/List)</div>
          <div class="middle">
            {{ infoData.avg_price | formatKUSAMA }}/{{
              infoData.avg_price_list | formatKUSAMA
            }}
            KSM
          </div>
          <!-- <div class="bottom">
            <i class="el-icon-bottom"></i>
            <span class="red">338%</span>
            <span class="text">· was&lt;.0001 KSM last day</span>
          </div> -->
        </div>
        <div class="item">
          <div class="top">Max Price&nbsp;(Buy/List)</div>
          <div class="middle">
            {{ infoData.max_price | formatKUSAMA }}/{{
              infoData.max_price_list | formatKUSAMA
            }}
            KSM
          </div>
          <!-- <div class="bottom">
            <i class="el-icon-bottom"></i>
            <span class="red">338%</span>
            <span class="text">· was&lt;.0001 KSM last day</span>
          </div> -->
        </div>
      </div>
      <div class="row">
        <div class="item">
          <div class="top">Volume</div>
          <div class="middle">
            {{ infoData.collection_volume | formatKUSAMA }} KSM
          </div>
          <!-- <div class="bottom">
            <i class="el-icon-bottom"></i>
            <span class="red">338%</span>
            <span class="text">· was&lt;.0001 KSM last day</span>
          </div> -->
        </div>
        <div class="item">
          <div class="top">Transactions</div>
          <div class="middle">{{ infoData.collection_transactions }}</div>
          <!-- <div class="bottom">
            <i class="el-icon-top"></i>
            <span class="green">338%</span>
            <span class="text">· was&lt;.0001 KSM last day</span>
          </div> -->
        </div>
        <div class="item">
          <div class="top">Unique Buyers</div>
          <div class="middle">{{ infoData.buyer_count }}</div>
          <!-- <div class="bottom">
            <i class="el-icon-bottom"></i>
            <span class="red">338%</span>
            <span class="text">· was&lt;.0001 KSM last day</span>
          </div> -->
        </div>
      </div>
    </div>
    <div class="chart-wrap">
      <div class="row">
        <div id="chart1" class="chart-item" v-loading="chart1Loading">
          <div class="title">Average Price & Volume</div>
          <div class="chart chart1" ref="chart1"></div>
        </div>
        <div id="chart2" class="chart-item" v-loading="chart2Loading">
          <div class="title">
            <span> Price Range </span>
            <el-tooltip
              placement="top"
              trigger="hover"
              content="View the min,max and avg price of sales on any given day."
            >
              <img class="info-icon" src="@/assets/images/info-icon.png" />
            </el-tooltip>
          </div>
          <div class="chart chart2" ref="chart2"></div>
        </div>
      </div>
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
} from "@/api/nft/nftDetail";
export default {
  data() {
    return {
      priceRangeList: [],
      chart1Loading: false,
      chart2Loading: false,
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
    getCollectionStatistic({
      pageSize: 10,
      pageIndex: 1,
      orderBys: [],
      collection_id: this.$route.query.id,
      collection_symbol: this.$route.query.symbol,
    }).then((d) => {
      this.infoData = d.list[0];
    });
  },
  mounted() { 
    this.initCharts();
    // this.generateIframe('chart1');
    // this.generateIframe('chart2');
    // this.generateIframe('chart3');

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
    goToBreakdown() {
      this.$router.push({
        name: "NftDetailBeakdown",
        query: this.$route.query,
      });
    },
    initCharts() {
      this.chart1Loading = true;
      this.chart2Loading = true;
      this.chart3Loading = true;
      this.chart4Loading = true;
      getAvgPriceVolumeOfCollection({
        collection_id: this.$route.query.id,
        query_days: this.latest7days,
      }).then((d) => {
        this.chart1Loading = false;
        this.averagePriceList = d.map((v) =>
          this.$utils.formatTokenNumber(v.avg_price, this.$utils.KSM_RATIO)
        );
        this.volumeList = d.map((v) =>
          this.$utils.formatTokenNumber(v.volume, this.$utils.KSM_RATIO)
        );
        this.initChart1();
      });
      getPriceRangeOfCollection({
        collection_id: this.$route.query.id,
        start_time: this.latest7daysStart,
        end_time: this.latest7daysEnd,
        interaction: "LIST",
      }).then((d1) => {
        getPriceRangeOfCollection({
          collection_id: this.$route.query.id,
          start_time: this.latest7daysStart,
          end_time: this.latest7daysEnd,
          interaction: "BUY",
        }).then((d) => {
          this.chart2Loading = false;
          // 补全数据
          d = this.latest7days.map((v) => {
            const findIndex = d.findIndex((sv) => sv.timestamp_byday === v);
            if (findIndex !== -1) {
              return {
                ...d[findIndex],
                avg_price_list: d1[findIndex].avg_price,
                max_price_list: d1[findIndex].max_price,
                min_price_list: d1[findIndex].min_price,
              };
            }
            return {
              avg_price: null,
              avg_price_list: null,
              max_price: null,
              max_price_list: null,
              min_price: null,
              min_price_list: null,
              timestamp_byday: v,
            };
          });
          this.priceRangeList = d;
          this.priceAvgList = d.map((v) =>
            this.$utils.formatTokenNumber(v.avg_price, this.$utils.KSM_RATIO)
          );
          this.priceMaxList = d.map((v) =>
            this.$utils.formatTokenNumber(v.max_price, this.$utils.KSM_RATIO)
          );
          this.priceMinList = d.map((v) =>
            this.$utils.formatTokenNumber(v.min_price, this.$utils.KSM_RATIO)
          );
          this.initChart2();
        });
      });
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
    initChart1() {
      const chart = echarts.init(this.$refs.chart1);
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
          data: ["Price(KSM)", "Volume(KSM)"],
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
          {
            type: "value",
            axisLabel: {
              color: "#A9A9A9",
              fontSize: 14,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "Price(KSM)",
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            lineStyle: {
              width: 5,
            },
            data: this.averagePriceList,
          },
          {
            name: "Volume(KSM)",
            type: "bar",
            yAxisIndex: 1,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(105, 231, 201, 1)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(56, 203, 152, 1)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
              borderRadius: [4, 4, 0, 0],
            },
            data: this.volumeList,
          },
        ],
      };
      chart.setOption(option);
    },
    initChart2() {
      const chart = echarts.init(this.$refs.chart2);
      const option = {
        color: [
          "rgba(58, 118, 240, 1)",
          "rgba(95, 204, 186, 1)",
          "rgba(255, 125, 0, 1)",
        ],
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const index = params[0].dataIndex;
            const obj = this.priceRangeList[index];
            return `
            <div class="echart-tooltip-formatter-popover">
              ${params[0].axisValue}
              <div class="row">
                <div class="label">${params[0].marker}${
              params[0].seriesName
            }:</div> 
                <div class="value">${params[0].value}/${this.$utils.formatToken(
              obj.avg_price_list,
              this.$utils.KSM_RATIO
            )} KSM</div>
              </div>
              <div class="row">
                <div class="label">${params[1].marker}${
              params[1].seriesName
            }:</div> 
                <div class="value">${params[1].value}/${this.$utils.formatToken(
              obj.max_price_list,
              this.$utils.KSM_RATIO
            )} KSM</div>
              </div>
               <div class="row">
                <div class="label">${params[2].marker}${
              params[2].seriesName
            }:</div> 
                <div class="value">${params[2].value}/${this.$utils.formatToken(
              obj.min_price_list,
              this.$utils.KSM_RATIO
            )} KSM</div>
              </div>
            </div>
                `;
          },
        },
        legend: {
          data: ["Avg", "Max", "Min"],
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
            name: "Avg",
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
            },
            data: this.priceAvgList,
          },
          {
            name: "Max",
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
            },
            data: this.priceMaxList,
          },
          {
            name: "Min",
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
            },
            data: this.priceMinList,
          },
        ],
      };
      chart.setOption(option);
    },
    initChart3() {
      const chart = echarts.init(this.$refs.chart3, null, { locale: "EN" });
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
        this.$router.push({
          name: "NftItemDetail",
          query: {
            id: obj.interaction_n_f_t,
          },
        });
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
  padding-top: 32px;
  width: 1320px;
  margin: 0 auto;
}
.back-title {
  display: flex;
  align-items: center;
  text-align: left;
  .el-icon-back {
    padding: 10px;
    cursor: pointer;
    opacity: 0.7;
    font-weight: bold;
    transform: none;
    color: rgba(41, 40, 40, 1);

    &:hover {
      opacity: 0.5;
    }
  }
  .text {
    font-size: 24px;
    font-weight: bold;
    color: #292828;
  }
  .time {
    margin-left: 10px;
    font-size: 16px;
    color: #7f7e7e;
  }
}
.nftNav-wrap {
  text-align: left;
  .nftNav {
    background: #ebeff3;
    border-radius: 4px;
    margin-top: 32px;
    display: inline-block;
    padding: 5px;
    span {
      padding: 7px 39px;
      cursor: pointer;
      width: 147px;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      font-size: 16px;

      color: #7f7e7e;
      &.active {
        background: #ffffff;
        color: #38cb98;
        font-weight: 500;
      }
    }
  }
}
.info-wrap {
  margin-top: 24px;
  .row {
    display: flex;
    .item {
      background: #ffffff;
      border-radius: 10px;
      padding: 32px 0;
      flex: 1;
      margin-right: 24px;
      margin-bottom: 24px;
      &:last-child {
        margin-right: 0;
      }
      .top {
        font-size: 16px;
        color: #7f7e7e;
      }
      .middle {
        padding: 8px 0;
        font-size: 24px;
        font-weight: bold;
        color: #545353;
      }
      .bottom {
        .el-icon-bottom {
          color: rgba(245, 63, 63, 1);
          font-weight: bold;
        }
        .el-icon-top {
          color: rgba(56, 203, 152, 1);
          font-weight: bold;
        }
        .green {
          font-size: 16px;
          color: #38cb98;
        }
        .red {
          font-size: 16px;
          color: #f53f3f;
        }
        .text {
          font-size: 16px;
          color: #7f7e7e;
        }
      }
    }
  }
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