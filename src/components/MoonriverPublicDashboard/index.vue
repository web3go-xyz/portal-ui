<template>
  <div class="page-wrap">
    <div class="fixed-right-menu">
      <a
        class="link hover-item"
        target="blank"
        href="https://web3go.gitbook.io/moonscan-smart-contract-label-for-projects/"
        >Wanna label your contracts?</a
      >
    </div>
    <div class="page">
      <div class="intro">
        <div class="big-title">Moonriver Overview</div>
        <div class="sub-title">
          <img src="@/assets/images/worldIcon.png" alt="" />
          <span @click="jumpUrl('https://moonbeam.network/networks/moonriver/')"
            >https://moonbeam.network/networks/moonriver/</span
          >
        </div>
        <div class="text">
          Made by the Web3Go team (Moonriver Community Enthusiasts) We are early
          Moonriver supporters and our mission is to provide open data analytics
          for the Moonriver community. We started with a Moonriver Collator
          Dashboard (
          <a
            class="link"
            target="blank"
            href="https://app.web3go.xyz/#/Moonriver"
            >https://app.web3go.xyz/#/Moonriver</a
          >
          )and have been working over the past year on more dashboards to
          provide greater visibility into what is happening on Moonriver (both
          EVM and substrate). We will continue to refine our dashboards and add
          more information. Please reach out if you have suggestions or
          questions.
        </div>
      </div>
      <div class="tab-content">
        <Overview></Overview>
      </div>
    </div>
  </div>
</template>

<script>
import Overview from "./Overview";
export default {
  components: {
    Overview,
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    jumpUrl(url) {
      window.open(url);
    },
  },
};
</script>

<style lang="less" scoped>
.page-wrap {
  background: white;
  padding: 24px;
  .fixed-right-menu {
    z-index: 10;
    padding: 10px;
    background: #ffffff;
    box-shadow: 0px 11px 13px rgba(160, 156, 185, 0.09);
    border-radius: 12px;
    position: fixed;
    bottom: 30%;
    transform: translateY(-50%);
    right: 8px;
    .link {
      font-weight: 400;
      line-height: 24px;
      font-size: 14px;
      color: #3965ff;
      display: flex;
      align-items: center;
      text-decoration: underline;
      justify-content: center;
    }
  }
}
@media screen and (max-width: 1400px) {
  .page {
    // width: 1200px !important;
  }
}
.page {
  // width: 1400px;
  margin: 0 auto;
  .banner {
    position: relative;
    height: 251.78px;
    background: url(~@/assets/images/basBanner.png) no-repeat center;
    background-size: cover;
    .circle {
      position: absolute;
      bottom: -90px;
      left: 50%;
      transform: translateX(-50%);
      img {
        width: 180px;
      }
    }
  }
  .intro {
    margin-top: 20px;
    text-align: center;
    .big-title {
      margin-bottom: 14px;
      font-weight: 700;
      font-size: 54px;
      color: #2b3674;
    }
    .sub-title {
      justify-content: center;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      font-weight: 400;
      line-height: 24px;
      font-size: 18px;
      color: #3965ff;
      img {
        margin-right: 10px;
        width: 21px;
      }
      span {
        text-decoration: underline;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
    .text {
      font-weight: 400;
      font-size: 18px;
      line-height: 32px;
      color: #2b3674;
      .link {
        color: #3965ff;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .tab-wrap {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
  .tabs {
    display: flex;
    align-items: center;
    .tab-item {
      cursor: pointer;
      margin: 0 40px;
      font-weight: 500;
      font-size: 16px;
      line-height: 50px;
      color: #a3aed0;
      position: relative;
      &::after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0px;
        height: 4px;
        background: #4318ff;
        border-radius: 2px;
        opacity: 0;
      }
      &:hover {
        color: #2b3674;
      }
      &.active {
        color: #2b3674;
        &::after {
          opacity: 1;
        }
      }
    }
  }
}
</style>