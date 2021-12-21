<template>
  <div class="nft g-wrap">
    <div class="nftHead">
      <i class="el-icon-back" @click="$router.push('/')"></i>
      <img src="../../assets/images/nft/logo.png" alt="" class="nftHead-logo" />
      <div class="nftHead-con">
        <h2 class="nftHead-con-title">NFT Garden</h2>
        <p class="nftHead-con-des">By Web3go Offical Team</p>
      </div>
    </div>
    <div class="nftNav">
      <span @click="goto('NFTProfiler')">Market Overview</span>
      <span class="act">Mint Master</span>
      <span @click="goto('NFTGraph')">NFT Graph</span>
    </div>
    <div class="nftNavCon">
      <div class="nftNavConList">
        <div class="nftNavConList-head">
          <span class="title">Latest Mints</span>
          <el-tooltip
            effect="dark"
            content="Latest NFT project sorted by mint count  in 24 hours"
            placement="top-start"
          >
            <img src="../../assets/images/nft/info.png" alt="" class="icon" />
          </el-tooltip>
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
                :key="item.title"
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
              <el-row v-for="item in renderListData" :key="item.id">
                <el-col
                  :span="8"
                  align="left"
                  class="collection hover-item"
                  @click.native="goDetail(item)"
                >
                  <div>
                    <el-tooltip
                      effect="dark"
                      :content="item.collection_name"
                      placement="top-start"
                    >
                      <span class="collection_name">{{
                        item.collection_name
                      }}</span>
                    </el-tooltip>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="mint_count">
                    {{ item.mint_count
                    }}<el-progress
                      :show-text="false"
                      class="progress"
                      :percentage="
                        +((item.mint_count / listTotal) * 100).toFixed(2)
                      "
                    ></el-progress>
                  </div> </el-col
                ><el-col :span="8"
                  ><div>
                    {{ filterTimestamp_created_at(item.mint_first_timestamp) }}
                  </div></el-col
                >
              </el-row>
            </div>
          </div>
          <div class="nftNavConList-table-pagination">
            <el-pagination
              :hide-on-single-page="true"
              :total="totalCount"
              layout="prev, pager, next"
              :current-page.sync="query.pageIndex"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="nftNavConLine">
        <div class="nftNavConLine-head">
          <span class="title">Minting Volume 24H</span>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content" class="tooltip-300px">
              Minting volume for projects that started minting in the last 24
              hours, no gas fee included.
            </div>
            <img src="../../assets/images/nft/info.png" alt="" class="icon" />
          </el-tooltip>
        </div>
        <div
          id="nftNavConLine"
          v-loading="nftNavConListLoading"
          element-loading-text="loading "
          element-loading-spinner="el-icon-loading"
        ></div>
        <ul class="mintionList">
          <li v-for="item in mintionList" :key="item.title">
            <span>{{ item.point }}%</span>
          </li>
        </ul>
        <div class="total">
          <span class="mintVolumeTotal">{{ mintVolumeTotal }}</span>
          <span class="text">Total</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLatestMintStatistic } from "@/api/nftMintMaster";
import { formatKUSAMA } from "../../filters";
import utility from "@/utils/index";
export default {
  name: "NFTMintMaster",
  data() {
    return {
      query: {
        pageSize: 5,
        pageIndex: 1,
        orderBys: []
      },
      totalCount: 0,
      listData: [],
      transactionChartInstance: null,
      nftNavConListLoading: false,
      listTotal: 0,
      mintVolumeTotal: 0,
      mintionList: [],
      tableTitle: [
        {
          col: "8",
          value: "collection_name",
          title: "collection"
        },
        {
          col: "8",
          value: "mint_count",
          title: "Minters"
        },
        {
          col: "8",
          value: "mint_first_timestamp",
          title: "First Mint"
        }
      ]
    };
  },
  computed: {
    renderListData() {
      return this.listData.slice(
        (this.query.pageIndex - 1) * this.query.pageSize,
        this.query.pageIndex * this.query.pageSize
      );
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getLatestMintStatistic();
    },
    getLatestMintStatistic() {
      this.nftNavConListLoading = true;
      getLatestMintStatistic({
        start_time: this.$moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
        end_time: this.$moment().format("YYYY-MM-DD")
      }).then(res => {
        this.totalCount = res?.length;
        this.nftNavConListLoading = false;
        this.listData = res;
        this.listTotal = res
          .map(item => +item.mint_count)
          .reduce((prev, curr) => {
            return prev + curr;
          });
        this.initChart();
      });
    },

    initChart() {
      const total = this.listData
        .map(item => +item.mint_volume)
        .reduce((prev, curr) => {
          return prev + curr;
        });
      this.mintVolumeTotal = this.formatedCap(total);
      const seriesData = this.listData
        .sort((b, a) => a.mint_volume - b.mint_volume)
        .slice(0, 5)
        .map((item, index) => {
          let mint_volume = new Number(item.mint_volume);
          const point = ((mint_volume / total) * 100).toFixed(2);
          return {
            name:
              item.collection_name.length > 23
                ? item.collection_name.slice(0, 23) + "..."
                : item.collection_name,
            title: item.collection_name,
            point,
            value: utility.formatTokenNumber(mint_volume, utility.KSM_RATIO),
            originValue: mint_volume
          };
        });
      const OthersvvValue = seriesData
        .map(item => +item.originValue)
        .reduce((a, b) => a + b);
      const OthersvvP = seriesData
        .map(item => +item.point)
        .reduce((a, b) => a + b);
      const OthersvvPoint = (100 - OthersvvP).toFixed(2);
      seriesData.push({
        name: "Others",
        title: "Others",
        point: OthersvvPoint,
        originValue: total - OthersvvValue,
        value: utility.formatTokenNumber(
          total - OthersvvValue,
          utility.KSM_RATIO
        )
      });
      const option = {
        tooltip: {
          trigger: "item",
          formatter: params => {
            return `
              <div class="echart-tooltip-formatter-popover">
                <div class="row">
                  <div class="label">${params.marker}${params.data.title}:</div> 
                  <div class="value">${params.data.point}%</div>
                </div>
              </div>
                  `;
          }
        },
        legend: {
          icon: "circle",
          top: "30%",
          right: "25%",
          orient: "vertical",
          textStyle: {
            color: "rgba(41, 40, 40, 0.8)"
          }
        },
        series: [
          {
            center: ["20%", "50%"],
            type: "pie",
            radius: ["50%", "40%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "13",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: seriesData
          }
        ]
      };
      this.mintionList = seriesData;
      const echart = echarts.init(document.getElementById("nftNavConLine"));
      echart.setOption(option);
    },
    formatedCap(row, isEchartData) {
      return utility.formatedDisplay4CrowdloanKSM(row, isEchartData);
    },
    filterTimestamp_created_at(str) {
      return this.$moment(str).format("YYYY-MM-DD");
    },
    handleSizeChange(val) {
      this.query.pageIndex = val;
    },
    handleCurrentChange(val) {
      this.query.pageIndex = val;
    },
    goDetail(item) {
      this.$router.push({
        name: "NftDetail",
        query: {
          back: this.$router.currentRoute.name,
          id: item.collection_id,
          symbol: item.collection_name
        }
      });
    },
    goto(routeName) {
      this.$router.push({
        name: routeName
      });
    }
  }
};
</script>
<style lang="less" scoped>
.nft {
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
    width: 445px;
    border-radius: 4px;
    height: 40px;
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
    display: flex;
    .nftNavConList {
      flex: 1;
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
        background: #fff;
        border-radius: 10px;
        margin-top: 16px;
        margin-bottom: 50px;
        &-header {
          padding-left: 24px;
          font-size: 17px;
          font-family: Rubik-Medium, Rubik;
          font-weight: 500;
          color: #7f7e7e;
          .el-row {
            height: 60px;
            display: flex;
            align-items: center;
            p {
              margin: 0;
              padding: 0;
            }
          }
        }
        &-content {
          .lp-row {
            .el-row {
              display: flex;
              align-items: center;
              background: #f5f7f9;
              padding-left: 24px;
              height: 60px;
              border-radius: 6px;
              font-size: 14px;
              font-family: Rubik-Regular, Rubik;
              font-weight: 400;
              color: #7f7e7e;
              &:nth-child(2n) {
                background: #fff;
              }
            }
          }
          .mint_count {
            display: flex;
            align-items: center;
            .progress {
              width: 100px;
              margin-top: -8px;
              margin-left: 12px;
              height: 6px;
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
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: right;
        }
      }
    }
    .nftNavConLine {
      flex: 1;
      position: relative;
      margin-left: 24px;
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
      #nftNavConLine {
        box-sizing: border-box;
        padding: 32px 0;
        margin-top: 24px;
        background: #fff;
        width: 100%;
        box-shadow: 10px;
        height: 430px;
      }
      .mintionList {
        position: absolute;
        right: 40px;
        top: 180px;
        list-style: none;
        li {
          color: #545353;
          line-height: 24px;
          font-size: 14px;
        }
      }
      .total {
        width: 100px;
        text-align: center;
        position: absolute;
        left: 75px;
        top: 240px;
        .mintVolumeTotal {
          font-size: 28px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: #292828;
          display: block;
        }
        .text {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8c8c8c;
          display: block;
        }
      }
    }
  }
}
</style>
