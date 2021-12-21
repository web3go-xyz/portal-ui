<template>
  <div class="content paraChainProfiler">
    <div class="common-back-title">
      <div class="g-wrap">
        <i class="el-icon-back" @click="$router.back()"></i>
        <span class="text"
          >{{ parachainCrowdloanChainType }} &nbsp;crowdloan</span
        >
        <div class="share-wrap">
          <img
            title="Share to Twitter"
            @click="handleShare('twitter')"
            src="@/assets/images/twitter@2x.png"
            alt=""
          />
          <img
            title="Capture snapshot"
            @click="handleShare('download')"
            src="@/assets/images/download@2x.png"
            alt=""
          />
        </div>
      </div>
    </div>

    <div class="g-wrap">
      <div class="nav">
        <div class="nav-left">
          <span
            class="tab-item"
            :class="{ act: tabType === 'On-going' }"
            @click="switchTab('On-going')"
            >On-going</span
          >
          <span
            v-show="true"
            class="tab-item"
            :class="{ act: tabType === 'History' }"
            @click="switchTab('History')"
            >History</span
          >
          <span
            v-show="true"
            class="tab-item"
            :class="{ act: tabType === 'Analytics' }"
            @click="switchTab('Analytics')"
            >Analytics</span
          >
        </div>
        <div class="nav-right"></div>
      </div>
    </div>
    <div class="g-wrap">
      <div class="data-table" v-if="tabType === 'On-going'">
        <div class="choose-history-block"></div>
        <el-table
          id="to-img-div"
          ref="table"
          v-loading="loading"
          :element-loading-text="'loading '"
          element-loading-spinner="el-icon-loading"
          :data="onGoingParaChainCrowdloanTableData"
          style="width: 100%"
        >
          <el-table-column label="Parachain" width="315">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.description" placement="top">
                <div
                  class="row-crowdloanId"
                  @click="viewContributionDetail(scope.row)"
                >
                  <img :src="scope.row.iconPath" />
                  <div class="paraId">{{ scope.row.paraId }}</div>
                  <div class="parachainName">{{ scope.row.parachainName }}</div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn"
            label="Lease"
            width="75"
            align="right"
          >
            <template slot-scope="scope">
              <div class="row-firstLease">
                {{ scope.row.firstLease }} - {{ scope.row.lastLease }}
              </div>
            </template></el-table-column
          >

          <el-table-column
            :class-name="showTableColumn ? '' : 'column-left'"
            align="right"
            label="Raised / Cap"
            sortable
            :sort-method="sortRaised"
          >
            <template slot-scope="scope">
              <div class="row-raised-cap">
                <el-progress
                  color="#17c684"
                  type="circle"
                  :width="40"
                  :stroke-width="8"
                  :text-inside="true"
                  :percentage="scope.row.percentage"
                ></el-progress>
                <span class="percentage">{{ scope.row.percentageText }}</span>
                <span class="formatedRaisedCap">{{
                  scope.row.formatedRaisedCap
                }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-if="showTableColumn"
            label="Expiration"
            align="left"
            width="180"
          >
            <template slot-scope="scope">
              <div class="row-expiration">
                Block: {{ scope.row.expirationBlock }}
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="showTableColumn" label="Status" width="100">
            <template slot-scope="scope">
              <div class="row-status">
                {{ scope.row.status }}
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="showTableColumn" label="" width="100">
            <template slot-scope="scope">
              <div
                class="row-button"
                @click="viewContributionDetail(scope.row)"
              >
                view <i class="el-icon-back"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="data-table" v-if="tabType === 'History'">
        <div class="choose-history-block">
          <el-select
            v-model="activeHistoryRoundIndex"
            placeholder=""
            @change="refreshData(activeHistoryRound)"
          >
            <el-option
              v-for="item in historyBlockList"
              :key="item.roundIndex"
              :label="item.label"
              :value="item.roundIndex"
            >
            </el-option>
          </el-select>
        </div>
        <el-table
          ref="table"
          id="to-img-div"
          :key="Math.random()"
          v-loading="loading"
          element-loading-text="loading "
          element-loading-spinner="el-icon-loading"
          :data="paraChainCrowdloanTableData"
          style="width: 100%"
        >
          <el-table-column label="Parachain" width="315">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.description" placement="top">
                <div
                  class="row-crowdloanId"
                  @click="viewContributionDetail(scope.row)"
                >
                  <img :src="scope.row.iconPath" />
                  <div class="paraId">{{ scope.row.paraId }}</div>
                  <div class="parachainName">{{ scope.row.parachainName }}</div>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showTableColumn"
            label="Lease"
            width="75"
            align="right"
          >
            <template slot-scope="scope">
              <div class="row-firstLease">
                {{ scope.row.firstLease }} - {{ scope.row.lastLease }}
              </div>
            </template></el-table-column
          >

          <el-table-column
            :class-name="showTableColumn ? '' : 'column-left'"
            align="left"
            label="Raised / Cap"
            sortable
            :sort-method="sortRaised"
          >
            <template slot-scope="scope">
              <div class="row-raised-cap">
                <el-progress
                  color="#17c684"
                  type="circle"
                  :width="40"
                  :stroke-width="8"
                  :text-inside="true"
                  :percentage="scope.row.percentage"
                ></el-progress>
                <div class="percentage">{{ scope.row.percentageText }}</div>
                <div class="formatedRaisedCap">
                  {{ scope.row.formatedRaisedCap }}
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-if="showTableColumn"
            label="Expiration"
            align="left"
            width="180"
          >
            <template slot-scope="scope">
              <div class="row-expiration">
                Block: {{ scope.row.expirationBlock }}
              </div>
            </template>
          </el-table-column>

          <el-table-column v-if="showTableColumn" label="Status" width="100">
            <template slot-scope="scope">
              <div class="row-status">
                {{ scope.row.status }}
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="showTableColumn" label="" width="100">
            <template slot-scope="scope">
              <div
                class="row-button"
                @click="viewContributionDetail(scope.row)"
              >
                view <i class="el-icon-back"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <ParaChainAnalytics v-if="tabType === 'Analytics'" />
    </div>
  </div>
</template>

<script>
import service from "@/api/paraChain-analysis-polkadot";
import utils from "@/utils";
import ParaChainAnalytics from "./Analytics.vue";
export default {
  name: "ParaChainProfiler",
  data() {
    return {
      parachainCrowdloanTitle: "Polkadot",
      showTableColumn: true,
      tabType: "On-going",
      timeRange: [],
      tokenRatio: 1000 * 1000 * 1000 * 10,
      paraChainList: [],
      paraChainCrowdloanTableData: [],
      onGoingParaChainCrowdloanTableData: [],
      query: {},

      loading: false,

      polkParaChainRoundList: [],
      onGoingRound: 0,
      activeHistoryRoundIndex: 0,
      historyBlockList: [],

      refreshInterval: {},
    };
  },
  components: {
    ParaChainAnalytics,
  },
  computed: {
    activeHistoryRound() {
      let self = this;
      for (let index = 0; index < self.polkParaChainRoundList.length; index++) {
        let round = self.polkParaChainRoundList[index];
        if (round.roundIndex === self.activeHistoryRoundIndex) {
          return round;
        }
      }
      return {};
    },
  },
  created() {
    let self = this;
    console.log(self.$route);
    if (self.$route && self.$route.query) {
      self.parachainCrowdloanChainType = self.$route.query.chainType;
    }
  },
  mounted() {
    var self = this;
    if (self.$route.params.paramsOnPage) {
      var paramsOnPage = self.$route.params.paramsOnPage;
      self.query = paramsOnPage;
    }
    Promise.all([
      self.getParaChainList(),
      service.getPolkParaChainRoundList(),
    ]).then((res) => {
      self.polkParaChainRoundList = res[1];

      if (self.polkParaChainRoundList.length > 0) {
        for (
          let index = 0;
          index < self.polkParaChainRoundList.length;
          index++
        ) {
          let round = self.polkParaChainRoundList[index];
          if (round.ongoing === 1 || round.ongoing === true) {
            self.onGoingRound = round;
            self.refreshOnGoingData(self.onGoingRound);

            self.refreshInterval = setInterval(() => {
              self.refreshOnGoingData(self.onGoingRound);
            }, 60 * 1000);
            break;
          }
        }
      }
      if (self.polkParaChainRoundList.length > 0) {
        self.historyBlockList = [];
        for (
          let index = 0;
          index < self.polkParaChainRoundList.length;
          index++
        ) {
          let round = self.polkParaChainRoundList[index];
          if (round.ongoing === 0 || round.ongoing === false) {
            round.label =
              round.description + " (Round " + round.roundIndex + ")";
            self.historyBlockList.push(round);
          }
        }

        if (self.historyBlockList.length > 0) {
          self.historyBlockList.reverse();
          let activeHistoryRound = self.historyBlockList[0];
          self.activeHistoryRoundIndex = activeHistoryRound.roundIndex;
          self.refreshData(activeHistoryRound);
        }
      }
    });
  },
  destroyed() {
    let self = this;
    if (self.refreshInterval) {
      clearInterval(self.refreshInterval);
    }
  },
  methods: {
    handleShare(key) {
      this.showTableColumn = false;
      this.$nextTick(() => {
        const el = document.querySelector("#to-img-div");
        utils
          .html2Img(el, () => {
            this.showTableColumn = true;
          })
          .then(({ address, base64 }) => {
            let title;
            if (this.tabType === "On-going") {
              title =
                "Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go";
            } else if (this.tabType === "History") {
              title =
                "Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go";
            }
            if (key == "twitter") {
              utils.share(
                "https://web3go.xyz/#/ParaChainProfiler4Polkadot?chainType=Polkadot",
                address,
                title
              );
            } else if (key == "download") {
              utils.downloadFile(base64, title);
            }
          });
      });
    },
    switchTab(type) {
      this.tabType = type;
    },
    sortRaised(a, b) {
      return a.raised > b.raised;
    },
    doSearch() {},
    viewContributionDetail(row) {
      this.$router.push({
        name: "ParaChainCrowdloanContributionDetail4Polkadot",
        query: {
          crowdloanId: row.crowdloanId,
          lastUpdateTime: row.lastUpdateTime,
          projectName: row.projectName,
          iconPath: row.iconPath,
          chainType: self.parachainCrowdloanChainType,
        },
        params: {
          paramsOnPage: this.query,
        },
      });
    },
    formatedRaisedCap(row) {
      let formatedCap = row.cap;
      let formatedRaised = row.raised;
      let mRange = 1000000;
      let kRange = 1000;

      let precision_cap = 1;
      let precision_percentage = 2;
      let precision_raised = 3;

      formatedCap = formatedCap / this.tokenRatio;
      formatedRaised = formatedRaised / this.tokenRatio;
      let percentage = (formatedRaised / formatedCap) * 100;
      percentage = percentage.toFixed(precision_percentage);
      row.percentage = parseFloat(percentage);
      row.percentageText = `${
        parseFloat(percentage) > 100 ? 100 : parseFloat(percentage)
      }%`;
      if (formatedCap >= mRange) {
        formatedCap = (formatedCap / mRange).toFixed(precision_cap) + "m";
      } else {
        formatedCap = (formatedCap / kRange).toFixed(precision_cap) + "k";
      }

      if (formatedRaised >= mRange) {
        formatedRaised =
          (formatedRaised / mRange).toFixed(precision_raised) + "m";
      } else {
        formatedRaised =
          (formatedRaised / kRange).toFixed(precision_raised) + "k";
      }
      return formatedRaised + " / " + formatedCap + " DOT";
    },
    formatedCap(row) {
      let formatedCap = row.cap;
      let mRange = 1000000;
      let kRange = 1000;
      let precision_cap = 1;
      formatedCap = formatedCap / this.tokenRatio;
      if (formatedCap >= mRange) {
        formatedCap =
          +(formatedCap / mRange).toFixed(precision_cap).toString() + "m";
      } else {
        formatedCap =
          +(formatedCap / kRange).toFixed(precision_cap).toString() + "k";
      }
      return formatedCap;
    },
    getParachainDescription(row) {
      let parachainId = this.getParachainId(row);
      if (parachainId) {
        if (this.paraChainList) {
          let findName = "";
          for (let index = 0; index < this.paraChainList.length; index++) {
            const element = this.paraChainList[index];
            if (element.paraId == parachainId) {
              findName = element.projectName;
              break;
            }
          }
          return parachainId + " " + findName + " " + row.crowdloanId;
        }
      }
      return "";
    },
    getprojectName(row) {
      let parachainId = this.getParachainId(row);
      let projectName = "";
      if (parachainId) {
        if (this.paraChainList) {
          for (let index = 0; index < this.paraChainList.length; index++) {
            const element = this.paraChainList[index];
            if (element.paraId == parachainId) {
              projectName = element.projectName;
              break;
            }
          }
        }
      }
      return projectName;
    },
    getlastUpdateTime(row) {
      let parachainId = this.getParachainId(row);
      let lastUpdateTime = "";
      if (parachainId) {
        if (this.paraChainList) {
          for (let index = 0; index < this.paraChainList.length; index++) {
            const element = this.paraChainList[index];
            if (element.paraId == parachainId) {
              lastUpdateTime = element.lastUpdateTime;
              break;
            }
          }
        }
      }
      return lastUpdateTime;
    },
    getParachainNameIcon(row) {
      let nameIcon = { parachainName: "", iconPath: "" };
      let parachainId = this.getParachainId(row);
      if (parachainId) {
        if (this.paraChainList) {
          let findIcon = "";
          for (let index = 0; index < this.paraChainList.length; index++) {
            const element = this.paraChainList[index];
            if (element.paraId == parachainId) {
              findIcon = element.icon;
              nameIcon.parachainName = element.projectName;
              break;
            }
          }
          if (!findIcon) {
            findIcon = "unknown.svg";
          }
          nameIcon.iconPath = "static/parachain-icon/" + findIcon;
        }
      }
      return nameIcon;
    },
    getParachainId(row) {
      if (row && row.crowdloanId) {
        let array = row.crowdloanId.split("-");
        if (array.length > 0) {
          return array[0];
        }
      }
      return "";
    },
    goHome() {
      this.$router.push({ name: "HomePage" });
    },

    getParaChainList() {
      var self = this;
      return service.getPolkParaChainList().then((resp) => {
        if (resp && resp.list) {
          self.paraChainList = resp.list;
        }
      });
    },

    refreshOnGoingData(param) {
      var self = this;
      self.onGoingParaChainCrowdloanTableData = [];
      self.loading = true;
      service
        .getPolkParaChainCrowdloanList({
          expirationBlocks: param.expirationBlocks,
        })
        .then((resp) => {
          self.loading = false;
          if (resp) {
            self.onGoingParaChainCrowdloanTableData = resp.list;
            self.onGoingParaChainCrowdloanTableData.forEach((row) => {
              let nameIcon = self.getParachainNameIcon(row);
              row.parachainName = nameIcon.parachainName;
              row.iconPath = nameIcon.iconPath;
              row.lastUpdateTime = self.getlastUpdateTime(row);
              row.projectName = self.getprojectName(row);
              row.description = self.getParachainDescription(row);
              row.paraId = self.getParachainId(row);
              row.formatedRaisedCap = self.formatedRaisedCap(row);
              row.formatedCap = self.formatedCap(row);
            });
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },
    refreshData(param) {
      var self = this;
      self.paraChainCrowdloanTableData = [];
      self.loading = true;
      service
        .getPolkParaChainCrowdloanList({
          expirationBlocks: param.expirationBlocks,
        })
        .then((resp) => {
          self.loading = false;
          if (resp) {
            self.paraChainCrowdloanTableData = resp.list;
            self.paraChainCrowdloanTableData.forEach((row) => {
              let nameIcon = self.getParachainNameIcon(row);
              row.parachainName = nameIcon.parachainName;
              row.iconPath = nameIcon.iconPath;
              row.lastUpdateTime = self.getlastUpdateTime(row);
              row.projectName = self.getprojectName(row);
              row.description = self.getParachainDescription(row);
              row.paraId = self.getParachainId(row);
              row.formatedRaisedCap = self.formatedRaisedCap(row);
              row.formatedCap = self.formatedCap(row);
            });
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },

    gotoDetail(row) {
      //pass the query params for goBack
      this.$router.push({
        name: "ParaChainCrowdloanContributionDetail",
        query: {
          crowdloanId: row.crowdloanId,
        },
        params: {
          paramsOnPage: this.query,
        },
      });
    },
  },
};
</script>
<style lang='less'>
.paraChainProfiler {
  .back {
    widows: 100%;
    height: 60px;
    background: #ffffff;
  }
  .el-table .cell {
    padding-right: 0;
  }
  th {
    text-align: left;
  }
  th:nth-child(1) .cell {
    text-align: left;
    margin-left: 24px;
  }
  th:nth-child(2) .cell {
    text-align: center;
  }
  th:nth-child(3) .cell {
    text-align: center;
  }
  th:nth-child(4) .cell {
    text-align: left;
    padding-left: 20px!important;
  }
  th:nth-child(5) .cell {
    text-align: left;
    padding-left:0!important;
  }
  th.column-raise .cell {
    text-align: right !important;
  }
  th.column-left .cell {
    text-align: left !important;
    padding-left: 72px !important;
  }

  th:nth-child(5) .cell {
    // margin-left: 72px;
  }
}
.paraChainProfiler .nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
}
.paraChainProfiler .nav-left {
}
.paraChainProfiler .nav-left {
  display: flex;
}
.paraChainProfiler .nav-left .tab-item {
  margin-right: 40px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  font-family: Rubik-Regular, Rubik;
  color: rgba(41, 40, 40, 0.7);
  line-height: 22px;
}
.paraChainProfiler .nav-left .tab-item.act,
.paraChainProfiler .nav-left .tab-item:hover {
  color: #17c684;
  position: relative;
}
.paraChainProfiler .nav-left .tab-item.act::after {
  position: absolute;
  top: 30px;
  width: 80%;
  content: "";
  display: inline-block;
  height: 2px;
  left: 10%;
  background: #17c684;
  border-radius: 2px;
}
.paraChainProfiler .nav-right {
  display: flex;
  align-items: center;
}
.paraChainProfiler .nav-right .title {
  font-size: 14px;
  font-family: Rubik-Regular, Rubik;
  color: rgba(255, 255, 255, 0.45);
}
.paraChainProfiler .nav-right .date-picker {
  width: 402px;
  height: 40px;
}
.paraChainProfiler .nav-right .nav-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 136px;
  height: 40px;
  background: #323232;
  border-radius: 6px;
}
.paraChainProfiler .nav-right .nav-switch .nav-switch-item {
  width: 59px;
  cursor: pointer;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  font-size: 16px;
  font-family: Rubik-Regular, Rubik;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.45);
}
.paraChainProfiler .nav-right .nav-switch .nav-switch-item.act {
  color: rgba(255, 255, 255, 0.85);
  background: #212121;
}
.paraChainProfiler .el-range-editor .el-range-input {
  background-color: #111;
}
.paraChainProfiler .el-date-table td.today span {
  color: #17c684;
}
.paraChainProfiler .el-button.is-disabled.is-plain,
.paraChainProfiler .el-button.is-disabled.is-plain:focus,
.el-button.is-disabled.is-plain:hover {
  background-color: #111;
}
.paraChainProfiler .row-button {
  justify-content: flex-end;
  display: flex;
  margin-right: 20px;
  align-items: center;
  cursor: pointer;
  color: #17c684;
}
.paraChainProfiler
  .white-theme
  .el-table--enable-row-hover
  .el-table__body
  tr:hover {
  box-shadow: 0px 18px 34px 0px rgba(41, 40, 40, 0.1);
}
.paraChainProfiler .row-button img {
  margin-left: 4px;
}
.paraChainProfiler .row-button:hover {
  color: #17c684;
}
.paraChainProfiler .row-button .el-icon-back {
  transform: rotate(180deg);
}
.paraChainProfiler .row-firstLease {
  color: rgba(41, 40, 40, 0.6);
}
.paraChainProfiler .row-lastLease {
  color: rgba(41, 40, 40, 0.6);
}
.paraChainProfiler .row-raise {
  text-align: right;
  color: rgba(41, 40, 40, 0.6);
}
.paraChainProfiler .row-raised-cap {
  color: rgba(41, 40, 40, 0.6);
  display: flex;
  align-items: center;
}
.paraChainProfiler .row-raised-cap .percentage {
  font-size: 16px;
  font-family: Rubik-Medium, Rubik;
  font-weight: 500;
  color: rgba(41, 40, 40, 0.6);
  margin-left: 10px;
  width: 80px;
}
.paraChainProfiler .row-raised-cap .formatedRaisedCap {
  width: 180px;
  text-align: right;
}

.paraChainProfiler .row-expiration {
  color: rgba(41, 40, 40, 0.6);
}
.paraChainProfiler .row-status {
  text-align: left;
  color: rgba(41, 40, 40, 0.6);
}
.paraChainProfiler .el-table td,
.paraChainProfiler .el-table th {
  padding: 0 !important;
}
.paraChainProfiler .el-table th > .cell {
  padding-left: 0;
  padding-right: 0;
}
.paraChainProfiler .el-table td .cell {
  padding: 10px 0;
}
.paraChainProfiler .el-progress-circle {
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.content {
}
.select-row {
  display: flex;
  color: white;
  line-height: 40px;
}
.select-row .select-title {
  font-size: 1.5rem;
  margin-right: 10px;
}

.data-table {
}

.row-firstLease {
  text-align: center;
}
.row-lastLease {
  text-align: center;
}
.row-raised-cap {
  justify-content: flex-end;
  display: flex;
}
.row-expiration {
  text-align: left;
  margin-left: 20px;
}

.row-crowdloanId {
  font-weight: bold;
  color: rgba(41, 40, 40, 0.8);
  display: flex;
  align-items: center;
  cursor: pointer;
}
.row-crowdloanId img {
  width: 24px;
  height: 24px;
  border-radius: 40px;
  margin-right: 5px;
  margin-left: 24px;
}
.row-crowdloanId paraId {
  margin-left: 5px;
}
.row-crowdloanId .parachainName {
  margin-left: 5px;
}

.choose-history-block {
  display: flex;
  justify-content: flex-end;
}
.choose-history-block .el-select {
  width: 300px;
}
.paraChainProfiler .share-wrap {
  margin-top: 4px;
  float: right;
  img {
    margin-left: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
}
</style>
