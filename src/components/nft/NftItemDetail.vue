<template>
  <div class="layout nft-breakdown-page">
    <div class="item-big-title">
      <span class="label hover-item" @click="$router.back()">Item List</span>
      <i class="el-icon-arrow-right"></i>
      <span class="text">{{ infoData.name }}</span>
    </div>
    <div class="info-wrap">
      <div class="left">
        <div class="left-title">
          {{ infoData.name }}
        </div>
        <div class="item">
          <span class="label">Item ID</span>
          <span class="text">{{ infoData.id }}</span>
        </div>
        <div class="item">
          <span class="label">Collection</span>
          <span class="text">{{ infoData.collectionId }}</span>
        </div>
        <div class="item">
          <span class="label">Creator</span>
          <span class="text">{{ infoData.issuer }}</span>
        </div>
        <div class="item">
          <span class="label">Owner</span>
          <span class="text">{{ infoData.currentOwner }}</span>
        </div>
        <div class="item">
          <span class="label">Metadata</span>
          <span class="text">{{ infoData.metadata }}</span>
        </div>
      </div>
      <div class="right">
        <div
          class="img"
          :style="{ 'background-image': 'url(' + ntfLink + ')' }"
        ></div>
      </div>
    </div>
    <div class="chart-wrap">
      <div class="row">
        <div class="chart-item" v-loading="chartLoading">
          <div class="title">
            <span> NFT Trades Over Time </span>
            <el-tooltip
              placement="top"
              trigger="hover"
              content="Track the specific item trades date and price"
            >
              <img class="info-icon" src="@/assets/images/info-icon.png" />
            </el-tooltip>
          </div>
          <div class="chart chart1" ref="chart1"></div>
        </div>
        <div class="chart-item table" v-loading="chartLoading">
          <div class="title">
            <span> NFT Activities Over Time </span>
            <el-tooltip
              placement="top"
              trigger="hover"
              content="Track all interactions of item order by time"
            >
              <img class="info-icon" src="@/assets/images/info-icon.png" />
            </el-tooltip>
          </div>
          <div class="table-wrap">
            <el-table :data="smallTableData" height="390">
              <el-table-column label="Time" sortable :sort-method="sortTime">
                <template slot-scope="scope">
                  <span>{{ $moment(scope.row.timestamp).fromNow() }} </span>
                </template>
              </el-table-column>
              <el-table-column label="From">
                <template slot-scope="scope">
                  <identity-icon-plus
                    :addressInfo="{
                      address: scope.row.interactionAccount,
                      addressDisplayCompact: true,
                      iconSize: 18,
                      fontSize: 12,
                    }"
                  ></identity-icon-plus>
                </template>
              </el-table-column>
              <el-table-column label="To">
                <template slot-scope="scope">
                  <identity-icon-plus
                    :addressInfo="{
                      address: getToAccount(scope.row),
                      addressDisplayCompact: true,
                      iconSize: 18,
                      fontSize: 12,
                    }"
                  ></identity-icon-plus>
                </template>
              </el-table-column>
              <el-table-column
                prop="interaction"
                label="Interaction"
                width="100"
              >
              </el-table-column>
              <el-table-column
                width="110"
                label="Price(KSM)"
                sortable
                :sort-method="sortPrice"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.nftPrice | formatKUSAMA }} </span>
                </template>
              </el-table-column>
              <el-table-column width="100" label="BlockNumber">
                <template slot-scope="scope">
                  <span
                    class="hover-item block-number"
                    @click="clickBlockNumber(scope.row.blockNumber)"
                    >{{ scope.row.blockNumber }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IdentityIconPlus from "@/components/ui-elements/IdentityIconPlus.vue";
import ipfsUtil from "@/utils/ipfsUtil";
import { getNFT, getTradeHistoryOfNFT } from "@/api/nftDetail";
export default {
  components: { IdentityIconPlus },
  data() {
    return {
      ntfLink: "",
      tableLoading: false,
      chartLoading: false,
      currentNft: null,
      checked: false,
      infoData: {},
      averagePriceList: [],
      volumeList: [],
      nftTrades: [],
      smallTableData: [],
      tableData: [],
      pageSize: 20,
      pageIndex: 1,
      totalCount: 0,
    };
  },
  created() {
    this.getItemDetail(this.$route.query.id);
  },
  mounted() {},
  methods: {
    getToAccount(row) {
      if (row.interaction === "BUY" || row.interaction === "LIST") {
        return row.caller;
      }
      if (row.interaction === "SEND") {
        return row.meta;
      }
      return row.interactionAccount;
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
    getItemDetail(id) {
      let self = this;
      this.chartLoading = true;
      getTradeHistoryOfNFT({
        nft_id: id,
        interactionFilters: ["MINTNFT", "BUY", "LIST", "SEND", "CONSUME"],
      }).then((d) => {
        this.chartLoading = false;
        this.nftTrades = d.map((v) => {
          return [
            v.timestamp,
            this.$utils.formatTokenNumber(v.nftPrice, this.$utils.KSM_RATIO),
          ];
        });
        this.smallTableData = d;
        this.initChart();
      });
      getNFT({
        nft_id: id,
      }).then((d) => {
        this.infoData = d;

        ipfsUtil.getIpfsPath(d.resources, d.metadata).then((resp) => {
          self.ntfLink = resp;
        });
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
    initChart() {
      const chart = echarts.init(this.$refs.chart1, null, { locale: "EN" });
      const option = {
        color: ["rgba(95, 204, 186, 1)", "rgba(255, 125, 0, 1)"],
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const index = params[0].dataIndex;
            const obj = this.smallTableData[index];
            return `
            <div class="echart-tooltip-formatter-popover">
              ${this.$moment(obj.timestamp).format("YYYY-MM-DD HH:mm:ss")}
              <div class="row">
                <div class="label">price:</div> 
                <div class="value">${this.$utils.formatToken(
                  obj.nftPrice,
                  this.$utils.KSM_RATIO
                )} KSM</div>
              </div>
              <div class="row">
                <div class="label">interaction:</div> 
                <div class="value">${obj.interaction}</div>
              </div>
               <div class="row">
                <div class="label">From:</div> 
                <div class="value">${this.shorterAddress(
                  obj.interactionAccount
                )}</div>
              </div>
               <div class="row">
                <div class="label">To:</div> 
                <div class="value">${this.shorterAddress(obj.caller)}</div>
              </div>
                <div class="row">
                <div class="label">BlockNumber:</div> 
                <div class="value">${this.shorterAddress(obj.blockNumber)}</div>
              </div>
            </div>
                `;
          },
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 100,
          },
        ],
        grid: {
          containLabel: true,
          left: 10,
          top: 70,
          bottom: 50,
          right: 10,
        },
        xAxis: [
          {
            type: "time",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: "#A9A9A9",
              fontSize: 14,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#A9A9A9",
              fontSize: 14,
            },
            splitLine: {
              lineStyle: {
                color: "rgba(232, 232, 232, 1)",
                type: "dashed",
              },
            },
          },
        ],
        series: [
          {
            name: "nftPrice",
            type: "line",
            smooth: true,
            lineStyle: {
              width: 3,
            },
            data: this.nftTrades,
          },
        ],
      };
      chart.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
.item-big-title {
  text-align: left;
  font-size: 14px;
  color: #7f7e7e;
  .label {
  }
  .el-icon-arrow-right {
    color: rgba(41, 40, 40);
  }
  .text {
    font-size: 14px;
    color: #292828;
  }
}
.layout {
  padding-top: 32px;
  width: 1320px;
  margin: 0 auto;
}
.nftNav {
  display: flex;
  justify-content: flex-start;
  margin-top: 32px;

  span {
    cursor: pointer;
    width: 147px;
    height: 32px;
    line-height: 32px;
    background: #ebeff3;
    font-size: 16px;
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    color: #7f7e7e;
    &.active {
      color: #38cb98;
      font-weight: 500;
      background: #fff;
    }
  }
}
.info-wrap {
  margin-top: 24px;
  padding: 24px;
  background-image: url("~@/assets/images/nft/bg.png");
  background-size: cover;
  border-radius: 10px;
  display: flex;
  .left {
    padding-top: 10px;
    margin-left: 8px;
    .left-title {
      text-align: left;
      font-size: 32px;
      color: #292828;
      margin-bottom: 16px;
    }
    flex: 1;
    .item {
      text-align: left;
      padding: 10px 0;
      .label {
        margin-right: 20px;
        display: inline-block;
        width: 80px;
        font-size: 16px;
        color: #7f7e7e;
      }
      .text {
        display: inline-block;
        font-size: 16px;
        color: #292828;
        &.link {
          color: rgba(56, 203, 152, 1);
        }
      }
    }
  }
  .right {
    flex: none;
    .img {
      border-radius: 10px;
      width: 270px;
      height: 270px;
      background-size: contain;
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
      flex: 2;
      height: 425px;
      margin-right: 24px;
      margin-bottom: 24px;
      background: #ffffff;
      border-radius: 10px;
      &.table {
        flex: 3;
      }
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
  & > .title {
    text-align: left;
    margin: 16px 0;
    font-size: 24px;
    color: #292828;
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
      &.active {
        border: 1px solid rgba(56, 203, 152, 1);
        padding: 22px;
      }
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
.table-wrap {
  .block-number {
    color: #38cb98;
  }
  /deep/ .el-table .el-table__body {
    border-spacing: 0;
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover {
    box-shadow: none;
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:nth-child(2n + 1) {
    background: #f5f7f9;
  }
  /deep/ .el-table {
    overflow: hidden !important;
  }
  /deep/ .el-table td .cell {
    // padding-left: 10px;
  }
  /deep/ .el-table th .cell {
    padding-left: 0;
  }
  /deep/ .el-table__body-wrapper {
    overflow-y: auto !important;
  }
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