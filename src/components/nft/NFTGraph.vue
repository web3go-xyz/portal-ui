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
      <span @click="goto('NFTProfiler')">Market Overview</span>
      <span @click="goto('NFTMintMaster')">Mint Master</span>
      <span class="act">NFT Graph</span>
    </div>
    <div class="statistic">
      <div class="card">
        <div class="number">{{ statisticInfo.total_count_with_resource }}</div>
        <div class="icon">
          <img src="./../../assets/images/nft/icon-multi-resources.png" />
        </div>
        <div class="desc">Number of NFTs with resource</div>
      </div>
      <div class="card">
        <div class="number">{{ statisticInfo.total_count_with_children }}</div>
        <div class="icon">
          <img src="./../../assets/images/nft/icon-children.png" />
        </div>
        <div class="desc">Number of NFTs with children</div>
      </div>
    </div>

    <div class="type-title">
      NFT Tree God Mode
      <div class="search-nft">
        <el-input
          placeholder="search by nft name"
          v-model="queryParams.nft_name"
          class="input-with-select"
          @keyup.enter.native="doSearch(true)"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="doSearch(true)"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="type-switch">
          <el-tabs v-model="activeType" @tab-click="doSearch(true)">
            <el-tab-pane label="Resource" name="Resource"></el-tab-pane>
            <el-tab-pane label="Children" name="Children"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="nft-list">
          <div class="list">
            <div
              :class="{ active: item.id == currentActiveNft.id }"
              class="nft-list-item"
              v-for="(item, index) in nftList"
              :key="item.id"
              @click="setActiveRecord(index)"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.id"
                placement="bottom"
                :open-delay="tooltipDelay"
              >
                <div class="nft-list-item-inner">
                  <div class="name">{{ item.name || item.id }}</div>
                  <div
                    class="nft-list-flag"
                    v-if="item.children && item.children.length"
                  >
                    <div class="flag-circle"></div>
                    {{ item.children.length }}
                  </div>
                  <div
                    class="nft-list-flag"
                    v-if="item.resources && item.resources.length"
                  >
                    <div class="flag-diamond"></div>
                    {{ item.resources.length }}
                  </div>
                </div>
              </el-tooltip>
            </div>
          </div>
          <div class="pagination">
            <el-pagination
              :hide-on-single-page="true"
              :total="totalCount"
              layout="prev, pager, next"
              :current-page.sync="queryParams.pageIndex"
              @current-change="handlePageChange"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="chart">
          <div id="tree-chart"></div>
        </div>
        <div class="nft-flag-legend">
          <div class="nft-list-flag">
            <div class="flag-circle"></div>
            NFT
          </div>
          <div class="nft-list-flag">
            <div class="flag-diamond"></div>
            Resource
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import nftGraphApi from "@/api/nft/nft-graph";
import ipfsUtil from "@/utils/ipfsUtil";
export default {
  name: "NFTGraph",
  data() {
    return {
      statisticInfo: {
        total_count_with_resource: 0,
        total_count_with_children: 0
      },
      tooltipDelay: 500,
      activeType: "Resource",
      queryParams: {
        pageSize: 10,
        pageIndex: 1,
        nft_name: ""
      },
      currentActiveNft: {},
      nftList: [],
      totalCount: 20,

      nftSymbolColors: [
        "#3A76F0",
        "#FFC014",
        "#FF5F57",
        "#896CFD",
        "#A2ADC2",
        "#FF9214",
        "#9FE080"
      ],
      nftSymbol: {
        symbol: "circle",
        symbolSize: 60,
        itemStyle: { color: "#38CB98" }
      },
      resourceSymbol: {
        symbol: "diamond",
        symbolSize: 20,
        itemStyle: { color: "#07F833" }
      }
    };
  },
  mounted() {
    let self = this;
    nftGraphApi.getNFTResourceStatistic().then(resp => {
      self.statisticInfo = resp;
    });
    self.doSearch(true);
  },
  methods: {
    goto(routeName) {
      this.$router.push({
        name: routeName
      });
    },
    refreshNFTResource() {
      let self = this;
      nftGraphApi.getNFTResourceList(this.queryParams).then(resp => {
        self.nftList = resp.list;
        self.totalCount = resp.totalCount;

        self.setActiveRecord(0);
      });
    },
    refreshNFTChildren() {
      let self = this;
      nftGraphApi.getNFTChildrenList(this.queryParams).then(resp => {
        self.nftList = resp.list;
        self.totalCount = resp.totalCount;

        self.setActiveRecord(0);
      });
    },
    doSearch(reset) {
      console.log("doSearch:", this.activeType);
      if (reset === true) {
        // console.log("doSearch reset");
        this.queryParams.pageIndex = 1;
      }
      if (this.activeType === "Resource") {
        this.refreshNFTResource();
      }
      if (this.activeType === "Children") {
        this.refreshNFTChildren();
      }
    },
    handlePageChange(pageIndex) {
      this.queryParams.pageIndex = pageIndex;
      this.doSearch();
    },

    refreshTreeChart(data, treeLayout) {
      console.log("refreshTreeChart", data);
      let self = this;
      if (!self.treeChartInstance) {
        let chartDom = document.getElementById("tree-chart");
        self.treeChartInstance = echarts.init(chartDom);
      }
      self.treeChartInstance.showLoading();
      self.treeChartInstance.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "click",
          formatter: function(params, ticket, callback) {
            ipfsUtil.buildImage(params).then(htmlContent => {
              callback(ticket, htmlContent);
            });
            return params.name;
          }
          // formatter: "{b}",
        },
        series: [
          {
            expandAndCollapse: false,
            roam: true, //mouse drag and scale
            label: {
              show: false
            },
            type: "tree",
            data: [data],
            left: "8%",
            top: "3%",
            layout: treeLayout,
            symbol: (value, params) => {
              return params.data.symbol || "circle";
            },
            symbolSize: (value, params) => {
              return params.data.symbolSize || 10;
            },
            initialTreeDepth: 5,
            animationDurationUpdate: 750,
            emphasis: {
              focus: "descendant"
            }
          }
        ]
      });
      self.treeChartInstance.hideLoading();
    },

    setActiveRecord(recordIndex) {
      let self = this;
      recordIndex = recordIndex || 0;
      if (!self.nftList || self.nftList.length == 0) {
        return;
      }
      let nft = self.nftList[recordIndex];
      console.log("setActiveRecord recordIndex=", recordIndex, "nft=", nft.id);
      self.currentActiveNft = nft;

      if (self.treeChartInstance) {
        self.treeChartInstance.showLoading();
      }
      if (self.activeType === "Resource") {
        nftGraphApi.getNFTResourceTree({ nft_id: nft.id }).then(resp => {
          let data = self.formatNFTResourceTreeData(resp);
          self.refreshTreeChart(data, "tree");
        });
      }
      if (self.activeType === "Children") {
        nftGraphApi.getNFTChildrenTree({ nft_id: nft.id }).then(resp => {
          let data = self.formatNFTChildrenTreeData(resp);
          self.refreshTreeChart(data, "radial");
        });
      }
    },
    formatNFTResourceTreeData(d) {
      let self = this;
      if (!d.current || !d.resources) {
        return {};
      }
      let data = {
        ...self.nftSymbol,
        symbolSize: self.nftSymbol.symbolSize,
        id: d.current.id,
        name: d.current.name,
        metadata: d.current.metadata,
        children: []
      };

      for (const r of d.resources) {
        data.children.push({
          ...self.resourceSymbol,
          ...r,
          name: r.id
        });
      }
      return data;
    },
    formatNFTChildrenTreeData(d) {
      let self = this;
      if (!d.root || !d.root.currentNode) {
        return {};
      }
      let nftSymbolSize = self.nftSymbol.symbolSize;
      let data = this.getNode(d.root, nftSymbolSize);
      console.log("formatNFTChildrenTreeData data=", data);
      return data;
    },

    getNode(node, nftSymbolSize) {
      let self = this;
      let dataNode = {
        ...self.nftSymbol,
        symbolSize: nftSymbolSize,
        id: node.currentNode.id,
        name: node.currentNode.name || node.currentNode.id,
        metadata: node.currentNode.metadata,
        children: []
      };
      if (node.currentNode.resources) {
        for (const r of node.currentNode.resources) {
          dataNode.children.push({
            ...self.resourceSymbol,
            ...r,
            name: r.id
          });
        }
      }
      if (node.childrenNode) {
        nftSymbolSize = nftSymbolSize / 2;
        if (nftSymbolSize < 10) {
          nftSymbolSize = 10;
        }

        for (let index = 0; index < node.childrenNode.length; index++) {
          const cNode = node.childrenNode[index];
          let nodeItem = this.getNode(cNode, nftSymbolSize);
          nodeItem.itemStyle = {
            color: self.nftSymbolColors[index % self.nftSymbolColors.length]
          };
          dataNode.children.push(nodeItem);
        }
      }
      return dataNode;
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
    height: 40px;
    width: 445px;
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
}

.statistic {
  padding: 20px 0px 20px;
  display: flex;
  .card {
    width: 312px;
    background: #ffffff;
    border-radius: 10px;
    margin-right: 24px;
    padding: 24px 24px;
    position: relative;

    .number {
      font-size: 28px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: #545353;
      text-align: left;
    }
    .desc {
      font-size: 16px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: #a9a9a9;
      text-align: left;
      margin-top: 8px;
    }
    .icon {
      position: absolute;
      right: 24px;
      top: 24px;
      img {
        width: 32px;
        height: 32px;
      }
    }
  }
}
.type-title {
  font-size: 24px;
  font-family: Rubik-Regular, Rubik;
  font-weight: 400;
  color: #292828;
  text-align: left;

  // display: flex;
  .search-nft {
    width: 440px;
    margin-top: 10px;
    margin-left: 0px;
  }
}

.content {
  margin-top: 16px;
  display: flex;
  .left {
    width: 400px;
    background: #ffffff;
    border-radius: 10px;
    padding: 17px 21px;

    /deep/ .el-tabs__item {
      font-size: 20px !important;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      line-height: 32px;
    }
    .nft-list {
      .nft-list-item {
        cursor: pointer;

        font-size: 16px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: #292828;

        padding: 8px 8px;

        text-align: left;

        .nft-list-item-inner {
          display: flex;

          .name {
            flex-grow: 1;
          }

          .nft-list-flag {
            display: flex;
            margin-right: 10px;
            width: 35px;
          }
        }
      }

      .nft-list-item:hover {
        background: #ebf9f4;
        border-radius: 6px;
      }

      .nft-list-item.active {
        background: #ebf9f4;
        border-radius: 6px;
      }
    }
    .pagination {
      margin-top: 10px;
    }
  }

  .right {
    flex-grow: 1;
    border: solid 1px #ddd;
    background: white;
    position: relative;
    #tree-chart {
      box-sizing: border-box;
      height: 470px;
    }

    .nft-flag-legend {
      position: absolute;
      right: 10px;
      top: 20px;
      display: flex;

      .nft-list-flag {
        display: flex;
        margin-right: 15px;
      }
    }
  }
}

.flag-diamond {
  width: 10px;
  height: 10px;
  transform: rotateZ(45deg) skew(0deg, 0deg);
  background: #07ff38;
  margin-right: 3px;
  margin-top: 4px;
}
.flag-circle {
  width: 13px;
  height: 13px;
  border-radius: 20px;
  background: #3ddfa7;
  margin-right: 3px;
  margin-top: 2px;
}
</style>
<style lang="less">
.ipfs-nft-img {
  max-width: 150px;
  max-height: 150px;
}
.ipfs-nft-desc {
  text-align: left;
  word-break: break-all;
  white-space: pre-wrap;
  width: 300px;
  font-style: italic;
}
</style>
