<template>
  <div class="profile-home-page">
    <div class="center">
      <div class="title">
        You can track balance, transactions, NFTs, and contributions of
        crowdloan across different parachains on Web3Go now!
      </div>
      <div class="search-wrap">
        <el-input
          class="input"
          placeholder="Search address"
          v-model="inputValue"
          @keyup.enter.native="jumpToIndex"
        >
          <img slot="prefix" src="@/assets/images/profile/search.png" alt="" />
        </el-input>
      </div>
      <div class="recommand-addresses">
        <div class="desc">Or try these :</div>
        <div
          v-for="d in recommandAddresses"
          :key="d.address"
          class="address"
          @click="useAddress(d)"
        >
          @{{ d.identity }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileHome",
  data() {
    return {
      inputValue: "",
      recommandAddresses: [
        {
          identity: "Acala Foundation",
          address: "5DbqSiw5j4jcb5BB1yuYYp88QVcgoZaYn9R3vff1BR2Cpa77",
          network: "polkadot",
        },
        {
          identity: "Litentry",
          address: "5G6LW2foWLgUv4SFfXmsViGBekNiaPKA3xjLQ3TrUdni6yYj",
          network: "polkadot",
        },
        {
          identity: "Shawn Tabrizi",
          address: "12hAtDZJGt4of3m2GqZcUCVAjZPALfvPwvtUTFZPQUbdX1Ud",
          network: "polkadot",
        },
        {
          identity: "Sango Xango",
          address: "FZpjhYdt6fqRSzW1nR4fRejavcrSo7UXYP4TDhE3mgimgeC",
          network: "kusama",
        },
        {
          identity: "Premiurly",
          address: "5ECNPeMZE5YrkAwwgVPSaxWfA7iDYFBLvLbHgSuNJynWyUiH",
          network: "polkadot",
        },
        {
          identity: "BINANCE_STAKE_10",
          address: "5EscYCwxaeVJgbKV6tfY49mtui7XJDF2GzuHqxwzMgTXxjjx",
          network: "polkadot",
        },
        {
          identity: "Pressburg Labs",
          address: "5CQ7Ro6SvNhd5LHn59x1hW4xF5PpaTyNbAW1o6ZV5fopJjBg",
          network: "polkadot",
        },

        {
          identity: "Eric | Pinknode T1",
          address: "5EHsYwMknMnJPuF3TDM4EsnWy1B9PbQNXajvLAfsm8nKPTui",
          network: "polkadot",
        },
        {
          identity: "Ramp Network",
          address: "5GCDTvWFVYTGL5q5RfToaU9Z4ZrASASLzLGCGFhugdFeB6my",
          network: "polkadot",
        },
      ],
    };
  },
  created() {
    //random and get top 4
    this.recommandAddresses.sort(function () {
      return 0.5 - Math.random();
    });
    this.recommandAddresses.length = 4;
  },
  methods: {
    useAddress(d) {
      this.inputValue = d.address;
      this.jumpToIndex();
    },
    jumpToIndex() {
      this.$router.push({
        name: "ProfileIndex",
        params: {
          nav: "Balance",
        },
        query: {
          address: this.inputValue,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.profile-home-page {
  height: calc(100vh - 60px);
  background: url(~@/assets/images/profile/bg.png) no-repeat center;
  background-size: 70% 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  .center {
    padding-bottom: 200px;
    .title {
      padding: 0 200px;
      font-size: 48px;
      font-weight: bold;
      color: #292828;
      margin-bottom: 57px;
    }
    .search-wrap {
      .input {
        width: 1050px;
        height: 72px;
        /deep/ .el-input__prefix {
          left: 25px;
          top: 25px;
          img {
            width: 20px;
            height: 20px;
          }
        }
        /deep/ .el-input__inner {
          height: 72px;

          padding-left: 63px;
          font-size: 16px;
          background: #ffffff;
          border-radius: 10px;
          border: 0 !important;
        }
      }
    }

    .recommand-addresses {
      padding: 40px 0px 0px;
      justify-content: center;
      display: flex;
      .desc {
        font-size: 16px;
        font-weight: bold;
        padding-right: 30px;
      }
      .address {
        padding-right: 10px;
        text-decoration: underline;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        color: rgb(96, 165, 250);
        &:hover {
          color: rgb(26, 121, 236);
        }
      }
    }
  }
}
</style>