<template>
  <div class="layout nft-breakdown-page">
    <div class="back-title">
      <i
        class="el-icon-back"
        @click="$router.push({ name: $route.query.back })"
      ></i>
      <span class="text">{{ infoData.name }}</span>
      <span class="time"
        >Collection created at :
        {{ $moment(infoData.timestampCreatedAt).format("YYYY-MM-DD") }}</span
      >
    </div>

    <div class="nftNav-wrap">
      <div class="nftNav">
        <span class="hover-item" @click="goToOverview">Overview</span>
        <span class="hover-item active">Breakdown</span>
      </div>
    </div>
    <div class="info-wrap">
      <div class="item">
        <span class="label">Collection Name</span>
        <span class="text">{{ infoData.name }}</span>
      </div>
      <div class="item">
        <span class="label">Collection ID</span>
        <span class="text">{{ infoData.id }}</span>
      </div>
    </div>
    <div class="item-list-wrap">
      <div class="title">
        <span class="left-text"> Item List </span>
        <el-input
          @keyup.enter.native="search"
          placeholder="Search name"
          v-model="searchKey"
        >
          <img
            slot="prefix"
            class="search-icon"
            src="@/assets/images/nft/search.png"
            alt=""
          />
        </el-input>
      </div>
      <!-- <div class="item-list" v-loading="tableLoading">
        <div
          class="item hover-item"
          v-for="v in tableData"
          :class="{ active: currentNft && currentNft.id == v.id }"
          @click="clickItem(v)"
          :key="v.id"
        >
          <div class="title">{{ shorterName(v.name) }}</div>
          <div class="middle">
            <div class="label">Price</div>
            <div class="right">
              <el-progress
                :percentage="getPercent(v)"
                :show-text="false"
              ></el-progress>
              <div class="num">{{ v.price | formatKUSAMA }}</div>
            </div>
          </div>
          <div class="bottom">
            <div class="label">Contract date</div>
            <div class="date">
              {{ $moment(v.timestampCreatedAt).format("YYYY-MM-DD") }}
            </div>
          </div>
        </div>
      </div> -->
      <el-table
        class="table"
        :data="tableData"
        :loading="tableLoading"
        @sort-change="sortChange"
      >
        <el-table-column label="Item ID">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.id" placement="top">
              <span>{{ shorterAddress(scope.row.id) }} </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Name">
          <template slot-scope="scope">
            <span :title="scope.row.name"
              >{{ shorterName(scope.row.name) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Price(KSM)" sortable="custom" prop="price">
          <template slot-scope="scope">
            <div class="price-wrap">
              <span class="price">{{ scope.row.price | formatKUSAMA }} </span>
              <el-progress
                :percentage="getPercent(scope.row)"
                :show-text="false"
              ></el-progress>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Contract date"
          sortable="custom"
          prop="timestampCreatedAt"
        >
          <template slot-scope="scope">
            <span
              >{{ $moment(scope.row.timestampCreatedAt).format("YYYY-MM-DD") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="" width="80">
          <template slot-scope="scope">
            <span class="hover-item view" @click="clickItem(scope.row)"
              >View
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          background
          layout="prev, pager, next,sizes,jumper"
          :current-page.sync="pageIndex"
          :page-size.sync="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ipfsUtil from "@/utils/ipfsUtil";
import {
  getNFT,
  getNFTs,
  getCollections,
  getTradeHistoryOfNFT,
  getCollectionStatistic,
  getPriceRangeOfCollection,
} from "@/api/nftDetail";
export default {
  data() {
    return {
      ntfLink: "",
      tableLoading: false,
      chartLoading: false,
      currentNft: null,
      checked: false,
      infoData: {},
      collectionTotalVolume: null,
      latest7daysStart: "",
      latest7daysEnd: "",
      latest7days: [],
      averagePriceList: [],
      volumeList: [],
      nftTrades: [],
      smallTableData: [],
      tableData: [],
      pageSize: 10,
      pageIndex: 1,
      totalCount: 0,
      orderBys: [],
      searchKey: "",
    };
  },
  created() {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      arr.push(this.$moment().subtract(i, "days").format("YYYY-MM-DD"));
    }
    this.latest7days = arr;
    this.latest7daysStart = arr[0];
    this.latest7daysEnd = arr[arr.length - 1];
    getCollections({
      pageSize: 10,
      pageIndex: 1,
      orderBys: [],
      collection_id: this.$route.query.id,
    }).then((d) => {
      this.infoData = d.list[0];
    });
    getCollectionStatistic({
      pageSize: 10,
      pageIndex: 1,
      orderBys: [],
      collection_id: this.$route.query.id,
      collection_symbol: this.$route.query.symbol,
    }).then((d) => {
      this.collectionTotalVolume = d.list[0].collection_volume;
    });
    this.getTableData();
  },
  mounted() {},
  methods: {
    sortChange(params) {
      this.orderBys = [
        {
          sort: params.prop,
          order: params.order == "descending" ? "DESC" : "ASC",
        },
      ];
      this.getTableData();
    },
    clickBlockNumber(blockNumber) {
      window.open(`https://kusama.subscan.io/block/${blockNumber}`);
    },
    sortTime(a, b) {
      return (
        this.$moment(a.timestamp).valueOf() >
        this.$moment(b.timestamp).valueOf()
      );
    },
    sortPrice(a, b) {
      return Number(a.nftPrice) > Number(b.nftPrice);
    },
    clickItem(v) {
      this.$router.push({
        name: "NftItemDetail",
        query: {
          id: v.id,
        },
      });
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
    shorterName(name) {
      if (name && name.length > 30) {
        return name.substring(0, 30) + "...";
      } else {
        return name;
      }
    },
    search() {
      this.pageIndex = 1;
      this.getTableData();
    },
    getTableData() {
      this.tableLoading = true;
      getNFTs({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        orderBys: this.orderBys,
        collection_id: this.$route.query.id,
        nft_name: this.searchKey,
      }).then((d) => {
        this.tableLoading = false;
        this.tableData = d.list;
        this.totalCount = d.totalCount;
      });
    },
    handleSizeChange() {
      this.getTableData();
    },
    handleCurrentChange() {
      this.getTableData();
    },
    goToOverview() {
      this.$router.push({
        name: "NftDetail",
        query: this.$route.query,
      });
    },
    getPercent(v) {
      if (!this.collectionTotalVolume) {
        return 0;
      }
      const result = (v.price / this.collectionTotalVolume) * 100;
      return result;
    },
  },
};
</script>

<style lang="less" scoped>
.layout {
  padding-top: 32px;
  width: 1320px;
  margin: 0 auto;
}
.back-title {
  display: flex;
  align-items: center;
  text-align: left;
  .el-icon-back {
    padding: 10px;
    cursor: pointer;
    opacity: 0.7;
    font-weight: bold;
    transform: none;
    color: rgba(41, 40, 40, 1);

    &:hover {
      opacity: 0.5;
    }
  }
  .text {
    font-size: 24px;
    font-weight: bold;
    color: #292828;
  }
  .time {
    margin-left: 20px;
    font-size: 16px;
    color: #7f7e7e;
  }
}
.nftNav-wrap {
  text-align: left;
  .nftNav {
    background: #ebeff3;
    border-radius: 4px;
    margin-top: 32px;
    display: inline-block;
    padding: 5px;
    span {
      padding: 7px 39px;
      cursor: pointer;
      width: 147px;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      font-size: 16px;

      color: #7f7e7e;
      &.active {
        background: #ffffff;
        color: #38cb98;
        font-weight: 500;
      }
    }
  }
}
.info-wrap {
  margin-top: 24px;
  display: flex;
  padding: 18px 32px;
  background: #ffffff;
  border-radius: 10px;
  .item {
    &:first-child {
      margin-right: 50px;
    }
    text-align: left;
    .label {
      margin-right: 10px;
      font-size: 16px;
      color: #7f7e7e;
    }
    .text {
      font-size: 16px;
      color: #292828;
      &.link {
        color: rgba(56, 203, 152, 1);
      }
    }
  }
}
.chart-wrap {
  margin-top: 24px;
  .row {
    display: flex;
    .chart-item {
      text-align: left;
      padding: 32px;
      flex: 1;
      height: 425px;
      margin-right: 24px;
      margin-bottom: 24px;
      background: #ffffff;
      border-radius: 10px;
      &:last-child {
        margin-right: 0;
      }
      .title {
        position: relative;
        font-size: 20px;
        color: #292828;
        span {
          vertical-align: middle;
        }
        .info-icon {
          vertical-align: middle;
          width: 16px;
          height: 16px;
        }
        .checkbox-wrap {
          position: absolute;
          right: 0;
          top: 0;
          /deep/ .el-checkbox__label {
            color: #7f7e7e;
          }
        }
      }
      .chart {
        height: calc(100% - 32px);
        width: 100%;
      }
    }
  }
}
.item-list-wrap {
  padding-bottom: 24px;
  & > .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    margin-bottom: 10px;
    .left-text {
      text-align: left;
      font-size: 24px;
      color: #292828;
    }
    /deep/ .el-input {
      width: 360px;
    }
    /deep/ .el-input__inner {
      border-radius: 8px;
      border: 0 !important;
      padding-left: 33px;
    }
    .search-icon {
      margin-top: 12px;
      margin-left: 4px;
      width: 16px;
      height: 16px;
    }
  }
  .item-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 24px;
    .item {
      text-align: left;
      background: white;
      border-radius: 10px;
      padding: 23px;
      .title {
        font-size: 16px;
        font-weight: bold;
        color: #545353;
        margin-bottom: 12px;
      }
      .middle {
        display: flex;
        justify-content: space-between;
        .label {
          font-size: 14px;
          color: #7f7e7e;
        }
        .right {
          display: flex;
          align-items: center;
          /deep/ .el-progress {
            width: 100px;
          }
          .num {
            margin-left: 12px;
            font-size: 14px;
            color: #545353;
          }
        }
      }
      .bottom {
        margin-top: 4px;
        display: flex;
        justify-content: space-between;
        .label {
          font-size: 14px;
          color: #7f7e7e;
        }
        .date {
          font-size: 14px;
          color: #545353;
        }
      }
    }
  }
  .pagination-wrap {
    padding-top: 24px;
    text-align: right;
  }
}
.table {
  .price-wrap {
    display: flex;
    align-items: center;
    .price {
      margin-right: 20px;
    }
    /deep/ .el-progress {
      width: 100px;
    }
  }
  .view {
    color: #38cb98;
  }
  // /deep/ .el-table .el-table__body {
  //   border-spacing: 0;
  // }
  // /deep/ .el-table--enable-row-hover .el-table__body tr:hover {
  //   box-shadow: none;
  // }
  // /deep/ .el-table--enable-row-hover .el-table__body tr:nth-child(2n + 1) {
  //   background: #f5f7f9;
  // }
  // /deep/ .el-table {
  //   overflow: hidden !important;
  // }
  /deep/ th.el-table__cell {
    background: transparent !important;
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }
  /deep/ td:not(:first-child) .cell {
    padding-left: 10px !important;
  }
  // /deep/ .el-table__body-wrapper {
  //   overflow-y: auto !important;
  // }
}
</style>
<style lang="less">
.nft-breakdown-detail-page-popover {
  .img {
    width: 232px;
    height: 232px;
    background-size: contain;
  }
}
</style>
