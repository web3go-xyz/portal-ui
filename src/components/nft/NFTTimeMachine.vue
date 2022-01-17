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
      <span @click="goto('NFTGraph')">NFT Graph</span>
      <span class="act">Time Machine</span>
    </div>

    <div class="nftNavCon">
      <div class="nftNavConInfo">
        <div class="nftNavConInfo-con">
          <div class="filter-item">
            <!-- <span style="font-size: 36px" class="material-icons">
              history
            </span> -->
            <span style="font-size: 18px"> Own NFT at date:&nbsp;</span>
            <el-date-picker
              style="width: 200px"
              v-model="query.filter_date"
              type="datetime"
              @change="refreshData(true)"
            >
            </el-date-picker>
          </div>
          <div class="filter-item">
            <el-radio-group v-model="query.queryType">
              <el-radio-button label="nft">
                <div>
                  NFT<el-tooltip effect="dark" placement="top-start">
                    <div slot="content" class="tooltip-300px">
                      filter by NFT, we can view the nft's owner at the specific date.
                    </div>
                    <img
                      src="../../assets/images/nft/info.png"
                      alt=""
                      class="tip-icon"
                    />
                  </el-tooltip></div
              ></el-radio-button>
              <el-radio-button v-model="query.queryType" label="owner">
                <div>
                  Owner<el-tooltip effect="dark" placement="top-start">
                    <div slot="content" class="tooltip-300px">
                     filter by owner, the list will show all the nfts owned at the specific date.
                    </div>
                    <img
                      src="../../assets/images/nft/info.png"
                      alt=""
                      class="tip-icon"
                    />
                  </el-tooltip>
                </div> </el-radio-button
            ></el-radio-group>
          </div>
          <div class="filter-item" v-if="query.queryType == 'nft'">
            <el-select
              v-model="query.collection_id"
              filterable
              clearable
              remote
              placeholder="search collection name"
              :remote-method="searchCollections"
              :loading="searchLoading"
              @change="refreshData(true)"
            >
              <el-option
                v-for="item in options4collections"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="filter-item" v-if="query.queryType == 'nft'">
            <el-select
              v-model="query.nft_name"
              filterable
              clearable
              remote
              placeholder="search nft name"
              :remote-method="searchNFTs"
              :loading="searchLoading"
              @change="refreshData(true)"
            >
              <el-option
                v-for="item in options4nfts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="filter-item" v-if="query.queryType == 'owner'">
            <el-input
              class="owner-address"
              v-model="query.owner"
              placeholder="search owner address on Kusama parachain"
              @keyup.enter.native="refreshData(true)"
            ></el-input>
          </div>
        </div>
      </div>
      <div class="nftNavConList">
        <div class="nftNavConList-head">
          <span class="title">Ownership History</span>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content" class="tooltip-300px">
              The ownership is dynamic calculated by the activities including
              MINTNFT, BUY, SEND, BURN, etc.
            </div>
            <img src="../../assets/images/nft/info.png" alt="" class="icon" />
          </el-tooltip>
          <span style="margin-left: 10px">Total : {{ totalCount }}</span>
        </div>
        <div
          class="nftNavConList-table"
          v-loading="listLoading"
          element-loading-text="loading "
          element-loading-spinner="el-icon-loading"
        >
          <div class="nftNavConList-table-content">
            <div class="lp-row">
              <el-table :data="listData" style="width: 100%">
                <el-table-column prop="collection_name" label="Collection">
                  <template slot-scope="scope">
                    <div>
                      <span
                        class="collection_name hover-item"
                        @click="goCollectionDetail(scope.row)"
                        >{{ scope.row.collection_name }}</span
                      >
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="nft_name" label="NFT">
                  <template slot-scope="scope">
                    <div style="display: flex">
                      <div
                        class="nft hover-item"
                        @click="goNFTDetail(scope.row)"
                      >
                        {{ scope.row.nft_name }}
                      </div>

                      <div class="burned" v-if="scope.row.nft_burned">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="`current NFT has been burned at ${scope.row.nft_burned_at}`"
                          placement="top-start"
                        >
                          <span class="material-icons">
                            local_fire_department
                          </span>
                        </el-tooltip>
                      </div>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="owner" label="Owner">
                  <template slot-scope="scope">
                    <div v-if="scope.row.owner">
                      <identity-icon-plus
                        :addressInfo="{
                          address: scope.row.owner,
                          addressDisplayCompact: false,
                          iconSize: 24,
                          fontSize: 14,
                        }"
                      ></identity-icon-plus>
                    </div> </template
                ></el-table-column>
                <el-table-column prop="own_start_date" label="First Own Date">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div
            class="nftNavConList-table-pagination"
            v-if="query.queryType == 'nft'"
          >
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
import IdentityIconPlus from "@/components/ui-elements/IdentityIconPlus.vue";
import historyApi from "@/api/nft/nftTimeMachine";
import nftApi from "@/api/nft/nftDetail";
export default {
  components: { IdentityIconPlus },
  name: "NFTTimeMachine",
  data() {
    return {
      query: {
        queryType: "nft",
        pageSize: 10,
        pageIndex: 1,
        orderBys: [
          {
            sort: "collection_id",
            order: "ASC",
          },
        ],
        collection_id: "",
        nft_name: "",
        filter_date: new Date(),

        owner: "",
      },
      listLoading: false,
      listData: [],
      totalCount: 0,

      options4collections: [],
      options4nfts: [],
      searchLoading: false,
    };
  },
  created() {},
  mounted() {
    this.refreshData();
  },
  methods: {
    refreshData(resetFlag) {
      this.totalCount = 0;
      if (this.query.queryType === "nft") {
        this.refreshDataByFilterNFT(resetFlag);
      }

      if (this.query.queryType === "owner") {
        this.refreshDataByFilterOwner(resetFlag);
      }
    },
    refreshDataByFilterOwner() {
      let own_date = this.query.filter_date;
      let owner = this.query.owner;
      if (!own_date) {
        return;
      }
      if (!owner) {
        return;
      }
      this.listLoading = true;
      let account_id_list = [owner];
      historyApi
        .getAccountOwnedNFTAtDate({
          account_id_list: account_id_list,
          own_date: own_date,
        })
        .then((resp) => {
          this.listLoading = false;
          this.listData = [];
          if (resp) {
            for (const d of resp) {
              this.listData.push({
                ...d,
                own_start_date: d.start_date,
                own_end_date: d.end_date,
              });
            }
            this.totalCount = this.listData.length;
          }
        });
    },
    refreshDataByFilterNFT(resetFlag) {
      if (resetFlag) {
        this.query.pageIndex = 1;
      }
      if (!this.query.filter_date) {
        return;
      }
      this.listLoading = true;
      nftApi
        .getAllNFTs({
          created_before: this.query.filter_date,
          collection_id: this.query.collection_id,
          nft_name: this.query.nft_name,
          pageSize: this.query.pageSize,
          pageIndex: this.query.pageIndex,
          orderBys: this.query.orderBys,
        })
        .then((res) => {
          this.listLoading = false;
          this.listData = [];
          if (res.list) {
            for (const d of res.list) {
              this.listData.push({
                ...d,
                owner: "",
                own_start_date: "",
                own_end_date: "",
              });
            }
          }
          this.totalCount = res.totalCount;

          this.loadOwnership(this.listData, this.query.filter_date);
        });
    },
    loadOwnership(nftList, own_date) {
      let nft_id_list = [];
      nftList.forEach((d) => {
        nft_id_list.push(d.nft_id);
      });
      if (nft_id_list.length == 0) {
        // this.$message({
        //   type: "error",
        //   message: "there is no nft",
        // });
        return;
      }
      this.listLoading = true;
      historyApi
        .getOwnershipOfNFTAtDate({
          nft_id_list: nft_id_list,
          own_date: own_date,
        })
        .then((resp) => {
          this.listLoading = false;
          let ownershipList = resp;
          if (ownershipList && ownershipList.length > 0) {
            // debugger
            for (let nft of nftList) {
              let findOwnship = ownershipList.find((t) => {
                return t.interaction_nft == nft.nft_id;
              });
              if (findOwnship) {
                nft.owner = findOwnship.owner;
                nft.own_start_date = findOwnship.start_date;
                nft.own_end_date = findOwnship.end_date;
              }
            }
          }
        });
    },

    goCollectionDetail(item) {
      this.$router.push({
        name: "NftDetail",
        query: {
          back: this.$router.currentRoute.name,
          id: item.collection_id,
        },
      });
    },
    goNFTDetail(item) {
      this.$router.push({
        name: "NftItemDetail",
        query: {
          id: item.nft_id,
        },
      });
    },

    handleSizeChange(val) {
      this.query.pageIndex = val;
      this.refreshData();
    },
    handleCurrentChange(val) {
      this.query.pageIndex = val;
      this.refreshData();
    },
    goto(routeName) {
      this.$router.push({
        name: routeName,
      });
    },

    searchCollections(query) {
      if (query !== "") {
        this.searchLoading = true;
        nftApi
          .getCollections({
            collection_name: query,
            pageSize: 30,
          })
          .then((res) => {
            this.searchLoading = false;
            this.options4collections = [];
            if (res && res.list) {
              for (const d of res.list) {
                this.options4collections.push({
                  label: d.name + "(" + d.symbol + ")",
                  value: d.id,
                });
              }
            }
          });
      } else {
        this.options4collections = [];
      }
    },

    searchNFTs(query) {
      if (query !== "") {
        this.searchLoading = true;
        nftApi
          .getNFTs({
            nft_name: query,
            pageSize: 30,
          })
          .then((res) => {
            this.searchLoading = false;
            this.options4nfts = [];
            if (res && res.list) {
              for (const d of res.list) {
                this.options4nfts.push({
                  label: d.name,
                  value: d.name,
                });
              }
            }
          });
      } else {
        this.options4nfts = [];
      }
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
        flex-direction: row;
        justify-content: space-between;

        margin-left: 8px;

        .filter-item {
          margin-right: 10px;
          display: flex;
          align-items: center;
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

  .burned {
    color: red;
  }

  .hover-item {
    cursor: pointer;
    font-weight: 500;
    color: #38cb98;
  }
  .owner-address.el-input {
    width: 450px;
  }
  .tip-icon {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }
}
</style>
