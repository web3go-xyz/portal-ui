<template>
  <div class="content wallet-profiler-detail">
    <div class="head extend-2-side">
      <div v-show="ifWhiteTheme" class="common-back-title">
        <i class="el-icon-back" @click="$router.back()"></i>
        <span class="text">{{ query.walletAddress }}</span>
      </div>
      <div class="info-wrap">
        <div class="g-wrap">
          <div v-if="!ifWhiteTheme" class="head-back" @click="goBack">
            <span><i class="el-icon-back"></i>Back</span>
          </div>
          <div class="head-mian">
            <div class="left">
              <p class="stitle">Token</p>
              <div class="title">
                <span class="test">{{
                  walletAddressSimpleInfo.chainType
                }}</span>
              </div>
              <p class="stitle">Wallet Address</p>
              <p class="desc">
                <input id="walletAddress" v-model="query.walletAddress" />
                <span class="copyImg" @click="copy()"
                  ><img :src="copyImg" alt="" class="copy"
                /></span>
                <el-tooltip
                  v-for="l in walletAddressSimpleInfo.labels"
                  :key="l.labelName"
                  :content="getLabelDesciption(l.labelName)"
                  placement="top"
                >
                  <span class="tag">
                    {{ l.labelName }}
                  </span>
                </el-tooltip>
              </p>
            </div>
            <div class="right">
              <p class="stitle">Token Balance</p>
              <div class="title">
                <span class="test">{{
                  Number(walletAddressSimpleInfo.balance).toFixed(2)
                }}</span>
              </div>
              <p class="stitle">First trading time</p>
              <p class="desc">
                {{ walletAddressSimpleInfo.firstInDate | formatDate }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="g-wrap">
      <div class="transaction">
        <!-- 功能暂时隐藏 -->
        <!-- <el-date-picker
          class="date-picker"
          v-model="timeRange"
          type="datetimerange"
          range-separator=""
          size="mini"
          @change="doSearch"
        >
        </el-date-picker> -->
        <div class="transactionChart" ref="transactionChart"></div>
      </div>
      <div class="funds-list">
        <div class="funds-card-item">
          <div class="funds-card">
            <div class="chart-container">
              <div
                ref="incomingFundsChart"
                :style="{ width: '100%', height: '200px' }"
              ></div>
            </div>
          </div>
          <div class="direction-list">
            <div class="direction-card">
              <div class="direction-card-left">
                <img :src="cardIcon1" alt="" class="cardIcon" />
              </div>
              <div class="direction-card-right">
                <div class="value">
                  {{ inComingTransactionCount }}
                </div>
                <div class="title">Incoming Transaction Count</div>
              </div>
            </div>
            <div class="direction-card">
              <div class="direction-card-left">
                <img :src="cardIcon2" alt="" class="cardIcon" />
              </div>
              <div class="direction-card-right">
                <div class="value">
                  {{ inComingAddressCount }}
                </div>
                <div class="title">Incoming Address Count</div>
              </div>
            </div>
          </div>
        </div>
        <div class="funds-card-item">
          <div class="funds-card">
            <div class="direction-card-left">
              <span></span>
            </div>
            <div class="direction-card-right">
              <div class="chart-container">
                <div
                  ref="outgoingFundsChart"
                  :style="{ width: '100%', height: '200px' }"
                ></div>
              </div>
            </div>
          </div>
          <div class="direction-list">
            <div class="direction-card">
              <div class="direction-card-left">
                <img :src="cardIcon3" alt="" class="cardIcon" />
              </div>
              <div class="direction-card-right">
                <div class="value">
                  {{ outgoingTransactionCount }}
                </div>
                <div class="title">Outgoing Transaction Count</div>
              </div>
            </div>
            <div class="direction-card">
              <div class="direction-card-left">
                <img :src="cardIcon4" alt="" class="cardIcon" />
              </div>
              <div class="direction-card-right">
                <div class="value">
                  {{ outgoingAddressCount }}
                </div>
                <div class="title">Outgoing Address Count</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="data-table">
        <el-table
          :key="Math.random()"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          :data="walletAddressTransactionTableData"
          style="width: 100%"
        >
          <el-table-column
            label="Transaction Time"
            prop="transactionTimestamp"
            sortable
          >
            <template slot-scope="scope">
              <div class="row-transactionTimestamp">
                {{ scope.row.transactionTimestamp | formatDate }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Direction" prop="direction" sortable>
            <template slot-scope="scope">
              <div class="row-direction">
                {{ scope.row.direction == 1 ? "In" : "Out" }}
              </div>
            </template></el-table-column
          >
          <el-table-column prop="amount" label="Amount" sortable>
            <template slot-scope="scope">
              <div
                :class="[
                  scope.row.direction == 1
                    ? 'amount amount-in'
                    : 'amount amount-out',
                ]"
              >
                <i class="el-icon-plus" v-if="scope.row.direction == 1"></i>
                <i class="el-icon-minus" v-if="scope.row.direction == 2"></i>
                <div>
                  {{ scope.row.amount | amountFixed }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="balanceAtPresent" label="Balance At Present">
            <template slot-scope="scope">
              <div class="row-balanceAtPresent">
                {{ Number(scope.row.balanceAtPresent).toFixed(2) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { Decimal } from "decimal.js";
import wsService from "@/api/wallet-analysis";
import logoImg from "@/assets/images/logo.png";
import copyImg from "@/assets/images/copy.png";
import cardIcon1 from "@/assets/images/cardIcon1.png";
import cardIcon2 from "@/assets/images/cardIcon2.png";
import cardIcon3 from "@/assets/images/cardIcon3.png";
import cardIcon4 from "@/assets/images/cardIcon4.png";

export default {
  name: "WalletProfilerDetail",
  data() {
    return {
      ifWhiteTheme: false,
      labelDefList: [],
      copyImg,
      logoImg,
      cardIcon1,
      cardIcon2,
      cardIcon3,
      cardIcon4,
      msg: "Welcome to WalletProfilerDetail",
      loading: false,
      query: {
        walletAddress: "",
        chainType: "",
        contractAddress: "",
      },
      timeRange: [],
      walletAddressSimpleInfo: {},
      walletAddressTransactionTableData: [],

      transactionChartInstance: null,
      outgoingFundsChartInstance: null,
      incomingFundsChartInstance: null,

      inComingTransactionCount: 0,
      outgoingTransactionCount: 0,
      inComingAddressCount: 0,
      outgoingAddressCount: 0,

      addressTagList: [],
    };
  },
  mounted() {
    const bodyEl = document.querySelector("body");
    if (bodyEl.className.includes("white-theme")) {
      this.ifWhiteTheme = true;
    }
    var query = this.$route.query;

    this.resetTimeRange();

    this.initChart();

    this.query = query;
    Promise.all([this.getAddressTagList()]).then((res) => {
      console.log("Promise all");
      this.queryWalletAddressSimpleInfo(this.query);
      this.queryWalletAddressTransactions(this.query);
    });
    wsService.getLabelDefs().then((resp) => {
      if (resp && resp.list) {
        this.labelDefList = resp.list;
      }
    });
  },
  methods: {
    getLabelDesciption(name) {
      const obj = this.labelDefList.find((v) => v.name == name);
      if (obj) {
        return obj.description;
      }
      return "";
    },
    copy() {
      const copyEl = document.getElementById("walletAddress");
      copyEl.select(); // 选择对象
      document.execCommand("copy"); // 执行浏览器复制命令
    },
    doSearch() {
      this.queryWalletAddressSimpleInfo(this.query);
      this.queryWalletAddressTransactions(this.query);
    },
    goBack() {
      this.$router.back();
      // this.$router.push({
      //   name: "WalletProfiler",
      //   params: this.$route.params,
      // });
    },
    goHome() {
      this.$router.push({ name: "HomePage" });
    },
    resetTimeRange() {
      this.timeRange = [];
      var startTime = new Date().getTime() - 1000 * 60 * 60 * 24 * 365;
      this.timeRange.push(startTime);
      var endTime = new Date();
      this.timeRange.push(endTime);
    },
    queryWalletAddressSimpleInfo(query) {
      var self = this;

      var param = {
        chainType: query.chainType,
        contractAddress: query.contractAddress,
        walletAddressList: [query.walletAddress],
      };

      self.walletAddressSimpleInfo = {};
      wsService
        .getWalletAddressSimpleInfo(param)
        .then((resp) => {
          if (resp && resp.list && resp.list.length > 0) {
            self.walletAddressSimpleInfo = resp.list[0];
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },

    queryWalletAddressTransactions(query) {
      var self = this;

      var param = {
        chainType: query.chainType,
        contractAddress: query.contractAddress,
        walletAddress: query.walletAddress,
        transactionTimestampStart: self.getTimestamp(self.timeRange[0]),
        transactionTimestampEnd: self.getTimestamp(self.timeRange[1]),
      };
      self.loading = true;
      self.walletAddressTransactionTableData = [];
      wsService
        .getWalletAddressTransactionInfo(param)
        .then((resp) => {
          self.loading = false;
          if (resp && resp.list) {
            //TODO find top 10 transaction records instead of show all transactions
            self.walletAddressTransactionTableData = resp.list;
            self.updateTransactionChartOption(
              self.walletAddressTransactionTableData
            );

            self.updateFundsChartOption(self.walletAddressTransactionTableData);

            self.updateCountSummary(self.walletAddressTransactionTableData);
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },
    getTimestamp(d) {
      var date = new Date(d);
      // debugger;
      var ts = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()
      );
      return Math.round(ts / 1000, 0);
    },

    initChart() {
      this.transactionChartInstance = echarts.init(this.$refs.transactionChart);

      this.incomingFundsChartInstance = echarts.init(
        this.$refs.incomingFundsChart
      );

      this.outgoingFundsChartInstance = echarts.init(
        this.$refs.outgoingFundsChart
      );
    },
    updateTransactionChartOption(transactionData) {
      var dateGroup = [];
      var balanceGroup = [];

      for (let index = 0; index < transactionData.length; index++) {
        const trans = transactionData[index];
        dateGroup.push(
          this.$options.filters["formatDate"](trans.transactionTimestamp)
        );
        balanceGroup.push(
          this.$options.filters["balanceFixed"](trans.balanceAtPresent)
        );
      }
      this.transactionChartInstance.setOption({
        title: {
          left: 20,
          text: "Token Balance Over Time",
          textStyle: {
            color: this.ifWhiteTheme ? "rgba(41, 40, 40, 0.8)" : "#fff",
          },
        },
        grid: {
          left:25,
          right:25,
          bottom:30,
          containLabel: true,
        },
        tooltip: {
          formatter: function (val) {
            return `
            ${val.name}<br/>
            ${val.marker} ${
              val.seriesName
            }  <span style="font-weight: bold;color: rgba(41, 40, 40, 0.8);">${val.value.toFixed(
              2
            )} MOVR</span>
            `;
          },
        },
        xAxis: {
          data: dateGroup,
        },
        yAxis: {
          splitLine: { show: false },
        },
        series: [
          {
            name: "balance",
            type: "line",
            data: balanceGroup,
            itemStyle: {
              color: "#17c684",
            },
          },
        ],
      });
    },
    updateFundsChartOption(transactionData) {
      var inComingAddressMap = {};
      var outgoingAddressMap = {};
      var self = this;
      transactionData.forEach((t) => {
        let addressMark = "";
        if (t.direction == 1) {
          // debugger;
          this.inComingTransactionCount++;
          addressMark = self.getAddressMark(t.from);
          if (inComingAddressMap[addressMark]) {
            inComingAddressMap[addressMark] = inComingAddressMap[
              addressMark
            ].add(new Decimal(t.amount));
          } else {
            inComingAddressMap[addressMark] = new Decimal(t.amount);
          }
        }
        if (t.direction == 2) {
          this.outgoingTransactionCount++;

          addressMark = self.getAddressMark(t.to);
          if (outgoingAddressMap[addressMark]) {
            outgoingAddressMap[addressMark] = outgoingAddressMap[
              addressMark
            ].add(new Decimal(t.amount));
          } else {
            outgoingAddressMap[addressMark] = new Decimal(t.amount);
          }
        }
      });

      var dataGroup4incoming = [];
      for (const key in inComingAddressMap) {
        dataGroup4incoming.push({
          name: key,
          value: inComingAddressMap[key].toNumber(),
        });
      }

      var dataGroup4outgoing = [];
      for (const key in outgoingAddressMap) {
        dataGroup4outgoing.push({
          name: key,
          value: outgoingAddressMap[key].toNumber(),
        });
      }
      this.incomingFundsChartInstance.setOption({
        color: [
          "rgba(234, 234, 234, 1)",
          "rgba(255, 86, 48, 1)",
          "rgba(255, 171, 0, 1)",
          "rgba(91, 127, 255, 1)",
        ],
        title: {
          text: "Incoming Funds",
          textStyle: {
            color: "rgba(41, 40, 40, 0.8)",
          },
          left: "50%",
          top: 30,
        },
        tooltip: { trigger: "item" },
        legend: {
          top: "35%",
          left: "50%",
          orient: "vertical",
          textStyle: {
            color: this.ifWhiteTheme ? "rgba(41, 40, 40, 0.8)" : "#fff",
          },
        },
        series: [
          {
            center: ["20%", "50%"],
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "13",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: dataGroup4incoming,
          },
        ],
      });

      this.outgoingFundsChartInstance.setOption({
         color: [
          "rgba(234, 234, 234, 1)",
          "rgba(255, 86, 48, 1)",
          "rgba(255, 171, 0, 1)",
          "rgba(91, 127, 255, 1)",
        ],
        title: {
          text: "Outgoing Funds",
          textStyle: {
            color: "rgba(41, 40, 40, 0.8)",
          },
          left: "50%",
          top: 30,
        },
        tooltip: { trigger: "item" },
        legend: {
          top: "35%",
          left: "50%",
          orient: "vertical",
          textStyle: {
            color: this.ifWhiteTheme ? "rgba(41, 40, 40, 0.8)" : "#fff",
          },
        },
        series: [
          {
            center: ["20%", "50%"],
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "13",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: dataGroup4outgoing,
          },
        ],
      });
    },

    updateCountSummary(transactionData) {
      if (transactionData) {
        this.inComingAddressCount = 0;
        this.outgoingAddressCount = 0;

        var inComingAddressMap = {};
        var outgoingAddressMap = {};

        transactionData.forEach((t) => {
          if (t.direction == 1) {
            inComingAddressMap[t.from] = 1;
          }
          if (t.direction == 2) {
            outgoingAddressMap[t.to] = 1;
          }
        });

        this.inComingAddressCount = 0;
        for (const key in inComingAddressMap) {
          this.inComingAddressCount++;
        }

        this.outgoingAddressCount = 0;
        for (const key in outgoingAddressMap) {
          this.outgoingAddressCount++;
        }
      }
    },

    getAddressMark(address) {
      if (this.addressTagList && this.addressTagList.length > 0) {
        for (let index = 0; index < this.addressTagList.length; index++) {
          const element = this.addressTagList[index];
          if (element.address == address) {
            return element.addressTag;
          }
        }
      }
      return "Unknown";
    },
    getAddressTagList() {
      var self = this;
      return wsService.getAddressTagList().then((resp) => {
        if (resp && resp.list) {
          self.addressTagList = resp.list;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.head {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
  height: 283px;
  background: #181818;
}
.head-back {
  padding: 48px 0;
}
.head-back span {
  cursor: pointer;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.87);
}
.head-back span i {
  margin-right: 5px;
}
.head-back span:hover {
  color: #17c684;
}
.head-mian {
  display: flex;
}
.head-mian > div {
  flex: 1;
}
.head-mian > .left {
  margin-right: 10px;
}
.head .stitle {
  color: rgba(255, 255, 255, 0.38);
  font-size: 12px;
  margin: 0;
}
.head .test {
  color: rgba(255, 255, 255, 0.87);
  font-size: 40px;
  font-family: Rubik-Bold, Rubik;
  font-weight: bold;
}
.head .tag {
  margin-left: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  padding: 5px 12px;
  background: #2b2b2b;
  border-radius: 6px;
}
.head .desc {
  margin: 0;
  font-size: 14px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
}
.head .desc img {
  width: 16px;
  cursor: pointer;
  height: 16px;
}
.head .desc .copyImg {
  position: relative;
  top: 2px;
  left: 4px;
}
.head .desc .copyImg:hover::after {
  position: absolute;
  border-radius: 10px;
  display: inline-block;
  top: -45px;
  right: -20px;
  width: 50px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2b2b2b;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.87);
  content: "Copy";
}
#walletAddress {
  background: none;
  border: none;
  font-size: 14px;
  width: 324px;
  padding: 0;
  margin: 0;
  outline: none;
  color: rgba(255, 255, 255, 0.6);
}
.head .title {
  margin-top: 9px;
  margin-bottom: 9px;
  height: 48px;
  display: flex;
  align-items: center;
}
.transaction {
  width:100%;
  margin-top: 48px;
  position: relative;
}
/deep/ .transaction .el-date-editor {
  position: absolute;
  z-index: 100;
  right: 0;
  top: 0;
}
.transactionChart {
  width: 100% !important;
  height: 400px;
  left: 0 !important;
}
.header .item {
  display: block;
  text-align: left;
  padding: 0px 20px;
}
.item .label {
  color: lightgray;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 10px;
  line-height: 25px;
}
.item .value {
  color: white;
  margin-left: 10px;
  line-height: 35px;
  font-size: 1.2rem;
}

.data-table {
  margin-top: 20px;
}

.card-list {
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: space-between;
}
.card-list .card {
  padding: 20px 0px 20px;
  background-color: #173143;
  width: 32%;
}
.card-list .card .label {
  color: lightgray;
  font-size: 0.8rem;
  font-weight: bold;
  line-height: 25px;
}
.card-list .card .value {
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  line-height: 35px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.card-list .card .value .label-tag {
  font-size: 0.8rem;
  font-weight: normal;
  padding: 4px 6px;
  background: gray;
  width: fit-content;
  border-radius: 5px;
  line-height: initial;
  /* float: left; */
  margin-right: 5px;
  margin-bottom: 3px;
}
.card-list .card .value.balance {
  font-size: 2.5rem;
}
.card-list .card .value.firstInDate {
  font-size: 1.2rem;
}

.funds-list {
  display: flex;
  margin-top: 24px;
  margin-bottom: 24px;
  justify-content: space-between;
}
.funds-card-item {
  flex: 1;
  border-radius: 6px;
  padding: 40px;
  box-sizing: border-box;
  &:first-child {
    margin-right: 24px;
  }
}
.funds-list .funds-card {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 40px;
  background-color: #173143;
  border-radius: 6px;
}
.funds-list .funds-card .title {
  color: white;
  text-align: left;
  padding-left: 10px;
}
.funds-list .funds-card .chart-container {
}

.direction-list {
  display: flex;
  padding-top: 40px;
  justify-content: space-between;
}
.amount {
  display: flex;
  align-items: baseline;
}
.amount.amount-in {
  color: #17c684;
  padding-right: 5px;
}
.amount.amount-out {
  color: #ea3943;
  padding-right: 5px;
}
.funds-list .funds-card {
  background: #181818;
}
.direction-list .direction-card {
  background: #181818;
}
.funds-card-item {
  background: #181818;
}
.direction-card {
  display: flex;
  align-items: center;
  height: 40px;
}
.direction-card-left {
  width: 40px;
  margin-right: 12px;
}
.direction-card-right {
  text-align: left;
  flex: 1;
}
.direction-card-right .value {
  margin-bottom: 4px;
  font-size: 18px;
  font-family: Rubik-Medium, Rubik;
  color: rgba(255, 255, 255, 0.87);
}
.direction-card-right .title {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.38);
}
.data-table {
  padding-bottom: 90px;
}
.row-transactionTimestamp {
  color: rgba(255, 255, 255, 0.87);
}
.row-direction {
  color: rgba(255, 255, 255, 0.6);
}
.row-balanceAtPresent {
  color: rgba(255, 255, 255, 0.6);
}
/deep/ .el-table td .cell {
  padding-left: 10px;
}
/deep/ .el-range-editor .el-range-input {
  background-color: #111;
}
/deep/ .el-table tr:nth-child(2n) {
  background-color: #111;
}
/deep/ .el-range-input {
  font-size: 14px;
}
.cardIcon {
  width: 16px;
  height: 16px;
  border: 12px solid #2b2b2b;
  border-radius: 12px;
}
body.white-theme .wallet-profiler-detail {
  .info-wrap {
    margin-top: 24px;
    padding-bottom: 24px;
    background-image: url("~@/assets/images/top-bg.png");
    background-size: cover;
    background-position: center;
  }
  .head {
    height: auto;
    background: transparent;
  }
  .head-back span {
    color: #17c684;
  }
  .head-back span:hover {
    opacity: 0.8;
  }
  .head .stitle {
    color: rgba(41, 40, 40, 0.6);
  }
  .head .test {
    color: rgba(41, 40, 40, 1);
  }
  .head .tag {
    color: rgba(41, 40, 40, 1);
    background: rgba(225, 231, 237, 0.8);
  }
  .head .desc {
    color: rgba(41, 40, 40, 0.8);
  }
  #walletAddress {
    color: rgba(41, 40, 40, 0.8);
  }
  .funds-card-item {
    background: white;
  }
  .funds-list .funds-card {
    background: white;
  }
  .direction-list .direction-card {
    background: white;
  }
  .funds-card-item {
    background: white;
  }
  .funds-list .funds-card .title {
    color: rgba(41, 40, 40, 0.8);
    font-weight: bold;
  }
  .cardIcon {
    border: 12px solid rgba(236, 246, 242, 1);
  }
  .direction-card-right .value {
    color: rgba(41, 40, 40, 1);
  }
  .direction-card-right .title {
    color: rgba(41, 40, 40, 0.6);
  }
  .data-table /deep/ .el-table tr:nth-child(2n) {
    background-color: #f5f7f9;
  }
  .transaction {
    margin-top: 24px;
    border-radius: 6px;
    background: white;
    padding: 28px 0px;
    padding-bottom: 0;
  }
  .row-transactionTimestamp {
    color: rgba(41, 40, 40, 0.8);
  }
  .row-direction {
    color: rgba(41, 40, 40, 0.8);
  }
  .row-balanceAtPresent {
    color: rgba(41, 40, 40, 0.8);
  }
  @media screen and (max-width: 1440px) {
    .common-back-title {
      margin-left: 100px;
      margin-right: 100px;
    }
  }
  @media screen and (min-width: 1440px) {
    .common-back-title {
      margin-left: 12vw;
      margin-right: 12vw;
    }
  }
}
</style>
