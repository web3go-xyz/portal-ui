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

.dark {
  background-color: #1A202C;
  .chart-item {
    background-color: #1A202C !important;
    .title {
      color: #edeeee !important;
    }
  }
}
</style>
 