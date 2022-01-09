<template>
  <div class="ProfileNFT ProfileNFT-rmrk">
    <div class="common-profile-title">
      <img src="/static/images/rmrk-logo.png" alt="" />
      <span>RMRK NFT</span>
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
                  >{{
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
              layout="prev, pager, next,sizes,jumper"
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
import { getAccountOwnedNFT } from "@/api/profile/nft";
import { formatKUSAMA } from "@/filters";
export default {
  name: "ProfileNFTRMRK",
  data() {
    return {
      query: {
        pageSize: 10,
        pageIndex: 1,
        orderBys: []
      },
      listData: [],
      totalCount: 0,
      loading: false,
      tableTitle: [
        {
          col: 6,
          title: "Collection",
          value: "collection_name",
          click: this.goDetail,
          className: "collection"
        },
        {
          col: 6,
          className: "collection",
          click: this.goDetail,
          value: "nft_name",
          title: "NFT"
        },
        {
          col: 4,
          align: "right",
          value: "price",
          filter: formatKUSAMA,
          title: "Price"
        },
        {
          col: 4,
          offset: 4,
          value: "own_date",
          filter: this.filterTimestamp_created_at,
          title: "Own date"
        }
      ]
    };
  },
  props: {
    addressList: {
      type: Array
    }
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
    goDetail(item) {
      this.$router.push({
        name: "NftDetail",
        query: {
          back: this.$router.currentRoute.name,
          id: item.collection_id,
          symbol: item.symbol
        }
      });
    },
    init() {
      if (!this.addressList || !this.addressList.length) return;
      const account_id = this.addressList.filter(
        item => item.network === "kusama"
      )[0].value;
      this.loading = true;
      getAccountOwnedNFT({
        account_id
      }).then(res => {
        this.loading = false;
        this.listData = res.nft_list;
        this.totalCount = res.nft_list.length;
      });
    },
    filterTimestamp_created_at(str) {
      return this.$moment(str).format("YYYY-MM-DD");
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
