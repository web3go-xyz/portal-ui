<template>
  <div class="table-wrap">
    <el-table
      v-loading="loading"
      :data="
        collectorData.allNominators.slice(
          (pageIndex - 1) * pageSize,
          pageIndex * pageSize
        )
      "
    >
      <el-table-column label="Rank" width="90">
        <template slot-scope="scope">
          <div
            class="rank-icon"
            :class="{
              first: scope.$index + 1 == 1,
              second: scope.$index + 1 == 2,
              third: scope.$index + 1 == 3,
            }"
          >
            {{ scope.$index + 1 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="roundindex" label="Delegator">
        <template slot-scope="scope">
          <div class="icon-cell">
            <img class="icon" :src="makeBlockie(scope.row.owner)" alt="" />
            <el-tooltip :content="scope.row.owner" placement="top">
              <span class="span" @click="turnDelegatorActionPage(scope.row)">{{
                shotFilter(scope.row.owner)
              }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="Stake">
        <template slot-scope="scope">
          <span>{{ scope.row.amount }} GLMR</span>
        </template>
      </el-table-column>
      <el-table-column label="Percent">
        <template slot-scope="scope">
          <span>{{ scope.row.percent }} %</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrap">
      <el-pagination
        background
        layout="prev, pager, next,sizes,jumper"
        :total="collectorData.allNominators.length"
        :current-page.sync="pageIndex"
        :page-size.sync="pageSize"
        :page-sizes="[10, 20, 50, 100]"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import makeBlockie from "ethereum-blockies-base64";

export default {
  props: {
    collectorData: {
      type: Object,
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
    };
  },

  methods: {
    makeBlockie(address) {
      return makeBlockie(address);
    },
    turnDelegatorActionPage(row) {
      this.$router.push({
        name: "MoonbeamDelegatorDetail",
        query: {
          id: row.owner,
        },
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
  .rank-icon {
    display: inline-block;
    padding: 1px 9px;
    background: #f5f7f9;
    border-radius: 50%;
    font-size: 14px;
    font-weight: bold;
    color: rgba(41, 40, 40, 0.6);
    &.first {
      background: #ffe599;
      color: #cc7429;
    }
    &.second {
      background: #dbe7ff;
      color: #7986a3;
    }
    &.third {
      background: #f6e2d4;
      color: #ce7321;
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