<template>
  <div class="profile-index-page">
    <div class="info-wrap">
      <div class="info-left">
        <img class="left-img" :src="getMainIcon()" alt="" />
        <div class="text-wrap">
          <div class="title">{{ $route.query.address | shorterAddress }}</div>
          <div class="copy-wrap">
            <Identicon
              :size="32"
              :theme="'polkadot'"
              :value="$route.query.address"
            />
            <span class="text">{{ $route.query.address }}</span>
            <img
              title="copy"
              @click="copy($route.query.address)"
              src="@/assets/images/profile/copy.png"
              alt=""
              class="copy hover-item"
            />
          </div>
        </div>
      </div>
      <div class="split"></div>
      <div class="item">
        <div class="title">
          <span> Address list </span>
          <img src="@/assets/images/profile/info1.png" alt="" />
        </div>
        <div class="text-wrap hover-item" @click="openDrawer">
          <span>All available address</span>
          <img src="@/assets/images/profile/arrow.png" alt="" />
        </div>
      </div>
      <div class="split"></div>
      <div class="item">
        <div class="title">
          <i v-if="isNaN(totalAmount)" class="el-icon-loading"></i>
          <span v-else>$ {{ totalAmount | format2 }}</span>
          <img style="margin-right:15px;" src="@/assets/images/profile/info2.png" alt="" />
        </div>
        <div class="text-wrap">
          <span>The total amount of account</span>
        </div>
      </div>
    </div>
    <div class="nftNav-wrap">
      <div class="nftNav">
        <span
          v-for="v in navList"
          :key="v.name"
          class="hover-item"
          :class="{ active: currentNav.name == v.name }"
          @click="goToNav(v)"
          >{{ v.name }}</span
        >
      </div>
      <div class="checkbox" v-if="currentNav.name == 'Balance'">
        <el-checkbox v-model="showZeroBalance">Show zero balances</el-checkbox>
      </div>
    </div>
    <div class="component-wrap">
      <component
        ref="component"
        :is="currentNav.component"
        :balanceNavData="balanceNavData"
        :showZeroBalance="showZeroBalance"
      />
    </div>
    <el-drawer
      size="480"
      :visible.sync="visible"
      :with-header="false"
      direction="rtl"
    >
      <div class="drawer-content">
        <div class="title">
          <span>Address list</span>
          <img
            class="hover-item"
            @click="visible = false"
            src="@/assets/images/profile/close.png"
            alt=""
          />
        </div>
        <div class="address-list">
          <div class="item" v-for="(v, i) in addressList" :key="i">
            <img class="left" :src="getIcon(v)" alt="" />
            <div class="middle">
              <div class="item-title">{{ v.network || "Public Key" }}</div>
              <div class="item-text">
                {{ v.value }}
              </div>
            </div>
            <div class="copy-wrap">
              <img
                title="copy"
                @click="copy(v.value)"
                src="@/assets/images/profile/copy.png"
                alt=""
                class="copy"
              />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Identicon from "@vue-polkadot/vue-identicon";
import {
  getAllSupportedChains,
  ss58transform,
  getBalance,
  getPrice,
} from "@/api/profile/Balance";
import Balance from "./nav/Balance";
import Crowdloan from "./nav/Crowdloan";
import Defi from "./nav/Defi";
import Staking from "./nav/Staking";
import NFT from "./nav/NFT";
import BigNumber from "bignumber.js";
export default {
  name: "ProfileIndex",
  components: {
    Balance,
    Crowdloan,
    Defi,
    Staking,
    NFT,
    Identicon,
  },
  data() {
    return {
      showZeroBalance: true,
      allChains: [],
      addressList: [],
      balanceNavData: [],
      visible: false,
      currentNav: {
        name: "Balance",
        component: Balance,
      },
      navList: [
        {
          name: "Balance",
          component: Balance,
        },
        {
          name: "Parachain Crowdloan",
          component: Crowdloan,
        },
        {
          name: "Defi",
          component: Defi,
        },
        {
          name: "Staking",
          component: Staking,
        },
        {
          name: "NFT",
          component: NFT,
        },
      ],
    };
  },
  created() {
    const find = this.navList.find((v) => this.$route.params.nav == v.name);
    if (find) {
      this.currentNav = find;
    }
    getAllSupportedChains().then((d) => {
      this.allChains = d;
      ss58transform({
        account: this.$route.query.address,
        // account: "15MtNMKZUFjHoWzqQzQ8ntuXaAB8KHb3QSf5SeXfkqpBh45i",
        networks: d.map((v) => v.network),
        filter_no_symbol: true,
      }).then((data) => {
        if (data.length && data[0].error) {
          this.addressList = [];
        } else {
          this.addressList = data;
        }
        this.getTableData();
      });
    });
  },
  computed: {
    // 删掉无效balance的地址
    filterAddressList() {
      if (this.addressList.length) {
        let filter = [];
        this.addressList.forEach((t) => {
          // 去掉特殊数据
          if (t.key == "Public Key") {
            return;
          }

          //去掉没有链地址的
          let findChain = this.allChains.find((c) => {
            return c.network == t.network;
          });
          if (!findChain) {
            return;
          } else {
            if (!findChain.wssEndpoints || findChain.wssEndpoints.length == 0) {
              return;
            }
          }

          filter.push(t);
        });

        return filter;
      }
      return [];
    },
    totalAmount() {
      let sum = 0;
      this.balanceNavData.forEach((v) => {
        sum += v.totalPrice;
      });
      return sum;
    },
  },
  methods: {
    getMainIcon() {
      const find = this.filterAddressList.find(
        (v) => v.value == this.$route.query.address
      );
      if (find) {
        return `static/parachain-icon/${find.network}.png`;
      }
      return "";
    },
    getTableData() {
      this.balanceNavData = JSON.parse(JSON.stringify(this.filterAddressList));
      if (this.balanceNavData.length) {
        this.$refs.component.rowClick(this.balanceNavData[0]);
      }
      this.balanceNavData.forEach((v) => {
        getPrice({
          symbol: v.symbols[0],
        }).then((priceResult) => {
          let price = 0;
          if (priceResult && priceResult.price) {
            price = priceResult.price;
          }
          this.$set(v, "price", price);
          if (v.price !== undefined && v.balance !== undefined) {
            this.$set(v, "totalPrice", Number(v.price) * Number(v.balance));
          }
        });
        getBalance({
          account_id: v.value,
          wssEndpoint: v.wssEndpoints[0],
          network: v.network,
        }).then((balanceResult) => {
          let balance = 0;
          if (balanceResult && balanceResult.balance) {
            balance =
              balanceResult.balance.free + balanceResult.balance.reserved;
            balance = this.formatTokenBalance(balance, balanceResult);
          }
          this.$set(v, "balance", balance);
          if (v.price !== undefined && v.balance !== undefined) {
            this.$set(v, "totalPrice", Number(v.price) * Number(v.balance));
          }
        });
      });
    },
    formatTokenBalance(balance, balanceResp) {
      if (balanceResp && balanceResp.account_id) {
        let findAddressItem = this.addressList.find((t) => {
          if (t.value) {
            return t.value === balanceResp.account_id;
          }
          return false;
        });
        if (findAddressItem) {
          if (findAddressItem.decimals && findAddressItem.decimals.length > 0) {
            let decimal = findAddressItem.decimals[0];
            let balanceFormated = BigNumber(balance).dividedBy(
              BigNumber("1e" + decimal)
            );
            return balanceFormated.toNumber();
          }
        }
      }
      return balance;
    },
    getIcon(v) {
      return `static/parachain-icon/${v.network}.png`;
    },
    openDrawer() {
      this.visible = true;
    },
    goToNav(v) {
      this.currentNav = v;
      this.$router.replace({
        name: "ProfileIndex",
        params: {
          nav: v.name,
        },
        query: this.$route.query,
      });
    },
    copy(text) {
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.setAttribute("value", text);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$message.success("Address Copied");
      }
      document.body.removeChild(input);
    },
  },
};
</script>
<style lang="less">
.common-profile-sort {
  span {
    display: inline-block;
    height: 24px;
    min-width: 53px;
    padding: 0 10px;
    text-align: center;
    line-height: 24px;
    background: rgba(#292828, 0.04);
    border-radius: 4px;
    font-size: 14px;
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    color: #7f7e7e;
    margin-right: 12px;
    cursor: pointer;
    &.act {
      color: #38cb98;
      background: rgba(56, 203, 152, 0.1);
    }
  }
}
.common-profile-component {
}
.nftNavCon .nftNavConList-table-header {
  padding-bottom: 15px !important;
  border-bottom: 1px solid #e9e9e9;
}
.nftNavConList-table-content .lp-row .el-row {
  border-bottom: 1px solid #e9e9e9;
}
.common-profile-table-nodata {
  color: #999;
  padding-top: 10px;
  font-size: 14px;
  text-align: center;
}
.common-profile-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 28px;
  font-family: Rubik-Medium, Rubik;
  font-weight: 500;
  color: #545353;
  margin: 20px 0;
  img {
    width: 32px;
    margin-right: 4px;
  }
}
</style>
<style lang="less" scoped>
.profile-index-page {
  text-align: left;
  margin: 0 auto;
  padding: 0 100px;
  margin-top: 27px;

  .info-wrap {
    background: #ffffff;
    border-radius: 10px;
    padding: 24px 16px;
    display: flex;
    align-items: center;
    .info-left {
      flex: 3;
      display: flex;
      align-items: center;
      .left-img {
        width: 56px;
        height: auto;
        // border-radius: 50%;
        margin-right: 8px;
      }
      .text-wrap {
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #292828;
          margin-bottom: 4px;
        }
        .copy-wrap {
          font-size: 14px;
          color: #7f7e7e;
          display: flex;
          align-items: center;
          // .text {
          //   margin-left: 4px;
          // }
          img {
            width: 16px;
            height: 16px;
            margin-left: 12px;
          }
        }
      }
    }
    .split {
      width: 1px;
      height: 53px;
      background: #d4d4d4;
      margin: 0 40px;
    }
    .item {
      flex: 2;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28px;
        font-weight: bold;
        color: #545353;
        img {
          width: 32px;
          height: 32px;
        }
      }
      .text-wrap {
        margin-top: 8px;
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #a9a9a9;
        img {
          width: 16px;
          height: 16px;
          margin-left: 4px;
        }
      }
    }
  }
  .nftNav-wrap {
    margin-top: 32px;
    text-align: left;
    display: flex;
    align-items: center;
    .nftNav {
      background: #ebeff3;
      border-radius: 4px;
      display: inline-block;
      padding: 5px;
      span {
        padding: 7px 39px;
        cursor: pointer;
        width: 147px;
        height: 32px;
        line-height: 32px;
        border-radius: 4px;
        font-size: 16px;

        color: #7f7e7e;
        &.active {
          background: #ffffff;
          color: #38cb98;
          font-weight: 500;
        }
      }
    }
    .checkbox {
      margin-left: 28px;
      /deep/ .el-checkbox__label {
        font-size: 16px;
        color: #7f7e7e !important;
      }
    }
  }
  .component-wrap {
    background: #ffffff;
    border-radius: 10px;
    padding: 24px;
    margin-top: 20px;
  }
}

.drawer-content {
  padding: 21px 0;
  .title {
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    font-weight: bold;
    color: #292828;
    img {
      padding: 10px;
      width: 24px;
      height: 24px;
    }
  }
  .address-list {
    height: calc(100vh - 120px);
    overflow: auto;
    .item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(233, 233, 233, 1);
      padding: 8px 24px;
      &:last-child {
        border-bottom: 0;
      }
      .left {
        width: 26px;
        height: auto;
      }
      .middle {
        flex: 1;
        margin: 0 11px;
        .item-title {
          font-size: 14px;
          font-weight: bold;
          color: #545353;
        }
        .item-text {
          margin-top: 4px;
          font-family: "Rubik";
          font-size: 12px;
          color: #a9a9a9;
        }
      }
      .copy-wrap {
        position: relative;
        .copy {
          opacity: .6;
          cursor: pointer;
          width: 16px;
          height: 16px;
          &:hover{
            opacity: .4;
          }
        }
      }
    }
  }
}
</style>
