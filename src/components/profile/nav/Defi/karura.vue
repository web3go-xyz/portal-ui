<template>
  <div class="content profile-defi-kraura">
    <div class="common-profile-title">
      <img src="@/assets/images/home/karura.png" alt="" />
      <span>Karura CDP</span>
    </div>
    <div class="cdp-list">
      <div class="cdp-list-header">
        <el-row>
          <el-col :span="5">Parachain</el-col>
          <el-col :span="5" align="right">Debt</el-col>
          <el-col :span="4" align="right">Collateral</el-col>
          <el-col :span="4" align="right">Ratio</el-col>
          <el-col :span="3" class="statusCol">Status</el-col>
        </el-row>
      </div>
      <div class="cdp-list-content">
        <div
          class="lp-row"
          v-for="d in loanPositionTableData"
          :key="d.accountId"
        >
          <el-row>
            <el-col :span="5" align="left">
              <div class="accountId">
                <img
                  class="account-logo"
                  src="@/assets/images/kusama-logo.png"
                />
                <!-- {{ d.accountId | shorterAddress }} -->
                <address-display
                  :address="d.accountId"
                  :isPrifile="true"
                ></address-display>
              </div>
            </el-col>
            <el-col :span="5" align="right"
              ><div class="debt">{{ d.debitFormat }} KUSD</div></el-col
            >
            <el-col :span="4" align="right"
              ><div class="collateral">
                {{ d.collateralFormat }} KSM
              </div></el-col
            >
            <el-col :span="4" align="right"
              ><div class="ratio" :class="getShowColor(d)">
                {{ d.ratioPercentage }} %
              </div></el-col
            >
            <el-col :span="4"
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
        <div
          v-if="!loanPositionTableData.length"
          class="common-profile-table-nodata"
        >
          No Data
        </div>
      </div>
      <div class="cdp-list-pagination">
        <el-pagination
          background
          layout="prev, pager, next"
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
import cdpService from "@/api/cdp-analysis";
import { ss58transform } from "@/api/common";

import addressDisplay from "@/components/ui-elements/addressDisplay";
export default {
  name: "ProfileDefiKarura",
  components: {
    addressDisplay
  },
  props: {
    addressList: {
      type: Array
    }
  },
  data() {
    return {
      ifWhiteTheme: false,
      statusOptions: [
        { label: "Safe", value: "Safe" },
        { label: "Warning", value: "Warning" },
        { label: "Danger", value: "Danger" }
      ],
      msg: "Welcome to CDPProfiler",
      loading: false,
      query: {
        pageSize: 10,
        pageIndex: 1,
        accountId: "",
        hideLoanCompleted: false,
        filterStatus: ["Safe", "Warning", "Danger"]
      },
      statisticData: {},
      totalCount: 0,
      loanPositionTableData: []
    };
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
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
          symbol: "KSM"
        })
        .then(resp => {
          self.loading = false;
          if (resp) {
            self.statisticData = resp;
          }
        })
        .catch(err => {
          self.loading = false;
          console.error(err);
        });
    },

    loadLoanPositionTable() {
      if (!this.addressList || !this.addressList.length) return;
      const accountId = this.addressList.filter(
        item => item.network === "karura"
      )[0].value;
      let self = this;
      self.loading = true;
      cdpService
        .getLoanPositionList({
          ...self.query,
          orderBys: [{ sort: "collateral", order: "DESC" }],
          chain: "Karura",
          symbol: "KSM",
          accountId
        })
        .then(resp => {
          self.loanPositionTableData = [];
          self.loading = false;
          if (resp && resp.list.length > 0) {
            self.loanPositionTableData = resp.list;
            self.totalCount = resp.totalCount;
          } else {
            self.totalCount = 0;
          }
        })
        .catch(err => {
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
          accountId: lp.accountId
        }
      });
    }
  },
  watch: {
    addressList(val) {
      if (val && val.length) {
        this.addressList = val;
        this.init(val);
      }
    }
  }
};
</script>
<style lang="less">
.profile-defi-kraura {
  .cdp-list-header .el-row {
    padding-bottom: 16px;
  }
  .el-row {
    border-bottom: 1px solid #e9e9e9;
  }
}
</style>
<style lang="less" scoped>
.profile-defi-kraura {
  .address-display:hover {
    color: #38cb98;
  }
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
    background: url("./../../../../assets/images/cdp/cdp-total.png");
  }
  .icon-debt {
    background: url("./../../../../assets/images/cdp/cdp-debt.png");
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
body.white-theme .profile-defi-kraura {
  .icon-total {
    background-image: url("./../../../../assets/images/cdp/cdp-total2.png");
  }
  .icon-debt {
    background-image: url("./../../../../assets/images/cdp/cdp-debt2.png");
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
.profile-defi-kraura {
  .clear {
    clear: both;
  }

  .cdp-search-filter-input .el-input__inner {
    font-size: 16px;
    height: 60px !important;
    border-radius: 6px !important;
    border: 1px solid #17c684 !important;
    padding-left: 70px;
  }

  .cdp-search-filter-input .el-input__icon {
    font-size: 20px;
    line-height: 60px;
    margin-left: 26px;
  }

  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: #111111;
    border: 1px solid rgba(255, 255, 255, 0.24);
    border-radius: 4px;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #17c684;
    color: #fff;
  }

  .el-input__inner {
    background-color: #111111;
    border: 1px solid rgba(107, 32, 32, 0.2) !important;
    border-radius: 4px;
  }

  .content {
    background: #111111;
    padding-top: 1px;
    position: relative;
  }

  .bg {
    position: absolute;
    background: url(./../../../../assets/images/cdp/cdp-bg.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    width: 120%;
    height: 300px;
    left: -10vw;
    top: 40px;
  }

  .search-filter {
    position: relative;
    color: #17c684;
    text-align: left;
    margin-top: 64px;
  }

  .search-filter .title1 {
    font-size: 48px;
    font-weight: bold;
  }

  .search-filter .title2 {
    font-size: 36px;
    margin-bottom: 24px;
  }

  .cdp-list {
  }

  .cdp-list-header {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.45);
    margin-bottom: 10px;
  }

  .lp-row {
    height: 80px;
    line-height: 80px;
    background: #181818;
    border-radius: 6px;
    margin-bottom: 12px;
    cursor: pointer;
  }

  .lp-row:hover {
    background: #212121;
  }

  .account-logo {
    height: 40px;
  }

  .accountId {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
  }

  .debt,
  .collateral {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.65);
  }

  .ratio,
  .status {
    font-size: 14px;
  }
  .status,
  .statusCol {
    margin-left: 100px;
  }
  .view {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.87);
  }

  .view:hover {
    color: #17c684;
  }

  .Safe {
    color: #17c684;
  }

  .Warning {
    color: #ffad00;
  }

  .Danger {
    color: #ea3943;
  }

  .Safe-bg {
    background: #17c684;
  }

  .Warning-bg {
    background: #ffad00;
  }

  .Danger-bg {
    background: #ea3943;
  }

  .cdp-list-pagination {
    text-align: right;
    padding-top: 10px;
  }
}

body.white-theme .profile-defi-kraura {
  .content {
    background: white;
  }

  .cdp-search-filter-input .el-input__inner {
    border: 1px solid transparent !important;
  }

  .el-input__inner {
    background-color: white;
  }

  .cdp-list-header {
    color: rgba(41, 40, 40, 0.6);
  }

  .lp-row {
    height: 50px;
    line-height: 50px;
    background: white;
    border-radius: 6px;
    margin-bottom: 12px;
    cursor: pointer;
  }

  .lp-row:hover {
    box-shadow: 0px 18px 34px 0px rgba(41, 40, 40, 0.1);
    z-index: 2;
    position: relative;
    transition: all 0.2s;
  }

  .accountId {
    color: rgba(41, 40, 40, 0.8);
  }

  .debt,
  .collateral {
    color: rgba(41, 40, 40, 0.8);
  }

  .view {
    color: rgba(56, 203, 152, 1);
  }

  .view:hover {
    opacity: 0.7;
  }

  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    background-color: white;
    border: 1px solid rgba(41, 40, 40, 0.3);
    border-radius: 4px;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #17c684;
    border: 1px solid #17c684;
    color: #fff;
  }

  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .el-pager li {
    background: transparent !important;
    border-radius: 4px;
    border: 1px solid rgba(41, 40, 40, 0.3) !important;
  }

  .el-pagination.is-background .el-pager li:hover {
    border-color: #17c684 !important;
  }

  .el-pagination.is-background .el-pager li.active {
    background: #17c684 !important;
    border: 0 !important;
  }

  .el-pagination .el-select .el-input .el-input__inner {
    background: transparent !important;
  }

  .el-pagination__jump .el-input__inner {
    background: transparent !important;
  }
}
</style>
