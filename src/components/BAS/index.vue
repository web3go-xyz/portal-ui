<template>
  <div class="page-wrap">
    <div class="page">
      <div class="banner">
        <div class="circle">
          <img src="@/assets/images/basicon.png" alt="" />
        </div>
      </div>
      <div class="intro">
        <div class="big-title">META APES</div>
        <div class="sub-title">
          <img src="@/assets/images/worldIcon.png" alt="" />
          <span @click="jumpUrl('https://metaapesgame.com/')"
            >https://metaapesgame.com/</span
          >
        </div>
        <div class="text">
          Meta Apes is a free-to-play, play-and-earn MMO strategy game designed
          for mobile. It is set in a post-apocalyptic world, in which humanity
          has ended and a new era ruled by Apes has begun. Web3go provides a
          general data overview of Meta Apes. Through the dashboard, users can
          check out the latest key data and understant the time trend of those
          data
        </div>
      </div>
      <div class="tab-wrap">
        <div class="tabs">
          <div
            class="tab-item"
            @click="clickTab(1)"
            :class="{ active: $route.query.tabIndex == 1 }"
          >
            Overview
          </div>
          <div
            class="tab-item"
            @click="clickTab(2)"
            :class="{ active: $route.query.tabIndex == 2 }"
          >
            ERC20
          </div>
          <div
            class="tab-item"
            @click="clickTab(3)"
            :class="{ active: $route.query.tabIndex == 3 }"
          >
            ERC721
          </div>
        </div>
      </div>
      <div class="tab-content">
        <Overview v-if="$route.query.tabIndex == 1"></Overview>
        <ERC20 v-if="$route.query.tabIndex == 2"></ERC20>
        <ERC721 v-if="$route.query.tabIndex == 3"></ERC721>
      </div>
    </div>
  </div>
</template>

<script>
import ERC20 from "@/components/BAS/ERC20";
import ERC721 from "@/components/BAS/ERC721";
import Overview from "@/components/BAS/Overview";
import basApi from "@/api/bas";
export default {
  components: {
    ERC20,
    ERC721,
    Overview,
  },
  data() {
    return {};
  },
  created() {
    if (!this.$route.query.tabIndex) {
      this.$router.push({
        name: "BAS",
        query: {
          tabIndex: 1,
        },
      });
    }
    basApi
      .basOverview({
        apikey: 123456,
      })
      .then((d) => {});
  },
  methods: {
    clickTab(tabIndex) {
      this.$router.push({
        name: "BAS",
        query: {
          tabIndex,
        },
      });
    },
    jumpUrl(url) {
      window.open(url);
    },
  },
};
</script>

<style lang="less" scoped>
.page-wrap {
  background: white;
  padding: 24px 0;
}
.page {
  width: 1696px;
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
    margin-top: 105px;
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