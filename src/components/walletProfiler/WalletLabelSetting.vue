<template>
  <div class="content wallet-profiler-label-setting">
    <div class="mask" @click="$emit('close')"></div>
    <div class="main">
      <img
        class="close"
        src="@/assets/images/close.png"
        @click="$emit('close')"
        alt=""
      />
      <div class="g-wrap">
        <div class="head-title">Label Customization for</div>

        <div class="switch-chain">
          <div>
            <el-select
              v-model="selectedSymbol"
              placeholder="choose token"
              size="small"
              @change="updateCurrentConfig"
            >
              <el-option
                v-for="item in chainList4Select"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="card-top">
          <div class="section-card card-top-left hb">
            <div class="title">High Balance</div>
            <div class="config-item">
              <div class="config-item-row">
                <div>
                  <el-radio
                    v-model="balanceActive"
                    label="amount"
                    @change="onBalanceActiveChange"
                    >Amount greater than
                  </el-radio>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="currentSymbolConfig.amountForBalance.info"
                    placement="right"
                  >
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
                <div>
                  <el-input-number
                    controls-position="right"
                    v-model="currentSymbolConfig.amountForBalance.value"
                    size="mini"
                    :precision="0"
                    :step="1"
                  ></el-input-number>
                </div>
              </div>
              <div class="config-item-row">
                <div>
                  <el-radio
                    v-model="balanceActive"
                    label="percentage"
                    @change="onBalanceActiveChange"
                    >Top Percentage</el-radio
                  >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="currentSymbolConfig.perForBalance.info"
                    placement="right"
                  >
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
                <el-input-number
                  controls-position="right"
                  v-model="currentSymbolConfig.perForBalance.value"
                  size="mini"
                  :precision="3"
                  :step="0.001"
                ></el-input-number>
              </div>
            </div>
          </div>

          <div class="section-card card-top-right ha">
            <div class="title">High Activity</div>
            <div class="config-item">
              <div class="config-item-row">
                <div>
                  <div class="label">Top Percentage</div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="currentSymbolConfig.perForActivity.info"
                    placement="right"
                  >
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
                <el-input-number
                  controls-position="right"
                  v-model="currentSymbolConfig.perForActivity.value"
                  size="mini"
                  :precision="3"
                  :step="0.001"
                ></el-input-number>
              </div>

              <div class="config-item-row">
                <div>
                  <div class="label">Time Period</div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="currentSymbolConfig.perForActivity.info"
                    placement="right"
                  >
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>

                <el-date-picker
                  class="date-picker"
                  @change="update_startDateForHighActivity"
                  v-model="timePeriod4highActivity"
                  type="daterange"
                  range-separator=""
                >
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>

        <div class="section-card sh card-bottom">
          <div class="card-bottom-left">
            <div class="title">Strong Holder</div>
            <div class="stitle">Balance</div>

            <div class="config-item">
              <div class="config-item-row">
                <div>
                  <el-radio
                    v-model="balanceActive4sh"
                    label="amount"
                    @change="onBalanceActive4shChange"
                    >Amount greater than</el-radio
                  >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="currentSymbolConfig.amountForSHOTop.info"
                    placement="right"
                  >
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
                <el-input-number
                  controls-position="right"
                  v-model="currentSymbolConfig.amountForSHOTop.value"
                  size="mini"
                  :precision="0"
                  :step="1"
                ></el-input-number>
              </div>
              <div class="config-item-row">
                <div>
                  <el-radio
                    v-model="balanceActive4sh"
                    label="percentage"
                    @change="onBalanceActive4shChange"
                    >Top Percentage</el-radio
                  >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="currentSymbolConfig.perForSHOTop.info"
                    placement="right"
                  >
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
                <el-input-number
                  controls-position="right"
                  v-model="currentSymbolConfig.perForSHOTop.value"
                  size="mini"
                  :precision="3"
                  :step="0.001"
                ></el-input-number>
              </div>
            </div>
          </div>
          <div class="card-bottom-right">
            <div class="stitle">Activity</div>
            <div class="config-item">
              <div class="config-item-row">
                <div>
                  <div class="label">Bottom Percentage</div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="currentSymbolConfig.perForSHOBottom.info"
                    placement="right"
                  >
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
                <el-input-number
                  controls-position="right"
                  v-model="currentSymbolConfig.perForSHOBottom.value"
                  size="mini"
                  :precision="3"
                  :step="0.001"
                ></el-input-number>
              </div>
              <div class="config-item-row">
                <div>
                  <div class="label">Time Period</div>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="currentSymbolConfig.perForActivity.info"
                    placement="right"
                  >
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
                <el-date-picker
                  class="date-picker"
                  @change="update_startDateForSHO"
                  v-model="timePeriod4SHOBottom"
                  type="daterange"
                  range-separator=""
                >
                </el-date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="operations">
          <span @click="saveConfig">Update Config</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from "@/api/config-manage";
export default {
  name: "WalletLabelSetting",
  data() {
    return {
      msg: "Welcome to WalletLabelSetting",
      configData: {},
      currentSymbolConfig: {
        amountForBalance: {},
        amountForSHOTop: {},
        perForActivity: {},
        perForBalance: {},
        perForSHOBottom: {},
        perForSHOTop: {},
      },
      selectedSymbol: null,
      balanceActive: "amount",
      balanceActive4sh: "amount",
      timePeriod4highActivity: [new Date(), new Date()],
      timePeriod4SHOBottom: [new Date(), new Date()],
    };
  },
  computed: {
    chainList4Select() {
      var d = [];
      if (this.configData && this.configData.configs) {
        this.configData.configs.forEach((c) => {
          d.push({ label: c.symbol, value: c.contract });
        });
      }
      return d;
    },
  },
  mounted() {
    var self = this;

    Promise.all([self.getWalletLabelConfig()]).then((res) => {
      console.log("Promise all");
      self.selectedSymbol = self.configData.configs[0].symbol;
      self.updateCurrentConfig();
    });
  },
  methods: {
    update_startDateForHighActivity() {
      this.currentSymbolConfig.startDateForHighActivity.startDate =
        this.timePeriod4highActivity[0].getTime() / 1000;
    },
    update_startDateForSHO() {
      this.currentSymbolConfig.startDateForSHO.startDate =
        this.timePeriod4SHOBottom[0].getTime() / 1000;
    },
    onBalanceActiveChange() {
      var flag = this.balanceActive;
      console.log(flag);
      if (flag == "amount") {
        this.currentSymbolConfig.amountForBalance.active = true;
        this.currentSymbolConfig.perForBalance.active = false;
      }
      if (flag == "percentage") {
        this.currentSymbolConfig.amountForBalance.active = false;
        this.currentSymbolConfig.perForBalance.active = true;
      }
    },
    onBalanceActive4shChange() {
      var flag = this.balanceActive4sh;
      console.log(flag);
      if (flag == "amount") {
        this.currentSymbolConfig.amountForSHOTop.active = true;
        this.currentSymbolConfig.perForSHOTop.active = false;
      }
      if (flag == "percentage") {
        this.currentSymbolConfig.amountForSHOTop.active = false;
        this.currentSymbolConfig.perForSHOTop.active = true;
      }
    },
    updateCurrentConfig() {
      var self = this;
      if (self.selectedSymbol) {
        console.log("updateCurrentConfig:", this.selectedSymbol);
        for (let index = 0; index < self.configData.configs.length; index++) {
          const c = self.configData.configs[index];
          if (
            c.symbol == self.selectedSymbol ||
            c.contract == self.selectedSymbol
          ) {
            self.currentSymbolConfig = c;

            if (self.currentSymbolConfig.amountForBalance.active) {
              self.balanceActive = "amount";
            }
            if (self.currentSymbolConfig.perForBalance.active) {
              self.balanceActive = "percentage";
            }

            if (self.currentSymbolConfig.amountForSHOTop.active) {
              self.balanceActive4sh = "amount";
            }
            if (self.currentSymbolConfig.perForSHOTop.active) {
              self.balanceActive4sh = "percentage";
            }

            if (self.currentSymbolConfig.startDateForHighActivity) {
              var startDate =
                self.currentSymbolConfig.startDateForHighActivity.startDate;
              startDate = new Date(startDate * 1000);

              self.timePeriod4highActivity = [startDate, new Date()];
            }
            if (self.currentSymbolConfig.startDateForSHO) {
              var startDate =
                self.currentSymbolConfig.startDateForSHO.startDate;
              startDate = new Date(startDate * 1000);

              self.timePeriod4SHOBottom = [startDate, new Date()];
            }
            //TODO  Add more config
          }
        }
      }
    },
    getWalletLabelConfig() {
      var self = this;
      return service.getWalletLabelConfig().then((resp) => {
        if (resp && resp) {
          self.configData = resp;
        }
      });
    },

    goBack() {
      this.$router.push({ name: "WalletProfiler" });
    },
    goHome() {
      this.$router.push({ name: "HomePage" });
    },

    saveConfig() {
      var self = this;
      var param = this.configData;
      return service.updateWalletLabelConfig(param).then((resp) => {
        if (resp && resp) {
          self.$emit("close");
          self.$notify({
            title: "Notification",
            message: "Update config for wallet label success",
            position: "bottom-right",
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.wallet-profiler-label-setting {
  &.content {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 89;
  }
  .main {
    background-color: #111111;
    position: absolute;
    top: 74px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 105;
    padding-top: 48px;
    border-radius: 100px 0px 0px 0px;
  }
  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    background: #ffffff;
    opacity: 0.27;
    left: 0;
    right: 0;
    z-index: 105;
  }
  .close {
    width: 33px;
    height: 33px;
    position: absolute;
    top: -49px;
    color: #fff;
    font-weight: bold;
    font-size: 32px;
    cursor: pointer;
    right: 32px;
    &:hover {
      opacity: 0.7;
    }
  }
  .last-update-time {
    color: lightgray;
    text-align: right;
    font-style: italic;
  }
  .switch-chain {
    margin-top: 32px;
    display: flex;
  }
  .head-title {
    text-align: left;
    height: 47px;
    font-size: 24px;
    color: #17c684;
    font-weight: bold;
    line-height: 47px;
  }
  .card-top {
    display: flex;
    justify-content: space-between;
  }
  .card-top-left {
    width: 683px;
    background: #181818;
    border-radius: 8px;
  }
  .card-bottom-left {
    padding-right: 38px;
    width: 683px;
    box-sizing: border-box;
  }
  .card-bottom-right {
    position: relative;
    right: -26px;
    top: 34px;
    padding-right: 32px;
    width: 666px;
  }
  .card-top-right {
    width: 725px;
    background: #181818;
    border-radius: 8px;
  }
  .card-bottom {
    background: #181818;
    display: flex;
    justify-content: space-between;
    position: relative;
  }
  .stitle {
    margin: 24px 0 16px;
    height: 24px;
    font-size: 16px;
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    line-height: 24px;
  }
  .card-bottom:after {
    content: "";
    display: inline-block;
    width: 1px;
    height: 112px;
    position: absolute;
    left: 622px;
    bottom: 31px;
    background: rgba(255, 255, 255, 0.1);
  }
  .section-card {
    margin-top: 24px;
    padding: 24px 30px 32px 32px;
    box-sizing: border-box;
    color: white;
  }
  .config-item {
    justify-content: space-between;
  }
  .section-card .title {
    text-align: left;
    font-size: 26px;
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 24px;
    line-height: 34px;
  }
  .section-card .config-item {
    display: flex;
    text-align: left;
    align-items: center;
    justify-content: space-between;
  }
  .el-radio {
    margin-right: 0;
  }
  .section-card .config-item .config-item-row {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .section-card .config-item .config-item-row i {
    margin-left: 5px;
  }
  .section-card .config-item .config-item-row > div {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-top: 16px !important;
  }
  .section-card .config-item .config-item-row i {
    color: lightgray;
    // font-size: 1.2rem;
  }
  .section-card .config-item .config-item-row .el-radio {
  }
  .section-card .config-item .config-item-row .el-input-number {
  }

  .section-card .config-item .config-item-row .label {
  }

  .splitter {
    width: 80%;
    border-top: dashed 1px #ddd;
    margin: 10px 0px;
  }
  .operations {
    cursor: pointer;
    margin: 100px auto 0;
    width: 320px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    background: #5fd6a1;
    border-radius: 6px;
    font-size: 18px;
    font-family: Rubik-Medium, Rubik;
    font-weight: 500;
    color: #ffffff;
  }
  .operations:hover {
    background-color: #17c684;
  }
  .operations:active {
    background-color: #15875f;
  }
  .switch-chain .el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .section-card .el-icon-arrow-up:before {
    content: "\e6d9" !important;
  }
  .section-card .el-icon-arrow-down:before {
    content: "\e6d8" !important;
  }
  .section-card .config-item .config-item-row .el-input-number {
    margin-left: 26px;
  }
  .el-radio__label {
    color: rgba(255, 255, 255, 0.6);
  }
  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 404px;
  }

  .el-input__inner {
    background-color: #212121 !important;
  }
  .el-icon-warning-outline {
    
  }
 
  @media (max-width: 1439px) {
    .g-wrap {
      max-width: 1300px !important;
    }
  }
}
body.white-theme .wallet-profiler-label-setting {
  .el-input-number .el-input__inner {
    text-align: left;
  }
  .switch-chain {
    margin-top: 16px;
  }
  .main {
    background-color: white;
    border-radius: 60px 0px 0px 0px;
    padding-top: 80px;
  }
  .mask {
    background: black;
    opacity: 0.4;
  }
  .el-input__inner {
    background-color: white !important;
  }
  .card-top-left {
    background: #f5f7f9;
  }
  .card-top-right {
    background: #f5f7f9;
  }
  .card-bottom {
    background: #f5f7f9;
  }
  .section-card .title {
    color: rgba(41, 40, 40, 0.8);
    margin-bottom: 5px;
  }
  .el-radio__label {
    color: rgba(41, 40, 40, 0.6);
  }
  .section-card {
    color: rgba(41, 40, 40, 0.6);
  }
  .stitle {
    color: rgba(41, 40, 40, 0.6);
    margin-bottom: 0;
  }
  .section-card .config-item .config-item-row i {
    color: rgba(41, 40, 40, 0.8);
  }
}
</style>
