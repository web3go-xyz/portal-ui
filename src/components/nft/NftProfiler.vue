<template>
  <div class="nft g-wrap">
    <div class="nftHead">
      <i class="el-icon-back" @click="$router.push('/')"></i>
      <img src="../../assets/images/nft/logo.png" alt="" class="nftHead-logo" />
      <div class="nftHead-con">
        <h2 class="nftHead-con-title">NFT Garden</h2>
        <p class="nftHead-con-des">By Web3go Official Team</p>
      </div>
    </div>
    <div class="nftNav">
      <span class="act">Market Overview</span>
      <span @click="goto('NFTMintMaster')">Mint Master</span>
      <span @click="goto('NFTGraph')">NFT Graph</span>
      <span @click="goto('NFTTimeMachine')">Time Machine</span>
    </div>

    <div class="nftNavCon">
      <div class="nftNavConInfo">
        <img
          src="../../assets/images/nft/logo.png"
          alt=""
          class="nftNavConInfo-logo"
        />
        <div class="nftNavConInfo-con">
          <h2 class="nftNavConInfo-con-title">Volume over time on RMRK</h2>
          <p class="nftNavConInfo-con-des">
            <span>{{ collectionVolume | formatKUSAMA }}</span
            ><span>KSM</span>
          </p>
        </div>
      </div>
      <div class="nftNavConList">
        <div class="nftNavConList-head">
          <span class="title">NFT Market Overview</span>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content" class="tooltip-300px">
              The latest market activity of all times. Please note that the max,
              avg, min price are in KSM and include listing and transfer price
              on RMRK.
            </div>
            <img src="../../assets/images/nft/info.png" alt="" class="icon" />
          </el-tooltip>
          <div style="float: right">
            <el-date-picker
              v-model="timeRange4collectionStatistic"
              type="datetimerange"
              range-separator="-"
              start-placeholder="start date"
              end-placeholder="end date"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="loadCollectionStatistic"
            >
            </el-date-picker>
          </div>
        </div>
        <div
          class="nftNavConList-table"
          v-loading="nftNavConListLoading"
          element-loading-text="loading "
          element-loading-spinner="el-icon-loading"
        >
          <div class="nftNavConList-table-header">
            <el-row>
              <el-col
                :span="item.col"
                v-for="(item, index) in tableTitle"
                :key="item.value"
                :align="item.align"
                :class="item.className"
                >{{ item.title }}
                <div class="sort">
                  <p>
                    <span
                      class="up"
                      :class="item.sort === 'ASC' ? 'act' : ''"
                      @click="
                        getTopTradedCollectionsSort(item.value, 'ASC', index)
                      "
                    ></span
                    ><span
                      class="down"
                      :class="item.sort === 'DESC' ? 'act' : ''"
                      @click="
                        getTopTradedCollectionsSort(item.value, 'DESC', index)
                      "
                    ></span>
                  </p></div
              ></el-col>
            </el-row>
          </div>
          <div class="nftNavConList-table-content">
            <div class="lp-row">
              <el-row v-for="item in listData" :key="item.id">
                <el-col
                  :span="tableTitle[0].col"
                  align="left"
                  class="collection hover-item"
                  @click.native="goDetail(item)"
                >
                  <div>
                    <el-tooltip
                      effect="dark"
                      :content="item.name"
                      placement="top-start"
                    >
                      <span class="collection_name">{{ item.name }}</span>
                    </el-tooltip>
                  </div>
                </el-col>
                <el-col :span="tableTitle[1].col"
                  ><div>
                    {{ item.collection_volume | formatKUSAMA }}
                  </div></el-col
                >
                <el-col :span="tableTitle[2].col"
                  ><div>{{ item.collection_transactions }}</div></el-col
                >
                <el-col :span="tableTitle[3].col"
                  ><div>{{ item.max_price_list | formatKUSAMA }}</div></el-col
                >
                <el-col :span="tableTitle[4].col"
                  ><div>{{ item.avg_price_list | formatKUSAMA }}</div></el-col
                ><el-col :span="tableTitle[5].col"
                  ><div>{{ item.min_price_list | formatKUSAMA }}</div></el-col
                >
                <el-col :span="tableTitle[6].col"
                  ><div>{{ item.max_price | formatKUSAMA }}</div></el-col
                >
                <el-col :span="tableTitle[7].col"
                  ><div>{{ item.avg_price | formatKUSAMA }}</div></el-col
                ><el-col :span="tableTitle[8].col"
                  ><div>{{ item.min_price | formatKUSAMA }}</div></el-col
                ><el-col :span="tableTitle[9].col"
                  ><div>{{ item.buyer_count }}</div></el-col
                ><el-col :span="tableTitle[10].col"
                  ><div>
                    {{ filterTimestamp_created_at(item.timestamp_created_at) }}
                  </div></el-col
                >
              </el-row>
            </div>
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

      <div class="nftNavConTop">
        <div class="nftNavConTop-head">
          <span class="title">Top 5 Collections</span>
          <el-tooltip
            effect="dark"
            content="Sorted by volume traded in the last 7 days. "
            placement="top-start"
          >
            <img src="../../assets/images/nft/info.png" alt="" class="icon" />
          </el-tooltip>
        </div>
        <div
          id="nftNavConTop-line"
          v-loading="nftNavConTopLoading"
          element-loading-text="loading "
          element-loading-spinner="el-icon-loading"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getCollectionStatistic,
  getTopTradedCollections,
  getAvgPriceVolumeOfCollection,
} from "@/api/nft/nftProfiler";
import { formatKUSAMA } from "../../filters";
export default {
  name: "NFTProfiler",
  data() {
    return {
      query: {
        pageSize: 10,
        pageIndex: 1,
        orderBys: [],
      },
      timeRange4collectionStatistic: ["", ""],
      listData: [],
      latest7days: [],
      totalCount: 0,
      collectionVolume: "--",
      nftNavConListLoading: false,
      nftNavConTopLoading: false,
      tableTitle: [
        {
          col: 3,
          title: "NFT Collection",
          align: "left",
          value: "name",
          className: "collection",
        },
        {
          col: 2,
          value: "collection_volume",
          title: "Volume",
        },
        {
          col: 2,
          value: "collection_transactions",
          title: "Transactions",
        },
        {
          col: 3,
          value: "max_price_list",
          title: "Max Price(List)",
        },
        {
          col: 2,
          value: "avg_price_list",
          title: "Avg",
        },
        {
          col: 2,
          value: "min_price_list",
          title: "Min",
        },
        {
          col: 3,
          value: "max_price",
          title: "Max Price(Sale)",
        },
        {
          col: 2,
          value: "avg_price",
          title: "Avg",
        },
        {
          col: 1,
          value: "min_price",
          title: "Min",
        },
        {
          col: 2,
          title: "Buyer",
          value: "buyer_count",
        },
        {
          col: 2,
          value: "timestamp_created_at",
          title: "Created",
        },
      ],
    };
  },
  created() {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      arr.push(this.$moment().subtract(i, "days").format("YYYY-MM-DD"));
    }
    this.latest7days = arr;
  },
  mounted() {
    this.init();
  },
  methods: {
    goDetail(item) {
      this.$router.push({
        name: "NftDetail",
        query: {
          back: this.$router.currentRoute.name,
          id: item.id,
          symbol: item.symbol,
        },
      });
    },
    init() {
      this.loadCollectionStatistic();
      this.getTopTradedCollections();
    },

    getTopTradedCollectionsSort(sort, order, index) {
      this.tableTitle = this.tableTitle.map((item) => {
        if (item.sort) {
          item.sort = null;
        }
        return item;
      });
      this.tableTitle[index].sort = order === "DESC" ? "DESC" : "ASC";
      this.query.pageSize = 10;
      this.query.pageIndex = 0;
      this.query.orderBys = [{ sort, order }];
      this.loadCollectionStatistic();
    },
    loadCollectionStatistic() {
      this.nftNavConListLoading = true;
      let query = {
        pageSize: this.query.pageSize,
        pageIndex: this.query.pageIndex,
        orderBys: this.query.orderBys,
        collection_id: "",
      };
      if (this.timeRange4collectionStatistic.length >= 2) {
        let start_time = this.timeRange4collectionStatistic[0];
        let end_time = this.timeRange4collectionStatistic[1];
        if (start_time && end_time) {
          query.start_time = start_time;
          query.end_time = end_time;
        }
      }
      getCollectionStatistic(query).then((res) => {
        this.nftNavConListLoading = false;
        this.listData = res.list;
        this.totalCount = res.totalCount;
        this.collectionVolume = res.collection_volume;
      });
    },
    getTopTradedCollections() {
      this.nftNavConTopLoading = true;
      getTopTradedCollections({
        start_time: this.$moment().subtract(7, "days").format("YYYY-MM-DD"),
        end_time: this.$moment().format("YYYY-MM-DD"),
        interaction: "BUY",
        topN: 5,
      }).then((getTopTradedCollectionsRes) => {
        if (getTopTradedCollectionsRes.length) {
          Promise.all(
            getTopTradedCollectionsRes.map((item) => {
              return getAvgPriceVolumeOfCollection({
                collection_id: item.collection_id,
                query_days: this.latest7days,
              });
            })
          ).then((getAvgPriceVolumeOfCollectionRes) => {
            this.nftNavConTopLoading = false;
            const chartDom = document.getElementById("nftNavConTop-line");
            const myChart = echarts.init(chartDom);
            const series = [];
            const legendData = [];
            for (let i = 0; i < getTopTradedCollectionsRes.length; i++) {
              const collection_id =
                getTopTradedCollectionsRes[i].collection_id.split("-")[1];
              const volume = getAvgPriceVolumeOfCollectionRes[i].map(
                (item) => +formatKUSAMA(item.volume || 0).replaceAll(",", "")
              );
              series.push({
                name: collection_id,
                type: "line",
                smooth: true,
                lineStyle: {
                  width: 3,
                },
                data: [...volume],
              });
              legendData.push(collection_id);
            }
            const option = {
              title: {
                subtext: "Unit: KSM",
                subtextStyle: {
                  fontSize: "14",
                  fontWeight: "bold",
                },
                top: "0",
                right: "0",
              },
              color: [
                "rgba(58, 118, 240, 1)",
                "rgba(95, 204, 186, 1)",
                "rgba(255, 125, 0, 1)",
              ],
              tooltip: {
                trigger: "axis",
                formatter: (params) => {
                  return `
                      <div class="echart-tooltip-formatter-popover">
                        ${params[0].axisValue}
                        <div class="row">
                          <div class="label">${params[0].marker}${params[0].seriesName}:</div> 
                          <div class="value">${params[0].value}</div>
                        </div>
                        <div class="row">
                          <div class="label">${params[1].marker}${params[1].seriesName}:</div> 
                          <div class="value">${params[1].value}</div>
                        </div>
                        <div class="row">
                          <div class="label">${params[2].marker}${params[2].seriesName}:</div> 
                          <div class="value">${params[2].value}</div>
                        </div>
                        <div class="row">
                          <div class="label">${params[3].marker}${params[3].seriesName}:</div> 
                          <div class="value">${params[3].value}</div>
                        </div>
                         <div class="row">
                          <div class="label">${params[4].marker}${params[4].seriesName}:</div> 
                          <div class="value">${params[4].value}</div>
                        </div>
                      </div>
                          `;
                },
              },
              legend: {
                data: legendData,
                icon: "circle",
                left: 0,
                top: 20,
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 40,
                itemStyle: {},
                textStyle: {
                  color: "#7F7E7E",
                  fontSize: 14,
                },
              },
              grid: {
                containLabel: true,
                left: 10,
                top: 70,
                bottom: 0,
                right: 10,
              },
              xAxis: [
                {
                  type: "category",
                  data: this.latest7days,
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
              series,
            };
            myChart.setOption(option);
          });
        }
      });
    },
    filterTimestamp_created_at(str) {
      return this.$moment(str).format("YYYY-MM-DD");
    },
    handleSizeChange(val) {
      this.query.pageIndex = val;
      this.loadCollectionStatistic();
    },
    handleCurrentChange(val) {
      this.query.pageIndex = val;
      this.loadCollectionStatistic();
    },
    goto(routeName) {
      this.$router.push({
        name: routeName,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.nft {
  .sort {
    display: inline-block;
    height: 20px;
    position: relative;
    top: -5px;
    p {
      display: flex;
      flex-direction: column;
      span {
        cursor: pointer;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        &.up {
          margin-bottom: 2px;
          border-bottom: 7px solid #cccdcf;
          &.act {
            border-bottom: 7px solid #38cb98;
          }
        }
        &.down {
          border-top: 7px solid #cccdcf;
          &.act {
            border-top: 7px solid #38cb98;
          }
        }
      }
    }
  }
  .nftHead {
    margin-top: 24px;
    height: 48px;
    display: flex;
    align-items: center;
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
    &-logo {
      width: 48px;
      height: 48px;
    }
    &-con {
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 8px;
      &-title {
        margin: 0;
        padding: 0;
        height: 26px;
        font-size: 24px;
        font-family: Rubik-Medium, Rubik;
        font-weight: 500;
        color: #292828;
      }
      &-des {
        font-size: 14px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: #7f7e7e;
        margin: 0;
        padding: 0;
        margin-top: 5px;
      }
    }
  }
  .nftNav {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 32px;
    height: 40px;
    width: 550px;
    border-radius: 4px;
    padding-left: 4px;
    background: #ebeff3;
    span {
      cursor: pointer;
      width: 147px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: #7f7e7e;
      &.act {
        border-radius: 4px;
        color: #38cb98;
        font-weight: 500;
        background: #fff;
      }
    }
  }
  .nftNavCon {
    .nftNavConInfo {
      margin-top: 24px;
      height: 44px;
      display: flex;
      &-logo {
        width: 44px;
        height: 44px;
      }
      &-con {
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 8px;
        &-title {
          margin: 0;
          padding: 0;
          height: 22px;
          font-size: 14px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: #a9a9a9;
        }
        &-des {
          height: 32px;
          font-size: 24px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: #292828;
          margin: 0;
          padding: 0;
          span:first-child {
            padding-right: 8px;
          }
          span:last-child {
            font-size: 14px;
          }
        }
      }
    }
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
    .nftNavConTop {
      margin-top: 28px;
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
      #nftNavConTop-line {
        box-sizing: border-box;
        padding: 10px 29px 32px;
        margin-top: 24px;
        background: #fff;
        width: 100%;
        height: 300px;
      }
    }
  }
}
</style>
