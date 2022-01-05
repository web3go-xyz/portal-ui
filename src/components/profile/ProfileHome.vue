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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: "",
    };
  },

  methods: {
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
  display: flex;
  align-items: center;
  justify-content: center;
  .center {
    padding-bottom: 200px;
    .title {
      padding: 0 100px;
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
  }
}
</style>