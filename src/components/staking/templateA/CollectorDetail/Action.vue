<template>
  <div class="table-wrap">
    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="roundindex" label="RoundIndex"> </el-table-column>
      <el-table-column prop="actiontype" label="Action"></el-table-column>

      <el-table-column prop="blocknumber" label="Block"></el-table-column>
      <el-table-column label="Balance Change">
        <template slot-scope="scope">
          <span
            >{{ scope.row.balancechange | roundNumber(2) }} {{ symbol }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="Balance Current">
        <template slot-scope="scope">
          <span
            >{{ scope.row.balancecurrent | roundNumber(2) }} {{ symbol }}</span
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrap">
      <el-pagination
        background
        layout="prev, pager, next,sizes,jumper"
        :total="totalCount"
        :current-page.sync="pageIndex"
        :page-size.sync="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        @current-change="getList"
        @size-change="getList"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import stakingService from "@/api/staking/index.js";

export default {
  props: {
    query: {
      type: Object,
    },
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      loading: false,
      tableData: [],
      totalCount: 0,
    };
  },
  created() {
    stakingService.base_api = this.query.base_api;
    this.getList();
  },
  computed: {
    symbol() {
      if (this.query && this.query.symbol) {
        return this.query.symbol;
      }
      return "Symbol";
    },
  },
  methods: {
    getList() {
      this.loading = true;
      stakingService
        .getCollatorActionHistory({
          collatorAccount: this.$route.query.id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.loading = false;
          this.tableData = res.list;
          this.totalCount = res.totalCount;
        });
    },
    shotFilter(str) {
      return str.slice(0, 6) + "..." + str.slice(str.length - 4, str.length);
    },
  },
};
</script>
<style lang="less" scoped>
.table-wrap {
  padding: 8px 24px;
  /deep/ .el-table {
    .el-table__row.active {
      background: rgba(245, 247, 249, 1);
    }
    .el-table__body {
      border-spacing: 0 !important;
    }
    td.el-table__cell,
    th.el-table__cell.is-leaf {
      border-bottom: 1px solid rgba(233, 233, 233, 1) !important;
      border-radius: 0 !important;
    }
    .cell {
      padding-left: 10px;
      color: rgba(41, 40, 40, 0.6);
    }
  }
  .pagination-wrap {
    text-align: right;
    margin-top: 20px;
    margin-bottom: 15px;
  }
}
</style>