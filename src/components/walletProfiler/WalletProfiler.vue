<template>
  <div class="content wallet-profiler-page">
    <transition name="slide-fade">
      <WalletLabelSetting @close="goSetting()" v-if="isShowSetting" />
    </transition>
    <div v-show="ifWhiteTheme" class="common-back-title">
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">{{ bigTitle }}</span>
    </div>

    <div class="main">
      <div v-show="!ifWhiteTheme" class="walletProfilerLogo">
        <span>{{ bigTitle }}</span>
      </div>
      <div class="select-row">
        <!-- <div class="select-title"></div> -->
        <!-- <el-select
          disabled
          v-model="query.selectedChainContractAddress"
          placeholder="filter by token"
          @change="refreshData(true)"
        >
          <el-option
            v-for="item in chainList4Select"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select> -->
        <!-- <div class="select-title"></div> -->
        <el-select
          v-model="query.selectedLabel"
          placeholder="filter by label"
          @change="refreshData(true)"
        >
          <el-option
            v-for="item in label4Select"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :class="item.id === 'setting' ? 'setting' : ''"
          >
            <div
              v-if="item.id === 'setting'"
              @click="goSetting()"
              class="settingLabel"
            >
              <img :src="settingImg" alt="" /> Label Setting
            </div>
          </el-option>
        </el-select>
        <div class="select-title"></div>
        <div>
          <el-input
            v-on:keyup.enter.native="refreshData"
            class="select-walletAddress"
            v-model="query.walletAddress"
            placeholder="special wallet address"
          ></el-input>
        </div>
        <div class="select-title"></div>
        <div class="select-reset-wrap">
          <el-button @click="reset" class="select-reset">Reset</el-button>
        </div>
      </div>
      <div class="data-table">
        <el-table
          @sort-change="sortChange"
          row-class-name="g-table-row"
          v-loading="loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          :data="walletAddressTableData"
          style="width: 100%"
        >
          <el-table-column label="Wallet Address" width="250">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.walletAddress" placement="top">
                <div class="row-walletAddress">
                  {{
                    formatAddressTag(scope.row.walletAddress) | shorterAddress
                  }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="Labels">
            <template slot-scope="scope">
              <div class="row-labels">
                <el-tooltip
                  v-for="l in sortLabel(scope.row.labels).slice(0, 4)"
                  :key="l.labelName"
                  :content="getLabelDesciption(l.labelName)"
                  placement="top"
                >
                  <span>
                    {{ l.labelName }}
                  </span>
                </el-tooltip>
              </div>
            </template></el-table-column
          >
          <el-table-column
            prop="balance"
            width="200"
            label="Balance"
            sortable="custom"
          >
            <template slot-scope="scope">
              <div class="row-balance">
                {{ Number(scope.row.balance).toFixed(2) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="firstInDate"
            label="First trading time"
            sortable="custom"
            width="210"
          >
            <template slot-scope="scope">
              <div class="row-firstInDate">
                {{ scope.row.firstInDate | formatDate }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="" width="100">
            <template slot-scope="scope">
              <div class="row-button" @click="gotoDetail(scope.row)">
                view <i class="el-icon-back"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          id="g-pagination"
          v-show="walletAddressTotalCount > 0"
          background
          :total="walletAddressTotalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize4WalletAddress"
          layout="prev, pager, next, sizes, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import wsService from "@/api/wallet-analysis";
import logoImg from "@/assets/images/logo.png";
import settingImg from "@/assets/images/setting.png";
import arrow from "@/assets/images/arrow.svg";
import WalletLabelSetting from "./WalletLabelSetting";

export default {
  name: "WalletProfiler",
  components: {
    WalletLabelSetting,
  },
  data() {
    return {
      ifWhiteTheme: false,
      orderBys: [],
      bigTitle: "Wallet Profiler",
      settingImg,
      logoImg,
      arrow,
      isShowSetting: false,
      msg: "Welcome to WalletProfiler",
      chainList: [],

      addressTagList: [],

      walletAddressTotalCount: 0,
      walletAddressTableData: [],

      query: {
        selectedLabel: null,
        selectedChainContractAddress: null,
        pageIndex4WalletAddress: 1,
        pageSize4WalletAddress: 10,
        walletAddress: null,
      },

      loading: false,
      labelDefList: [],

      enableShorterAddress: false,
    };
  },
  computed: {
    chainList4Select() {
      var d = [];
      if (this.chainList) {
        this.chainList.forEach((c) => {
          d.push({ label: c.chainType, value: c.contractAddress });
        });
      }
      return d;
    },
    label4Select() {
      var d = [];

      if (this.labelDefList) {
        this.labelDefList.forEach((c) => {
          d.push({ label: c.name, value: c.name });
        });
      }
      d.push({
        id: "setting",
      });
      return d;
    },

    selectedChain() {
      if (this.chainList) {
        for (let index = 0; index < this.chainList.length; index++) {
          const element = this.chainList[index];
          if (
            element.contractAddress == this.query.selectedChainContractAddress
          ) {
            return element;
          }
        }
        return {};
      }
    },
  },
  mounted() {
    const bodyEl = document.querySelector("body");
    if (bodyEl.className.includes("white-theme")) {
      this.ifWhiteTheme = true;
    }
    var self = this;
    // if (self.$route.params.paramsOnPage) {
    //   var paramsOnPage = self.$route.params.paramsOnPage;
    //   self.query = paramsOnPage;
    // }
    const data = JSON.parse(self.$route.query.data);
    if (data) {
      this.bigTitle = data.name;
      var contractAddress = data.data.contractAddress;
      self.query.selectedChainContractAddress = contractAddress;
    }
    Promise.all([
      self.getChainList(),
      self.getAddressTagList(),
      self.getLabelDefs(),
    ]).then((res) => {
      console.log("Promise all");
      if (self.query.selectedChainContractAddress) {
        self.refreshData();
      }
    });
  },
  methods: {
    sortLabel(labels) {
      const newArr = [];
      this.labelDefList.forEach((v) => {
        const find = labels.find((sv) => sv.labelName == v.name);
        if (find) {
          newArr.push(find);
        }
      });
      return newArr;
    },
    sortChange(obj) {
      this.orderBys = [
        { sort: obj.prop, order: obj.order == "ascending" ? "ASC" : "DESC" },
      ];
      this.refreshData();
    },
    getLabelDesciption(name) {
      const obj = this.labelDefList.find((v) => v.name == name);
      if (obj) {
        return obj.description;
      }
      return "";
    },
    reset() {
      // this.query.selectedChainContractAddress = null;
      this.query.selectedLabel = null;
      this.query.walletAddress = null;
      this.refreshData();
    },
    formatAddressTag(address) {
      if (this.addressTagList && this.addressTagList.length > 0) {
        for (let index = 0; index < this.addressTagList.length; index++) {
          const element = this.addressTagList[index];
          if (element.address == address) {
            return element.addressTag;
          }
        }
      }
      if (this.enableShorterAddress) {
        return this.$options.filters["shorterAddress"](address);
      }
      return address;
    },
    handleSizeChange(val) {
      console.log(`pageSize: ${val} `);
      this.query.pageSize4WalletAddress = val;
      this.query.pageIndex4WalletAddress = 1;
      var resetPageIndex = true;
      this.refreshData(resetPageIndex);
    },
    handleCurrentChange(val) {
      console.log(`current: ${val}`);
      this.query.pageIndex4WalletAddress = val;
      this.refreshData();
    },
    goSetting() {
      this.isShowSetting = !this.isShowSetting;
    },
    goHome() {
      this.$router.push({ name: "HomePage" });
    },
    getLabelDefs() {
      var self = this;
      return wsService.getLabelDefs().then((resp) => {
        if (resp && resp.list) {
          // 暂时隐藏两个没有的标签
          self.labelDefList = resp.list.filter(
            (v) => v.name !== "Smart Money" && v.name !== "Big Whale"
          );
        }
      });
    },
    getChainList() {
      var self = this;
      return wsService.getChainList().then((resp) => {
        if (resp && resp.list) {
          self.chainList = resp.list;
        }
      });
    },
    getAddressTagList() {
      var self = this;
      return wsService.getAddressTagList().then((resp) => {
        if (resp && resp.list) {
          self.addressTagList = resp.list;
        }
      });
    },
    refreshData(resetPageIndex) {
      var self = this;
      // self.walletAddressTableData = [];

      var param = {
        orderBys: this.orderBys,
        pageSize: self.query.pageSize4WalletAddress,
        pageIndex:
          resetPageIndex || false ? 1 : self.query.pageIndex4WalletAddress,
        contractAddress: self.query.selectedChainContractAddress,
        label: self.query.selectedLabel,
        walletAddress: self.query.walletAddress,
      };
      self.loading = true;
      wsService
        .getWalletAddressList(param)
        .then((resp) => {
          // self.loading = false;
          if (resp) {
            self.walletAddressTotalCount = resp.totalCount;

            //query walletAddress simple info
            self.queryWalletAddressSimpleInfo(resp.list);
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },
    queryWalletAddressSimpleInfo(data) {
      const d = JSON.parse(JSON.stringify(data));
      var self = this;

      var param = {
        orderBy: this.orderBys[0],
        chainType: "",
        contractAddress: "",
        walletAddressList: [],
      };

      if (d && d.length > 0) {
        param.chainType = d[0].chainType;
        param.contractAddress = d[0].contractAddress;

        d.forEach((row) => {
          param.walletAddressList.push(row.walletAddress);
        });

        // self.loading = true;
        wsService
          .getWalletAddressSimpleInfo(param)
          .then((resp) => {
            self.loading = false;
            if (resp) {
              var infoList = resp.list;

              for (let rowIndex = 0; rowIndex < d.length; rowIndex++) {
                const row = d[rowIndex];

                for (let index = 0; index < infoList.length; index++) {
                  const info = infoList[index];
                  if (
                    info.contractAddress == row.contractAddress &&
                    info.walletAddress == row.walletAddress
                  ) {
                    row.labels = info.labels;
                    row.balance = info.balance;
                    row.firstInDate = info.firstInDate;
                  }
                }
              }
              this.walletAddressTableData = d;
            }
          })
          .catch((err) => {
            self.loading = false;
            console.error(err);
          });
      } else {
        self.walletAddressTableData = d;
        self.loading = false;
      }
    },
    gotoDetail(row) {
      //pass the query params for goBack
      this.$router.push({
        name: "WalletProfilerDetail",
        query: {
          walletAddress: row.walletAddress,
          chainType: row.chainType,
          contractAddress: row.contractAddress,
        },
        // params: {
        //   paramsOnPage: this.query,
        // },
      });
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="less" scoped>
.main {
  background: url("../../assets/images/list-bg.png") no-repeat top right;
  background-size: 30%;
}
.walletProfilerLogo {
  height: 47px;
  font-size: 40px;
  font-family: Rubik-Medium, Rubik;
  font-weight: 500;
  color: #17c684;
  line-height: 47px;
  text-align: left;
  margin-top: 48px;
}
.select-row {
  margin-top: 33px;
  display: flex;
  color: white;
  line-height: 40px;
}
.select-row .select-title {
  margin-right: 10px;
}
.select-reset-wrap {
  flex: 1;
  text-align: right;
}
.select-reset {
  border-radius: 6px;
  width: 101px;
}
.data-table {
  margin-top: 20px;
}
.data-table /deep/ td {
  padding: 3.5px 8.5px;
}
.row-walletAddress {
  color: rgba(255, 255, 255, 0.85);
  font-weight: bold;
}
#g-pagination {
  margin-top: 24px;
  padding-bottom: 68px;
  text-align: right;
}
.row-labels span {
  padding: 5px 12px;
  display: inline-block;
  background: #2b2b2b;
  color: rgba(255, 255, 255, 0.65);
  border-radius: 16px;
}
.setting {
  height: 42px;
  line-height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  color: #17c684;
}
.row-labels span:not(:last-child) {
  margin-right: 8px;
}
.row-balance {
  color: rgba(255, 255, 255, 0.65);
}
.row-firstInDate {
  color: rgba(255, 255, 255, 0.65);
}
.row-button {
  justify-content: flex-end;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.87);
}
.row-button img {
  margin-left: 4px;
}
.row-button:hover {
  color: #17c684;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translate(100%);
}
.el-icon-back {
  transform: rotate(180deg);
  margin-left: 5px;
}
.settingLabel {
  display: flex;
  align-items: center;
}
.settingLabel img {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
/deep/ .el-pagination__sizes .el-select {
  width: auto;
}
body.white-theme {
  .wallet-profiler-page .main {
    padding-left: 100px;
    padding-right: 100px;
  }
  .walletProfilerLogo {
    color: #292828;
    background: white;
  }
  .main {
    background: rgb(245, 247, 249);
  }
  .row-walletAddress {
    color: rgba(41, 40, 40, 0.8);
  }
  .row-labels span {
    background: rgba(236, 246, 242, 1);
    color: rgba(41, 40, 40, 0.6);
  }
  .row-balance {
    color: rgba(41, 40, 40, 0.8);
  }
  .row-firstInDate {
    color: rgba(41, 40, 40, 0.8);
  }
  .row-button {
    color: #17c684;
  }
  .row-button:hover {
    opacity: 0.8;
  }
  .select-row {
    /deep/ .el-input__inner {
      border: 1px solid transparent !important;
    }
  }
}
</style>
