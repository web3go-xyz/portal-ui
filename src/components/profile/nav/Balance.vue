<template>
  <div class="profile-balance-page">
    <div class="tag-wrap">
      <div
        v-for="(v, i) in tagList"
        :key="i"
        class="tag"
        :class="{ disabled: v.disabled, active: v.name == currentTag.name }"
        @click="changeTag(v)"
      >
        {{ v.name }}
      </div>
    </div>
    <div class="table-wrap">
      <div class="left-table">
        <el-table
          :data="tableData1"
          style="width: 100%"
          :row-class-name="getRowClass"
        >
          <el-table-column label="Token" prop="id"> </el-table-column>
          <el-table-column label="Price" prop="id"> </el-table-column>
          <el-table-column label="Balance" prop="id"> </el-table-column>
          <el-table-column label="Value" prop="id"> </el-table-column>
        </el-table>
      </div>
      <div class="right-table">
        <el-table :data="tableData2" style="width: 100%">
          <el-table-column label=" " prop="type">
            <template>
              <div>2342</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination-wrap">
      <el-pagination
        class="left"
        layout="prev, pager, next"
        :total="tableParams1.total"
        :current-page.sync="tableParams1.pageIndex"
      >
      </el-pagination>
      <el-pagination
        class="right"
        layout="prev, pager, next"
        :total="tableParams2.total"
        :current-page.sync="tableParams2.pageIndex"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentRow: null,
      tableData1: [{ id: 123 }, { id: 1234 }],
      tableData2: [{}],
      tableParams1: {
        pageIndex: 1,
        pageSize: 10,
        total: 33,
      },
      tableParams2: {
        pageIndex: 1,
        pageSize: 10,
        total: 33,
      },
      currentTag: {
        name: "All Chains",
      },
      tagList: [
        {
          name: "All Chains",
        },
        {
          name: "Polkadot",
        },
        {
          name: "Kusama",
          disabled: true,
        },
        {
          name: "Karura",
          disabled: true,
        },
      ],
    };
  },
  methods: {
    getRowClass({ row }) {
      if (this.currentRow && row.id == this.currentRow.id) {
        return "active";
      }
      return "";
    },
    changeTag(v) {
      this.currentTag = v;
    },
    handleCurrentChange1(pageIndex) {
      this.$set(this.table1Params, "pageIndex", pageIndex);
    },
    handleCurrentChange2(pageIndex) {
      this.$set(this.table2Params, "pageIndex", pageIndex);
    },
  },
};
</script>

<style lang="less" scoped>
.profile-balance-page {
  .tag-wrap {
    display: flex;
    .tag {
      background: rgba(41, 40, 40, 0.05);
      border-radius: 4px;
      font-size: 14px;
      color: #7f7e7e;
      margin-right: 12px;
      padding: 4px 8px;
      cursor: pointer;
      &.active {
        background: rgba(56, 203, 152, 0.1);
        color: rgba(56, 203, 152, 1);
      }
      &.disabled {
        cursor: initial;
        background: rgba(41, 40, 40, 0.05);
        color: rgba(212, 212, 212, 1);
      }
    }
  }
  .table-wrap {
    margin-top: 30px;
    display: flex;
    .left-table {
      flex: 1;
      overflow: hidden;
      /deep/ .el-table {
        .el-table__body {
          border-spacing: 0 !important;
        }
        .el-table__body tr:hover {
          box-shadow: none !important;
          background-color: #f5f7fa;
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
    }
    .right-table {
      background: #f5f7f9;
      flex: 1;
      overflow: hidden;
      /deep/ .el-table {
        .el-table__body {
          border-spacing: 0 !important;
        }
        .el-table__body tr:hover {
          box-shadow: none !important;
          background-color: #f5f7fa;
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
        th {
          height: 48px;
        }
        tr {
          background: #f5f7f9;
        }
      }
    }
  }
  .pagination-wrap {
    text-align: center;
    padding-top: 20px;
    display: flex;
    .left {
      flex: 1;
    }
    .right {
      flex: 1;
    }
  }
}
</style>