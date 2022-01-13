<template>
  <div class="content cdp-page">
    <div
      v-show="ifWhiteTheme"
      class="common-back-title"
      style="margin-left: -100px; margin-right: -100px"
    >
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">Karura</span>
    </div>
    <div class="search-filter">
      <div class="chainStatistic">
        <div>
          <div class="statistic-item clearfix">
            <div class="icon icon-total"></div>
            <div class="value">
              <div class="title">Total</div>
              <div class="value-formated">
                {{ statisticData.collateralFormat
                }}<span class="value-formated-unit">CDPS</span>
              </div>
            </div>
          </div>

          <div class="statistic-item clearfix">
            <div class="icon icon-debt"></div>
            <div class="value">
              <div class="title">Debt</div>
              <div class="value-formated">
                {{ statisticData.debitFormat }}
                <span class="value-formated-unit">KUSD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <el-input
          clearable
          class="cdp-search-filter-input"
          prefix-icon="el-icon-search"
          placeholder="Enter User Address"
          type="text"
          v-model="query.accountId"
          @keyup.enter.native="searchLoanPositionByAccountId"
        ></el-input>
      </div>
    </div>
    <div class="clear"></div>
    <div class="filter">
      <el-select
        @change="loadLoanPositionTable"
        v-model="query.filterStatus"
        multiple
        collapse-tags
        style="margin-left: 20px"
        placeholder="filter status"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-checkbox
        @change="loadLoanPositionTable"
        v-model="query.hideLoanCompleted"
        >Hide Loan Completed</el-checkbox
      >
    </div>
    <div class="cdp-list">
      <div class="cdp-list-header">
        <el-row>
          <el-col :span="10" align="left">ID</el-col>
          <el-col :span="4">Debt</el-col>
          <el-col :span="3">Collateral</el-col>
          <el-col :span="3">Ratio</el-col>
          <el-col :span="2">Status</el-col>
        </el-row>
      </div>
      <div class="cdp-list-content">
        <div
          class="lp-row"
          v-for="d in loanPositionTableData"
          :key="d.accountId"
        >
          <el-row>
            <el-col :span="10" align="left">
              <div class="accountId">
                <img
                  class="account-logo"
                  src="./../../assets/images/kusama-logo.png"
                />
                <!-- {{ d.accountId | shorterAddress }} -->
                <address-display :address="d.accountId"></address-display>
              </div>
            </el-col>
            <el-col :span="4"
              ><div class="debt">{{ d.debitFormat }} KUSD</div></el-col
            >
            <el-col :span="3"
              ><div class="collateral">
                {{ d.collateralFormat }} KSM
              </div></el-col
            >
            <el-col :span="3"
              ><div class="ratio" :class="getShowColor(d)">
                {{ d.ratioPercentage }} %
              </div></el-col
            >
            <el-col :span="2"
              ><div class="status" :class="getShowColor(d)">
                {{ d.status }}
              </div></el-col
            >
            <el-col :span="2"
              ><div class="view" @click="showLoanPositionDetail(d)">
                view &nbsp;<i class="el-icon-right"></i></div
            ></el-col>
          </el-row>
        </div>
      </div>
      <div class="cdp-list-pagination">
        <el-pagination
          background
          layout="prev, pager, next,sizes,jumper"
          :current-page.sync="query.pageIndex"
          :page-size.sync="query.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import css from "./cpd.less";
import cdpService from "@/api/cdp-analysis";
import { ss58transform } from "@/api/common";

import addressDisplay from "@/components/ui-elements/addressDisplay";
export default {
  name: "CDPProfiler",
  components: {
    addressDisplay,
  },
  data() {
    return {
      ifWhiteTheme: false,
      statusOptions: [
        { label: "Safe", value: "Safe" },
        { label: "Warning", value: "Warning" },
        { label: "Danger", value: "Danger" },
      ],
      msg: "Welcome to CDPProfiler",
      loading: false,
      query: {
        pageSize: 10,
        pageIndex: 1,
        accountId: "",
        hideLoanCompleted: false,
        filterStatus: ["Safe", "Warning", "Danger"],
      },
      statisticData: {},
      totalCount: 0,
      loanPositionTableData: [],
    };
  },
  computed: {},
  mounted() {
    const bodyEl = document.querySelector("body");
    if (bodyEl.className.includes("white-theme")) {
      this.ifWhiteTheme = true;
    }
    let self = this;
    if (self.$route.params.paramsOnPage) {
      var paramsOnPage = self.$route.params.paramsOnPage;
      self.query = paramsOnPage;
    }
    self.loadStatistic();

    self.loadLoanPositionTable();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.loadLoanPositionTable();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.loadLoanPositionTable();
    },
    getShowColor(d) {
      return d.status;
    },

    loadStatistic() {
      let self = this;
      self.loading = true;
      cdpService
        .getChainStatistic({
          pageSize: 10,
          pageIndex: 1,
          orderBys: [],
          chain: "Karura",
          symbol: "KSM",
        })
        .then((resp) => {
          self.loading = false;
          if (resp) {
            self.statisticData = resp;
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },

    loadLoanPositionTable() {
      let self = this;
      self.loading = true;
      cdpService
        .getLoanPositionList({
          ...self.query,
          orderBys: [{ sort: "collateral", order: "DESC" }],
          chain: "Karura",
          symbol: "KSM",
          accountId: "",
        })
        .then((resp) => {
          self.loanPositionTableData = [];
          self.loading = false;
          if (resp && resp.list.length > 0) {
            self.loanPositionTableData = resp.list;
            self.totalCount = resp.totalCount;
          } else {
            self.totalCount = 0;
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },

    async searchLoanPositionByAccountId() {
      let self = this;
      if (!self.query.accountId) {
        return;
      }
      self.loading = true;
      let searchKey;
      try {
        const res = await ss58transform({
          networks: ["karura"],
          account: self.query.accountId,
        });
        const obj = res.find((v) => v.network == "karura");
        searchKey = obj.value;
      } catch (err) {
        searchKey = self.query.accountId;
      }
      cdpService
        .getLoanPositionList({
          pageSize: 10,
          pageIndex: 1,
          orderBys: [{ sort: "collateral", order: "DESC" }],
          chain: "Karura",
          symbol: "KSM",
          accountId: searchKey,
        })
        .then((resp) => {
          self.loading = false;
          if (resp && resp.list.length > 0) {
            let currentLoanPosition = resp.list[0];
            self.showLoanPositionDetail(currentLoanPosition);
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },

    showLoanPositionDetail(lp) {
      let self = this;
      // self.$message({
      //   message: "show loanPosition detail for:\t" + lp.accountId,
      //   type: "success",
      // });

      self.$router.push({
        name: "CDPDetail",
        query: {
          loanPositionId: lp.id,
          accountId: lp.accountId,
        },
      });
    },
  },
};
</script>
 
<style lang="less" scoped>
.cdp-page {
  .search-filter {
    margin-top: 0;
  }
  .chainStatistic {
    padding-top: 20px;
    padding-bottom: 16px;
  }
  .statistic-item {
    display: inline-block;
  }
  .statistic-item:last-child {
    margin-left: 40px;
  }

  .statistic-item .icon {
    float: left;
    width: 48px;
    height: 48px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin: 10px 16px;
  }
  .icon-total {
    background: url("./../../assets/images/cdp/cdp-total.png");
  }
  .icon-debt {
    background: url("./../../assets/images/cdp/cdp-debt.png");
  }
  .statistic-item .value {
    float: left;
  }
  .statistic-item .value .title {
    float: initial;
    text-align: left;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.45);
  }
  .statistic-item .value .value-formated {
    float: initial;
    font-size: 32px;
    color: rgba(255, 255, 255, 0.87);
    margin-top: 10px;
  }
  .statistic-item .value .value-formated .value-formated-unit {
    font-size: 16px;
    color: #858585;
    margin-left: 20px;
  }

  .filter {
    padding: 15px 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .filter .el-checkbox {
    margin-left: 15px;
    color: rgba(255, 255, 255, 0.45) !important;
  }
}
body.white-theme .cdp-page {
  .icon-total {
    background-image: url("./../../assets/images/cdp/cdp-total2.png");
  }
  .icon-debt {
    background-image: url("./../../assets/images/cdp/cdp-debt2.png");
  }
  .statistic-item .value .title {
    color: rgba(41, 40, 40, 0.6);
  }
  .statistic-item .value .value-formated {
    color: rgba(41, 40, 40, 1);
  }
  .statistic-item .value .value-formated .value-formated-unit {
    color: rgba(41, 40, 40, 0.6);
  }
  .filter .el-checkbox {
    color: #606266 !important;
  }
}
</style>
