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
          :data="
            filterBalanceNavData.slice(
              (tableParams1.pageIndex - 1) * tableParams1.pageSize,
              tableParams1.pageIndex * tableParams1.pageSize
            )
          "
          style="width: 100%"
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
                      class="copy"
                    />
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Price">
            <template slot-scope="scope">
              <i
                v-if="scope.row.price === undefined"
                class="el-icon-loading"
              ></i>
              <div v-else>$ {{ Number(scope.row.price).toFixed(2) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Balance">
            <template slot-scope="scope">
              <i
                v-if="scope.row.balance === undefined"
                class="el-icon-loading"
              ></i>
              <div v-else>
                {{ scope.row.balance | format2 }}
                {{ scope.row.symbols[0] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Value">
            <template slot-scope="scope">
              <i
                v-if="scope.row.totalPrice === undefined"
                class="el-icon-loading"
              ></i>
              <div v-else>$ {{ scope.row.totalPrice | format2 }}</div>
            </template>
          </el-table-column>
          <el-table-column width="80" label=" " align="center">
            <template slot-scope="scope">
              <i
                v-if="
                  currentRow &&
                  scope.row.value == currentRow.value &&
                  detailLoading
                "
                class="el-icon-loading"
              ></i>
              <span v-else class="view hover-item" @click="rowClick(scope.row)"
                ><div v-if="supportBalance(scope.row)">view</div></span
              >
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
    </div>
    <el-dialog
      center
      :title="currentRow && (currentRow.value)"
      :visible.sync="visbile"
      width="600"
    >
      <div class="right-table">
        <el-table
          v-loading="detailLoading"
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
              <img
                class="trans"
                src="@/assets/images/profile/trans.png"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column>
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
                  >+{{
                    scope.row.balanceChange
                      | formatBalanceWithDecimal(getDecimal())
                  }}</span
                >
                <span v-else class="red"
                  >-{{
                    scope.row.balanceChange
                      | formatBalanceWithDecimal(getDecimal())
                  }}</span
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrap">
        <el-pagination
          v-if="currentRow"
          layout="prev, pager, next"
          :total="detailData.length"
          :current-page.sync="tableParams2.pageIndex"
          :page-size="tableParams1.pageSize"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAccountDetail } from "@/api/profile/parachain.balance";
export default {
  name: "Profile-Balance",
  props: {
    balanceNavData: {
      type: Array,
    },
    showZeroBalance: {
      type: Boolean,
    },
  },
  data() {
    return {
      visbile: false,
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
  watch: {
    showZeroBalance() {
      this.clearTable2();
    },
  },
  computed: {
    filterBalanceNavData() {
      // 过滤是否显示zero balance
      const result = this.balanceNavData.filter((v) => {
        if (this.showZeroBalance) {
          return true;
        } else {
          return v.balance > 0;
        }
      });
      // 过滤选中tag
      if (!this.currentTag) {
        return result;
      }
      return result.filter((v) => v.network == this.currentTag.network);
    },
  },
  methods: {
    supportBalance(d) {
      let s = ["polkadot", "litmus"];
      // console.log(d);
      return s.indexOf(d.network) >= 0;
    },
    getDecimal() {
      if (
        this.currentRow &&
        this.currentRow.decimals &&
        this.currentRow.decimals.length > 0
      ) {
        return this.currentRow.decimals[0];
      }
      return 0;
    },
    isAdd(row) {
      if (row.type == "Transfer") {
        if (this.currentRow.value == row.fromAccountId) {
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
        network: row.network,
        account_id: row.value,
        time_start: "1970-01-01T00:00:00.000Z",
        time_end: new Date().toISOString(),
        include_transactions_detail: true,
      }).then((d) => {
        this.detailLoading = false;
        const detailData = [];
        d.transactions.forEach((v) => {
          v.list.forEach((sv) => {
            let record = {
              ...sv,
              type: v.type,
            };
            if (record.type === "Endowed") {
              record.balanceChange = record.freeBalance;
            }
            detailData.push(record);
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
        if (this.detailData.length) {
          this.visbile = true;
        } else {
          this.$message.warning("The wallet has no data");
        }
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
      .has-gutter {
        display: none;
      }
    }
  }
  .view {
    font-size: 14px;
    color: #38cb98;
  }
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
        .el-table__body {
          border-spacing: 0 !important;
          .el-table__cell {
            padding-top: 5px;
            padding-bottom: 5px;
          }
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
          opacity: 0.6;
          cursor: pointer;
          &:hover {
            opacity: 0.4;
          }
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
    display: block;
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
  .pagination-wrap {
    text-align: center;
    padding-top: 20px;
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
  .empty {
    padding-top: 190px;
    box-sizing: border-box;
    height: 569px;
    line-height: initial;
    .img-wrap {
      margin-bottom: 16px;
      img {
        width: 120px;
        height: 115px;
      }
    }
    .text {
      font-size: 18px;
      color: rgba(41, 40, 40, 0.6);
    }
  }
  // /deep/ .detail-dialog {
  //   border-radius: 10px;
  //   .el-dialog__header{
  //     padding-top:24px;
  //   }
  //   .el-dialog__title {
  //     font-size: 24px;
  //     font-weight: bold;
  //     color: #262626;
  //   }
  // }
}
</style>