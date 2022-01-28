<template>
  <div class="layout" :class="stylemode">
    <div class="chart-wrap">
      <div class="row">
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
      chart2Loading: false,
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
    this.loadData2();
  },
  methods: {
    loadData2() {
      this.chart2Loading = true;
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
  },
};
</script>
 
 