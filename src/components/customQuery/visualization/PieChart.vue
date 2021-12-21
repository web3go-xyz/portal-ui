<template>
  <div class="viz-component viz-piechart">
    <div class="viz-options" v-if="options.editSupport">
      <!-- <div class="head">
        <div>Chart Options</div>
        <div>
          <el-button class="btn-chart-remove" type="danger" @click="removeChart"
            >Remove</el-button
          >
        </div>
      </div> -->
      <div class="config">
        <div class="section-title">
          <i class="el-icon-caret-right"></i>Display options
        </div>
        <div class="section-item">
          <div class="section-item-desc">Title</div>
          <div class="section-item-value">
            <el-input v-model="config.chartTitle" placeholder=""></el-input>
          </div>
        </div>

        <div class="section-title">
          <i class="el-icon-caret-right"></i>Result Data
        </div>
        <div class="section-item">
          <div class="section-item-desc">Name column</div>
          <div class="section-item-value">
            <el-select
              style="width: 100%"
              v-model="config.nameColumn"
              placeholder="choose field"
            >
              <el-option
                v-for="item in fields"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="section-item">
          <div class="section-item-desc">Value column</div>
          <div class="section-item-value">
            <el-select
              style="width: 100%"
              v-model="config.valueColumn"
              placeholder="choose field"
            >
              <el-option
                v-for="item in fields"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="generate">
        <el-button
          class="btn-chart-generate"
          type="primary"
          @click="generateChart"
          >Run</el-button
        >
      </div>
    </div>
    <div class="viz-chart">
      <div ref="chart" style="width: 100%; height: 100%"></div>
    </div>
  </div>
</template>

<script>
import css from "./viz.less";
export default {
  props: {
    data: {
      type: Object,
    },
    id: String,
    options: {
      type: Object,
    },
  },
  computed: {
    tableData() {
      if (this.data && this.data.table) {
        return this.data.table;
      }
      return [];
    },
    fields() {
      let columnNames = [];
      if (this.data.table && this.data.table.length > 0) {
        let firstRecord = this.data.table[0];
        for (const key in firstRecord) {
          columnNames.push({ value: key, label: key });
        }
      }
      return columnNames;
    },
  },
  data() {
    return {
      config: {
        chartTitle: "",
        nameColumn: "",
        valueColumn: "",
      },

      chartInstance: null,
    };
  },
  mounted() {
    console.log("pieChart mounted");
    if (this.options) {
      this.config.chartTitle = this.options.chartTitle || "";
      this.config.nameColumn = this.options.nameColumn || "";
      this.config.valueColumn = this.options.valueColumn || "";
    }
  },
  methods: {
    refresh() {
      console.log("refresh current component id=", this.id);
      this.generateChart();
    },
    removeChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose();
        this.chartInstance = null;
      }
      this.$emit("viz-component-remove", this.id);
    },
    generateChart() {
      if (this.chartInstance == null) {
        this.chartInstance = echarts.init(this.$refs.chart);
      }
      var resize = {
        width:
          this.options && this.options.editSupport
            ? 700
            : window.innerWidth > 1440
            ? 1280
            : 1100,
        height: 500,
      };
      this.chartInstance.resize(resize);

      if (this.config.nameColumn && this.config.valueColumn) {
        let pieData = this.getPieData();
        this.chartInstance.setOption({
          color: [
            "#38CB98",
            "rgba(91, 127, 255, 1)",
            "rgba(255, 86, 48, 1)",
            "#5470c6",
            "#91cc75",
            "#fac858",
            "#ee6666",
            "#73c0de",
            "#3ba272",
            "#fc8452",
            "#9a60b4",
            "#ea7ccc",
          ],
          tooltip: { trigger: "item" },
          darkMode: true,
          legend: { type: "scroll", bottom: 10 },
          title: {
            text: this.config.chartTitle,
            textStyle: {
              color: "rgba(41, 40, 40, 0.8)",
            },
            left: 10,
            top: 10,
          },
          series: [
            {
              type: "pie",
              radius: ["40%", "60%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              data: pieData,
            },
          ],
        });

        if (this.options && this.options.editSupport) {
          let newOptions = {
            id: this.id,
            ...this.options,
            ...this.config,
          };
          this.$emit("viz-component-update-options", newOptions);
        }
      }
    },
    getPieData() {
      if (this.config.valueColumn && this.config.nameColumn) {
        let pieData = [];
        this.tableData.forEach((row) => {
          pieData.push({
            value: row[this.config.valueColumn],
            name: row[this.config.nameColumn],
          });
        });
        return pieData;
      }
      return [];
    },
  },
};
</script>

 