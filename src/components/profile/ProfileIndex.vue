<template>
  <div class="profile-index-page">
    <div class="info-wrap">
      <div class="info-left">
        <img class="left-img" src="@/assets/images/home/eye.png" alt="" />
        <div class="text-wrap">
          <div class="title">EaCAgm…x6f3Hq</div>
          <div class="copy-wrap">
            <span>EaCAgmsTaQ23WHQ9b7ohJ6FoTzzy87hwA2HpUkX4fx6f3Hq</span>
            <img
              title="copy"
              @click="copy('EaCAgmsTaQ23WHQ9b7ohJ6FoTzzy87hwA2HpUkX4fx6f3Hq')"
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
          <img
            class="hover-item"
            @click="openDrawer"
            src="@/assets/images/profile/info1.png"
            alt=""
          />
        </div>
        <div class="text-wrap hover-item" @click="openDrawer">
          <span>All available address</span>
          <img src="@/assets/images/profile/arrow.png" alt="" />
        </div>
      </div>
      <div class="split"></div>
      <div class="item">
        <div class="title">
          <span>$ 9,999</span>
          <img src="@/assets/images/profile/info2.png" alt="" />
        </div>
        <div class="text-wrap">
          <span>The total amout of accout</span>
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
    </div>
    <div class="component-wrap">
      <component :is="currentNav.component" />
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
            <img
              class="left"
              src="@/assets/images/home_slices/moonriver.png"
              alt=""
            />
            <div class="middle">
              <div class="item-title">Moonriver</div>
              <div class="item-text">
                EcccaCAgmsTaQ23WHQ9b7ohJ6FoTzzy87hwA2HpUkX4fx6f
              </div>
            </div>
            <div class="copy-wrap">
              <img
                title="copy"
                @click="copy('EcccaCAgmsTaQ23WHQ9b7ohJ6FoTzzy87hwA2HpUkX4fx6f')"
                src="@/assets/images/profile/copy.png"
                alt=""
                class="copy hover-item"
              />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Balance from "./nav/Balance";
import Crowdloan from "./nav/Crowdloan";
import Defi from "./nav/Defi";
import Staking from "./nav/Staking";
import NFT from "./nav/NFT";
export default {
  components: {
    Balance,
    Crowdloan,
    Defi,
    Staking,
    NFT,
  },
  data() {
    return {
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
      addressList: [
        {},
        {},
        {},
        {},
        {},
      ],
    };
  },
  created() {
    const find = this.navList.find((v) => this.$route.params.nav == v.name);
    if (find) {
      this.currentNav = find;
    }
  },
  methods: {
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
      });
    },
    copy(text) {
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.setAttribute("value", text);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$message.success("Already copied");
      }
      document.body.removeChild(input);
    },
  },
};
</script>

<style lang="less" scoped>
.profile-index-page {
  text-align: left;
  margin: 0 auto;
  padding: 0 100px;
  margin-top: 27px;
  .info-wrap {
    width: 100%;
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
        height: 56px;
        border-radius: 50%;
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
    text-align: left;
    .nftNav {
      background: #ebeff3;
      border-radius: 4px;
      margin-top: 32px;
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
      &:last-child{
        border-bottom: 0;
      }
      .left {
        width: 26px;
        height: 26px;
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
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style>