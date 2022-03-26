<template>
  <div class="staking-detail-page">
    <div class="common-back-title">
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">{{ address }}</span>
    </div>
    <div class="big-bg">
      <div class="info-wrap">
        <div class="info-left">
          <img class="icon" :src="makeBlockie(address)" alt="" />
          <div class="right">
            <div class="title">
              <span>Delegator</span>
            </div>
            <div class="copy-wrap">
              <span class="text">{{ address }}</span>
              <img
                title="copy"
                @click="$utils.copy(address)"
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
            <span>{{ bonded | roundNumber(2) }} {{ symbol }}</span>
            <img src="@/assets/images/moonriver/icon2.png" alt="" />
          </div>
          <div class="label">Total Bonded</div>
        </div>
        <div class="split"></div>
        <div class="item">
          <div class="title">
            <span
              >{{ rewardData.latestReward | roundNumber(2) }} {{ symbol }}</span
            >
            <img src="@/assets/images/moonriver/icon-reward.png" alt="" />
          </div>
          <div class="label">Latest Reward</div>
        </div>
        <div class="split"></div>
        <div class="item">
          <div class="title">
            <span
              >{{ rewardData.totalReward | roundNumber(2) }} {{ symbol }}</span
            >
            <img src="@/assets/images/moonriver/icon-reward.png" alt="" />
          </div>
          <div class="label">Total Reward</div>
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
        <component
          ref="component"
          :is="currentNav.component"
          :query="$route.query"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Action from "./Action";
import Reward from "./Reward";
import makeBlockie from "ethereum-blockies-base64";
import stakingService from "@/api/staking/index.js";

export default {
  data() {
    return {
      bonded: null,
      currentNav: {
        name: "Reward",
        component: Reward,
      },
      navList: [
        {
          name: "Reward",
          component: Reward,
        },
        {
          name: "Action",
          component: Action,
        },
      ],
      rewardData: {
        latestReward: 0,
        totalReward: 0,
      },
      address: "",
    };
  },
  computed: {
    paraChainName() {
      if (this.$route.query && this.$route.query.name) {
        return this.$route.query.name;
      }
      return "Staking";
    },
    symbol() {
      if (this.$route.query && this.$route.query.symbol) {
        return this.$route.query.symbol;
      }
      return "Symbol";
    },
  },
  created() {
    let self = this;
    stakingService.base_api = this.$route.query.base_api;
    self.address = self.$route.query.id;

    stakingService
      .getDelegatorRewardStatistic({
        delegatorAccount: self.address,
      })
      .then((resp) => {
        self.rewardData = resp;
      });
    this.getBonded();
  },
  methods: {
    getBonded() {
      this.$localforage
        .getItem(this.paraChainName + "CollectorSortList")
        .then((str) => {
          let bondSum = 0;
          if (str) {
            const collectorList = JSON.parse(str);
            for (const c of collectorList) {
              for (const n of c.allNominators) {
                if (n.owner === this.address) {
                  bondSum += Number(n.amount);
                }
              }
            }
          }
          this.bonded = bondSum;
        });
    },
    makeBlockie(address) {
      return makeBlockie(address);
    },
    goToNav(v) {
      this.currentNav = v;
    },
  },
};
</script>

<style lang="less" scoped>
.staking-detail-page {
  height: 100vh;
  overflow: auto;
  text-align: left;
  .big-bg {
    padding: 24px 100px;
    .info-wrap {
      // width: 890px;
      border-radius: 10px;
      background: #ffffff;
      display: flex;
      padding: 24px;
      align-items: center;
      .info-left {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 8px;
          width: 56px;
          height: 56px;
        }
        .right {
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #292828;
            margin-bottom: 8px;
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
        margin: 0 48px;
        width: 1px;
        height: 53px;
        background: #d4d4d4;
      }
      .item {
        width: 312px;
        .title {
          display: flex;
          justify-content: space-between;
          font-size: 28px;
          font-weight: bold;
          color: #545353;
          img {
            width: 32px;
            height: 32px;
          }
        }
        .label {
          margin-top: 8px;
          font-size: 16px;
          color: #a9a9a9;
        }
      }
    }
    .nftNav-wrap {
      margin-bottom: 16px;
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
    }
    .component-wrap {
      border-radius: 10px;
      background: white;
    }
  }
}
</style>