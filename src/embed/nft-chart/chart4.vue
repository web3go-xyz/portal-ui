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