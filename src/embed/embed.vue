<template>
  <div id="app"><router-view></router-view></div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="less">
html,
body {
  margin: 0px;
}
// echarts 自定义html元素的样式
.echart-tooltip-formatter-popover {
  .row {
    display: flex;
    justify-content: space-between;

    .label {
      color: #7f7e7e;
      margin-right: 15px;
    }

    .value {
      font-weight: bold;
      color: #545353;
    }
  }
}
.nft-detail-page-popover {
  font-size: 14px !important;
}
.dark {
  background-color: #1a202c;
  .chart-item {
    background-color: #1a202c !important;
    .title {
      color: #edeeee !important;
    }
  }
}

.layout {
  margin: 0 auto;
}

.chart-wrap {
  .row {
    display: flex;
    .chart-item {
      text-align: left;
      padding: 32px;
      flex: 1;
      height: calc(100vh - 64px);
      background: #ffffff;
      border-radius: 10px;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        .code-img {
          display: block !important;
        }
      }
      .title {
        position: relative;
        font-size: 20px;
        color: #292828;
        span {
          vertical-align: middle;
        }
        .info-icon {
          vertical-align: middle;
          width: 16px;
          height: 16px;
        }
        .code-img {
          opacity: 0.2;
          display: none;
          position: absolute;
          right: 0;
          top: 0;
          width: 24px;
          height: 24px;
          padding: 3px 5px;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            background: #ccc;
            opacity: 0.4;
          }
        }
        .checkbox-wrap {
          position: absolute;
          right: 0;
          top: 0;
          /deep/ .el-checkbox__label {
            color: #7f7e7e;
          }
        }
      }
      .chart {
        height: calc(100% - 32px);
        width: 100%;
      }
    }
  }
}
</style>
 