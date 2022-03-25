<template>
  <div class="table-wrap">
    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="realroundindex" label="RoundIndex">
      </el-table-column>
      <el-table-column prop="issueroundindex" label="issue roundIndex">
      </el-table-column>
      <el-table-column prop="issueBlock" label="issue blocknumber">
      </el-table-column>
      <el-table-column prop="balance" label="balance"></el-table-column>
      <el-table-column prop="timestamp" label="timestamp">
        <template slot-scope="scope">
          <span>{{
            $moment(scope.row.timestamp).format("YYYY-MM-DD HH:mm:ss")
          }}</span>
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
import moonriverService from "@/api/moonBeam";

export default {
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
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      moonriverService
        .getCollatorRewardHistory({
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