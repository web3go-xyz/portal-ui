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