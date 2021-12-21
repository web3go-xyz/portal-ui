<template>
  <div class="content moonriver-page">
    <div class="common-back-title">
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">Moonriver</span>
      <div class="link-btn-wrap" v-if="!freeBalance">
        <img
          v-if="!linkLoading"
          class="icon"
          src="@/assets/images/wallet-icon.png"
          alt=""
        />
        <el-button
          class="link-btn"
          :loading="linkLoading"
          @click="handleLinkAccount"
          >Connect Wallet</el-button
        >
      </div>
      <div v-else class="wallet-wrap">
        <img class="icon" src="@/assets/images/wallet-login-icon.png" alt="" />
        <span class="number">
          <el-tooltip :content="linkAccount.address" placement="top">
            <span> {{ shotFilter(linkAccount.address) }}</span>
          </el-tooltip>
          （{{ this.freeBalance }} MOVR）</span
        >
      </div>
    </div>
    <div class="big-bg">
      <div class="info-wrap">
        <div class="info-item">
          <img src="@/assets/images/moonriver1.png" alt="" />
          <div class="right">
            <div class="title">Round Index</div>
            <div class="number">{{ roundInfo.current }}</div>
          </div>
        </div>
        <div class="info-item">
          <img src="@/assets/images/moonriver2.png" alt="" />
          <div class="right">
            <div class="title">Block Number</div>
            <div class="number">{{ blockNumber }}</div>
          </div>
        </div>
        <div class="info-item">
          <img src="@/assets/images/moonriver3.png" alt="" />
          <div class="right">
            <div class="title">Round Porgress</div>
            <div class="number">
              {{ blockNumber - roundInfo.first }}/{{ roundInfo.length }}
            </div>
          </div>
          <el-progress
            class="circle"
            type="circle"
            :width="50"
            color="#38CB98"
            :stroke-width="10"
            stroke-linecap="butt"
            :percentage="getInfoPercentage"
            :show-text="false"
          ></el-progress>
        </div>
      </div>
      <el-tabs class="big-tabs" v-model="activeTab" @tab-click="handleClick">
        <el-tab-pane label="Stake Simulation" name="1"></el-tab-pane>
        <el-tab-pane label="My Stake" name="2"></el-tab-pane>
      </el-tabs>
      <div v-show="activeTab == 1" class="tab-content tab-content1">
        <el-table v-loading="loading" :data="tableData">
          <el-table-column label="Rank" width="90">
            <template slot-scope="scope">
              <div
                class="rank-icon"
                :class="{
                  first: scope.row.rankIndex + 1 == 1,
                  second: scope.row.rankIndex + 1 == 2,
                  third: scope.row.rankIndex + 1 == 3,
                }"
              >
                {{ scope.row.rankIndex + 1 }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="Collator">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.id" placement="top">
                <span class="collector-span" @click="turnActionPage(scope)">{{
                  shotFilter(scope.row.id)
                }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="Self Stake">
            <template slot-scope="scope">
              <span>{{ getSelfStake(scope.row) | roundNumber(2) }} MOVR</span>
            </template>
          </el-table-column>
          <el-table-column width="150" label="Delegator Stake">
            <template slot-scope="scope">
              <span
                >{{ getNominatorStake(scope.row) | roundNumber(2) }} MOVR</span
              >
            </template>
          </el-table-column>
          <el-table-column label="Total Stake">
            <template slot-scope="scope">
              <span>{{ getTotalStake(scope.row) | roundNumber(2) }} MOVR</span>
            </template>
          </el-table-column>
          <el-table-column label="Total Reward">
            <template slot-scope="scope">
              <span>{{ scope.row.totalReward | roundNumber(2) }} MOVR</span>
            </template>
          </el-table-column>
          <el-table-column label="Latest RPM" prop="latestRPM">
            <template slot-scope="scope">
              <span>{{ scope.row.latestRPM | roundNumber(8) }} MOVR</span>
            </template>
          </el-table-column>
          <el-table-column
            width="270"
            prop="name"
            label="Reward History ( Latest 10 rounds )"
          >
            <template slot-scope="scope">
              <div :ref="'tableChart' + scope.row.id" class="table-chart"></div>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-popover
                popper-class="simulate-popover"
                @show="showDetail(scope.$index, scope.row)"
                placement="left"
                trigger="click"
              >
                <div class="simulate-popover-content">
                  <div
                    class="detail-chart"
                    :ref="'detailChart' + scope.row.id"
                  ></div>
                  <div class="title statistic-title">
                    <span>RPM Statistic</span>
                    <el-tooltip
                      placement="top"
                      trigger="hover"
                      content='RPM, Rewards Per MOVR. To simplify the calculation, we define RPM as "rewards per MOVR when nominating to the specific collator"'
                    >
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </div>
                  <div class="statistic">
                    <div class="item">
                      <span class="label">Min:</span
                      ><span>{{ scope.row.mimRPM | roundNumber(7) }} MOVR</span>
                    </div>
                    <div class="item">
                      <span class="label">Max:</span
                      ><span>{{ scope.row.maxRPM | roundNumber(7) }} MOVR</span>
                    </div>
                    <div class="item">
                      <span class="label">Average:</span
                      ><span
                        >{{ scope.row.averageRPM | roundNumber(7) }} MOVR</span
                      >
                    </div>
                    <div class="item">
                      <span class="label"> RPM Valatility Score: </span>
                      <span class="yellow">{{
                        scope.row.standardDeviation | roundNumber(8)
                      }}</span>
                      <el-tooltip
                        placement="top"
                        trigger="hover"
                        content="The volatility of rewards. We use standard deviation to indicate the volatility of rewards. The less the volatility is, the rewards of nominating this collator are relatively stable(according to the latest 10 rounds)"
                      >
                        <i class="el-icon-warning-outline"></i>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="title">Estimate Reward</div>
                  <div class="input-wrap">
                    <span class="label">Stake</span>
                    <el-input class="input" v-model="inputValue"></el-input>
                    <span class="unit">MOVR</span>
                    <el-tooltip
                      class="tip"
                      placement="top"
                      trigger="hover"
                      content="Input the quantity of MOVR to estimate the rewards in real-time. Estimated reward = Quantity * RPM, RPM is calculated according to the standard deviation"
                    >
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                    <i class="el-icon-right"></i>
                    <span class="yellow">{{
                      getBoundaryReward(scope.row)
                    }}</span>
                    <span class="unit">MOVR</span>
                  </div>
                  <div class="title">
                    <span>Competitor </span>
                    <el-tooltip
                      placement="top"
                      trigger="hover"
                      content="The real-time data of MOVR staked by the nominators and the corresponding ranking are listed here"
                    >
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </div>
                  <div class="competitor-wrap">
                    <div class="item">
                      <div class="item-top">
                        <span class="title">Current Rank:</span>
                        <span class="number yellow">{{
                          getSimulateRank(scope.row)
                        }}</span>
                      </div>
                      <div class="progress-wrap">
                        <el-progress
                          :text-inside="true"
                          :stroke-width="16"
                          :percentage="getSumulatePercent(scope.row)"
                        ></el-progress>
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-top">
                        <span class="title"
                          >Rank {{ maxNominator }} Stake:</span
                        >
                        <span class="number"
                          >{{
                            getSingleNominatorStakeByRank(
                              scope.row,
                              parseInt(maxNominator)
                            )
                          }}
                          MOVR</span
                        >
                      </div>
                      <div class="progress-wrap">
                        <el-progress
                          :text-inside="true"
                          :stroke-width="16"
                          :percentage="
                            getSumulatePercentByRank(scope.row, maxNominator)
                          "
                        ></el-progress>
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-top">
                        <span class="title"
                          >Rank {{ parseInt(maxNominator * 0.9) }} Stake:</span
                        >
                        <span class="number"
                          >{{
                            getSingleNominatorStakeByRank(
                              scope.row,
                              parseInt(maxNominator * 0.9)
                            )
                          }}
                          MOVR</span
                        >
                      </div>
                      <div class="progress-wrap">
                        <el-progress
                          :text-inside="true"
                          :stroke-width="16"
                          :percentage="
                            getSumulatePercentByRank(
                              scope.row,
                              parseInt(maxNominator * 0.9)
                            )
                          "
                        ></el-progress>
                      </div>
                    </div>
                    <div class="item">
                      <div class="item-top">
                        <span class="title"
                          >Rank {{ parseInt(maxNominator * 0.5) }} Stake:</span
                        >
                        <span class="number"
                          >{{
                            getSingleNominatorStakeByRank(
                              scope.row,
                              parseInt(maxNominator * 0.5)
                            )
                          }}
                          MOVR</span
                        >
                      </div>
                      <div class="progress-wrap">
                        <el-progress
                          :text-inside="true"
                          :stroke-width="16"
                          :percentage="
                            getSumulatePercentByRank(
                              scope.row,
                              parseInt(maxNominator * 0.5)
                            )
                          "
                        ></el-progress>
                      </div>
                    </div>
                  </div>
                </div>
                <span slot="reference" class="table-operation-span"
                  >Simulate</span
                >
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="activeTab == 2" class="tab-content tab-content2">
        <div class="search-wrap">
          <el-input
            class="search-input"
            placeholder="Wallet Account"
            prefix-icon="el-icon-search"
            v-model="searchAccount"
            @keyup.enter.native="getMyStackList"
          >
          </el-input>
          <div class="search-account-btn" @click="getMyStackList()">search</div>
          <div class="reset-account-btn" @click="resetAccountFilter()">
            reset
          </div>
        </div>
        <el-table class="my-stack-table" v-loading="loading" :data="tableData2">
          <el-table-column prop="name" label="Collator">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.id" placement="top">
                <span class="collector-span" @click="turnActionPage(scope)">{{
                  shotFilter(scope.row.id)
                }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="Rank">
            <template slot-scope="scope">
              <div class="rank-icon">
                <span class="text">{{ getCollectorRank(scope.row) }}</span>
                <el-popover
                  :disabled="getCollectorRank(scope.row) <= 10"
                  class="icon-wrap"
                  placement="bottom"
                  trigger="click"
                >
                  <div class="popover-content">
                    <div class="top">
                      <div class="item">
                        <span class="title">Total Stake:</span>
                        <span class="number"
                          >{{
                            getTotalStake(scope.row) | roundNumber(2)
                          }}
                          MOVR</span
                        >
                      </div>
                      <div class="item">
                        <span class="title">Previous Rank Stake:</span>
                        <span class="number"
                          >{{
                            getPreviousTotalStake(scope.row) | roundNumber(2)
                          }}
                          MOVR</span
                        >
                      </div>
                    </div>
                    <div class="bottom">
                      <div class="item">
                        <div class="item-left">
                          <span class="title"
                            >Rank
                            {{ parseInt(maxCollector * 0.9) }} Stake:</span
                          >
                          <span class="number"
                            >{{
                              getTotalStakeByRank(parseInt(maxCollector * 0.9))
                                | roundNumber(2)
                            }}
                            MOVR</span
                          >
                        </div>
                        <div class="item-right">
                          <el-progress
                            :text-inside="true"
                            :stroke-width="16"
                            :percentage="
                              getCollectPercentByRank(
                                parseInt(maxCollector * 0.9)
                              )
                            "
                          ></el-progress>
                        </div>
                      </div>
                      <div class="item">
                        <div class="item-left">
                          <span class="title"
                            >Rank
                            {{ parseInt(maxCollector * 0.6) }} Stake:</span
                          >
                          <span class="number"
                            >{{
                              getTotalStakeByRank(parseInt(maxCollector * 0.6))
                                | roundNumber(2)
                            }}
                            MOVR</span
                          >
                        </div>
                        <div class="item-right">
                          <el-progress
                            :text-inside="true"
                            :stroke-width="16"
                            :percentage="
                              getCollectPercentByRank(
                                parseInt(maxCollector * 0.6)
                              )
                            "
                          ></el-progress>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img
                    class="tooltip-icon safe"
                    v-if="getCollectorRank(scope.row) <= 10"
                    slot="reference"
                    src="@/assets/images/stake-safe.png"
                    alt=""
                  />
                  <img
                    class="tooltip-icon"
                    v-if="
                      getCollectorRank(scope.row) >=
                      parseInt(maxCollector * 0.9)
                    "
                    slot="reference"
                    src="@/assets/images/stake-danger.png"
                    alt=""
                  />
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Self Stake">
            <template slot-scope="scope">
              <span>{{ getSelfStake(scope.row) | roundNumber(2) }} MOVR</span>
            </template>
          </el-table-column>
          <el-table-column width="150" label="Nominator Stake">
            <template slot-scope="scope">
              <span
                >{{ getNominatorStake(scope.row) | roundNumber(2) }} MOVR</span
              >
            </template>
          </el-table-column>
          <el-table-column label="Total Stake">
            <template slot-scope="scope">
              <span>{{ getTotalStake(scope.row) | roundNumber(2) }} MOVR</span>
            </template>
          </el-table-column>
          <el-table-column label="My Stake">
            <template slot-scope="scope">
              <span>{{ getMyStake(scope.row) | roundNumber(2) }} MOVR</span>
            </template>
          </el-table-column>
          <el-table-column label="My Rank">
            <template slot-scope="scope">
              <div class="rank-icon">
                <span class="text">{{ getStakeRank(scope.row) }}</span>
                <el-popover
                  class="icon-wrap"
                  placement="bottom"
                  trigger="click"
                >
                  <div class="popover-content">
                    <div class="top">
                      <div class="item">
                        <span class="title">My Stake:</span>
                        <span class="number"
                          >{{
                            getMyStake(scope.row) | roundNumber(2)
                          }}
                          MOVR</span
                        >
                      </div>
                      <div class="item">
                        <span class="title">Previous Rank Stake:</span>
                        <span class="number"
                          >{{
                            getPreviousSingleNominatorStake(scope.row)
                              | roundNumber(2)
                          }}
                          MOVR</span
                        >
                      </div>
                    </div>
                    <div class="bottom">
                      <div class="item">
                        <div class="item-left">
                          <span class="title"
                            >Rank {{ maxNominator }} Stake:</span
                          >
                          <span class="number"
                            >{{
                              getSingleNominatorStakeByRank(
                                scope.row,
                                maxNominator
                              ) | roundNumber(2)
                            }}
                            MOVR</span
                          >
                        </div>
                        <div class="item-right">
                          <el-progress
                            :text-inside="true"
                            :stroke-width="16"
                            :percentage="
                              getSingleNominatorStakePercentByRank(
                                scope.row,
                                maxNominator
                              )
                            "
                          ></el-progress>
                        </div>
                      </div>
                      <div class="item">
                        <div class="item-left">
                          <span class="title"
                            >Rank
                            {{ parseInt(maxNominator * 0.9) }} Stake:</span
                          >
                          <span class="number"
                            >{{
                              getSingleNominatorStakeByRank(
                                scope.row,
                                parseInt(maxNominator * 0.9)
                              ) | roundNumber(2)
                            }}
                            MOVR</span
                          >
                        </div>
                        <div class="item-right">
                          <el-progress
                            :text-inside="true"
                            :stroke-width="16"
                            :percentage="
                              getSingleNominatorStakePercentByRank(
                                scope.row,
                                parseInt(maxNominator * 0.9)
                              )
                            "
                          ></el-progress>
                        </div>
                      </div>
                      <div class="item">
                        <div class="item-left">
                          <span class="title"
                            >Rank
                            {{ parseInt(maxNominator * 0.5) }} Stake:</span
                          >
                          <span class="number"
                            >{{
                              getSingleNominatorStakeByRank(
                                scope.row,
                                parseInt(maxNominator * 0.5)
                              ) | roundNumber(2)
                            }}
                            MOVR</span
                          >
                        </div>
                        <div class="item-right">
                          <el-progress
                            :text-inside="true"
                            :stroke-width="16"
                            :percentage="
                              getSingleNominatorStakePercentByRank(
                                scope.row,
                                parseInt(maxNominator * 0.5)
                              )
                            "
                          ></el-progress>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img
                    class="tooltip-icon"
                    v-if="getStakeRank(scope.row) >= maxNominator - 10"
                    slot="reference"
                    src="@/assets/images/stake-danger.png"
                    alt=""
                  />
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="My Ratio">
            <template slot-scope="scope">
              <el-progress
                :text-inside="true"
                :stroke-width="16"
                :percentage="getMyRatio(scope.row)"
              ></el-progress>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { BigNumber } from "bignumber.js";

import moonriverService from "@/api/moonriver";
// Required imports
// import { ApiPromise, WsProvider } from "@polkadot/api";
// import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
export default {
  data() {
    return {
      currentSimulate: {},
      freeBalance: null,
      linkLoading: false,
      searchAccount: "",
      linkAccount: {},
      blockNumber: null,
      maxCollector: 100,
      maxNominator: 50,
      roundInfo: {
        current: null,
        first: null,
        length: null,
      },
      inputValue: 0,
      loading: false,
      activeTab: "1",
      tableData: [],
      tableData2: [],
      detailChart: null,
      timer: null,
      alReadySelectCollectorIdList: [],
      isFirstQuery: true,

      charts: {},
      refreshDataInterval: 15000,
    };
  },
  async created() {
    let self = this;
    this.getAllData();
    this.timer = setInterval(() => {
      this.getAllData();
    }, self.refreshDataInterval);
  },
  beforeDestroy() {
    console.log("moonriver staking view destroy");
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.charts) {
      for (let key in this.charts) {
        let chartInstance = this.charts[key];
        if (chartInstance) {
          echarts.dispose(chartInstance);
          chartInstance = null;
        }
      }
      this.charts = null;
    }
  },
  computed: {
    totalCollectorStake() {
      let result = BigNumber(0);
      // 算出中标的大哥的金额
      this.tableData.forEach((v, i) => {
        if (i < this.maxCollector) {
          result = result.plus(this.getTotalStake(v));
        }
      });
      return result;
    },
    getInfoPercentage() {
      const percent =
        (this.blockNumber - this.roundInfo.first) / this.roundInfo.length;
      if (!percent || percent === Infinity) {
        return 0;
      }
      return Number((percent * 100).toFixed(2));
    },
  },
  methods: {
    getLatestRPM(d) {
      if (d && d.length > 0) {
        return d[d.length - 1].RPM.toNumber();
      }
      return 0;
    },
    resetAccountFilter() {
      this.searchAccount = this.linkAccount ? this.linkAccount.address : "";
    },
    getBoundaryReward(row) {
      const min = BigNumber(this.inputValue || 0).multipliedBy(
        row.averageRPM.minus(row.standardDeviation)
      );
      const max = BigNumber(this.inputValue || 0).multipliedBy(
        row.averageRPM.plus(row.standardDeviation)
      );
      return `${min.toFormat(5)} ~ ${max.toFormat(5)}`;
    },
    getSimulateRank(row) {
      if (!row.allNominators.length) {
        return 1;
      }
      const index = row.allNominators.findIndex((v) => {
        const result =
          BigNumber(this.inputValue || 0).toNumber() > v.amount.toNumber();
        return result;
      });
      if (index == -1) {
        return row.allNominators.length + 1;
      }
      return index + 1;
    },
    getSumulatePercent(row) {
      const top = BigNumber(this.inputValue || 0);
      const rank = this.getSimulateRank(row);
      if (rank > this.maxNominator) {
        return 0;
      }
      const newAllNominators = [...row.allNominators];
      newAllNominators.splice(rank - 1, 0, {
        owner: "",
        amount: top,
      });
      let bottom = BigNumber(0);
      newAllNominators.forEach((v, i) => {
        if (i < this.maxNominator) {
          bottom = bottom.plus(v.amount);
        }
      });
      if (bottom.toNumber() == 0) {
        return 0;
      }
      const percent = top.dividedBy(bottom).multipliedBy(100);
      return Number(percent.toFixed(2));
    },
    getSumulatePercentByRank(row, rank) {
      const currentRank = this.getSimulateRank(row);
      if (rank > this.maxNominator) {
        return 0;
      }
      const newAllNominators = [...row.allNominators];
      newAllNominators.splice(currentRank - 1, 0, {
        owner: "",
        amount: BigNumber(this.inputValue || 0),
      });
      let top;
      if (!newAllNominators[rank - 1]) {
        top = BigNumber(0);
      } else {
        top = BigNumber(newAllNominators[rank - 1].amount);
      }
      let bottom = BigNumber(0);
      newAllNominators.forEach((v, i) => {
        if (i < this.maxNominator) {
          bottom = bottom.plus(v.amount);
        }
      });
      if (bottom.toNumber() == 0) {
        return 0;
      }
      const percent = top.dividedBy(bottom).multipliedBy(100);
      return Number(percent.toFixed(2));
    },
    getCollectPercentByRank(rank) {
      const row = this.tableData[rank - 1];
      const top = this.getTotalStake(row);
      const bottom = this.totalCollectorStake;
      const percent = top.dividedBy(bottom).multipliedBy(100);
      return Number(percent.toFixed(2));
    },
    getMyStackList() {
      const arr = this.tableData.filter((v) => {
        const result = v.allNominators.find(
          (sv) => sv.owner == this.searchAccount
        );
        return result;
      });
      this.tableData2 = arr;
    },
    getSelfStake(row) {
      return row.bond;
    },
    getCollectorRank(row) {
      const findIndex = this.tableData.findIndex((v) => v.id == row.id);
      return findIndex + 1;
    },
    getStakeRank(row) {
      const findIndex = row.allNominators.findIndex(
        (v) => v.owner == this.searchAccount
      );
      return findIndex + 1;
    },
    getMyRatio(row) {
      const find = row.allNominators.find((v) => v.owner == this.searchAccount);
      const nominatorStake = this.getNominatorStake(row);
      const result = find.amount.dividedBy(nominatorStake);
      return Number(result.multipliedBy(100).toFixed(2));
    },
    getMyStake(row) {
      const find = row.allNominators.find((v) => v.owner == this.searchAccount);
      if (find) {
        return find.amount;
      }
    },
    getPreviousSingleNominatorStake(row) {
      const findIndex = row.allNominators.findIndex(
        (v) => v.owner == this.searchAccount
      );

      let previousIndex = findIndex - 1;
      if (previousIndex <= 0) {
        previousIndex = 0;
      }

      const amount = row.allNominators[previousIndex].amount;
      return amount;
    },
    getSingleNominatorStakeByRank(row, rank) {
      if (!row.allNominators[rank - 1]) {
        return BigNumber(0);
      }
      const amount = row.allNominators[rank - 1].amount;
      return amount;
    },
    getSingleNominatorStakePercentByRank(row, rank) {
      const top = this.getSingleNominatorStakeByRank(row, rank);
      let bottom = BigNumber(0);
      row.allNominators.forEach((v, i) => {
        if (i < this.maxNominator) {
          bottom = bottom.plus(v.amount);
        }
      });
      if (bottom.toNumber() == 0) {
        return 0;
      }
      const percent = top.dividedBy(bottom).multipliedBy(100);
      return Number(percent.toFixed(2));
    },
    getNominatorStake(row) {
      let result = BigNumber(0);
      row.topDelegations.forEach((v) => {
        result = result.plus(v.amount);
      });
      return result;
    },
    getTotalStake(row) {
      return this.getSelfStake(row).plus(this.getNominatorStake(row));
    },
    getPreviousTotalStake(row) {
      const index = this.tableData.findIndex((v) => v.id == row.id);
      let previousIndex = index - 1;
      if (previousIndex <= 0) {
        previousIndex = 0;
      }
      const preRow = this.tableData[previousIndex];
      return this.getTotalStake(preRow);
    },
    getTotalStakeByRank(rank) {
      let rankIndex = rank - 1;
      if (rankIndex <= 0) {
        rankIndex = 0;
      }
      const row = this.tableData[rankIndex];
      return this.getTotalStake(row);
    },
    getAllData() {
      let self = this;
      moonriverService.getLatestBlockNumber().then((d) => {
        this.blockNumber = d;
      });
      moonriverService.getMaxNominatorsPerCollator().then((d) => {
        this.maxNominator = d;
      });
      moonriverService.getMaxCollatorsPerRound().then((d) => {
        this.maxCollector = d;
      });
      if (this.isFirstQuery) {
        this.loading = true;
        this.isFirstQuery = false;
      }
      //获取round信息
      moonriverService.getCurrentRoundInfo().then((d) => {
        this.roundInfo = d;
        // 获取大哥列表
        moonriverService.getRealtimeCollatorCandidatePool().then((c) => {
          // 一次性获取小弟列表
          const nominatorPromiseArr = [];
          let collatorAccounts = [];
          c.forEach((v) => {
            collatorAccounts.push(v.owner);
          });
          nominatorPromiseArr.push(
            moonriverService.getRealtimeCollatorState({
              collators: collatorAccounts,
            })
          );

          //获取大哥totalReward信息
          const getCollectorTotalRewardPromise =
            moonriverService.getCollatorTotalReward({
              collators: c.map((v) => v.owner),
            });
          // 获取大哥的历史10次reward
          const getCollector10RewardPromise =
            moonriverService.getCollatorReward({
              startRoundIndex: this.roundInfo.current - 11,
              endRoundIndex: this.roundInfo.current - 2,
              accounts: c.map((v) => v.owner),
            });
          // 获取小弟的历史10次totalStake
          const getNominator10TotalStakePromise = moonriverService.atStake({
            startRoundIndex: this.roundInfo.current - 11,
            endRoundIndex: this.roundInfo.current - 2,
          });
          // 获取小弟的历史10次totalReward
          const getNominator10RewardPromise =
            moonriverService.getNominatorReward({
              startRoundIndex: this.roundInfo.current - 11,
              endRoundIndex: this.roundInfo.current - 2,
            });

          const allPromiseArr = [
            ...nominatorPromiseArr,
            getCollectorTotalRewardPromise,
            getCollector10RewardPromise,
            getNominator10TotalStakePromise,
            getNominator10RewardPromise,
          ];

          Promise.all(allPromiseArr).then((d) => {
            this.loading = false;
            // 整理小弟列表
            let nominatorRes = d.slice(0, nominatorPromiseArr.length);
            if (Array.isArray(nominatorRes) && nominatorRes.length > 0) {
              nominatorRes = nominatorRes[0];
            }
            nominatorRes.forEach((v) => {
              v.bond = BigNumber(v.bond, 16).dividedBy(1e18);
              v.topDelegations.forEach((sv) => {
                sv.amount = BigNumber(sv.amount, 16).dividedBy(1e18);
              });
              v.bottomDelegations.forEach((sv) => {
                sv.amount = BigNumber(sv.amount, 16).dividedBy(1e18);
              });
              v.allNominators = [...v.topDelegations, ...v.bottomDelegations];
              //排序小弟
              v.allNominators.sort((a, b) => {
                const totalB = b.amount;
                const totalA = a.amount;
                const result = totalB.minus(totalA);
                return result;
              });
            });
            // 排序大哥
            nominatorRes.sort((a, b) => {
              const totalB = this.getTotalStake(b);
              const totalA = this.getTotalStake(a);
              const result = totalB.minus(totalA);
              return result;
            });
            // 塞入totalReward
            const totalRewardRes = d[nominatorPromiseArr.length];
            nominatorRes.forEach((v) => {
              const find = totalRewardRes.collators.find(
                (sv) => sv.account.toLowerCase() == v.id.toLowerCase()
              );
              if (find) {
                v.totalReward = BigNumber(find.reward);
              } else {
                v.totalReward = BigNumber(0);
              }
            });
            // debugger
            // 塞入10次大哥reward
            const getCollector10RewardRes = d[nominatorPromiseArr.length + 1];
            nominatorRes.forEach((v) => {
              const arr = [];
              for (
                let i = this.roundInfo.current - 11;
                i <= this.roundInfo.current - 2;
                i++
              ) {
                const find = getCollector10RewardRes.rewards.find(
                  (sv) =>
                    sv.account.toLowerCase() == v.id.toLowerCase() &&
                    sv.roundIndex == i
                );
                if (find) {
                  arr.push({
                    roundIndex: i,
                    reward: BigNumber(find.reward),
                  });
                } else {
                  arr.push({
                    roundIndex: i,
                    reward: BigNumber(0),
                  });
                }
              }
              v.historyReward = arr;
            });
            // 塞入10次小弟totalStake
            const getNominator10TotalStakeRes =
              d[nominatorPromiseArr.length + 2];
            nominatorRes.forEach((v) => {
              const arr = [];
              for (
                let i = this.roundInfo.current - 11;
                i <= this.roundInfo.current - 2;
                i++
              ) {
                const find = getNominator10TotalStakeRes.stakes.find(
                  (sv) => sv.collatorAccount == v.id && sv.roundIndex == i
                );
                if (find) {
                  arr.push({
                    roundIndex: i,
                    nominatorsStake: BigNumber(find.nominatorsStake),
                  });
                } else {
                  arr.push({
                    roundIndex: i,
                    nominatorsStake: BigNumber(0),
                  });
                }
              }
              v.historyNominatorTotalStake = arr;
            });
            // 塞入10次小弟totalReward (坑点：历史数据返回可能缺失某个roundIndex)

            const getNorminator10RewardRes = d[nominatorPromiseArr.length + 3];
            console.log(
              "getNorminator10RewardRes:",
              getNorminator10RewardRes,
              ",nominatorRes:",
              nominatorRes
            );
            nominatorRes.forEach((v) => {
              const arr = [];
              for (
                let i = this.roundInfo.current - 11;
                i <= this.roundInfo.current - 2;
                i++
              ) {
                //按照collator分开reward数据
                const find = getNorminator10RewardRes.rewards.find(
                  (sv) =>
                    sv.roundIndex == i &&
                    sv.collator.toLowerCase() == v.id.toLowerCase()
                );
                if (find) {
                  arr.push({
                    roundIndex: i,
                    reward: BigNumber(find.reward),
                  });
                } else {
                  arr.push({
                    roundIndex: i,
                    reward: BigNumber(0),
                  });
                }
              }
              v.historyNominatorTotalReward = arr;
            });
            // 计算历史RPM
            nominatorRes.forEach((v) => {
              const arr = [];
              for (
                let i = this.roundInfo.current - 11;
                i <= this.roundInfo.current - 2;
                i++
              ) {
                const findTop = v.historyNominatorTotalReward.find(
                  (sv) => sv.roundIndex == i
                );
                const findBottom = v.historyNominatorTotalStake.find(
                  (sv) => sv.roundIndex == i
                );

                const result = new BigNumber(0);
                if (findTop && findBottom) {
                  const top = findTop.reward;
                  const bottom = findBottom.nominatorsStake;
                  if (bottom.toNumber() > 0 && top.toNumber() > 0) {
                    result = top.dividedBy(bottom);
                  }
                }
                arr.push({
                  roundIndex: i,
                  RPM: result,
                });
              }
              v.historyRPM = arr;
              v.latestRPM = self.getLatestRPM(v.historyRPM);
              v.mimRPM = Math.min.apply(
                null,
                arr.map((sv) => sv.RPM.toNumber())
              );
              v.maxRPM = Math.max.apply(
                null,
                arr.map((sv) => sv.RPM.toNumber())
              );
              // 平均数
              let allRPM = BigNumber(0);
              arr.forEach((sv) => {
                allRPM = allRPM.plus(sv.RPM);
              });
              v.averageRPM = allRPM.dividedBy(10);
              // 标准差
              let topSum = BigNumber(0);
              v.historyRPM.forEach((sv) => {
                topSum = topSum.plus(
                  sv.RPM.minus(v.averageRPM).exponentiatedBy(2)
                );
              });
              v.standardDeviation = topSum.dividedBy(10).sqrt();
            });
            for (let index = 0; index < nominatorRes.length; index++) {
              const element = nominatorRes[index];
              element.rankIndex = index;
            }
            this.tableData = nominatorRes;
            console.log("tableData", nominatorRes);
            this.$nextTick(() => {
              this.generateTableChart();
            });
            if (this.searchAccount) {
              this.getMyStackList();
            }
          });
        });
      });
    },
    generateTableChart() {
      let self = this;
      console.log(
        " charInstance update with ",
        this.tableData.length,
        " charts"
      );
      this.tableData.forEach((v) => {
        let chartId = `tableChart${v.id}`;
        let charInstance = self.charts[chartId];
        if (charInstance) {
          //console.log(' charInstance clear:',chartId);
          charInstance.clear();
        } else {
          //console.log(' charInstance init:',chartId);
          charInstance = echarts.init(this.$refs[chartId]);
        }
        charInstance.setOption({
          grid: {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
          },
          xAxis: {
            data: v.historyReward.map((v) => "round" + v.roundIndex),
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          yAxis: {
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
          series: [
            {
              name: "balance",
              type: "line",
              data: v.historyReward.map((v) => v.reward.toNumber()),
              itemStyle: {
                color: "#17c684",
              },
              symbol: "none",
              silent: true,
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
        });

        self.charts[chartId] = charInstance;
        //console.log(' charInstance update:',chartId);
      });
    },
    async handleLinkAccount() {
      // this.linkLoading = true;
      // // 指定远端接口
      // const wsProvider = new WsProvider("wss://rpc.polkadot.io");
      // // 创建接口
      // const api = await ApiPromise.create({ provider: wsProvider });

      // await web3Enable("Web3go");
      // const allAccounts = await web3Accounts();
      // if (allAccounts.length) {
      //   this.linkAccount = allAccounts[0];
      //   this.searchAccount = this.linkAccount.address;
      //   const acct = await api.query.system.account(this.linkAccount.address);
      //   this.freeBalance = acct.data.free.toString(10);
      //   this.inputValue = this.freeBalance;
      //   this.linkLoading = false;
      //   if (this.tableData.length) {
      //     this.getMyStackList();
      //   }
      // }

      // 引入web3
      this.linkLoading = true;
      // var Web3 = require("web3");
      // if (window.ethereum) {
      //   this.provider = window.ethereum;

      //   // 请求连接demo.
      //   try {
      //     await window.ethereum.enable();
      //   } catch (error) {
      //     console.error("User denied account access");
      //   }
      // }

      // this.web3 = new Web3(this.provider);
      // this.web3.provider = this.provider;
      const Web3 = require("web3"); //Load Web3 library
      //Create local Web3 instance - set Moonriver as provider
      this.web3 = new Web3(ethereum);

      try {
        await ethereum.send("eth_requestAccounts");
      } catch (error) {
        console.error("User denied account access");
        this.linkLoading = false;
        return;
      }
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x505" }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x505",
                  chainName: "Moonriver",
                  rpcUrls: ["https://rpc.moonriver.moonbeam.network"],
                  nativeCurrency: {
                    name: "MOVR",
                    symbol: "MOVR",
                    decimals: 18,
                  },
                  blockExplorerUrls: [
                    "https://blockscout.moonriver.moonbeam.network/",
                  ],
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
            this.linkLoading = false;
            return;
          }
        }
        this.linkLoading = false;
        return;
        // handle other "switch" errors
      }
      const solveAccounts = (accs) => {
        if (accs.length === 0) {
          console.error("无法获取账号，Metamask 是否正确配置？");
          return;
        }
        this.linkAccount = {
          address: accs[0],
        };
        this.searchAccount = this.linkAccount.address;
        // 查询token余额
        this.web3.eth.getBalance(this.linkAccount.address).then((d) => {
          this.freeBalance = BigNumber(d).dividedBy(1e18).toString();
          this.inputValue = this.freeBalance;
          this.linkLoading = false;
          if (this.tableData.length) {
            this.getMyStackList();
          }
          // 监听账号切换
        });
      };
      this.web3.eth.getAccounts((err, accs) => {
        console.log("accs", accs);
        if (err != null) {
          console.error("无法获取账号， 是否安装了 Metamask");
          this.message = "";
          return;
        }
        solveAccounts(accs);
      });
      ethereum.on("accountsChanged", (accs) => {
        solveAccounts(accs);
      });
      ethereum.on("chainChanged", (chainId) => {
        //连接到moonRiver
        if (chainId == "0x505") {
          this.web3.eth.getAccounts((err, accs) => {
            console.log("accs", accs);
            if (err != null) {
              console.error("无法获取账号， 是否安装了 Metamask");
              this.message = "";
              return;
            }
            solveAccounts(accs);
          });
        } else {
          this.linkAccount = {};
          this.searchAccount = undefined;
          this.freeBalance = null;
          this.inputValue = 0;
        }
      });
    },
    getyAxisMinMax(valueArray, scale, fixedNumber) {
      let d = { min: undefined, max: undefined };
      for (let index = 0; index < valueArray.length; index++) {
        const element = valueArray[index];

        if (d.min === undefined || d.min > element) {
          d.min = element;
        }
        if (d.max === undefined || d.max < element) {
          d.max = element;
        }
      }
      d.min = d.min * (1 - scale);
      d.min = parseFloat(d.min.toFixed(fixedNumber));
      d.max = d.max * (1 + scale);
      d.max = parseFloat(d.max.toFixed(fixedNumber));
      return d;
    },
    showDetail(rowIndex, row) {
      this.currentSimulate = { ...row, rowIndex };
      const detailChart = echarts.init(this.$refs[`detailChart${row.id}`]);
      //debugger;
      let totalStake_yAxis = this.getyAxisMinMax(
        row.historyNominatorTotalStake.map((v) => v.nominatorsStake.toNumber()),
        0.005,
        0
      );
      console.log(totalStake_yAxis);
      let totalReward_yAxis = this.getyAxisMinMax(
        row.historyNominatorTotalReward.map((v) => v.reward.toNumber()),
        0.005,
        2
      );
      console.log(totalReward_yAxis);
      let RPM_yAxis = this.getyAxisMinMax(
        row.historyRPM.map((v) => v.RPM.toNumber()),
        0.1,
        6
      );
      console.log(RPM_yAxis);

      detailChart.setOption({
        title: {
          left: -5,
          text: "Reward History ( Latest 10 rounds )",
          textStyle: {
            color: "#292828",
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: function (val) {
            return `
            ${val[0].axisValue}<br/>
            ${val[0].marker} ${
              val[0].seriesName
            }  <span style="font-weight: bold;color: rgba(41, 40, 40, 0.8);">${val[0].value.toFixed(
              2
            )} MOVR</span><br/>
            ${val[1].marker} ${
              val[1].seriesName
            }  <span style="font-weight: bold;color: rgba(41, 40, 40, 0.8);">${val[1].value.toFixed(
              2
            )} MOVR</span><br/>
            ${val[2].marker} ${
              val[2].seriesName
            }  <span style="font-weight: bold;color: rgba(41, 40, 40, 0.8);">${val[2].value.toFixed(
              7
            )} MOVR</span>
            `;
          },
        },
        grid: {
          left: 0,
          bottom: 60,
          right: "10%",
          containLabel: true,
        },
        xAxis: {
          data: row.historyReward.map((v) => "round " + v.roundIndex),
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
        yAxis: [
          {
            max: totalStake_yAxis.max,
            min: totalStake_yAxis.min,
            position: "left",
            nameLocation: "start",
            nameTextStyle: {
              color: "rgba(41, 40, 40, 0.4)",
              lineHeight: 40,
            },
            name: "Total Stake",
            axisLabel: {
              color: "rgba(41, 40, 40, 0.4)",
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: "dashed",
                color: "rgba(41, 40, 40, 0.4)",
              },
            },
          },
          {
            max: totalReward_yAxis.max,
            min: totalReward_yAxis.min,
            position: "right",
            nameLocation: "start",
            nameTextStyle: {
              color: "rgba(41, 40, 40, 0.4)",
              lineHeight: 40,
            },
            offset: 10,
            name: "Total Reward",
            axisLabel: {
              color: "rgba(41, 40, 40, 0.4)",
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: "dashed",
                color: "rgba(41, 40, 40, 0.4)",
              },
            },
          },
          {
            max: RPM_yAxis.max,
            min: RPM_yAxis.min,
            position: "right",
            nameLocation: "start",
            nameTextStyle: {
              color: "rgba(41, 40, 40, 0.4)",
              lineHeight: 40,
              padding: [0, 0, 0, 30],
            },
            offset: 60,
            name: "RPM",
            axisLabel: {
              color: "rgba(41, 40, 40, 0.4)",
            },
            splitLine: {
              show: false,
              lineStyle: {
                type: "dashed",
                color: "rgba(41, 40, 40, 0.4)",
              },
            },
          },
        ],
        series: [
          {
            name: "Total Stake (Delegator):",
            yAxisIndex: 0,
            type: "line",
            data: row.historyNominatorTotalStake.map((v) =>
              v.nominatorsStake.toNumber()
            ),
            itemStyle: {
              color: "#38CB98",
            },
            // areaStyle: {
            //   color: {
            //     type: "linear",
            //     x: 0,
            //     y: 0,
            //     x2: 0,
            //     y2: 1,
            //     colorStops: [
            //       {
            //         offset: 0,
            //         color: "rgba(105, 231, 201, 0.35)", // 0% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "rgba(56, 203, 152, 0)", // 100% 处的颜色
            //       },
            //     ],
            //   },
            // },
          },
          {
            name: "Total Reward (Delegator):",
            yAxisIndex: 1,

            type: "line",
            data: row.historyNominatorTotalReward.map((v) =>
              v.reward.toNumber()
            ),
            itemStyle: {
              color: "rgba(91, 127, 255, 1)",
            },
            // areaStyle: {
            //   color: {
            //     type: "linear",
            //     x: 0,
            //     y: 0,
            //     x2: 0,
            //     y2: 1,
            //     colorStops: [
            //       {
            //         offset: 0,
            //         color: "blue", // 0% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "rgba(56, 203, 152, 0)", // 100% 处的颜色
            //       },
            //     ],
            //   },
            // },
          },
          {
            name: "RPM(Reward Per MOVR):",
            yAxisIndex: 2,
            type: "line",
            data: row.historyRPM.map((v) => v.RPM.toNumber()),
            itemStyle: {
              color: "rgba(255, 86, 48, 1)",
            },
            // areaStyle: {
            //   color: {
            //     type: "linear",
            //     x: 0,
            //     y: 0,
            //     x2: 0,
            //     y2: 1,
            //     colorStops: [
            //       {
            //         offset: 0,
            //         color: "blue", // 0% 处的颜色
            //       },
            //       {
            //         offset: 1,
            //         color: "rgba(56, 203, 152, 0)", // 100% 处的颜色
            //       },
            //     ],
            //   },
            // },
          },
        ],
      });
      this.detailChart = detailChart;
    },
    turnActionPage({ row, $index }) {
      this.$router.push({
        name: "CollectorAction",
        query: {
          id: row.id,
          rank: $index + 1,
          selfStake: this.getSelfStake(row),
          totalStake: this.getTotalStake(row),
        },
      });
    },
    handleClick(e) {},
    shotFilter(str) {
      return str.slice(0, 6) + "..." + str.slice(str.length - 4, str.length);
    },
  },
};
</script>

<style lang="less" scoped>
.moonriver-page {
  /deep/ .el-progress-bar__innerText {
    color: rgba(41, 40, 40, 0.8);
    font-weight: bold;
  }
  .collector-span {
    font-size: 14px;
    font-weight: bold;
    color: rgba(41, 40, 40, 0.8);
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
  .link-btn-wrap {
    display: flex;
    align-items: center;
    float: right;
    margin-right: 35px;
    margin-top: 15px;
    .icon {
      width: 16px;
      height: 16px;
      margin-right: -25px;
      z-index: 10;
    }
    .link-btn {
      border: 0 !important;
      width: 148px;
      height: 32px;
      line-height: 32px;
      border-radius: 6px;
      border: 1px solid #38cb98;
      font-size: 16px;
      color: #38cb98;
      text-align: center;
      cursor: pointer;
      padding: 0;
      padding-left: 16px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  .wallet-wrap {
    float: right;

    margin-right: 35px;
    .icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      vertical-align: middle;
    }
    .number {
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      vertical-align: middle;
      font-size: 16px;
      color: rgba(41, 40, 40, 0.6);
    }
  }

  .big-bg {
    padding: 25px 100px;
    .info-wrap {
      display: flex;
      .info-item {
        display: flex;
        align-items: center;
        margin-right: 100px;
        img {
          width: 48px;
          height: 48px;
          margin-right: 15px;
        }
        .right {
          .title {
            text-align: left;
            font-size: 16px;
            color: rgba(41, 40, 40, 0.6);
          }
          .number {
            font-family: Rubik-Regular, Rubik;
            font-weight: bold;
            margin-top: 4px;
            font-size: 32px;
            color: rgba(41, 40, 40, 0.8);
          }
        }
        .circle {
          margin-left: 16px;
        }
      }
    }
    .big-tabs {
      margin-top: 15px;
      /deep/ .el-tabs__item {
        font-size: 16px;
        font-weight: bold;
      }
      /deep/ .el-tabs__nav-wrap::after {
        display: none;
      }
    }
    .tab-content1 {
      .table-chart {
        width: 216px;
        height: 69px;
      }
      .rank-icon {
        display: inline-block;
        padding: 1px 9px;
        background: #f5f7f9;
        border-radius: 50%;
        font-size: 14px;
        font-weight: bold;
        color: rgba(41, 40, 40, 0.6);
        &.first {
          background: #ffe599;
          color: #cc7429;
        }
        &.second {
          background: #dbe7ff;
          color: #7986a3;
        }
        &.third {
          background: #f6e2d4;
          color: #ce7321;
        }
      }
    }
    .tab-content2 {
      .search-wrap {
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        .search-input {
          width: 500px;
        }
        .search-account-btn {
          margin-left: 16px;
          width: 70px;
          height: 40px;
          line-height: 40px;
          background: #38cb98;
          border-radius: 6px;
          font-size: 14px;
          color: white;
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        }
        .reset-account-btn {
          margin-left: 16px;
          width: 70px;
          height: 40px;
          line-height: 40px;
          background: #ffffff;
          border-radius: 6px;
          border: 1px solid rgba(41, 40, 40, 0.3);
          font-size: 14px;
          color: rgba(41, 40, 40, 0.8);
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        }
      }
      .rank-icon {
        .text {
          vertical-align: bottom;
          font-size: 14px;
          font-weight: bold;
          color: rgba(41, 40, 40, 0.8);
        }
        .icon-wrap {
          margin-left: 8px;
          vertical-align: bottom;
          display: inline-block;
        }
        .tooltip-icon {
          cursor: pointer;
          display: block;
          width: 24px;
          height: 24px;
          &.safe {
            cursor: initial;
          }
        }
      }
      /deep/ .el-table__body {
        td {
          padding: 38px 8.5px !important;
        }
      }
    }
  }
}
.popover-content {
  /deep/ .el-progress-bar__innerText {
    color: rgba(41, 40, 40, 0.8);
    font-weight: bold;
  }
  padding: 4px;
  .top {
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(41, 40, 40, 0.1);
    .item {
      margin-bottom: 8px;
      .title {
        font-size: 14px;
        color: rgba(41, 40, 40, 0.6);
      }
      .number {
        margin-left: 8px;
        font-size: 14px;
        font-weight: bold;
        color: rgba(41, 40, 40, 0.8);
      }
    }
  }
  .bottom {
    margin-top: 16px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      .item-left {
        flex: 1;
        .title {
          font-size: 14px;
          color: rgba(41, 40, 40, 0.6);
        }
        .number {
          margin-left: 8px;
          font-size: 14px;
          font-weight: bold;
          color: rgba(41, 40, 40, 0.6);
        }
      }
      .item-right {
        margin-left: 40px;
        width: 141px;
        flex: none;
      }
    }
  }
}

.simulate-popover-content {
  /deep/ .el-progress-bar__innerText {
    color: rgba(41, 40, 40, 0.8);
    font-weight: bold;
  }
  padding: 10px;
  .detail-chart {
    height: 316px;
    width: 910px;
  }
  .el-icon-warning-outline {
    font-size: 16px;
  }
  & > .title {
    font-size: 18px;
    font-weight: bold;
    color: #292828;
    margin-bottom: 14px;
  }
  .statistic-title {
  }
  .statistic {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item {
      font-size: 14px;
      font-weight: bold;
      color: rgba(41, 40, 40, 0.6);
      .label {
        font-weight: 400;
        margin-right: 8px;
      }
      .yellow {
        color: #ffab00;
        font-size: 18px;
      }
    }
  }
  .input-wrap {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    .label {
      font-size: 14px;
      color: rgba(41, 40, 40, 0.8);
    }
    .input {
      width: 110px;
      margin: 0 8px;
    }
    .tip {
      margin-left: 4px;
      margin-right: 24px;
    }
    .yellow {
      margin-left: 18px;
      margin-right: 8px;
      color: #ffab00;
      font-weight: 500;
      font-size: 18px;
    }
    .el-icon-right {
      font-size: 17px;
    }
    .unit {
      font-size: 14px;
      color: rgba(41, 40, 40, 0.6);
    }
  }
  .competitor-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item {
      .item-top {
        margin-bottom: 8px;
        .title {
          margin-right: 8px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(41, 40, 40, 0.6);
        }
        .number {
          &.yellow {
            font-size: 18px;
            font-weight: bold;
            color: #ffab00;
          }
          font-size: 14px;
          font-weight: bold;
          color: rgba(41, 40, 40, 0.6);
        }
      }
    }
  }
}
</style>
<style>
.simulate-popover {
  background: rgb(250, 250, 250) !important;
  box-shadow: rgba(0, 0, 0, 0.6) 0px 2px 20px 0px !important;
}
</style>