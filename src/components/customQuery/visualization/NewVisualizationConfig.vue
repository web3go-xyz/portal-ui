<template>
  <div class="viz-config viz-config-page">
    <div
      v-if="
        $route.query.editSupport === true || $route.query.editSupport === 'true'
      "
      class="viz-config-select"
    >
      <el-select
        v-model="choosedVizType"
        placeholder="choose visualization type"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button class="btn-add" @click="add">Add</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
  computed: {},
  data() {
    return {
      choosedVizType: null,
      options: [
        {
          value: "BarChart",
          label: "BarChart",
        },
        {
          value: "LineChart",
          label: "LineChart",
        },
        {
          value: "PieChart",
          label: "PieChart",
        },
      ],
    };
  },
  methods: {
    add() {
      if (!this.choosedVizType) {
        this.$message.error("please choose visualization type");
        return;
      }

      this.$emit("viz-component-add", this.choosedVizType);
    },
  },
};
</script>

<style lang="less" scoped>
.viz-config {
  .viz-config {
    text-align: left;
    padding: 10px 10px;
    color: #fff;
  }
  .viz-config-select {
    display: flex;
    align-items: baseline;
  }
  .viz-config-desc {
    margin-right: 10px;
  }
  .viz-config-add {
    text-align: left;
    margin-top: 10px;
  }
  .btn-add {
    width: 150px;
    background: #17c684;
    border-radius: 6px;
    color: #fff;
    border-color: #111111;
  }
  .btn-add:hover {
    color: #fff;
    border-color: #111111;
    background: #168d5f;
  }
}

body.white-theme .viz-config-page {
  .btn-add {
    width: 59px;
    height: 40px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid rgba(41, 40, 40, 0.4);
    font-size: 14px;
    font-family: Rubik-Medium, Rubik;
    font-weight: 500;
    color: rgba(41, 40, 40, 0.8);
    padding: 0;
    margin-left: 20px;
  }
  .viz-config-select /deep/ .el-input__inner {
    background-color: transparent !important;
  }
  .btn-add:hover {
    opacity: 0.7;
  }
}
</style>