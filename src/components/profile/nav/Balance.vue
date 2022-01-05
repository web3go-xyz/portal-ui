<template>
  <div class="profile-balance-page">
    <div class="tag-wrap">
      <div class="tag" :class="{ active: !currentTag }" @click="clearTag">
        All Chains
      </div>
      <div
        v-for="(v, i) in balanceNavData"
        :key="i"
        class="tag"
        :class="{ active: currentTag && v.network == currentTag.network }"
        @click="changeTag(v)"
      >
        {{ v.network }}
      </div>
    </div>
    <div class="table-wrap">
      <div class="left-table">
        <el-table
          v-loading="balanceNavLoading"
          :data="
            filterBalanceNavData.slice(
              (tableParams1.pageIndex - 1) * tableParams1.pageSize,
              tableParams1.pageIndex * tableParams1.pageSize
            )
          "
          style="width: 100%"
          :row-class-name="getRowClass"
          @row-click="rowClick"
        >
          <el-table-column label="Token" width="225">
            <template slot-scope="scope">
              <div class="token-cell">
                <img class="left" :src="getIcon(scope.row)" alt="" />
                <div class="right">
                  <div class="item-title">{{ scope.row.network }}</div>
                  <div class="item-text">
                    <span>
                      <el-tooltip :content="scope.row.value" placement="top">
                        <span> {{ shorterAddress(scope.row.value) }}</span>
                      </el-tooltip>
                    </span>
                    <img
                      title="copy"
                      @click.stop="copy(scope.row.value)"
                      src="@/assets/images/profile/copy.png"
                      alt=""
                      class="copy hover-item"
                    />
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Price">
            <template slot-scope="scope">
              <div>$ {{ Number(scope.row.price).toFixed(2) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Balance">
            <template slot-scope="scope">
              <div>
                {{ scope.row.balance | format2 }}
                {{ scope.row.symbols[0] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Value">
            <template slot-scope="scope">
              <div>$ {{ scope.row.totalPrice | format2 }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="currentRow" v-loading="detailLoading" class="right-table">
        <el-table
          :data="
            detailData.slice(
              (tableParams2.pageIndex - 1) * tableParams2.pageSize,
              tableParams2.pageIndex * tableParams2.pageSize
            )
          "
          style="width: 100%"
        >
          <el-table-column width="190">
            <template slot-scope="scope">
              <div class="detail-from">
                <img class="left" :src="getIcon(currentRow)" alt="" />
                <div class="right">
                  <div class="item-title">
                    {{
                      $moment(scope.row.timestamp).format("YYYY-MM-DD HH:mm")
                    }}
                  </div>
                  <div class="item-text">
                    <span>
                      <el-tooltip
                        :content="
                          scope.row.fromAccountId || scope.row.accountId
                        "
                        placement="top"
                      >
                        <span>
                          {{
                            shorterAddress(
                              scope.row.fromAccountId || scope.row.accountId
                            )
                          }}</span
                        >
                      </el-tooltip>
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="30" class-name="icon-cell">
            <template>
              <div>
                <img
                  class="trans"
                  src="@/assets/images/profile/trans.png"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column width="145">
            <template slot-scope="scope">
              <div class="detail-to">
                <div class="item-title">
                  {{ scope.row.type }}
                </div>
                <div class="item-text">
                  <span>
                    <el-tooltip
                      :content="scope.row.toAccountId"
                      placement="top"
                    >
                      <span> {{ shorterAddress(scope.row.toAccountId) }}</span>
                    </el-tooltip>
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div v-if="scope.row.balanceChange" class="num-change-wrap">
                <img class="left" :src="getIcon(currentRow)" alt="" />
                <span v-if="isAdd(scope.row)" class="blue"
                  >+{{ scope.row.balanceChange }}</span
                >
                <span v-else class="red">-{{ scope.row.balanceChange }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination-wrap">
      <div class="left">
        <el-pagination
          layout="prev, pager, next"
          :total="filterBalanceNavData.length"
          :current-page.sync="tableParams1.pageIndex"
          :page-size="tableParams1.pageSize"
          @current-change="tableCurrentChange1"
        >
        </el-pagination>
      </div>
      <div class="right">
        <el-pagination
          v-if="currentRow"
          layout="prev, pager, next"
          :total="detailData.length"
          :current-page.sync="tableParams2.pageIndex"
          :page-size="tableParams1.pageSize"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";
import { getAccountDetail } from "@/api/profile/Balance";
export default {
  props: {
    balanceNavLoading: {
      type: Boolean,
    },
    balanceNavData: {
      type: Array,
    },
  },
  data() {
    return {
      detailLoading: false,
      currentRow: null,
      detailData: [],
      tableParams1: {
        pageIndex: 1,
        pageSize: 10,
      },
      tableParams2: {
        pageIndex: 1,
        pageSize: 10,
      },
      currentTag: null,
    };
  },
  created() {},
  computed: {
    filterBalanceNavData() {
      if (!this.currentTag) {
        return this.balanceNavData;
      }
      return this.balanceNavData.filter(
        (v) => v.network == this.currentTag.network
      );
    },
  },
  methods: {
    isAdd(row) {
      if (row.type == "Tranfer") {
        if (currentRow.value == row.fromAccountId) {
          return false;
        } else {
          return true;
        }
      }
      if (
        row.type == "Reserved" ||
        row.type == "Withdraw" ||
        row.type == "Slash"
      ) {
        return false;
      }
      return true;
    },
    copy(text) {
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.setAttribute("value", text);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.$message.success("Address Copied");
      }
      document.body.removeChild(input);
    },
    shorterAddress(address) {
      if (address && address.length > 20) {
        // debugger
        let subLength = 5;
        return (
          address.substring(0, subLength) +
          "..." +
          address.substring(address.length - subLength)
        );
      } else {
        return address;
      }
    },
    getIcon(v) {
      return `static/parachain-icon/${v.network}.png`;
    },
    getRowClass({ row }) {
      if (this.currentRow && row.network == this.currentRow.network) {
        return "active";
      }
      return "";
    },
    rowClick(row) {
      this.currentRow = row;
      this.detailLoading = true;
      this.detailData = [];
      getAccountDetail({
        account_id: row.value,
        time_start: "1970-01-01T00:00:00.000Z",
        time_end: new Date().toISOString(),
        include_transactions_detail: true,
      }).then((d) => {
        this.detailLoading = false;
        const detailData = [];
        d.transactions.forEach((v) => {
          v.list.forEach((sv) => {
            detailData.push({
              ...sv,
              type: v.type,
            });
          });
        });
        // 根据时间倒序
        detailData.sort((a, b) => {
          const result =
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          return result;
        });
        console.log("detailData", detailData);
        this.detailData = detailData;
      });
    },
    clearTable2() {
      this.currentRow = null;
      this.$set(this.tableParams2, "pageIndex", 1);
    },
    tableCurrentChange1() {
      this.clearTable2();
    },
    clearTag() {
      this.currentTag = null;
      this.clearTable2();
    },
    changeTag(v) {
      this.currentTag = v;
      this.clearTable2();
    },
  },
};
</script>

<style lang="less" scoped>
.profile-balance-page {
  .tag-wrap {
    .tag {
      display: inline-block;
      background: rgba(41, 40, 40, 0.05);
      border-radius: 4px;
      font-size: 14px;
      color: #7f7e7e;
      margin-right: 12px;
      margin-bottom: 8px;
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
    margin-top: 20px;
    display: flex;
    .left-table {
      flex: 5;
      overflow: hidden;
      /deep/ .el-table {
        .el-table__row {
          cursor: pointer;
        }
        .el-table__row.active {
          background: rgba(245, 247, 249, 1);
        }
        .el-table__body {
          border-spacing: 0 !important;
          .el-table__cell {
            padding-top: 5px;
            padding-bottom: 5px;
          }
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
      flex: 4;
      overflow: hidden;
      /deep/ .el-table {
        .el-table__body {
          border-spacing: 0 !important;
          .el-table__cell {
            padding-top: 5px;
            padding-bottom: 5px;
          }
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

        .el-table__empty-block {
          border-radius: 0;
          background: #f5f7f9 !important;
        }
        tr {
          background: #f5f7f9;
        }
      }
    }
    .token-cell {
      display: flex;
      align-items: center;
      .left {
        width: 26px;
        height: auto;
      }
      .right {
        flex: 1;
        margin: 0 11px;
        .item-title {
          font-size: 14px;
          font-weight: bold;
          color: #545353;
        }
        .item-text {
          display: flex;
          align-items: center;
          font-family: "Rubik";
          font-size: 12px;
          color: #a9a9a9;
          .copy {
            margin-left: 8px;
            width: 16px;
            height: 16px;
          }
        }
      }
    }
    .detail-from {
      display: flex;
      align-items: center;
      .left {
        width: 26px;
        height: auto;
      }
      .right {
        flex: 1;
        margin: 0 11px;
        .item-title {
          font-size: 14px;
          color: #7f7e7e;
        }
        .item-text {
          font-size: 14px;
          color: #545353;
        }
      }
    }
    .trans {
      width: 16px;
      height: 16px;
    }
    .detail-to {
      .item-title {
        font-size: 14px;
        color: #7f7e7e;
      }
      .item-text {
        font-size: 14px;
        color: #545353;
      }
    }
    .num-change-wrap {
      display: flex;
      align-items: center;
      .left {
        width: 26px;
        height: auto;
        margin-right: 8px;
      }
      .blue {
        font-size: 14px;
        color: #38cb98;
      }
      .red {
        font-size: 14px;
        color: #f53f3f;
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
  /deep/ .icon-cell .cell {
    padding: 0 !important;
  }
}
</style>