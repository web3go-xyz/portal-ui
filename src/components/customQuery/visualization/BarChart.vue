<template>
  <div class="viz-component viz-barchart">
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
          <div class="section-item-desc">X column</div>
          <div class="section-item-value">
            <el-select
              style="width: 100%"
              v-model="config.xColumn"
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
          <div class="section-item-desc">Y column</div>
          <div class="section-item-value">
            <el-select
              style="width: 100%"
              v-model="config.yColumn"
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
import { shorterAddress } from "@/filters";
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
      config: { chartTitle: "", xColumn: "", yColumn: "" },

      chartInstance: null,
    };
  },
  mounted() {
    console.log("BarChart mounted");
    if (this.options) {
      this.config.chartTitle = this.options.chartTitle || "";
      this.config.xColumn = this.options.xColumn || "";
      this.config.yColumn = this.options.yColumn || "";
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

      if (this.config.xColumn && this.config.yColumn) {
        // debugger;
        let xData = this.getxAxisData();
        let yData = this.getyAxisData();
        const option = {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(119, 229, 199)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(84, 204, 155)", // 100% 处的颜色
              },
            ],
          },
          tooltip: { trigger: "item" },
          darkMode: true,
          title: {
            text: this.config.chartTitle,
            textStyle: {
              color: "rgba(41, 40, 40, 0.8)",
            },
            left: 10,
            top: 10,
          },
          grid: {
            bottom: 150,
          },
          xAxis: {
            type: "category",
            data: xData,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "rgba(41, 40, 40, 0.4)",
              rotate: 60,
              formatter: function (value) {
                return shorterAddress(value);
              },
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              color: "rgba(41, 40, 40, 0.4)",
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
                color: "rgba(41, 40, 40, 0.4)",
              },
            },
          },
          series: [
            {
              data: yData,
              type: "bar",
              itemStyle: {
                borderRadius: [6, 6, 0, 0],
              },
            },
          ],
        };
        const hasData = yData.find((v) => !isNaN(Number(v)));
        if (!hasData) {
          option.yAxis.min = 0;
          option.yAxis.max = 1;
        }
        this.chartInstance.setOption(option);

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
    getxAxisData() {
      if (this.config.xColumn) {
        let data = [];
        this.tableData.forEach((row) => {
          data.push(row[this.config.xColumn]);
        });
        return data;
      }
      return [];
    },
    getyAxisData() {
      if (this.config.yColumn) {
        let data = [];
        this.tableData.forEach((row) => {
          data.push(row[this.config.yColumn]);
        });
        return data;
      }
      return [];
    },
  },
};
</script>

 