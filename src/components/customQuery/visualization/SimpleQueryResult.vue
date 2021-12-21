<template>
  <div class="viz-table">
    <el-table
      :data="
        tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      style="width: 100%"
    >
      <el-table-column v-for="h in headers" :key="h" :prop="h" :label="h">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="parseInt(total)"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    total() {
      if (this.data && this.data.table) {
        return this.data.table.length;
      }
      return 0;
    },
    tableData() {
      if (this.data && this.data.table) {
        return this.data.table;
      }
      return [];
    },
    headers() {
      let columnNames = [];
      if (this.data.table && this.data.table.length > 0) {
        let firstRecord = this.data.table[0];
        for (const key in firstRecord) {
          columnNames.push(key);
        }
      }
      return columnNames;
    },
  },
  data() {
    return {
      pagesize: 10,
      currentPage: 1,
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style scoped>
</style>