<template>
  <div class="homepage">
    <div class="slide">
      <ul class="fSort">
        <li v-for="(fItem, findex) in slideList" :key="findex" class="fItem">
          <div
            class="name fname"
            @click="clickSlide(fItem, findex)"
            :class="{ active: defaultActiveSlideIndex === findex }"
          >
            <span class="icon" :class="fItem.name"></span>
            <span class="text">{{ fItem.name }}</span>
            <span
              v-if="fItem.children && fItem.children.length"
              class="arrow"
              :class="{ hide: fItem.isShow }"
            ></span>
          </div>
          <ul
            v-if="fItem.children && fItem.children.length && fItem.isShow"
            class="sSort"
          >
            <li
              class="sItem"
              v-for="(sItem, sindex) in fItem.children"
              :key="`${findex}${sindex}`"
            >
              <div
                class="name sname"
                @click="clickSlide(sItem, `${findex}-${sindex}`)"
                :class="{
                  active: defaultActiveSlideIndex === `${findex}-${sindex}`,
                }"
              >
                <span class="icon"></span>
                <span class="text">{{ sItem.name }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="wrap">
        <div class="adv-v2">
          <img class="adv-banner-v2" src="./../assets/images/banner-v2.png" />
        </div>

        <div class="case-wrapper clearfix">
          <div class="card" v-show="featuredCardVisible">
            <h2 class="card-title">Featured</h2>
            <div class="card-content">
              <div
                class="card-item"
                v-for="d in rmrkDashboardListFilter"
                :key="d.id"
                @click="showCardDetail('RMRKNFT', d)"
              >
                <div class="card-item-head">
                  <img :src="d.icon" alt="" class="logo" />
                  <span class="type">{{ d.name }}</span>
                </div>
                <div class="card-item-con">
                  <img
                    src="./../assets/images/home/rmrk-nft-dashboard.png"
                    alt=""
                    class="polyline"
                    style="width: 95%; margin-top: -30px"
                  />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <i
                      v-show="userInfo"
                      :class="{
                        'el-icon-star-on': ifAlreadyCollect(d),
                        'el-icon-star-off': !ifAlreadyCollect(d),
                      }"
                      @click.stop="collect(d)"
                    ></i>
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>

              <div
                class="card-item"
                v-for="d in parachainCrowdloanDashboardListFilter"
                :key="d.id"
                @click="showCardDetail('crowdloan', d)"
              >
                <div class="card-item-head">
                  <img :src="d.icon" alt="" class="logo" />
                  <span class="type">{{ mapCardType(d.type) }}</span>
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <i
                      v-show="userInfo"
                      :class="{
                        'el-icon-star-on': ifAlreadyCollect(d),
                        'el-icon-star-off': !ifAlreadyCollect(d),
                      }"
                      @click.stop="collect(d)"
                    ></i>
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>
              <div
                class="card-item"
                v-for="d in monriverDashboardListFilter"
                :key="d.id"
                @click="showCardDetail(d.type, d)"
              >
                <div class="card-item-head">
                  <img :src="d.icon" alt="" class="logo" />
                  <span class="type">{{ mapCardType(d.type) }}</span>
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <i
                      v-show="userInfo"
                      :class="{
                        'el-icon-star-on': ifAlreadyCollect(d),
                        'el-icon-star-off': !ifAlreadyCollect(d),
                      }"
                      @click.stop="collect(d)"
                    ></i>
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>
              <div
                class="card-item"
                v-for="d in karuraDashboardListFilter"
                :key="d.id"
                @click="showCardDetail('cdp', d)"
              >
                <div class="card-item-head">
                  <img
                    src="./../assets/images/home/karura.png"
                    alt=""
                    class="logo"
                  />
                  <span class="type">{{ mapCardType(d.type) }}</span>
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <i
                      v-show="userInfo"
                      :class="{
                        'el-icon-star-on': ifAlreadyCollect(d),
                        'el-icon-star-off': !ifAlreadyCollect(d),
                      }"
                      @click.stop="collect(d)"
                    ></i>
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>

              <div
                class="card-item"
                v-for="d in erc20DashboardListFilter"
                :key="d.id"
                @click="showCardDetail('erc20', d)"
              >
                <div class="card-item-head">
                  <img
                    src="./../assets/images/home/erc20.png"
                    alt=""
                    class="logo"
                  />
                  <span class="type"
                    >{{ mapCardType(d.type) }} - {{ d.name }}</span
                  >
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <i
                      v-show="userInfo"
                      :class="{
                        'el-icon-star-on': ifAlreadyCollect(d),
                        'el-icon-star-off': !ifAlreadyCollect(d),
                      }"
                      @click.stop="collect(d)"
                    ></i>
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="case-wrapper clearfix">
          <div class="card" v-show="communityCardVisible">
            <h2 class="card-title">Community</h2>
            <div class="card-content">
              <div class="card-item create" @click="buildNewQuery()">
                <img src="./../assets/images/home/plus_create.png" alt="" />
                <p>Create New Analysis</p>
              </div>
              <div
                class="card-item"
                v-for="d in customQueryDashboardListFilter"
                :key="d.id"
                @click="showCardDetail('customQuery', d)"
              >
                <div class="card-item-head">
                  <img
                    src="./../assets/images/home/customQuery.png"
                    alt=""
                    class="logo"
                  />
                  <div class="type">{{ d.type }}{{ d.name }}</div>
                  <div class="option">
                    <img
                      src="./../assets/images/home/option.png"
                      alt=""
                      class="option-icon"
                    />
                    <div class="option-con">
                      <p
                        @click.stop="
                          handleCustomQueryActionCommand(d.id + '-edit')
                        "
                      >
                        <img
                          src="./../assets/images/home/edit.png"
                          alt=""
                        /><span>Edit</span>
                      </p>
                      <p
                        @click.stop="
                          handleCustomQueryActionCommand(d.id + '-remove')
                        "
                      >
                        <img
                          src="./../assets/images/home/delete.png"
                          alt=""
                        /><span>Delete</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="card-item-con">
                  <img :src="getCardLineImg(d.type)" alt="" class="polyline" />
                </div>
                <div class="card-item-foot">
                  <span class="name">{{ d.type }}{{ d.name }}</span>
                  <p class="clickNum" v-if="d.viewCount">
                    <i
                      v-show="userInfo"
                      :class="{
                        'el-icon-star-on': ifAlreadyCollect(d),
                        'el-icon-star-off': !ifAlreadyCollect(d),
                      }"
                      @click.stop="collect(d)"
                    ></i>
                    <img src="./../assets/images/home/eye.png" alt="" />
                    <span>{{ d.viewCount }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!featuredCardVisible && !communityCardVisible" class="empty">
          <img src="../assets/images/nodata.png" alt="" />
          <p>No data…</p>
        </div>
      </div>
      <div class="foot">
        <ul>
          <li v-for="(foot, index) in footList" :key="index">
            <a :href="foot.url" target="blank"
              ><img
                v-if="foot.icon"
                :src="require(`../assets/images/home/${foot.icon}.png`)"
                alt=""
              /><span v-else>{{ foot.name }}</span></a
            >
          </li>
        </ul>
      </div>
    </div>

    <el-dialog
      title="Confirm"
      :visible.sync="removeCustomQueryDialogVisible"
      width="30%"
    >
      <span>Are you sure to remove current item?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeCustomQueryDialogVisible = false"
          >Cancel</el-button
        >
        <el-button @click="doRemoveCustomQuery">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import queryService from "@/api/custom-query";
import platformApi from "@/api/platform";
import { addFavorite, removeFavorite, getUserFavorite } from "@/api/user";

import businessImg from "@/assets/images/home/business.png";
import logofootImg from "@/assets/images/home/logo_foot.png";
export default {
  name: "HomePage",
  computed: {
    customQueryDashboardListFilter() {
      return this.doTagFilter(
        this.customQueryDashboardList,
        this.activeTagFilter
      );
    },
    erc20DashboardListFilter() {
      return this.doTagFilter(this.erc20DashboardList, this.activeTagFilter);
    },
    parachainCrowdloanDashboardListFilter() {
      return this.doTagFilter(
        this.parachainCrowdloanDashboardList,
        this.activeTagFilter
      );
    },
    karuraDashboardListFilter() {
      return this.doTagFilter(this.karuraDashboardList, this.activeTagFilter);
    },
    monriverDashboardListFilter() {
      return this.doTagFilter(this.stakingDashboardList, this.activeTagFilter);
    },
    rmrkDashboardListFilter() {
      return this.doTagFilter(this.rmrkNFTDashboardList, this.activeTagFilter);
    },
    featuredCardVisible() {
      var total =
        this.erc20DashboardListFilter.length +
        this.parachainCrowdloanDashboardListFilter.length +
        this.karuraDashboardListFilter.length +
        this.monriverDashboardListFilter.length +
        this.rmrkDashboardListFilter.length;
      return total > 0;
    },
    communityCardVisible() {
      if (this.activeTagFilter != "Featured") {
        return true;
      } else {
        return false;
      }
    },
  },
  data() {
    return {
      userInfo: null,
      collectList: [],
      logofootImg,
      businessImg,
      defaultActiveSlideIndex: 0,
      activeTagFilter: "",
      slideList: [
        {
          name: "All",
          tag: "All",
        },
        {
          name: "Featured",
          tag: "Featured",
        },
        {
          name: "Community",
          tag: "Community",
        },
        {
          name: "Chain",
          children: [
            {
              name: "Ethereum",
              tag: "Ethereum",
            },
            {
              name: "Polkadot",
              tag: "Polkadot",
            },
          ],
        },
        {
          name: "Projects",
          children: [
            {
              name: "Karura",
              tag: "Karura",
            },
            {
              name: "Moonriver",
              tag: "Moonriver",
            },
            {
              name: "Moonbeam",
              tag: "Moonbeam",
            },
            {
              name: "Crowdloan",
              tag: "Crowdloan",
            },
            {
              name: "RMRK",
              tag: "RMRK",
            },
          ],
        },
      ],
      footDesc:
        "Web3Go is a multi-blockchain data analytics platform that allows everyone to play with and visualize blockchain data. Rooted in the Polkadot ecosystem, Web3Go avails itself as a powerful tool for Polkadot enthusiasts to interact, surface the signal, and grasp the value behind different blockchains.",
      footList: [
        {
          name: "Twitter",
          url: "https://twitter.com/Web3Go",
          icon: "twitter",
        },
        {
          name: "Medium",
          url: "https://web3go.medium.com/",
          icon: "medium",
        },
        {
          name: "Telegram",
          url: "https://t.me/Web3GoCommunity",
          icon: "telegram",
        },
        {
          name: "Docs",
          url: "https://doc.web3go.xyz/",
        },
        {
          name: "About us",
          url: "https://melz243.wixsite.com/web3go",
        },
      ],
      msg: "Welcome to Data Analysis",

      erc20DashboardList: [
        {
          id: "ERC20-1",
          type: "ERC20",
          name: " LIT Analysis",
          description: "Sample Analysis For LIT To View The Details And Trends",
          created: "Web3go Offical Team",
          data: {
            contractAddress: "0xb59490ab09a0f526cc7305822ac65f2ab12f9723",
          },
          tags: ["Featured", "ERC20", "Ethereum"],
        },
        {
          id: "ERC20-2",
          type: "ERC20",
          name: " ATA Analysis",
          description: "Sample Analysis For ATA To View The Details And Trends",
          created: "Web3go Offical Team",
          data: {
            contractAddress: "0xa2120b9e674d3fc3875f415a7df52e382f141225",
          },
          tags: ["Featured", "ERC20", "Ethereum"],
        },
      ],

      parachainCrowdloanDashboardList: [
        {
          id: "Polkadot-1",
          type: "Polkadot",
          name: " Crowdloan",
          description: "Polkadot Crowdloan Analysis for each parachain",
          created: "Web3go Offical Team",
          tags: ["Featured", "Crowdloan", "Polkadot", "Kusama"],
          icon: "./static/images/polkadot.svg",
        },
        {
          id: "Kusama-1",
          type: "Kusama",
          name: " Crowdloan",
          description: "Kusama Crowdloan Analysis for each parachain",
          created: "Web3go Offical Team",
          tags: ["Featured", "Crowdloan", "Polkadot", "Kusama"],
          icon: "./static/images/kusama.png",
        },
      ],
      karuraDashboardList: [
        {
          id: "Karura-1",
          type: "Karura",
          name: " CDP Analysis",
          description:
            "Karura CDP Analysis to view the detail of loan postion and loan actions",
          created: "Web3go Offical Team",
          tags: ["Featured", "Polkadot", "Kusama", "Karura"],
        },
      ],
      stakingDashboardList: [
        {
          id: "Moonbeam-1",
          type: "Moonbeam",
          name: " Stake Analysis",
          description: "Moonbeam staking analysis and simulate",
          created: "Web3go Offical Team",
          tags: ["Featured", "Polkadot", "Moonbeam"],
          icon: require(`./../assets/images/home/moonbeam.png`),
        },
        {
          id: "Moonriver-1",
          type: "Moonriver",
          name: " Stake Analysis",
          description: "Moonriver staking analysis and simulate",
          created: "Web3go Offical Team",
          tags: ["Featured", "Kusama", "Moonriver"],
          icon: require(`./../assets/images/home/moonriver.png`),
        },
        {
          id: "Bifrost-1",
          type: "Bifrost",
          name: "Stake Analysis",
          description: "Bifrost staking analysis and simulate",
          created: "Web3go Offical Team",
          tags: ["Featured", "Kusama", "Bifrost"],
          icon: require(`./../assets/images/home/bifrost.svg`),
        },
        {
          id: "Turing-1",
          type: "Turing",
          name: "Stake Analysis",
          description: "Turing staking analysis and simulate",
          created: "Web3go Offical Team",
          tags: ["Featured", "Kusama", "Turing"],
          icon: require(`./../assets/images/home/oak-turing.png`),
        },
        {
          id: "Litentry-1",
          type: "Litentry",
          name: "Stake Analysis",
          description: "Litentry staking analysis and simulate",
          created: "Web3go Offical Team",
          tags: ["Featured", "Kusama", "Litentry"],
          icon: require(`./../assets/images/home/litentry.png`),
        },
      ],
      rmrkNFTDashboardList: [
        {
          id: "rmrkNFT-1",
          type: "RMRK NFT",
          name: "RMRK NFT Garden",
          icon: "./static/images/rmrk-logo.png",
          description: "",
          created: "Web3go Offical Team",
          tags: ["Featured", "Polkadot", "Kusama", "RMRK", "NFT"],
        },
      ],

      customQueryDashboardList: [
        {
          id: -1,
          name: "My LIT Analysis",
          description: "My Analysis For LIT",
          created: "YJ",
          data: {
            contractAddress: "0xb59490ab09a0f526cc7305822ac65f2ab12f9723",
          },
        },
      ],

      removeCustomQueryDialogVisible: false,
      removeCustomQueryId: -1,

      dataBoardViewCounts: [
        {
          dataBoardId: "Polkadot-1",
          viewCount: 1,
        },
      ],
    };
  },
  created() {
    let self = this;
    self.loadCustomQueryDashboardList();

    platformApi.queryDataBoardViewCount().then((resp) => {
      self.dataBoardViewCounts = resp;
    });
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
      this.refreshCollectList();
    }
  },
  methods: {
    refreshCollectList() {
      getUserFavorite().then((d) => {
        this.collectList = d;
      });
    },
    collect(obj) {
      const newObj = { ...obj, type: obj.type ? obj.type : "Custom" };
      if (!this.ifAlreadyCollect(newObj)) {
        addFavorite({
          userId: this.userInfo.userId,
          type: newObj.type,
          link: this.getLink(newObj),
          linkUrl: JSON.stringify(newObj),
        }).then((d) => {
          this.refreshCollectList();
        });
      } else {
        const find = this.collectList.find(
          (v) => v.type == newObj.type && v.link == this.getLink(newObj)
        );
        removeFavorite({
          id: find.id,
        }).then((d) => {
          this.refreshCollectList();
        });
      }
    },
    getLink(obj) {
      const map = {
        "RMRK NFT": "RMRK NFT Garden",
        Moonriver: "Moonriver Staking",
        Moonbeam: "Moonbeam Staking",
        Karura: "Karura  CDPs",
        Kusama: "Kusama Parachain Crowdloans",
        Polkadot: "Polkadot Parachain Crowdloans",
        ERC20: `ERC20 - ${obj.name}`,
        Custom: obj.name,
      };
      return map[obj.type];
    },
    ifAlreadyCollect(obj) {
      const newObj = { ...obj, type: obj.type ? obj.type : "Custom" };
      const find = this.collectList.find(
        (v) => v.type == newObj.type && v.link == this.getLink(newObj)
      );
      if (find) {
        return true;
      }
      return false;
    },
    mapCardType(type) {
      const obj = {
        Moonriver: "Moonriver Staking",
        Moonbeam: "Moonbeam Staking",
        Karura: "Karura  CDPs",
        Kusama: "Kusama Parachain Crowdloans",
        Polkadot: "Polkadot Parachain Crowdloans",
        Bifrost: "Bifrost Staking",
        Turing: "Turing Staking",
      };
      return obj[type] || type;
    },
    getCardLineImg(type) {
      const types = ["Karura", "Kusama", "Polkadot", "ERC20"];

      let num = types.indexOf(type) > -1 ? types.indexOf(type) + 2 : 9;
      if (type === "Moonbeam") {
        return require(`./../assets/images/home/moonbeam-staking-dashboard.png`);
      }

      if (type === "Moonriver") {
        return require(`./../assets/images/home/moonriver-staking-dashboard.png`);
      }
      if (type === "Bifrost") {
        return require(`./../assets/images/home/bifrost-dashboard.png`);
      }
      if (type === "Turing") {
        return require(`./../assets/images/home/oak-turing-dashboard.png`);
      }
      if (type === "Karura") {
        return require(`./../assets/images/home/karura-cdp-dashboard.png`);
      }
      return require(`./../assets/images/home/card-line${num}.png`);
    },

    doTagFilter(array, tagFilter) {
      let self = this;
      let filterList = [];

      if (!tagFilter || tagFilter == "All") {
        filterList = array;
      } else {
        for (let index = 0; index < array.length; index++) {
          const d = array[index];
          if (d.tags) {
            if (d.tags.includes(tagFilter)) {
              filterList.push(d);
            }
          } else {
            filterList.push(d);
          }
        }
      }
      //find viewCount
      if (filterList) {
        // debugger;
        filterList.forEach((t) => {
          for (
            let vcIndex = 0;
            vcIndex < self.dataBoardViewCounts.length;
            vcIndex++
          ) {
            const vc = self.dataBoardViewCounts[vcIndex];
            if (t.id == vc.dataBoardId) {
              t.viewCount = vc.viewCount;
              break;
            }
          }
        });
      }
      return filterList;
    },
    clickSlide(item, index) {
      const { children, isShow } = item;
      if (children && children.length) {
        this.$set(item, "isShow", !isShow);
      }
      if (this.defaultActiveSlideIndex !== index) {
        this.defaultActiveSlideIndex = index;
      }
      this.activeTagFilter = item.tag || "";
    },
    showCardDetail(type, d) {
      if (d.id) {
        platformApi.reportDataBoardViewCount({
          dataBoardId: d.id,
        });
      }

      if (type == "erc20") {
        this.$router.push({
          name: "WalletProfiler",
          query: {
            data: JSON.stringify(d),
          },
        });
      }

      if (type == "crowdloan") {
        let routeName = "ParaChainProfiler";
        if (d.type == "Polkadot") {
          routeName = "ParaChainProfiler4Polkadot";
        }
        this.$router.push({
          name: routeName,
          params: {
            data: d,
          },
          query: {
            chainType: d.type,
          },
        });
      }
      if (type == "cdp") {
        this.$router.push({
          name: "CDPProfiler",
          params: {
            data: d,
          },
        });
      }
      if (type == "customQuery") {
        this.handleCustomQueryActionCommand(d.id + "-view");
      }

      if (type == "Moonriver") {
        this.$router.push({
          name: "Moonriver",
          params: {
            data: d,
          },
        });
      }
      if (type == "Moonbeam") {
        this.$router.push({
          name: "Moonbeam",
          params: {
            data: d,
          },
        });
      }
      if (type == "RMRKNFT") {
        this.$router.push({
          name: "NFTProfiler",
          params: {
            data: d,
          },
        });
      }

      if (type == "Bifrost") {
        this.$router.push({
          name: "BifrostStaking",
          params: {
            data: d,
          },
        });
      }
      if (type == "Turing") {
        this.$router.push({
          name: "TuringStaking",
          params: {
            data: d,
          },
        });
      }
      if (type == "Litentry") {
        this.$router.push({
          name: "LitentryStaking",
          params: {
            data: d,
          },
        });
      }
    },

    buildNewQuery(d) {
      this.$router.push({
        name: "CustomQuery",
        query: {
          editSupport: true,
        },
      });
    },

    loadCustomQueryDashboardList() {
      let self = this;
      queryService.getList().then((resp) => {
        if (resp) {
          self.customQueryDashboardList = [];
          resp.forEach((q) => {
            let d = {
              ...q,
            };
            d.name = q.title;
            if (q.params) {
              d.data = JSON.parse(q.params);
            }
            self.customQueryDashboardList.push(d);
          });
        }
      });
    },
    handleCustomQueryActionCommand(command) {
      console.log("handleCustomQueryActionCommand:", command);
      let id = command.split("-")[0];
      command = command.split("-")[1];
      if (command == "remove") {
        this.removeCustomQueryId = id;
        this.removeCustomQueryDialogVisible = true;
      }
      if (command == "edit" || command == "view") {
        let self = this;
        self.$router.push({
          name: "CustomQuery",
          query: {
            id: id,
            editSupport: command == "edit",
          },
        });
      }
    },
    doRemoveCustomQuery() {
      let self = this;
      let params = { id: this.removeCustomQueryId };
      queryService.remove(params).then((resp) => {
        if (resp) {
          self.$message.success("action success");
          self.loadCustomQueryDashboardList();
          self.removeCustomQueryDialogVisible = false;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" >
.homepage {
  display: flex;
  min-height: calc(100vh - 60px);
  .el-icon-star-on,
  .el-icon-star-off {
    font-size: 16px;
    margin-right: 5px;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
  .card {
    .card-title {
      text-align: left;
      margin: 48px 0 16px;
      height: 40px;
      font-size: 32px;
      font-family: Rubik-Medium, Rubik;
      font-weight: 500;
      color: #292828;
      line-height: 40px;
    }
    .card-content {
      display: flex;
      flex-wrap: wrap;
      .card-item {
        cursor: pointer;
        width: 400px;
        margin-bottom: 24px;
        margin-right: 10px;
        // &:not(:nth-child(4n)) {
        //   margin-right: 20px;
        // }
        &-head {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          background: #ffffff;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 16px;
          .logo {
            width: 32px;
            height: 32px;
          }
          .type {
            padding-left: 11px;
            text-align: left;
            flex: 1;
            font-size: 18px;
            font-family: Rubik-Medium, Rubik;
            font-weight: 500;
            color: #292828;
            line-height: 26px;
            height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .option {
            position: relative;
            &:hover > .option-con {
              display: block;
            }
            &-icon {
              cursor: pointer;
              width: 16px;
              height: 16px;
            }
            &-con {
              &::after {
                position: absolute;
                top: -10px;
                right: 10px;
                content: "";
                display: inline-block;
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-bottom: 10px solid #ffffff;
                box-shadow: 0px -12px 18px 0px rgb(0 0 0 / 12%);
              }
              display: none;
              position: absolute;
              top: 30px;
              right: -12px;
              width: 89px;
              padding: 13px 0;
              background: #ffffff;
              box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.12);
              p {
                cursor: pointer;
                margin: 0;
                height: 40px;
                padding-left: 12px;
                display: flex;
                align-items: center;
                &:hover {
                  background: #ebf9f4;
                }
                img {
                  width: 16px;
                  height: 16px;
                  margin-right: 8px;
                }
                span {
                  font-size: 14px;
                  font-family: Rubik-Regular, Rubik;
                  font-weight: 400;
                  color: #545353;
                }
              }
            }
          }
        }
        &-con {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          background: #ffffff;
          display: flex;
          align-items: center;
          padding: 0 24px;
          justify-content: center;
          height: 170px;
          img {
            width: 100%;
          }
        }
        &-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          margin-top: 17px;
          font-family: Rubik-Regular, Rubik;
          font-weight: 400;
          color: #545353;
          .name {
            text-align: left;
            flex: 1;
          }
          .clickNum {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 44px;
            margin: 0;
            img {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
          }
        }
        &.create {
          background: #fff;
          border: 2px dashed #38cb98;
          min-height: 272px;
          text-align: center;
          img {
            margin-top: 65px;
            width: 46px;
            margin-bottom: 42px;
          }
          p {
            margin: 0;
            font-size: 16px;
            font-family: Rubik-Medium, Rubik;
            font-weight: 500;
            color: #38cb98;
          }
        }
      }
    }
  }
}
.empty {
  height: calc(100vh - 450px);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  img {
    width: 167px;
    margin-bottom: 16px;
  }
  p {
    font-size: 18px;
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    color: rgba(41, 40, 40, 0.6);
  }
}
.foot {
  position: fixed;
  background: #fff;
  left: 200px;
  box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.02);
  bottom: 0;
  right: 0;
  ul {
    width: 100%;
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
    height: 60px;
    align-items: center;
    justify-content: center;
    li {
      a {
        display: flex;
        align-items: center;
        text-decoration: none;
        font-size: 18px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: #292828;
        img {
          width: 24px;
        }
        span {
          &:hover {
            color: #21dbc1;
          }
        }
      }
      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
}
.main {
  padding-left: 200px;
  box-sizing: border-box;
  flex: 1;
  .wrap {
    padding-bottom: 70px;
    min-height: calc(100vh - 302px);
  }
  .adv {
    margin: 32px 24px 8px;
    box-sizing: border-box;
    background: #2a2828;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
  }
  .adv-text {
    flex-grow: 1;
    text-align: left;
    padding: 24px 24px;
    .adv-text-main {
      font-size: 24px;
      color: #fff;
    }
    .adv-text-comment {
      padding-top: 10px;
      font-size: 14px;
      color: #a6acab;
    }
  }
  .adv-banner {
    height: 140px;
  }
  .adv-v2 {
    margin: 30px 24px 8px;
    box-sizing: border-box;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
  }
  .adv-banner-v2 {
    width: 100%;
  }
}
.slide {
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  z-index: 9;
  background: #fff;
  box-shadow: 0px 8px 32px 0px rgba(70, 100, 100, 0.06);
  width: 200px;
  box-sizing: border-box;
  padding: 16px 0;
}
.slide .fSort {
  list-style: none;
  padding: 0;
  margin: 0;
}
.slide .fSort .fItem {
  font-size: 14px;
  font-family: Rubik-Regular, Rubik;
  font-weight: 400;
  display: flex;
  color: #292828;
  flex-direction: column;
  .name {
    padding-left: 19;
    margin-right: 8px;
    border-radius: 10px;
    cursor: pointer;
    height: 40px;
    display: flex;
    align-items: center;
    color: #7f7e7e;
    justify-content: space-between;
    &:hover {
      color: #292828;
      background: rgba(193, 227, 212, 0.3);
      .icon {
        &.All {
          background-image: url("../assets/images/home/all_hover.png");
        }
        &.Featured {
          background-image: url("../assets/images/home/featured_hover.png");
        }
        &.Community {
          background-image: url("../assets/images/home/community_hover.png");
        }
        &.Chain {
          background-image: url("../assets/images/home/chain_hover.png");
        }
        &.Projects {
          background-image: url("../assets/images/home/projects_hover.png");
        }
        &.Report {
          background-image: url("../assets/images/home/report_hover.png");
        }
      }
    }
    .icon {
      width: 40px;
      height: 40px;
      background-size: 16px 16px;
      background-repeat: no-repeat;
      background-position: center center;
      &.All {
        background-image: url("../assets/images/home/all.png");
      }
      &.Featured {
        background-image: url("../assets/images/home/featured.png");
      }
      &.Community {
        background-image: url("../assets/images/home/community.png");
      }
      &.Chain {
        background-image: url("../assets/images/home/chain.png");
      }
      &.Projects {
        background-image: url("../assets/images/home/projects.png");
      }
      &.Report {
        background-image: url("../assets/images/home/report.png");
      }
    }
    .text {
      text-align: left;
      flex: 1;
    }
    .arrow {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      background-size: 16px 16px;
      background-repeat: no-repeat;
      background-position: center center;
      background-image: url("../assets/images/home/arrow.png");
      &.hide {
        transform: rotate(-90deg);
      }
    }
  }
  .name.active {
    border-radius: 0px 6px 6px 0px;
    overflow: hidden;
    color: #292828;
    position: relative;
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      content: "";
      height: 100%;
      display: inline-block;
      width: 100%;
      z-index: 101;
      background: #38cb98;
      opacity: 0.1;
    }
    &::after {
      z-index: 102;
      content: "";
      display: inline-block;
      width: 3px;
      height: 40px;
      background: linear-gradient(
        209deg,
        #55e9a8 0%,
        #55e9a8 13%,
        #21dbc1 45%,
        #7c4fff 100%
      );
      border-radius: 6px;
    }
    .arrow {
      background-image: url("../assets/images/home/arrow.png");
    }
    .icon {
      &.All {
        background-image: url("../assets/images/home/all_hover.png");
      }
      &.Featured {
        background-image: url("../assets/images/home/featured_hover.png");
      }
      &.Community {
        background-image: url("../assets/images/home/community_hover.png");
      }
      &.Chain {
        background-image: url("../assets/images/home/chain_hover.png");
      }
      &.Projects {
        background-image: url("../assets/images/home/projects_hover.png");
      }
      &.Report {
        background-image: url("../assets/images/home/report_hover.png");
      }
    }
  }
}

.slide .fSort .fItem .icon {
  width: 40px;
}
.slide .fSort .fItem img {
  width: 16px;
}
.slide .sSort {
  padding: 0;
  margin: 0;
  list-style: none;
}
.title {
  margin-top: 80px;
  margin-bottom: 50px;
  font-size: 36px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0px 2px 9px rgba(0, 0, 0, 0.5);
}

.case-wrapper {
  padding: 0 16px 0 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.case-item {
  cursor: pointer;
  width: 340px;
  height: 315px;
  border-radius: 6px;
  opacity: 0.9;
  display: block;
  margin: 24px 20px 0 0;
  position: relative;
  transition: all 0.5s;
}
.case-item:hover {
  margin-top: 10px;
  height: 310px;
  background-color: #303131;
}

.case-item-title {
  text-align: left;
  margin: 32px 24px 16px;
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}
.case-item-description {
  text-align: left;
  margin: 0 24px;
  overflow: hidden;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 22px;
}
.case-item-created {
  display: flex;
  margin: 32px 24px 16px;

  color: rgba(255, 255, 255, 0.6);
}
.case-item-created .created-name {
  margin-left: 10px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.87);
  flex-grow: 1;
  text-align: left;
}
.case-item-created .item-img img {
  width: 89px;
  height: 111px;
  margin-left: 24px;
}
.case-item-view {
  position: absolute;
  font-size: 16px;
  font-weight: bold;

  line-height: 19px;
  text-align: left;
  left: 24px;
  bottom: 30px;
}
.case-item-view img {
  width: 14px;
}

.erc20 {
  background: #323232;
}
.erc20 .case-item-view {
  color: #17c684;
}
.kusama {
  background: #212121;
}
.kusama .case-item-view {
  color: #17c684;
}
.karura {
  background: #e03156;
}
.karura .case-item-view {
  color: #ffffff;
}
.add-new {
  background: rgba(24, 24, 24, 0.8);
  box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 2px dashed #17c684;
}

.case-item-add-new-icon img {
  margin-top: 113px;
  width: 46px;
}
.case-item-add-new-description {
  font-size: 16px;
  font-weight: bold;
  color: #17c684;
  margin-top: 40px;
}

.customQuery {
  background: #323232;
}
.customQuery .case-item-view {
  color: #17c684;
}

.case-item-action {
  position: absolute;
  right: 10px;
  top: 5px;
  .el-dropdown-text {
    font-size: 18px;
    line-height: 25px;
    height: 30px;
    width: 50px;
  }
}
</style>
