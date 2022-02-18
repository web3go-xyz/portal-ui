<template>
  <div class="insight-detail-page">
    <div class="layout">
      <!-- <div class="header">
        <div class="left">
          <img class="icon" src="/static/parachain-icon/moonbeam.png" alt="" />
          <span class="title">Moonbeam Account Overview</span>
          <span class="tip"
            >Moonbeam Balance • Edited 2 days ago by report d.</span
          >
        </div>
        <div class="right">
          <el-select clearable v-model="value" placeholder="AUTO REFRESH">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="icon-wrap">
            <i class="icon el-icon-share"></i>
            <i class="icon el-icon-full-screen"></i>
            <i class="icon el-icon-more"></i>
          </div>
        </div>
      </div> -->
      <div class="breadcrumb">
        <span class="link hover-item" @click="$router.back()"> Insight </span>
        <i class="el-icon-arrow-right"></i>
        <span class="text">{{$route.query.name}}</span>
      </div>
      <div class="content">
        <iframe
          allowTransparency="true"
          width="100%"
          height="100%"
          :src="$route.query.link"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      options: [
        { label: "select1", value: 1 },
        { label: "select2", value: 2 },
      ],
    };
  },
  created() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.insight-detail-page {
  background: rgb(245, 247, 249);
  height: calc(100vh - 60px);
  .layout {
    box-sizing: border-box;

    height: 100%;
    padding: 24px 100px;
    // .header {
    //   background: #ffffff;
    //   border-radius: 10px;
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   padding: 16px;
    //   & > .left {
    //     display: flex;
    //     align-items: center;
    //     .icon {
    //       width: 56px;
    //       height: 56px;
    //       margin-right: 8px;
    //     }
    //     .title {
    //       font-size: 24px;
    //       font-weight: bold;
    //       color: #292828;
    //       margin-right: 32px;
    //     }
    //     .tip {
    //       font-size: 16px;
    //       color: #a9a9a9;
    //     }
    //   }
    //   & > .right {
    //     display: flex;
    //     align-items: center;
    //     /deep/ input {
    //       border: 1px solid #d6d6d6 !important;
    //     }
    //     .icon-wrap {
    //       .icon {
    //         margin-left: 16px;
    //         cursor: pointer;
    //         &:hover {
    //           opacity: 0.8;
    //         }
    //       }
    //     }
    //   }
    // }
    .content {
      // overflow: auto;
      box-sizing: border-box;
      height: calc(100% - 41px);
      border-radius: 10px;
    }
  }
  .breadcrumb {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 24px;
    .link {
      font-size: 14px;
      color: #a9a9a9;
    }
    .el-icon-arrow-right {
      font-size: 12px;
      padding: 0 8px;
    }
    .text {
      font-size: 14px;
      color: #292828;
    }
  }
}
</style>