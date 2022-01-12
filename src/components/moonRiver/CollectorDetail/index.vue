<template>
  <div class="moonriver-detail-page">
    <div class="common-back-title">
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">{{ $route.query.id }}</span>
    </div>
    <div class="big-bg">
      <div class="info-wrap">
        <div class="item">
          <div class="title">
            <span>{{ $route.query.rank }}</span>
            <img src="@/assets/images/moonriver/icon1.png" alt="" />
          </div>
          <div class="label">Rank</div>
        </div>
        <div class="item">
          <div class="title">
            <span>{{ $route.query.selfStake | roundNumber(2) }}</span>
            <img src="@/assets/images/moonriver/icon2.png" alt="" />
          </div>
          <div class="label">Self-Bonded(MOVR)</div>
        </div>
        <div class="item">
          <div class="title">
            <span>{{ $route.query.totalStake | roundNumber(2) }}</span>
            <img src="@/assets/images/moonriver/icon3.png" alt="" />
          </div>
          <div class="label">Total Bonded(MOVR)</div>
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
        <component ref="component" :is="currentNav.component" />
      </div>
    </div>
  </div>
</template>

<script>
import Delegator from "./Delegator";
import Reward from "./Reward";
import Action from "./Action";

export default {
  data() {
    return {
      currentNav: {
        name: "Delegator",
        component: Delegator,
      },
      navList: [
        {
          name: "Delegator",
          component: Delegator,
        },
        {
          name: "Reward",
          component: Reward,
        },
        {
          name: "Action",
          component: Action,
        },
      ],
    };
  },
  methods: {
    goToNav(v) {
      this.currentNav = v;
    },
  },
};
</script>

<style lang="less" scoped>
.moonriver-detail-page {
  height: 100vh;
  overflow: auto;
  text-align: left;
  .big-bg {
    padding: 24px 100px;
    .info-wrap {
      display: flex;
      .item {
        width: 312px;
        margin-right: 24px;
        padding: 24px;
        background: #ffffff;
        border-radius: 10px;
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