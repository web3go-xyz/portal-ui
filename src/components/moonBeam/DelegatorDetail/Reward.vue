<template>
  <div class="table-wrap">
    <el-table v-loading="loading" :data="tableData">
      <el-table-column label="Collator">
        <template slot-scope="scope">
          <div class="icon-cell">
            <img class="icon" :src="makeBlockie(scope.row.collator)" alt="" />
            <el-tooltip :content="scope.row.collator" placement="top">
              <span class="span" @click="turnCollectorActionPage(scope.row)">{{
                shotFilter(scope.row.collator)
              }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
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
import makeBlockie from "ethereum-blockies-base64";

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
    makeBlockie(address) {
      return makeBlockie(address);
    },
    turnCollectorActionPage(row) {
      this.$router.push({
        name: "CollectorDetail",
        query: {
          id: row.collator,
        },
      });
    },
    getList() {
      this.loading = true;
      moonriverService
        .getDelegatorRewardHistory({
          delegatorAccount: this.$route.query.id,
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
  .delegator-span {
    font-size: 14px;
    color: rgba(56, 203, 152, 1);
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
  .icon-cell {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 8px;
      width: 32px;
      height: 32px;
    }
    .span {
      font-size: 14px;
      color: rgba(56, 203, 152, 1);
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>