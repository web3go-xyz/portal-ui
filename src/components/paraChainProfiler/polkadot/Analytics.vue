<template>
  <div class="paraChainAnalytics">
    <div class="paraChainAnalytics-nav">
      <span :class="{ act: tabType === 'DOT' }" @click="switchTab('DOT')"
        >DOT</span
      >
      <span
        :class="{ act: tabType === 'Contributors' }"
        @click="switchTab('Contributors')"
        >Contributors</span
      >
    </div>
    <div v-show="tabType === 'DOT'">
      <div class="paraChainAnalytics-line">
        <h2 class="title">Total DOT raised per round</h2>
        <div ref="DOT-line"></div>
      </div>
      <div class="paraChainAnalytics-category">
        <h2 class="title">MAX / AVE / MIN DOT raised per round</h2>
        <div ref="DOT-category"></div>
      </div>
    </div>
    <div v-show="tabType === 'Contributors'">
      <div class="paraChainAnalytics-line">
        <h2 class="title">Number of contributors per round</h2>
        <div ref="Contributors-line"></div>
      </div>
      <div class="paraChainAnalytics-category">
        <h2 class="title">MAX / AVE / MIN campaign contributors per round</h2>
        <div ref="Contributors-category"></div>
      </div>
      <div class="paraChainAnalytics-list">
        <h2 class="title">Top 10 Contributors</h2>
        <div class="data-table">
          <el-table
            :key="Math.random()"
            v-loading="loading"
            element-loading-text="loading "
            element-loading-spinner="el-icon-loading"
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column label="Address" prop="crowdloanId">
              <template slot-scope="scope">
                <span class="copyImg" @click="copy(scope.row.account)">
                  <el-tooltip content="copy" placement="top">
                    <img :src="copyImg" alt="" class="copy" />
                  </el-tooltip>
                </span>
                <span class="crowdloanId">
                  {{ filterId(scope.row.account) }}
                  <input
                    v-model="scope.row.account"
                    :copyId="scope.row.account"
                  />
                </span>
              </template>
            </el-table-column>

            <el-table-column prop="crowdloanCount">
              <template slot="header">
                <el-tooltip
                  content="Number of campaigns contributed"
                  placement="top"
                >
                  <i class="el-icon-info">Number</i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <span class="participations">
                  {{ scope.row.crowdloanCount }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Total DOT contributed" prop="Amount">
              <template slot="header">
                <el-tooltip content="Total DOT contributed" placement="top">
                  <i class="el-icon-info">Total</i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <span class="amount">
                  {{ formatedCap(scope.row.totalAmount) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="Max DOT contributed per campaign"
              prop="Max"
            >
              <template slot="header">
                <el-tooltip
                  content="Max DOT contributed per campaign"
                  placement="top"
                >
                  <i class="el-icon-info">Max</i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <span class="max">
                  {{ formatedCap(scope.row.maxAmount) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="Min DOT contributed per campaign"
              prop="Smallest"
            >
              <template slot="header">
                <el-tooltip
                  content="Min DOT contributed per campaign"
                  placement="top"
                >
                  <i class="el-icon-info">Min</i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <span class="smallest">
                  {{ formatedCap(scope.row.minAmount) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Number of contributions" prop="Total">
              <template slot-scope="scope">
                <span class="total">
                  {{ scope.row.contributionCount }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utility from "@/utils/index";
import copyImg from "@/assets/images/copy.png";
import service from "@/api/paraChain-analysis-polkadot";
export default {
  name: "ParaChainAnalytics",
  data() {
    return {
      copyImg,
      tokenRatio: 1000 * 1000 * 1000 * 1000,
      loading: true,
      tableData: [],
      tabType: "DOT",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    copy(copyId) {
      const copyEl = document.querySelector(`[copyId=${copyId}]`);
      copyEl.select(); // 选择对象
      document.execCommand("copy"); // 执行浏览器复制命令
    },
    async init() {
      const tokenData = await service.getRaisedCompareOfMultiRound();
      this.renderLine(tokenData, "DOT");
      this.renderCategory(tokenData, "DOT");
    },
    getContributorsData() {
      service.getContributorCompareOfMultiRound().then((res) => {
        this.renderCategory(res, "Contributors");
        this.renderLine(res, "Contributors");
      });
      service.getTopContributorOfMultiRound().then((res) => {
        this.loading = false;
        this.dealtableData(res);
      });
    },
    switchTab(type) {
      this.tabType = type;
      if (type === "Contributors" && !this.tableData.length) {
        this.getContributorsData();
      }
    },
    filterId(data) {
      return `${data.slice(0, 6)}....${data.slice(-6)}`;
    },
    dealtableData(data) {
      this.tableData = data;
    },
    formatedCap(row, isEchartData) {
      return utility.formatedDisplay4CrowdloanDOT(row, isEchartData);
    },
    renderLine(data, type) {
      const option = {
        title: {
          left: -5,
          textStyle: {
            color: "#292828",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          data: data.map((item, index) => `Round ${index + 1}`),
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "rgba(41, 40, 40, 0.4)",
          },
        },
        yAxis: {
          axisLabel: {
            color: "rgba(41, 40, 40, 0.4)",
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "rgba(41, 40, 40, 0.4)",
            },
          },
        },
        series: [
          {
            name: "Contributors",
            type: "line",
            data: data.map((item) =>
              type === "DOT"
                ? this.formatedCap(item.totalRaised, true)
                : item.totalContributorCount
            ),
            itemStyle: {
              color: "#17c684",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(105, 231, 201, 0.35)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(56, 203, 152, 0)", // 100% 处的颜色
                  },
                ],
              },
            },
          },
        ],
      };
      if (type === "DOT") {
        option.series[0].name = "DOT";
        option.tooltip.formatter = function (params) {
          var tar = params[0];
          return (
            '<div class="option-rasie"><div class="option-rasie-title">' +
            tar.axisValue +
            '</div><div class="option-rasie-con"><span>DOT</span>' +
            tar.data +
            "K<div></div>"
          );
        };
      }
      const line = echarts.init(this.$refs[`${type}-line`]);
      line.setOption(option);
    },
    renderCategory(data, type) {
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          left: "right",
          data: ["Maximum amount", "Average amount", "Minimum amount"],
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "bottom",
          top: "left",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: data.map((item, index) => `Round ${index + 1}`),
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Maximum amount",
            type: "bar",
            barGap: 0,
            emphasis: {
              focus: "series",
            },
            data: data.map((item) =>
              type === "DOT"
                ? this.formatedCap(item.maxRaised, true)
                : item.maxContributorCount
            ),
          },
          {
            name: "Average amount",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: data.map((item) =>
              type === "DOT"
                ? this.formatedCap(item.avgRaised, true)
                : item.avgContributorCount
            ),
          },
          {
            name: "Minimum amount",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: data.map((item) =>
              type === "DOT"
                ? this.formatedCap(item.minRaised, true)
                : item.minContributorCount
            ),
          },
        ],
      };
      if (type === "DOT") {
        option.legend.data = [
          "Maximum number of contributors",
          "Average number of contributors",
          "Minimum number of contributors",
        ];
        option.series[0].name = "Maximum number of contributors";
        option.series[1].name = "Average number of contributors";
        option.series[2].name = "Minimum number of contributors";
        option.tooltip = {
          trigger: "axis",
          formatter: function (params) {
            var tar1 = params[0];
            var tar2 = params[1];
            var tar3 = params[2];
            return (
              '<div class="option-rasie"><div class="option-rasie-title">' +
              tar1.axisValue +
              '</div><div class="option-rasie-con option-rasie-con1"><span>Maximum number of contributors</span><span class="value">' +
              tar1.data +
              'K</span></div><div class="option-rasie-con option-rasie-co2"><span>Average number of contributors</span><span class="value">' +
              tar2.data +
              'K</span></div><div class="option-rasie-con option-rasie-con3"><span>Minimum number of contributors</span><span class="value">' +
              tar3.data +
              "K</span></div></div>"
            );
          },
        };
      } else {
        option.legend.data = [
          "Maximum amount",
          "Average amount",
          "Minimum amount",
        ];
        option.series[0].name = "Maximum amount";
        option.series[1].name = "Average amount";
        option.series[2].name = "Minimum amount";
        option.tooltip = {
          trigger: "axis",
          formatter: function (params) {
            var tar1 = params[0];
            var tar2 = params[1];
            var tar3 = params[2];
            return (
              '<div class="option-rasie"><div class="option-rasie-title">' +
              tar1.axisValue +
              '</div><div class="option-rasie-con option-rasie-con1"><span>Maximum amount</span><span class="value">' +
              tar1.data +
              '</span></div><div class="option-rasie-con option-rasie-co2"><span>Average amount</span><span class="value">' +
              tar2.data +
              '</span></div><div class="option-rasie-con option-rasie-con3"><span>Minimum amount</span><span class="value">' +
              tar3.data +
              "</span></div></div>"
            );
          },
        };
      }
      const category = echarts.init(this.$refs[`${type}-category`]);
      category.setOption(option);
    },
  },
};
</script>

<style  lang='less' scoped>
.paraChainAnalytics {
  .crowdloanId {
    input {
      width: 1px;
      height: 1px;
      opacity: 0;
      border: none;
      outline: none;
    }
  }
  .copyImg {
    float: right;
    position: relative;
    top: 2px;
    left: -29px;
    &:active + .crowdloanId {
      background: #a9d1fe;
    }
  }
  .copyImg img {
    cursor: pointer;
    height: 17px;
    width: 17px;
  }
  .copyImg:hover::after {
    position: absolute;
    border-radius: 10px;
    display: inline-block;
    top: -45px;
    right: -20px;
    height: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2b2b2b;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    opacity: 0.9;
    color: rgba(255, 255, 255, 0.87);
    content: "Copy";
  }
  &-nav {
    text-align: left;
    margin-top: 8px;
    clear: both;
    overflow: hidden;
    span {
      float: left;
      display: inline-block;
      text-align: center;
      line-height: 32px;
      width: 104px;
      height: 32px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      border-radius: 6px 0px 0px 6px;
      font-size: 14px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: #595959;
      cursor: pointer;
      &:last-child {
        border-radius: 0px 6px 6px 0px;
      }
      &.act {
        color: #38cb98;
        border: 1px solid #38cb98;
      }
    }
  }
  &-line {
    padding: 24px;
    box-sizing: border-box;
    margin-top: 16px;
    background: #fff;
    height: 428px;
    position: relative;
    .title {
      margin: 0;
      padding: 0;
      top: 24px;
      left: 24px;
      position: absolute;
      text-align: left;
      line-height: 32px;
      font-size: 24px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: rgba(41, 40, 40, 0.8);
    }
    div {
      width: 100%;
      height: 100%;
    }
  }
  &-category {
    padding: 24px;
    box-sizing: border-box;
    margin-top: 32px;
    background: #fff;
    height: 418px;
    position: relative;
    .title {
      margin: 0;
      padding: 0;
      top: 24px;
      left: 24px;
      position: absolute;
      text-align: left;
      line-height: 32px;
      font-size: 24px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: rgba(41, 40, 40, 0.8);
    }
    div {
      width: 100%;
      height: 100%;
    }
  }

  &-list {
    margin-top: 21px;
    padding: 24px;
    background: #fff;
    .title {
      margin: 0;
      padding: 0 24px;
      text-align: left;
      line-height: 32px;
      font-size: 24px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: rgba(41, 40, 40, 0.8);
    }
    div {
      /deep/ th:nth-child(3) .cell,
      /deep/ th:nth-child(4) .cell,
      /deep/ th:nth-child(5) .cell {
        text-align: left;
      }
      /deep/ td:nth-child(1) .cell {
        clear: both;
      }
      /deep/ td:nth-child(2) .cell {
        margin-left: 25px;
      }
      /deep/ th:nth-child(5) .cell {
        margin-left: 0;
      }
      margin-top: 24px;
      width: 100%;
      height: 100%;
      .contributionDetail .el-table tr th .cell {
        color: rgba(000, 000, 000, 0.3) !important;
        font-weight: bold;
      }

      /deep/ tr td .cell {
        color: rgba(41, 40, 40, 0.6);
      }

      /deep/ tr td:nth-child(1) .cell {
        font-weight: 500;
        margin-left: 16px;
        color: rgba(41, 40, 40, 0.8);
      }

      /deep/ tr th {
        background: #fff;
        padding: 0;
        border-bottom: none;
        padding-bottom: 16px;
      }
      /deep/ tr td {
        border-bottom: none;
        padding: 18.5px 0 !important;
      }
      /deep/ .cell {
        padding: 0;
      }
      /deep/ .el-table__body {
        border-spacing: 0 !important;
      }
      /deep/ tr:nth-child(2n) {
        background-color: #f5f7f9;
      }
    }
  }
}
</style>
<style  lang='less'>
.option-rasie {
  &-title {
    text-align: center;
  }
  &-con {
    text-align: left;
    clear: both;
    &::before {
      content: "";
      width: 10px;
      height: 10px;
      display: inline-block;
      margin-right: 5px;
      border-radius: 50%;
      background: #91cc75;
      font-weight: bold;
    }
    span {
      margin-right: 20px;
      &.value {
        float: right;
      }
    }
    &1::before {
      background: #5470c6;
    }
    &2::before {
      background: #91cc75;
    }
    &3::before {
      background: #fac858;
    }
  }
}
</style>