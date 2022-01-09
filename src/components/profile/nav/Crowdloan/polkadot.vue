<template>
  <div class="ProfileNFT ProfileNFT-rmrk">
    <div class="common-profile-title">
      <img src="/static/parachain-icon/polkadot.png" alt="" />
      <span>DOT {{ totalamount }}</span>
    </div>
    <div class="nftNavCon">
      <div class="nftNavConList">
        <div
          class="nftNavConList-table"
          v-loading="loading"
          element-loading-text="loading "
          element-loading-spinner="el-icon-loading"
        >
          <div class="nftNavConList-table-header">
            <el-row>
              <el-col
                :span="item.col"
                v-for="item in tableTitle"
                :key="item.value"
                :align="item.align"
                :offset="item.offset"
                :class="item.className"
                >{{ item.title }}
              </el-col>
            </el-row>
          </div>
          <div class="nftNavConList-table-content">
            <div class="lp-row">
              <el-row v-for="item in renderListData" :key="item.id">
                <el-col
                  :span="tableTitle[index].col"
                  v-for="(cell, index) in tableTitle"
                  :key="item[cell.value]"
                  :align="tableTitle[index].align"
                  :offset="tableTitle[index].offset"
                  @click.native="
                    tableTitle[index].click && tableTitle[index].click(item)
                  "
                  :class="tableTitle[index].className"
                  ><img
                    v-if="tableTitle[index].img"
                    :src="tableTitle[index].img(item)"
                    alt=""
                  />
                  {{
                    tableTitle[index].filter
                      ? tableTitle[index].filter(item[cell.value])
                      : item[cell.value]
                  }}
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-if="!listData.length" class="common-profile-table-nodata">
            No Data
          </div>
          <div class="nftNavConList-table-pagination">
            <el-pagination
              background
              layout="prev, pager"
              :current-page.sync="query.pageIndex"
              :page-size.sync="query.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :total="totalCount"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPolkadotCrowdloanContributions,
  getPolkadotParaChainList
} from "@/api/profile/crowdloan";
import { formatDOT } from "@/filters";
export default {
  name: "ProfileCrodloanPolkadot",
  props: {
    addressList: {
      type: Array
    }
  },
  data() {
    return {
      query: {
        pageSize: 10,
        pageIndex: 1,
        orderBys: []
      },
      totalamount: "",
      listData: [],
      totalCount: 0,
      loading: false,
      tableTitle: [
        {
          col: 6,
          title: "Parachain",
          value: "projectName",
          img: this.getIcon,
          click: this.goDetail,
          className: "parachain collection"
        },
        {
          col: 4,
          title: "Amount（DOT）",
          align: "right",
          filter: formatDOT,
          value: "amount"
        },
        {
          col: 4,
          offset: 2,
          title: "BlockNumber",
          align: "right",
          value: "blockNumber"
        },
        {
          col: 4,
          title: "Time",
          offset: 4,
          filter: this.filterTimestamp_created_at,
          value: "createdTime"
        }
      ]
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  computed: {
    renderListData() {
      return this.listData.slice(
        (this.query.pageIndex - 1) * this.query.pageSize,
        this.query.pageIndex * this.query.pageSize
      );
    }
  },
  methods: {
    goDetail(row) {
      this.$router.push({
        name: "ParaChainCrowdloanContributionDetail4Polkadot",
        query: {
          crowdloanId: row.crowdloanId,
          lastUpdateTime: row.createdTime,
          projectName: row.projectName,
          iconPath: row.icon
        }
      });
    },
    getIcon(item) {
      return `static/parachain-icon/${item.icon}`;
    },
    init() {
      if (!this.addressList || !this.addressList.length) return;
      this.loading = true;
      const account = this.addressList.filter(
        item => item.network === "polkadot"
      )[0].value;
      getPolkadotParaChainList().then(res => {
        this.allParachainList = res.list;
        getPolkadotCrowdloanContributions({
          account
        }).then(res => {
          this.loading = false;
          this.totalCount = res.length;
          this.totalamount = formatDOT(
            this.totalCount
              .map(item => +item.amount)
              .reduce((prev, curr) => {
                return prev + curr;
              })
          );
          let list = res;
          if (list) {
            for (const d of list) {
              let paraId = d.paraId;
              let findParachainInfo = this.allParachainList.find(t => {
                return t.paraId === paraId;
              });
              if (findParachainInfo) {
                d.icon = findParachainInfo.icon;
                d.projectName = findParachainInfo.projectName;
              }
            }
          }
          this.listData = list;
        });
      });
    },
    filterTimestamp_created_at(str) {
      return this.$moment(str).format("YYYY-MM-DD hh:mm:ss");
    },
    handleSizeChange(val) {
      this.query.pageIndex = val;
    },
    handleCurrentChange(val) {
      this.query.pageIndex = val;
    }
  },
  watch: {
    addressList(val) {
      if (val && val.length) {
        this.addressList = val;
        this.init();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.ProfileNFT {
  .parachain {
    display: flex;
    align-items: center;
    img {
      margin-right: 8px;
      width: 32px;
      height: 32px;
    }
  }
  .nftNavCon {
    .nftNavConList {
      margin-top: 37px;
      text-align: left;
      &-head {
        .title {
          font-size: 24px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: #292828;
          margin-right: 4px;
        }
        .icon {
          cursor: pointer;
          width: 16px;
          height: 16px;
        }
      }

      &-table {
        margin-top: 25px;
        &-header {
          padding-left: 24px;
          font-size: 14px;
          font-family: Rubik-Medium, Rubik;
          font-weight: 500;
          color: #7f7e7e;
          padding-bottom: 8px;
          line-height: 17px;
        }
        &-content {
          .lp-row {
            .el-row {
              background: #ffffff;
              padding-left: 24px;
              line-height: 60px;
              border-radius: 6px;
              font-size: 14px;
              font-family: Rubik-Regular, Rubik;
              font-weight: 400;
              color: #7f7e7e;
              margin-top: 8px;
            }
          }
          .collection {
            cursor: pointer;
            font-weight: 500;
            color: #38cb98;
            .collection_name {
              display: block;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
            }
          }
        }
        &-pagination {
          margin-top: 20px;
          text-align: right;
        }
      }
    }
  }
}
</style>
