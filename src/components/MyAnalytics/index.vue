<template>
  <div class="my-analytics-page">
    <div class="layout">
      <div class="header">
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
      </div>
      <div class="content"></div>
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
.my-analytics-page {
  background: rgb(245, 247, 249);
  .layout {
    padding: 24px 100px;
    .header {
      background: #ffffff;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      & > .left {
        display: flex;
        align-items: center;
        .icon {
          width: 56px;
          height: 56px;
          margin-right: 8px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #292828;
          margin-right: 32px;
        }
        .tip {
          font-size: 16px;
          color: #a9a9a9;
        }
      }
      & > .right {
        display: flex;
        align-items: center;
        /deep/ input {
          border: 1px solid #d6d6d6 !important;
        }
        .icon-wrap {
          .icon {
            margin-left: 16px;
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
    .content {
      background: #ffffff;
      border-radius: 10px;
      height: 500px;
      margin-top: 24px;
    }
  }
}
</style>