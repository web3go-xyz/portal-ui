<template>
  <div class="content contributionDetail">
    <div class="common-back-title" style="padding: 0">
      <div class="g-wrap">
        <i class="el-icon-back" @click="$router.back()"></i>
        <span class="text">{{ info.paraId }} {{ query.projectName }}</span>
        <div class="share-wrap-top">
          <img
            title="Share to Twitter"
            @click="
              handleShareAll(
                'twitter',
                '#share-all',
                'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
              )
            "
            src="@/assets/images/twitter@2x.png"
            alt=""
          />
          <img
            title="Capture snapshot"
            @click="
              handleShareAll(
                'download',
                '#share-all',
                'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
              )
            "
            src="@/assets/images/download@2x.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="head extend-2-side">
      <div class="g-wrap">
        <div class="head-mian" id="share-all">
          <div class="head-mian-con">
            <div class="title">
              <img class="color" :src="query.iconPath" />
              <span class="test">{{ query.projectName }}</span>
            </div>
            <div class="tag">
              <span class="tag-item"> {{ info.paraId }} </span>
              <span class="tag-item"> {{ info.status }} </span>
            </div>
            <!-- <p class="stitle">Contributed at</p>
            <p class="desc">
              <span>
                Block:{{ info.expirationBlock }}
                {{ query.lastUpdateTime }}</span
              >
            </p> -->
          </div>
          <div class="head-mian-item">
            <p>
              <img src="@/assets/images/crowdloan/kusama_detail_raised.png" alt="" /><span
                >Total raised</span
              >
            </p>
            <el-tooltip
              :content="formatedTokenValue(info.totalRaisedValue)"
              placement="bottom"
            >
              <h2>{{ formatedCap(info.totalRaisedValue) }}</h2>
            </el-tooltip>
          </div>
          <div class="head-mian-item">
            <p class="contributions">
              <img
                src="@/assets/images/crowdloan/kusama_detail_contributions.png"
                alt=""
              /><span>Number of contributions</span>
            </p>
            <h2>{{ totalContributionCount | roundNumber(0) }}</h2>
          </div>
          <div class="head-mian-item">
            <p class="contributions">
              <img
                src="@/assets/images/crowdloan/kusama_detail_contributor.png"
                alt=""
              /><span>Number of contributors</span>
            </p>
            <h2>{{ totalContributorCount | roundNumber(0) }}</h2>
          </div>
          <div class="head-mian-item">
            <p>
              <img
                src="@/assets/images/crowdloan/kusama_detail_progress.png"
                alt=""
              /><span>Cap</span>
            </p>
            <el-tooltip
              :content="formatedTokenValue(info.totalCapitalValue)"
              placement="bottom"
            >
              <h2>{{ formatedCap(info.totalCapitalValue) }}</h2>
            </el-tooltip>
          </div>
          <div class="head-mian-item">
            <p>
              <img src="@/assets/images/crowdloan/kusama_detail_ration.png" alt="" /><span
                >Progress</span
              >
            </p>
            <h2>{{ info.progress }}%</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="g-wrap">
      <div
        class="ad-link"
        v-for="ad in adList"
        :key="ad.name"
        v-show="showAd(ad.name)"
      >
        <div :class="ad.class">
          <img :src="ad.image" @click="gotoLink(ad)" />
        </div>
      </div>

      <div class="header-filter">
        <div class="filter-left">
          <div class="label">{{ totalContributionCount }} Contributions</div>
        </div>
        <div class="filter-right">
          <div class="contribution-account">
            <el-input
              v-on:keyup.enter.native="refreshData(true)"
              style="width: 260px"
              v-model="query.filterContributionAccount"
              placeholder="filter contributor account"
            ></el-input>
          </div>
          <div class="contribution-order">
            <el-select
              v-model="query.filterOrderOption"
              placeholder="please choose sort order"
              @change="refreshData(true)"
            >
              <el-option
                v-for="option in orderOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="contribution-totalAmount">
            Total: {{ contributionAmount | formatKUSAMA }} &nbsp;KSM
          </div>
          <div class="reset">
            <el-button @click="reset(true)">Reset</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="g-wrap">
      <div class="data-table">
        <el-table
          :key="Math.random()"
          v-loading="loading"
          element-loading-text="loading "
          element-loading-spinner="el-icon-loading"
          :data="contributionTableData"
          style="width: 100%"
        >
          <el-table-column label="Contributor" prop="account" width="450">
            <template slot-scope="scope">
              <address-display :address="scope.row.account"></address-display>
            </template>
          </el-table-column>
          <el-table-column label="Amount" prop="amount" width="210">
            <template slot-scope="scope">
              {{ scope.row.amountFormated }}
            </template>
          </el-table-column>
          <el-table-column prop="ratio" label="Ratio" width="200">
            <template slot-scope="scope">
              {{ scope.row.ratio }}
            </template>
          </el-table-column>

          <el-table-column prop="createdAt" label="Contributed at">
            <template slot-scope="scope">
              <div>Block: {{ scope.row.blockNum }}</div>
              <div>{{ filterTime(scope.row.createdAt) | formatDate }}</div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          id="g-pagination"
          v-show="contributionCount4Page > 0"
          background
          :current-page.sync="query.currentPage"
          :total="contributionCount4Page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="query.pageSize"
          layout="prev, pager, next, sizes, jumper"
        >
        </el-pagination>
      </div>
      <div class="chart">
        <h2 class="title" style="position: relative">
          Top 5 contributors by number of contributions
          <div class="share-wrap">
            <img
              title="Share to Twitter"
              @click="
                handleShare(
                  'twitter',
                  '#share1',
                  'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
                )
              "
              src="@/assets/images/twitter@2x.png"
              alt=""
            />
            <img
              title="Capture snapshot"
              @click="
                handleShare(
                  'download',
                  '#share1',
                  'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
                )
              "
              src="@/assets/images/download@2x.png"
              alt=""
            />
          </div>
        </h2>
        <div id="share1">
          <div class="left">
            <div class="transactionChart" ref="transactionChart"></div>
          </div>
          <div class="right">
            <ul>
              <li
                v-for="(
                  i, index
                ) in getContributorsRankingListOfnumberOfContributions"
                :key="i.account"
              >
                <div>
                  <span class="rank" v-if="index < 3"
                    ><img
                      :src="
                        require(`@/assets/images/crowdloan/kusama_detail_top${
                          index + 1
                        }.png`)
                      "
                      alt=""
                  /></span>
                  <span class="rank" v-else>{{ index + 1 }}</span>
                  <span>
                    <address-display :address="i.account"></address-display>
                  </span>
                </div>
                <span>{{ i.numberOfContributions }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="chart">
        <h2 class="title" style="position: relative">
          Top 5 contributors by KSM contributed
          <div class="share-wrap">
            <img
              title="Share to Twitter"
              @click="
                handleShare(
                  'twitter',
                  '#share2',
                  'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
                )
              "
              src="@/assets/images/twitter@2x.png"
              alt=""
            />
            <img
              title="Capture snapshot"
              @click="
                handleShare(
                  'download',
                  '#share2',
                  'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
                )
              "
              src="@/assets/images/download@2x.png"
              alt=""
            />
          </div>
        </h2>
        <div id="share2">
          <div class="left">
            <div class="transactionChart" ref="ContributorChart"></div>
          </div>
          <div class="right">
            <ul>
              <li
                v-for="(
                  i, index
                ) in getContributorsRankingListOfoverallContributionAmount"
                :key="i.account"
              >
                <div>
                  <span class="rank" v-if="index < 3"
                    ><img
                      :src="
                        require(`@/assets/images/crowdloan/kusama_detail_top${
                          index + 1
                        }.png`)
                      "
                      alt=""
                  /></span>
                  <span class="rank" v-else>{{ index + 1 }}</span>
                  <span>
                    <address-display :address="i.account"></address-display
                  ></span>
                </div>
                <el-tooltip
                  :content="formatedTokenValue(i.contributionAmount)"
                  placement="bottom"
                >
                  <span>{{ formatedCap(i.contributionAmount) }}</span>
                </el-tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="history">
        <h2 class="title">History</h2>
        <div style="position: relative">
          <div class="share-wrap">
            <img
              title="Share to Twitter"
              @click="
                handleShare(
                  'twitter',
                  '#share3',
                  'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
                )
              "
              src="@/assets/images/twitter@2x.png"
              alt=""
            />
            <img
              title="Capture snapshot"
              @click="
                handleShare(
                  'download',
                  '#share3',
                  'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
                )
              "
              src="@/assets/images/download@2x.png"
              alt=""
            />
          </div>
          <div id="share3" class="chart-el" ref="historyTotal"></div>
        </div>
        <div style="position: relative">
          <div class="share-wrap">
            <img
              title="Share to Twitter"
              @click="
                handleShare(
                  'twitter',
                  '#share4',
                  'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
                )
              "
              src="@/assets/images/twitter@2x.png"
              alt=""
            />
            <img
              title="Capture snapshot"
              @click="
                handleShare(
                  'download',
                  '#share4',
                  'Crowdloan Progress Updates! Check out our crowdloan data on @Web3Go'
                )
              "
              src="@/assets/images/download@2x.png"
              alt=""
            />
          </div>
          <div id="share4" class="chart-el" ref="historyIncrement"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from "bignumber.js";
import utils from "@/utils";
import service from "@/api/paraChain-analysis-kusama";
import addressDisplay from "@/components/ui-elements/addressDisplay";
import { ss58transform } from "@/api/common";

export default {
  name: "ParaChainCrowdloanContributionDetail",
  components: {
    addressDisplay,
  },
  data() {
    return {
      ksmRatio: 1000 * 1000 * 1000 * 1000,
      msg: "Welcome to ParaChainCrowdloan Contribution Detail",
      info: {},
      loading: false,
      transactionChartInstance: null,
      getTotalContributionAmount: 0,
      getContributorsRankingListOfnumberOfContributions: [],
      getContributorsRankingListOfoverallContributionAmount: [],
      query: {
        crowdloanId: "",
        filterContributionAccount: "",
        filterOrderOption: "Latest",
        pageIndex: 1,
        pageSize: 10,
        currentPage: 1,
      },
      contributionAmount: 0,
      contributionCount4Page: 0,
      totalContributionCount: 0,
      totalContributorCount: 0,
      orderOptions: [
        {
          label: "Latest",
          value: "Latest",
          metadata: { sort: "createdAt", order: "DESC" },
        },
        {
          label: "Oldest",
          value: "Oldest",
          metadata: { sort: "createdAt", order: "ASC" },
        },
        {
          label: "Most Amount",
          value: "Most Amount",
          metadata: { sort: "amount", order: "DESC" },
        },
        {
          label: "Least Amount",
          value: "Least Amount",
          metadata: { sort: "amount", order: "ASC" },
        },
      ],

      crowdloanData: {},
      contributionTableData: [],

      adList: [
        {
          name: "Acala",
          class: "",
          image: "./static/ad/acala-link.png",
          link: "https://acala.network/acala/join-acala?ref=0xec495d2d087bcfe8062c6ec85c90bf4a2ccd05d21978c0f2de7c5fb3cf1fa542#join-acala",
        }, //TODO get ad from api
        {
          name: "Moonbeam",
          class: "",
          image: "./static/ad/moonbeam-link.png",
          link: "https://crowdloan.moonbeam.foundation/",
        },
        {
          name: "Litentry",
          class: "",
          image: "./static/ad/litentry-link.png",
          link: "https://crowdloan.litentry.com/",
        },
      ],
      refreshInterval: {},
    };
  },
  mounted() {
    let self = this;
    const query = this.$route.query;
    self.info = Object.assign(this.info, query);
    self.query = Object.assign(this.query, query);
    self.refreshAllData();
    self.refreshInterval = setInterval(() => {
      self.refreshAllData();
    }, 2 * 60 * 1000);
  },
  destroyed() {
    let self = this;
    if (self.refreshInterval) {
      clearInterval(self.refreshInterval);
    }
  },
  methods: {
    formatedTokenValue(v) {
      return utils.formatToken(v, utils.KSM_RATIO);
    },
    refreshAllData() {
      let self = this;
      Promise.all([
        service.getPieChartContributorsRankingList({
          crowdloanId: this.query.crowdloanId,
          topN: 5,
          rankingBy: "numberOfContributions",
        }),
        service.getPieChartContributorsRankingList({
          crowdloanId: this.query.crowdloanId,
          topN: 5,
          rankingBy: "overallContributionAmount",
        }),
        service.getContributorsRankingList({
          crowdloanId: this.query.crowdloanId,
          topN: 5,
          rankingBy: "numberOfContributions",
        }),
        service.getTotalContributionAmount({
          crowdloanId: this.query.crowdloanId,
        }),
        service.getCrowdloanCapAndRaisedValue({
          crowdloanId: this.query.crowdloanId,
        }),
        service.getOverallContributionAmountAndAcountDailyIncrease({
          crowdloanId: this.query.crowdloanId,
        }),
        service.getPolkParaChainCrowdloanList({
          crowdloanId: this.query.crowdloanId,
        }),
      ]).then(async (res) => {
        this.getContributorsRankingListOfnumberOfContributions = res[0].map(
          (item, index) => {
            item.numberOfContributions = res[2][index].numberOfContributions;
            return item;
          }
        );
        this.initHistory(res[5]);
        this.getTotalContributionAmount = res[3];
        this.getContributorsRankingListOfoverallContributionAmount = res[1];
        this.info = Object.assign(this.info, res[4], {
          contributions:
            this.getTotalContributionAmount.totalContributionAmount,
          progress: (
            (res[4].totalRaisedValue / res[4].totalCapitalValue) *
            100
          ).toFixed(0),
        });
        this.getParachainCrowdLoan(res[6]);
        await this.reset();
        this.initNumberChart();
        this.initContributorChart();
      });

      service
        .getTotalNumberOfContributions({
          crowdloanId: this.query.crowdloanId,
        })
        .then((resp) => {
          self.totalContributionCount = parseInt(
            resp.totalNumberOfContributions
          );
          self.totalContributorCount = parseInt(resp.totalContributorCount);
        });
    },
    gotoLink(ad) {
      var newWindow = window.open(ad.link, "_blank");
      newWindow.focus();
    },
    linkMoonbeam() {
      var newWindow = window.open("", "_blank");
      newWindow.focus();
    },
    showAd(name) {
      if (this.query && this.query.projectName) {
        return this.query.projectName.indexOf(name) > -1;
      }
      return false;
    },
    handleShare(key, elId, title) {
      const el = document.querySelector(elId);
      el.className = el.className + " share-700-height";
      utils
        .html2Img(el, () => {
          el.className = el.className.replace(" share-700-height", "");
        })
        .then(({ address, base64 }) => {
          if (key == "twitter") {
            utils.share(
              `https://web3go.xyz/#${this.$route.fullPath}`,
              address,
              title
            );
          } else if (key == "download") {
            utils.downloadFile(base64, title);
          }
        });
    },
    filterTime(time) {
      return (+new Date(time)).toString().slice(0, -3);
    },
    shotFilter(str) {
      return str.slice(0, 6) + "..." + str.slice(str.length - 4, str.length);
    },
    formatedCap(row, isEchartData) {
      let result = utils.formatedDisplay4CrowdloanKSM(row, isEchartData);
      //console.log("formatedCap:", result);
      return result;
    },
    initHistory(data) {
      const historyTotal = echarts.init(this.$refs.historyTotal);
      const historyIncrement = echarts.init(this.$refs.historyIncrement);
      let seriesData = [this.formatedCap(data[0].amountIncrease, true)];
      data
        .map((item) => this.formatedCap(item.amountIncrease, true))
        .reduce((a, b) => {
          const total = (+a + b).toFixed(1);
          seriesData.push(total);
          return total;
        });
      const timeData = data.map((item) => item.dateCreatedOn);
      const totalData = data.map((item) =>
        this.formatedCap(item.amountIncrease, true)
      );
      const historyTotalOption = {
        title: {
          text: "Total KSM raised during the crowdloan",
          left: -5,
          textStyle: {
            color: "#292828",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: `{c0}K`,
        },
        xAxis: {
          data: timeData,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "rgba(41, 40, 40, 0.4)",
          },
        },
        yAxis: {
          axisLabel: {
            color: "rgba(41, 40, 40, 0.4)",
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed",
              color: "rgba(41, 40, 40, 0.4)",
            },
          },
        },
        series: [
          {
            name: "Amount",
            type: "line",
            data: seriesData,
            itemStyle: {
              color: "#17c684",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(105, 231, 201, 0.35)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(56, 203, 152, 0)", // 100% 处的颜色
                  },
                ],
              },
            },
          },
        ],
      };
      const historyIncrementOption = {
        title: {
          text: "Daily increase of KSM raised during the crowdloan",
          left: -5,
          textStyle: {
            color: "#292828",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: `{c0}K`,
        },
        xAxis: {
          type: "category",
          data: timeData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: totalData,
            type: "bar",
          },
        ],
      };
      historyTotal.setOption(historyTotalOption);
      historyIncrement.setOption(historyIncrementOption);
    },
    initNumberChart() {
      this.transactionChartInstance = echarts.init(this.$refs.transactionChart);
      const seriesData =
        this.getContributorsRankingListOfnumberOfContributions.map(
          (item, index) => {
            const strs = ["Top1", "Top2", "Top3", "Top4", "Top5"][index];
            const point = (
              (item.numberOfContributions / this.totalContributionCount) *
              100
            ).toFixed(2);
            const name = `${strs}   ${point}%`;
            return {
              name,
              point,
              value: item.numberOfContributions,
            };
          }
        );
      const OthersvvName = seriesData
        .map((item) => +item.point)
        .reduce((a, b) => a + b);
      const OthersvvValue = seriesData
        .map((item) => +item.value)
        .reduce((a, b) => a + b);
      seriesData.push({
        name: `Others ${(100 - OthersvvName).toFixed(2)}%`,
        value: this.totalContributionCount - OthersvvValue,
      });
      const option = {
        tooltip: { trigger: "item" },
        legend: {
          top: "15%",
          right: "0%",
          orient: "vertical",
          textStyle: {
            color: "rgba(41, 40, 40, 0.8)",
          },
        },
        series: [
          {
            center: ["30%", "30%"],
            type: "pie",
            radius: ["60%", "40%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "13",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: seriesData,
          },
        ],
      };
      this.transactionChartInstance.setOption(option);
    },
    initContributorChart() {
      this.transactionChartInstance = echarts.init(this.$refs.ContributorChart);
      const seriesData =
        this.getContributorsRankingListOfoverallContributionAmount.map(
          (item, index) => {
            const strs = ["Top1", "Top2", "Top3", "Top4", "Top5", "Others"][
              index
            ];
            const point = (item.percentageForContributionAmount * 100).toFixed(
              2
            );
            const name = `${strs}   ${point}%`;
            return {
              name,
              point,
              value: this.formatedCap(item.contributionAmount, true),
            };
          }
        );
      const OthersvvName = seriesData
        .map((item) => +item.point)
        .reduce((a, b) => a + b);
      const OthersvvValue = seriesData
        .map((item) => +item.value)
        .reduce((a, b) => a + b);
      seriesData.push({
        name: `Others ${(100 - OthersvvName).toFixed(2)}%`,
        value:
          this.formatedCap(
            this.getTotalContributionAmount.totalContributionAmount,
            true
          ) - OthersvvValue,
      });
      const option = {
        tooltip: { trigger: "item", formatter: `{c0}K` },
        legend: {
          top: "15%",
          right: "0%",
          orient: "vertical",
          textStyle: {
            color: "rgba(41, 40, 40, 0.8)",
          },
        },
        series: [
          {
            center: ["30%", "30%"],
            type: "pie",
            radius: ["60%", "40%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "13",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: seriesData,
          },
        ],
      };
      this.transactionChartInstance.setOption(option);
    },
    async reset(resetFilter) {
      if (resetFilter) {
        this.query.filterContributionAccount = "";
        this.query.filterOrderOption = "Latest";
        this.query.pageIndex = 1;
        this.query.currentPage = 1;
        this.query.pageSize = 10;
      }
      await this.refreshData();
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.pageIndex = 1;
      var resetPageIndex = true;
      this.refreshData(resetPageIndex);
    },
    handleCurrentChange(val) {
      this.query.pageIndex = val;
      this.refreshData();
    },
    getParachainCrowdLoan(resp) {
      var self = this;
      if (resp && resp.list.length > 0) {
        self.crowdloanData = resp.list[0];
        self.info = Object.assign(self.info, self.crowdloanData);
      }
    },
    getOrderBy() {
      let orderBys = [];
      for (let index = 0; index < this.orderOptions.length; index++) {
        const element = this.orderOptions[index];
        if (element.value == this.query.filterOrderOption) {
          orderBys.push(element.metadata);
          break;
        }
      }
      return orderBys;
    },
    async refreshData(resetPageIndex) {
      var self = this;
      if (resetPageIndex) {
        self.query.pageIndex = 1;
        self.query.currentPage = 1;
      }
      var self = this;
      self.contributionTableData = [];
      self.loading = true;
      let searchKey = self.query.filterContributionAccount;
      try {
        const res = await ss58transform({
          networks: ["kusama"],
          account: self.query.filterContributionAccount,
        });
        const obj = res.find((v) => v.network == "kusama");
        searchKey = obj.value;
      } catch (err) {
        searchKey = self.query.filterContributionAccount;
      }

      var param = {
        pageSize: self.query.pageSize,
        pageIndex: self.query.pageIndex,
        crowdloanId: self.query.crowdloanId,
        account: searchKey,
        orderBys: self.getOrderBy(),
      };
      await service
        .getPolkParaChainCrowdloanContributionList(param)
        .then((resp) => {
          self.loading = false;
          if (resp) {
            self.contributionCount4Page = resp.totalCount;
            self.contributionAmount = resp.totalAmount;
            self.contributionTableData = resp.list;
            self.update(self.contributionTableData);
          }
        })
        .catch((err) => {
          self.loading = false;
          console.error(err);
        });
    },
    goBack() {
      this.$router.push({
        name: "ParaChainProfiler",
        params: this.$route.params,
      });
    },
    goHome() {
      this.$router.push({ name: "HomePage" });
    },

    update(tableData) {
      //amountFormated
      let totalRaised = this.crowdloanData.raised;
      for (let index = 0; index < tableData.length; index++) {
        const row = tableData[index];

        let ratio =
          parseFloat((row.amount / totalRaised) * 100).toFixed(4) + "%";
        row.ratio = ratio;

        row.amountFormated = new BigNumber(row.amount).div(
          new BigNumber(this.ksmRatio)
        );

        let precision = 2;
        row.amountFormated = row.amountFormated.toFormat(precision) + " KSM";
      }
    },
  },
};
</script>
<style lang="less">
.contributionDetail {
  background: #fff;
}
.contributionDetail .history {
  width: 100%;
  height: 500px;
  margin-top: 12px;
}
.contributionDetail .history .title {
  text-align: left;
  margin: 0 0 20px;
}
.contributionDetail .history > div {
  width: 100%;
  height: 100%;
}
.contributionDetail .history > div > .chart-el {
  width: 100%;
  height: 100%;
}
.contributionDetail .el-table tr th .cell {
  color: rgba(000, 000, 000, 0.3) !important;
  font-weight: bold;
}
body.white-theme .contributionDetail .el-table .el-table__body {
  border-spacing: 0 !important;
}
.contributionDetail .el-table tr td .cell {
  color: rgba(41, 40, 40, 0.6);
}
.contributionDetail .el-table tr th:nth-child(1) .cell,
.contributionDetail .el-table tr td:nth-child(1) .cell {
  text-align: left;
}
.contributionDetail .el-table tr td:nth-child(1) .cell {
  font-weight: 500;
  margin-left: 16px;
  color: rgba(41, 40, 40, 0.8);
}
.contributionDetail .el-table tr th:nth-child(2) .cell,
.contributionDetail .el-table tr td:nth-child(2) .cell {
  text-align: right;
}
.contributionDetail .el-table tr th:nth-child(3) .cell,
.contributionDetail .el-table tr td:nth-child(3) .cell {
  text-align: right;
}

.contributionDetail .el-table tr th:nth-child(4) .cell,
.contributionDetail .el-table tr td:nth-child(4) .cell {
  text-align: left;
  margin-left: 152px;
}
.contributionDetail .el-table tr th {
  background: #fff;
  padding: 0;
  padding-bottom: 16px;
}
.contributionDetail .el-table tr td {
  padding: 7px 0;
}
.contributionDetail .el-table .cell {
  padding: 0;
}
.contributionDetail .header-filter .el-select {
  width: 266px;
}
.contributionDetail .common-back-title {
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.06);
}
.contributionDetail .el-table tr:nth-child(2n) {
  background-color: #f5f7f9;
}
.contributionDetail .el-table td,
.el-table th {
  border-bottom: none;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.content {
}

.header-filter {
  padding: 40px 0 0px;
}
.header-filter .filter-left {
  display: block;
  text-align: left;
  font-weight: bold;
  font-size: 24px;
  color: rgba(41, 40, 40, 0.8);
  margin-bottom: 20px;
}
.header-filter .filter-right {
  justify-content: space-between;
  color: white;
  display: flex;
}
.header-filter .filter-right .reset {
  flex: 1;
  text-align: right;
}

.header-filter .filter-right .contribution-account {
}
.header-filter .filter-right .contribution-order {
  margin: 0px 10px;
}
.header-filter .filter-right .contribution-totalAmount {
  margin: 10px 10px;
  color: #000;
}
.data-table {
  margin-top: 20px;
}
.head {
  background: #f4f6f8 url("~@/assets/images/detail_bg.png") no-repeat left top;
  background-size: 100% 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}
.head-back {
  padding: 48px 0;
}
.head-back span {
  cursor: pointer;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.87);
}
.head-back span i {
  margin-right: 5px;
}
.head-back span:hover {
  color: #17c684;
}
.head-mian {
  display: flex;
}
.head .stitle {
  color: rgba(41, 40, 40, 0.6);
  font-size: 12px;
  margin: 0;
}
.head .color {
  width: 40px;
  height: 40px;
  border-radius: 36px;
  margin-right: 12px;
}
.head .test {
  color: #292828;
  font-size: 36px;
  font-family: Rubik-Bold, Rubik;
  font-weight: bold;
}
.head .tag {
  margin-bottom: 16px;
}
.head .tag-item {
  margin-right: 8px;
  font-size: 12px;
  padding: 4px 12px;
  color: rgba(41, 40, 40, 0.6);
  background: rgba(225, 231, 237, 0.8);
  border-radius: 6px;
}
.head .desc {
  margin: 0;
  font-size: 14px;
  margin-top: 4px;
  display: flex;
  color: rgba(41, 40, 40, 0.6);
  align-items: center;
}
.head .desc img {
  width: 16px;
  cursor: pointer;
  height: 16px;
}
.head .desc .copyImg {
  position: relative;
  top: 2px;
  left: 4px;
}
.head .desc .copyImg:hover::after {
  position: absolute;
  border-radius: 10px;
  display: inline-block;
  top: -45px;
  right: -20px;
  width: 50px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2b2b2b;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  opacity: 0.9;
  color: rgba(41, 40, 40, 0.6);
  content: "Copy";
}

.head .title {
  margin-bottom: 24px;
  height: 48px;
  display: flex;
  align-items: center;
}
.head-mian {
  display: flex;
  background-size: contain;
  justify-content: space-between;
  padding: 35px 0 20px;
}
.head-mian-con {
  flex: 1;
}
.head-mian-item {
  margin-left: 15px;
  width: 170px;
  height: 140px;
  background: #fff;
  border-radius: 6px;
}
.head-mian-item p img {
  width: 24px;
  height: 24px;
}
.head-mian-item p.contributions span {
  line-height: 1;
}
.head-mian-item p {
  display: flex;
  align-content: center;
  margin: 0;
  line-height: 1;
  padding: 24px;
  padding-bottom: 0;
  height: 24px;
  margin-bottom: 20px;
}
.head-mian-item p span {
  line-height: 24px;
  margin-left: 8px;
  font-size: 14px;
  font-family: Rubik-Regular, Rubik;
  color: rgba(41, 40, 40, 0.6);
}
.head-mian-item h2 {
  margin: 0;
  text-align: center;
  padding: 24px 10px;
  padding-top: 0;
  font-size: 40px;
  font-family: Rubik-Medium, Rubik;
  font-weight: 500;
  color: rgba(41, 40, 40, 0.8);
}
#g-pagination {
  margin-top: 24px;
  padding-bottom: 68px;
  text-align: right;
}
.chart {
  padding: 40px 40px 0;
  background: #f5f7f9;
  margin-bottom: 20px;
}
.chart > div {
  display: flex;
  height: 320px;
  justify-content: space-between;
}
.chart .left {
  order: 2;
  flex: 1;
  box-sizing: border-box;
  border-radius: 6px;
}
.chart h2 {
  text-align: left;
  font-size: 24px;
  font-family: Rubik-Regular, Rubik;
  font-weight: 500;
  padding-bottom: 26px;
  color: rgba(41, 40, 40, 0.8);
  border-bottom: 1px solid rgba(41, 40, 40, 0.1);
}
.chart .right {
  flex: 1;
  order: 1;
  box-sizing: border-box;
  border-radius: 6px;
}
.chart .right ul {
  margin: 0;
  padding: 0;
  list-style: none;
  padding-top: 24px;
}
.chart .right li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  font-size: 14px;
  font-family: Rubik-Medium, Rubik;
  font-weight: 500;
  color: rgba(41, 40, 40, 0.6);
  margin-bottom: 24px;
}
.chart .right li .times {
  color: rgba(41, 40, 40, 0.8);
}
.chart .right li div {
  display: flex;
  align-items: center;
}
.chart .left > div {
  padding-top: 40px;
}
.chart h2 {
  margin: 0;
}
.chart .right li .rank {
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  margin-right: 14px;
  font-size: 20px;
  font-family: Rubik-Medium, Rubik;
  font-weight: 500;
  color: rgba(41, 40, 40, 0.8);
}
.chart .right li .rank img {
  width: 32px;
  height: 32px;
}
.transactionChart {
  height: 400px;
}
.share-700-height {
  height: 700px !important;
  &.chart-el {
    padding-top: 100px;
  }
  & > .left {
    & > div {
      margin-top: 130px !important;
    }
  }
  & > .right {
    & > ul {
      margin-top: 130px !important;
    }
  }
}
.contributionDetail {
  .hide2div {
    height: 400px;
    padding-top: 300px;
    .hide {
      display: none;
    }
  }
  .share-wrap {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
    img {
      margin-left: 2px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .history .share-wrap {
    right: 40px;
  }
  .share-wrap-top {
    margin-top: 4px;
    float: right;
    img {
      margin-left: 10px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
