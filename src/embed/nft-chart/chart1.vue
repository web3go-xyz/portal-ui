<template>
  <div class="layout" :class="stylemode">
    <div class="chart-wrap">
      <div class="row">
        <div id="chart1" class="chart-item" v-loading="chart1Loading">
          <div class="title">
            <span> Average Price & Volume </span>
          </div>
          <div class="chart chart1" ref="chart1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAvgPriceVolumeOfCollection } from "./../lib/api";
export default {
  data() {
    return {
      priceRangeList: [],
      chart1Loading: false,
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
    this.loadData1();
  },
  methods: {
    loadData1() {
      this.chart1Loading = true;
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
  },
};
</script> 