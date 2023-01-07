<template>
  <div class="content staking-page">
    <div class="common-back-title">
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">{{ paraChainName }}</span>
      <div class="link-btn-wrap" v-if="!linkAccount.address">
        <img
          v-if="!linkLoading"
          class="icon"
          src="@/assets/images/staking/wallet-icon.png"
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
        <i class="el-icon-wallet switch-icon" @click="handleLinkAccount"></i>
        <identity-icon-plus :addressInfo="linkAccount"></identity-icon-plus>

        <div class="number" v-if="linkAccount.freeBalance">
          （{{ linkAccount.freeBalance | roundNumber(2) }} {{ symbol }}）
        </div>
        <div v-else><i class="el-icon-loading"></i></div>
        <div v-if="supportNotify">
          <el-popover placement="bottom" width="400" trigger="click">
            <div class="popover-subscribe">
              <div class="subscribe-address">
                <div class="title">My Wallet address:</div>
                <div class="content">
                  {{ linkAccountSubscribeData.subscribe_address }}
                </div>
              </div>
              <div class="subscribe-auto-notify-at-my-stake">
                <div class="title">Auto Notify Config:</div>
                <div class="content">
                  <el-switch
                    style="display: block"
                    v-model="linkAccountSubscribeData.auto_notify_at_my_stake"
                    :active-value="auto_notify_at_my_stake_active"
                    :inactive-value="auto_notify_at_my_stake_inactive"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-text="
                      linkAccountSubscribeData.auto_notify_at_my_stake == 1
                        ? 'Auto notify my stake'
                        : 'Ignore my stake'
                    "
                    @change="updateAutoNotify()"
                  >
                  </el-switch>
                </div>
              </div>
              <div
                class="subscribe-email"
                v-if="linkAccountSubscribeData.subscribe_email"
              >
                <div class="title">My Email account:</div>
                <div class="content">
                  {{ linkAccountSubscribeData.subscribe_email }}
                  <div
                    class="subscribe-email-clear"
                    @click="linkAccountSubscribeData.subscribe_email = ''"
                  >
                    <i class="el-icon-remove-outline"></i>
                  </div>
                </div>
              </div>

              <div
                class="watched-address"
                v-if="
                  linkAccountSubscribeData.watched_address &&
                  linkAccountSubscribeData.watched_address.length > 0
                "
              >
                <div class="title">Watched Addresses:</div>
                <div
                  class="content watched-address-item"
                  v-for="wa in linkAccountSubscribeData.watched_address"
                  :key="wa"
                >
                  {{ wa }}
                  <div
                    class="watched-address-remove"
                    @click="unsubscribe({ id: wa })"
                  >
                    <i class="el-icon-remove-outline"></i>
                  </div>
                </div>

                <div class="clear-all-subscribe">
                  <a @click="clearSubscribe()">Clear All</a>
                </div>
              </div>
            </div>
            <i slot="reference" class="el-icon-bell"></i>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="big-bg">
      <div class="info-wrap">
        <div class="info-item">
          <img src="@/assets/images/staking/icon3.png" alt="" />
          <div class="right">
            <div class="title">Round Index</div>
            <div class="number">{{ roundInfo.current }}</div>
          </div>
        </div>
        <div class="info-item">
          <img src="@/assets/images/staking/icon1.png" alt="" />
          <div class="right">
            <div class="title">Block Number</div>
            <div class="number">{{ blockNumber }}</div>
          </div>
        </div>
        <div class="info-item">
          <img src="@/assets/images/staking/icon2.png" alt="" />
          <div class="right">
            <div class="title">Round Progress</div>

            <el-tooltip placement="top" trigger="hover">
              <div slot="content" class="tooltip-100px">
                Estimate:
                {{ estimateMinutes }}
                minutes
              </div>
              <div class="number">
                {{ blockNumber - roundInfo.first }}/{{ roundInfo.length }}
              </div>
            </el-tooltip>
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
        <div class="select-wrap">
          <span>Calculate By </span>
          <el-select
            @change="changeSelect"
            v-model="roundsPickedByDropdown"
            collapse-tags
          >
            <el-option
              v-for="item in roundsDropdown"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <span>Round</span>
        </div>
        <div style="width: 100%; overflow: hidden">
          <el-table
            v-loading="loading"
            :data="onePageTableData"
            @sort-change="sortChange"
            class="stakeTable"
            style="width: 100%"
          >
            <el-table-column label="Rank" width="90">
              <template slot="header" slot-scope="scope">
                <div>
                  Rank
                  <el-tooltip placement="top" trigger="hover">
                    <div slot="content" class="tooltip-300px">
                      Current Rank by total stake of collator.
                      <br />
                      <br />
                      The green icon means the current collator was choosen and
                      produce blocks in current round.
                    </div>
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
              </template>
              <template slot-scope="scope">
                <div
                  class="rank-icon"
                  :class="{
                    'active-block-producer': scope.row.activeBlockProducer,
                  }"
                >
                  {{ scope.row.rankIndex + 1 }}
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Collator" min-width="180">
              <template slot-scope="scope">
                <div class="icon-cell">
                  <identity-icon-plus
                    @click.native="turnActionPage(scope)"
                    :addressInfo="{
                      address: scope.row.id,
                      addressDisplayCompact: true,
                      isEthereum: isEthereum,
                      fontSize: 16,
                    }"
                  ></identity-icon-plus>
                  <!-- <img class="icon" :src="makeBlockie(scope.row.id)" alt="" />
                <el-tooltip :content="scope.row.id" placement="top">
                  <span class="span" >{{
                    shotFilter(scope.row.id)
                  }}</span>
                </el-tooltip> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Stake" min-width="180">
              <template slot-scope="scope">
                Self:<span
                  >{{ getSelfStake(scope.row) | roundNumber(2) }}
                  {{ symbol }}</span
                >
                <br />

                Delegators:
                <span
                  >{{ getNominatorStake(scope.row) | roundNumber(2) }}
                  {{ symbol }}</span
                >

                <br />
                Total:
                <span
                  >{{ getTotalStake(scope.row) | roundNumber(2) }}
                  {{ symbol }}</span
                >
              </template>
            </el-table-column>

            <el-table-column label="Total Reward" width="120">
              <template slot-scope="scope">
                <span
                  >{{ scope.row.totalReward | roundNumber(2) }}
                  {{ symbol }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              label="Min Bond"
              min-width="120"
              prop="minBond"
              sortable="custom"
              align="center"
            >
              <template slot="header" slot-scope="scope">
                <div style="display: inline-flex; align-items: center">
                  Min Bond
                  <el-tooltip placement="top" trigger="hover">
                    <div slot="content" class="tooltip-300px">
                      Min Bond means the minimum bond amount to join the
                      collator.
                    </div>
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.minBond | roundNumber(0) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="Avg Blocks"
              min-width="120"
              prop="averageBlocks"
              align="center"
            >
              <template slot="header" slot-scope="scope">
                <div>
                  Avg Blocks
                  <el-tooltip placement="top" trigger="hover">
                    <div slot="content" class="tooltip-300px">
                      Average Blocks in past 10 round which has been rewarded (
                      round {{ startRoundIndex4AverageBlocksCalculation }} -
                      {{ endRoundIndex }} ). <br /><br />
                    </div>
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.averageBlocks | roundNumber(1) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="Current Blocks"
              min-width="120"
              prop="currentBlocks"
              align="center"
            >
              <template slot="header" slot-scope="scope">
                <div>
                  Current Blocks
                  <el-tooltip placement="top" trigger="hover">
                    <div slot="content" class="tooltip-300px">
                      Blocks produced in the current round
                      {{ currentRoundIndex }}. <br /><br />
                    </div>
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.currentBlocks }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="APR"
              prop="apr"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template slot="header" slot-scope="scope">
                <div style="display: inline-flex; align-items: center">
                  APR
                  <el-tooltip placement="top" trigger="hover">
                    <div slot="content" class="tooltip-300px">
                      APR means the annualized income pledged to the current
                      collator.
                      <br />
                      APR formula= ( reward / rounds / stake ) * roundPerYear *
                      100
                    </div>
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.apr | roundNumber(2) }}%</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="220"
              prop="name"
              label="Rewards(Last 10 rounds)"
            >
              <template slot-scope="scope">
                <div
                  :id="'tableChart' + scope.row.id"
                  class="table-chart"
                ></div>
              </template>
            </el-table-column>
            <el-table-column width="220" fixed="right">
              <template slot-scope="scope">
                <div class="div-operation">
                  <span
                    v-if="supportSimulate"
                    @click="showDetail(scope.$index, scope.row)"
                    :ref="'simulateBtn' + scope.row.id"
                    class="table-operation-span"
                    ><i class="el-icon-data-line"></i>Simulate</span
                  >

                  <el-tooltip
                    v-if="supportNotify"
                    effect="light"
                    placement="bottom"
                  >
                    <div slot="content">
                      Add current collator into watch list with specified
                      email,<br />
                      you'll recieve notification email when the rank reach the
                      end of max collators.<br />current thresold is the last
                      10%.
                    </div>
                    <div
                      v-show="showSubscribe(scope.row)"
                      class="subscribe"
                      @click="subscribe(scope.row)"
                    >
                      <i class="el-icon-circle-plus-outline"></i>
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    v-if="supportNotify"
                    effect="light"
                    placement="bottom"
                  >
                    <div slot="content">
                      remove current collator from watch list.
                    </div>
                    <div
                      v-show="alreadySubscribed(scope.row)"
                      class="subscribe-already"
                      @click="unsubscribe(scope.row)"
                    >
                      <i class="el-icon-remove-outline"></i>
                    </div>
                  </el-tooltip>
                  <div
                    v-if="!scope.row.isDelegated && scope.row.isDelegatable"
                    @click="handleDelegate(scope.row)"
                    class="table-btn"
                    style="margin-left: 8px"
                  >
                    Delegate
                  </div>
                  <div
                    v-if="scope.row.isDelegated"
                    @click="goToMyStake"
                    class="table-btn"
                    style="margin-left: 8px; background: rgb(95, 106, 249)"
                  >
                    MyStake
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-wrap">
          <el-pagination
            background
            layout="prev, pager, next,sizes"
            :total="tableData.length"
            :current-page.sync="pageIndex"
            @size-change="generateTableChart"
            @current-change="generateTableChart"
            :page-size.sync="pageSize"
            :page-sizes="[100]"
          >
          </el-pagination>
        </div>
      </div>
      <div v-if="activeTab == 2" class="tab-content tab-content2">
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
          <div
            class="reward-history-btn"
            v-show="searchAccount"
            @click="turnDelegatorActionPage(searchAccount)"
          >
            reward history
          </div>
        </div>
        <el-table
          class="my-stack-table stakeTable"
          v-loading="loading"
          :data="tableData2"
          id="my-stake-table"
        >
          <el-table-column width="250" label="Collator">
            <template slot-scope="scope">
              <div class="icon-cell">
                <identity-icon-plus
                  @click.native="turnActionPage(scope)"
                  :addressInfo="{
                    address: scope.row.id,
                    addressDisplayCompact: true,
                    isEthereum: isEthereum,
                    fontSize: 16,
                  }"
                ></identity-icon-plus>
                <!-- <img class="icon" :src="makeBlockie(scope.row.id)" alt="" />
                <el-tooltip :content="scope.row.id" placement="top">
                  <span class="span" @click="turnActionPage(scope)">{{
                    shotFilter(scope.row.id)
                  }}</span>
                </el-tooltip> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Rank">
            <template slot-scope="scope">
              <div class="rank-icon">
                <span class="text">{{ getCollectorRank(scope.row) }}</span>
                <el-popover
                  class="icon-wrap"
                  placement="bottom"
                  trigger="click"
                >
                  <div class="popover-content">
                    <div class="top">
                      <div class="item">
                        <span class="title"
                          >Max Collators is {{ maxCollector }}</span
                        >
                        <span
                          class="title"
                          v-if="
                            getCollectorRank(scope.row) >=
                            parseInt(maxCollector * 0.9)
                          "
                        >
                          <br />
                          Current Rank is below
                          {{ parseInt(maxCollector * 0.9) }} (last 10%)<br
                        /></span>
                      </div>
                      <div class="item">
                        <span class="title">Total Stake:</span>
                        <span class="number"
                          >{{ getTotalStake(scope.row) | roundNumber(2) }}
                          {{ symbol }}</span
                        >
                      </div>
                      <div class="item">
                        <span class="title">Previous Rank Stake:</span>
                        <span class="number"
                          >{{
                            getPreviousTotalStake(scope.row) | roundNumber(2)
                          }}
                          {{ symbol }}</span
                        >
                      </div>
                    </div>
                    <div class="bottom">
                      <div
                        class="item"
                        v-if="tableData.length > parseInt(maxCollector * 0.9)"
                      >
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
                            {{ symbol }}</span
                          >
                        </div>
                        <div class="item-right">
                          <el-progress
                            :text-inside="true"
                            :stroke-width="16"
                            :percentage="
                              getCollectPercentByRank(
                                parseInt(maxCollector * 0.9)
                              ) || 0
                            "
                          ></el-progress>
                        </div>
                      </div>
                      <div
                        class="item"
                        v-if="tableData.length > parseInt(maxCollector * 0.6)"
                      >
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
                            {{ symbol }}</span
                          >
                        </div>
                        <div class="item-right">
                          <el-progress
                            :text-inside="true"
                            :stroke-width="16"
                            :percentage="
                              getCollectPercentByRank(
                                parseInt(maxCollector * 0.6)
                              ) || 0
                            "
                          ></el-progress>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img
                    class="tooltip-icon safe"
                    v-if="
                      getCollectorRank(scope.row) < parseInt(maxCollector * 0.9)
                    "
                    slot="reference"
                    src="@/assets/images/staking/stake-safe.png"
                    alt=""
                  />
                  <img
                    class="tooltip-icon"
                    v-if="
                      getCollectorRank(scope.row) >=
                      parseInt(maxCollector * 0.9)
                    "
                    slot="reference"
                    src="@/assets/images/staking/stake-danger.png"
                    alt=""
                  />
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Self Stake">
            <template slot-scope="scope">
              <span
                >{{ getSelfStake(scope.row) | roundNumber(2) }}
                {{ symbol }}</span
              >
            </template>
          </el-table-column>
          <el-table-column width="150" label="Nominator Stake">
            <template slot-scope="scope">
              <span
                >{{ getNominatorStake(scope.row) | roundNumber(2) }}
                {{ symbol }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="Total Stake">
            <template slot-scope="scope">
              <span
                >{{ getTotalStake(scope.row) | roundNumber(2) }}
                {{ symbol }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="My Stake">
            <template slot-scope="scope">
              <span
                >{{ getMyStake(scope.row) | roundNumber(2) }} {{ symbol }}</span
              >
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
                          >{{ getMyStake(scope.row) | roundNumber(2) }}
                          {{ symbol }}</span
                        >
                      </div>
                      <div class="item">
                        <span class="title">Previous Rank Stake:</span>
                        <span class="number"
                          >{{
                            getPreviousSingleNominatorStake(scope.row)
                              | roundNumber(2)
                          }}
                          {{ symbol }}</span
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
                            {{ symbol }}</span
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
                              ) || 0
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
                            {{ symbol }}</span
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
                              ) || 0
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
                            {{ symbol }}</span
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
                              ) || 0
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
                    src="@/assets/images/staking/stake-danger.png"
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
                :percentage="getMyRatio(scope.row) || 0"
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column
            v-if="parachain.canDelegate"
            :width="preferedWidthForMyStakeActions"
            fixed="right"
          >
            <template slot-scope="scope">
              <div
                v-if="currentWalletAccount && scope.row.revokeStatus <= 1"
                class="table-btn"
                @click="handleDelegateMore(scope.row)"
              >
                DelegateMore
              </div>
              <RevokeStake
                v-if="activeTab == 2 && apiPromise && roundInfo && blockNumber"
                :api="apiPromise"
                :collator="scope.row.id"
                :symbol="symbol"
                :linkAccount="linkAccount"
                :currentWalletAccount="currentWalletAccount"
                :roundInfo="roundInfo"
                :blockNumber="blockNumber"
                :paraChainName="paraChainName"
                @statusChanged="onRevokeStatusChange"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="fixed-popover">
      <el-popover
        @hide="removeScrollEvent"
        ref="popover"
        placement="left"
        popper-class="simulate-popover"
      >
        <div v-if="currentSimulate.id" class="simulate-popover-content">
          <div
            class="detail-chart"
            :ref="'detailChart' + currentSimulate.id"
          ></div>
          <div class="title statistic-title">
            <span>RPM Statistic</span>
            <el-tooltip placement="top" trigger="hover">
              <div slot="content" class="tooltip-300px">
                RPM, rewards per {{ symbol }} for next single round. Simply like
                how much rewards you will get in the next round if tokens
                staked. This indicator is for delegators to find the max
                estimated rewards under the fixed token quantity.
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </div>
          <div class="statistic">
            <div class="item">
              <span class="label">Min:</span
              ><span
                >{{ currentSimulate.mimRPM | roundNumber(7) }}
                {{ symbol }}</span
              >
            </div>
            <div class="item">
              <span class="label">Max:</span
              ><span
                >{{ currentSimulate.maxRPM | roundNumber(7) }}
                {{ symbol }}</span
              >
            </div>
            <div class="item">
              <span class="label">Average:</span
              ><span
                >{{ currentSimulate.averageRPM | roundNumber(7) }}
                {{ symbol }}</span
              >
            </div>
            <div class="item">
              <span class="label"> RPM Valatility Score: </span>
              <span class="yellow">{{
                currentSimulate.standardDeviation | roundNumber(8)
              }}</span>
              <el-tooltip placement="top" trigger="hover">
                <div slot="content" class="tooltip-300px">
                  The volatility of rewards. We use standard deviation to
                  indicate the volatility of rewards. The less the volatility
                  is, the rewards of nominating this collator are relatively
                  stable(according to the latest 10 rounds)
                </div>
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </div>
          </div>
          <div class="title">Estimate Reward</div>
          <div class="input-wrap">
            <span class="label">Stake</span>
            <el-input class="input" v-model="inputValue"></el-input>
            <span class="unit">{{ symbol }}</span>
            <el-tooltip class="tip" placement="top" trigger="hover">
              <div slot="content" class="tooltip-300px">
                Input the quantity of {{ symbol }} to estimate the rewards in
                real-time. Estimated reward = Quantity * RPM, RPM is calculated
                according to the standard deviation
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
            <i class="el-icon-right"></i>
            <span class="yellow">{{ getBoundaryReward(currentSimulate) }}</span>
            <span class="unit">{{ symbol }}</span>
          </div>
          <div class="title">
            <span>Competitor </span>
            <el-tooltip placement="top" trigger="hover">
              <div slot="content" class="tooltip-300px">
                The real-time data of {{ symbol }} staked by the nominators and
                the corresponding ranking are listed here
              </div>
              <i class="el-icon-warning-outline"></i>
            </el-tooltip>
          </div>
          <div class="competitor-wrap">
            <div class="item">
              <div class="item-top">
                <span class="title">Current Rank:</span>
                <span class="number yellow">{{
                  getSimulateRank(currentSimulate)
                }}</span>
              </div>
              <div class="progress-wrap">
                <el-progress
                  :text-inside="true"
                  :stroke-width="16"
                  :percentage="getSumulatePercent(currentSimulate) || 0"
                ></el-progress>
              </div>
            </div>
            <div class="item">
              <div class="item-top">
                <span class="title">Rank {{ maxNominator }} Stake:</span>
                <span class="number"
                  >{{
                    getSingleNominatorStakeByRank(
                      currentSimulate,
                      parseInt(maxNominator)
                    )
                  }}
                  {{ symbol }}</span
                >
              </div>
              <div class="progress-wrap">
                <el-progress
                  :text-inside="true"
                  :stroke-width="16"
                  :percentage="
                    getSumulatePercentByRank(currentSimulate, maxNominator) || 0
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
                      currentSimulate,
                      parseInt(maxNominator * 0.9)
                    )
                  }}
                  {{ symbol }}</span
                >
              </div>
              <div class="progress-wrap">
                <el-progress
                  :text-inside="true"
                  :stroke-width="16"
                  :percentage="
                    getSumulatePercentByRank(
                      currentSimulate,
                      parseInt(maxNominator * 0.9)
                    ) || 0
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
                      currentSimulate,
                      parseInt(maxNominator * 0.5)
                    )
                  }}
                  {{ symbol }}</span
                >
              </div>
              <div class="progress-wrap">
                <el-progress
                  :text-inside="true"
                  :stroke-width="16"
                  :percentage="
                    getSumulatePercentByRank(
                      currentSimulate,
                      parseInt(maxNominator * 0.5)
                    ) || 0
                  "
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
        <span slot="reference" class="table-operation-span"
          ><i class="el-icon-data-line"></i>Simulate</span
        >
      </el-popover>
    </div>
    <DelegateModal
      ref="delegateModal"
      :api="apiPromise"
      :symbol="symbol"
      :linkAccount="linkAccount"
      :currentWalletAccount="currentWalletAccount"
      :minBond="minBond"
      @success="delegateSuccess"
    ></DelegateModal>

    <el-dialog
      title="Choose Wallet Account"
      :visible.sync="showAccountChooseDialog"
      width="30%"
      center
    >
      <div class="wallet-list">
        <div
          class="wallet-item"
          v-for="ac in allAccounts"
          :key="ac.key"
          @click="accountChoosen(ac)"
        >
          <div class="wallet-item-meta">
            {{ ac.meta.name }}&nbsp;(&nbsp;{{ ac.meta.source }}&nbsp;)
          </div>
          <div class="wallet-item-address">{{ ac.address }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="showAccountChooseDialog = false"
          >Cancel</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import IdentityIconPlus from "@/components/ui-elements/IdentityIconPlus.vue";
import { BigNumber } from "bignumber.js";
import stakingService from "@/api/staking/index.js";
import aprUtlis from "./apr.utils";
import chainUtlis from "@/chain/chain.utils";
import DelegateModal from "./DelegateModal";
import RevokeStake from "./RevokeStake";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api";

export default {
  name: "staking-board",
  components: {
    IdentityIconPlus,
    DelegateModal,
    RevokeStake,
  },
  data() {
    return {
      apiPromise: null,
      currentWalletAccount: null,
      selectRoundList: [],
      auto_notify_at_my_stake_active: 1,
      auto_notify_at_my_stake_inactive: 0,
      scrollHandler: null,
      chartInstances: [],
      pageIndex: 1,
      pageSize: 100,
      currentSimulate: {},
      linkLoading: false,
      searchAccount: "",
      linkAccount: {
        address: "",
        identity: {
          showMoreInfo: false,
        },
        iconSize: 26,
        fontSize: 14,
        addressDisplayCompact: true,

        freeBalance: null,
      },
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

      alReadySelectCollectorIdList: [],
      isFirstQuery: true,

      charts: {},
      timer: null,
      refreshDataInterval: 5 * 60 * 1000,
      timer4header: null,
      refreshHeaderDataInterval: 30 * 1000,
      tanganikaPendingUnstakeCollator: '',

      linkAccountSubscribeData: {
        subscribe_address: "",
        watched_address: [],
        subscribe_email: "",
        auto_notify_at_my_stake: 0,
      },

      sort4DisplayConfig: { prop: "", order: "" },

      activeCollators: [],

      roundsPickedByDropdown: 10, //默认计算Avg Blocks的round数， 前10个round
      roundsDropdown: [1, 3, 4, 5, 8, 10],

      allAccounts: [], //account choose list shown on dialog
      showAccountChooseDialog: false,
      delegateEventPending: null,
      hasDelegateRecord: false,
      preferedWidthForMyStakeActions: 250, // or 200 in other case. My Stakes按钮显示宽度
    };
  },
  async created() {
    await this.preSessionCheck();
    if (this.parachain.walletSupport === "MetaMask") {
      const alreadyLinkMetaMask = localStorage.getItem("alreadyLinkMetaMask");
      if (alreadyLinkMetaMask) {
        this.handleLinkAccount();
      }
    } else {
      const savedAccountStr = localStorage.getItem("currentAccount");
      if (savedAccountStr) {
        setTimeout(() => {
          this.accountChoosen(JSON.parse(savedAccountStr));
        }, 100);
      }
    }
    stakingService.base_api = this.$route.meta.base_api;

    let self = this;
    this.getAllData();
    this.timer = setInterval(() => {
      this.getAllData();
    }, self.refreshDataInterval);

    this.timer4header = setInterval(() => {
      this.getHeaderData();
    }, self.refreshHeaderDataInterval);

    let lastResizeRun = null;
    window.onresize = () => {
      if (lastResizeRun) {
        try {
          clearTimeout(lastResizeRun);
          lastResizeRun = null;
        } catch (e) {
          console.warn(e);
        }
      }
      lastResizeRun = setTimeout(() => {
        if (this.chartInstances && this.chartInstances.length) {
          this.chartInstances.forEach((it) => {
            this.$nextTick(() => it.resize());
          });
        }
      }, 1000);
    };
  },
  beforeDestroy() {
    console.log("staking view destroy");
    window.onresize = null;
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.timer4header) {
      clearInterval(this.timer4header);
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
    estimateMinutes() {
      let targetSeconds = this.parachain.targetSeconds || 12;
      let blocks =
        this.roundInfo.length - (this.blockNumber - this.roundInfo.first);
      return Math.ceil((blocks * targetSeconds) / 60);
    },
    isEthereum() {
      if (this.parachain.walletSupport) {
        return this.parachain.walletSupport.indexOf("MetaMask") > -1;
      }
      return false;
    },
    parachain() {
      if (this.$route.meta && this.$route.meta.parachain) {
        return this.$route.meta.parachain;
      }
      return {};
    },
    paraChainIcon() {
      return this.parachain.icon || `${this.paraChainName}.png`;
    },
    paraChainName() {
      return this.parachain.name || "Staking";
    },
    symbol() {
      return this.parachain.symbol || "Symbol";
    },
    decimals() {
      return this.parachain.decimals || 0;
    },
    decimalsFormat() {
      return new BigNumber("1e" + this.decimals);
    },
    minBond() {
      return this.parachain.minBond || 1;
    },
    supportNotify() {
      if (this.parachain.supportNotify !== undefined) {
        return this.parachain.supportNotify;
      }
      return false;
    },
    supportSimulate() {
      if (this.parachain.supportSimulate !== undefined) {
        return this.parachain.supportSimulate;
      }
      return false;
    },

    filterNoRewardRoundWhenCalcAPR() {
      return (this.parachain.filterNoRewardRoundWhenCalcAPR || false) === true;
    },
    onePageTableData() {
      return this.freshTableStatus(
        this.tableData.slice(
          (this.pageIndex - 1) * this.pageSize,
          this.pageIndex * this.pageSize
        )
      );
    },
    startRoundIndex4AverageBlocksCalculation() {
      return this.roundInfo.current - 1 - (this.roundsPickedByDropdown || 0);
    },
    endRoundIndex4AverageBlocksCalculation() {
      return this.roundInfo.current - 1;
    },
    startRoundIndex() {
      return this.roundInfo.current - 11 - 0;
    },
    endRoundIndex() {
      return this.roundInfo.current - 2 - 0; //Reward延迟2round发放
    },
    currentRoundIndex() {
      return this.roundInfo.current;
    },
    totalSupply() {
      return this.roundInfo.totalIssuance;
    },
    totalCollatorStake() {
      let result = BigNumber(0);

      if (this.tableData) {
        for (const row of this.tableData) {
          if (row.rankIndex < this.maxCollector) {
            result = result.plus(this.getTotalStake(row));
          }
        }
      }

      return result;
    },
    getInfoPercentage() {
      const percent =
        (this.blockNumber - this.roundInfo.first) / this.roundInfo.length;
      if (!percent || percent === Infinity || percent < 0) {
        return 0;
      }
      const result = Number((percent * 100).toFixed(2));
      if (!result) {
        console.info(result);
      }
      return result || 0;
    },
  },
  methods: {
    async preSessionCheck() {
      const savedAccountStr = (() => {
        const cache = localStorage.getItem("currentAccount");
        if (!cache) return;
        try {
          return JSON.parse(cache).address;
        } catch (e) {
          console.warn("illegal cache");
        }
      })();

      if (!savedAccountStr) return;
      let accounts = [];
      if (this.parachain.walletSupport === "polkadot.js") {
        accounts = (
          await this.getAccountList_PolkadotJs(
            this.paraChainName,
            this.parachain.ss58Format
          )
        ).map((it) => it.address);
      } else if (this.isEthereum) {
        const ethereum = window.ethereum;
        if (ethereum.isConnected && ethereum.isConnected()) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
          if (account) {
            accounts = [account];
          }
        }
        return;
      } else {
        throw new Error("Unsupported Wallet Runtime..");
      }
      let matches = accounts && accounts.filter((it) => it === savedAccountStr);
      if (!matches || !matches.length) {
        localStorage.setItem("currentAccount", null);
      }
    },
    getFreeBalance(accountInfo) {
      if (accountInfo && accountInfo.data) {
        console.log(`getFreeBalance:`, accountInfo);
        // {"free":488672920111,"reserved":0,"miscFrozen":0,"feeFrozen":0}}
        let free = accountInfo.data.free.toString(10);
        if (accountInfo.data.miscFrozen) {
          let miscFrozen = accountInfo.data.miscFrozen.toString(10);
          let final = free - miscFrozen;
          if (final < 0) final = 0;
          return final;
        }
      }
      return 0;
    },
    goToMyStake(resetCounter) {
      if (resetCounter === true || this.activeTab !== "2") {
        //
        this.preferedWidthForMyStakeActions = 200;
      }
      this.getMyStackList();
      this.activeTab = "2";
    },
    async delegateSuccess() {
      this.loading = true;
      this.getAllData();
      const accountInfo = await this.apiPromise.query.system.account(
        this.linkAccount.address
      );
      let freeBalance = this.getFreeBalance(accountInfo);
      this.linkAccount.freeBalance =
        this.formatWithDecimals(freeBalance).toFixed();
    },
    ifShowDelegate() {
      // row
      // const find = row.allNominators.find(
      //   (sv) => sv.owner == this.linkAccount.address
      // );
      // if (find || !this.currentWalletAccount) {
      //   return false;
      // }
      return true;
    },
    ifAlreadyDelegate(row) {
      const find =
        this.linkAccount.address &&
        row.allNominators.find((sv) => sv.owner == this.linkAccount.address);
      if (find) {
        // this.currentWalletAccount
        return true;
      }
      return false;
    },
    handleDelegateMore(row) {
      this.$refs.delegateModal.init(row.id, true);
    },
    async handleDelegate(row) {
      const ready = () => this.linkAccount && this.linkAccount.address;
      const proxy = () => {
        return ready() && this.$refs.delegateModal.init(row.id);
      };
      if (!ready()) {
        return this.handleLinkAccount()
          .then(() => {
            this.delegateEventPending = row;
          })
          .then(proxy);
      }
      proxy();
    },
    formatWithDecimals(value) {
      return BigNumber(value).dividedBy(this.decimalsFormat);
    },
    changeSelect() {
      this.loading = true;
      this.getAllData();
    },
    clearSubscribe() {
      let self = this;
      stakingService
        .unsubscribe({
          subscribe_address: self.linkAccountSubscribeData.subscribe_address,
          cancel_watched_address: self.linkAccountSubscribeData.watched_address,
          auto_notify_at_my_stake:
            self.linkAccountSubscribeData.auto_notify_at_my_stake,
        })
        .then((resp) => {
          self.linkAccountSubscribeData.watched_address.splice(
            0,
            self.linkAccountSubscribeData.watched_address.length
          );

          self.$notify({
            message: "Clear Success",
            position: "bottom-left",
            showClose: false,
            duration: 2000,
            type: "success",
          });
        });
    },
    showSubscribe(row) {
      let self = this;
      if (!this.linkAccount || !this.linkAccount.address) {
        return false;
      }
      let collatorAddress = row.id;
      if (
        self.linkAccountSubscribeData &&
        self.linkAccountSubscribeData.watched_address
      ) {
        let exist = self.linkAccountSubscribeData.watched_address.find(
          (item) => {
            return item.toLowerCase() === collatorAddress.toLowerCase();
          }
        );
        if (exist) {
          return false;
        }
      }
      return true;
    },
    alreadySubscribed(row) {
      let self = this;
      if (!this.linkAccount || !this.linkAccount.address) {
        return false;
      }
      let collatorAddress = row.id;
      if (
        self.linkAccountSubscribeData &&
        self.linkAccountSubscribeData.watched_address
      ) {
        let exist = self.linkAccountSubscribeData.watched_address.find(
          (item) => {
            return item.toLowerCase() === collatorAddress.toLowerCase();
          }
        );
        if (exist) {
          return true;
        }
      }
      return false;
    },
    updateAutoNotify() {
      let self = this;

      let callback = () => {
        stakingService
          .subscribe({
            subscribe_address: self.linkAccountSubscribeData.subscribe_address,
            new_watched_address: [],
            subscribe_email: self.linkAccountSubscribeData.subscribe_email,
            auto_notify_at_my_stake:
              self.linkAccountSubscribeData.auto_notify_at_my_stake,
          })
          .then((resp) => {
            self.$notify({
              message: "Update Success",
              position: "bottom-left",
              showClose: false,
              duration: 2000,
              type: "success",
            });
          });
      };
      if (!self.linkAccountSubscribeData.subscribe_email) {
        self.configDialog_subscribe_email(callback);
      } else {
        callback();
      }
    },
    configDialog_subscribe_email(callback) {
      let self = this;
      self
        .$prompt(
          "please specify an email address to receive notifications",
          "",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            inputPattern:
              /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            inputErrorMessage: "email format incorrect",
          }
        )
        .then(({ value }) => {
          self.linkAccountSubscribeData.subscribe_email = value;
          if (callback) {
            callback();
          }
        })
        .catch(() => {});
    },
    subscribe(row) {
      let self = this;
      let collatorAddress = row.id;
      console.log(collatorAddress);
      if (!self.linkAccountSubscribeData.subscribe_email) {
        self.configDialog_subscribe_email(() => {
          if (row && row.id) {
            self.subscribe(row);
          }
        });
        return;
      }

      let exist = self.linkAccountSubscribeData.watched_address.find((item) => {
        return item.toLowerCase() === collatorAddress.toLowerCase();
      });
      if (!exist) {
        stakingService
          .subscribe({
            subscribe_address: self.linkAccountSubscribeData.subscribe_address,
            new_watched_address: [collatorAddress],
            subscribe_email: self.linkAccountSubscribeData.subscribe_email,
            auto_notify_at_my_stake:
              self.linkAccountSubscribeData.auto_notify_at_my_stake,
          })
          .then((resp) => {
            self.linkAccountSubscribeData.watched_address.push(collatorAddress);

            self.$notify({
              message: "Subscribe Success",
              position: "bottom-left",
              showClose: false,
              duration: 2000,
              type: "success",
            });
          });
      }
    },
    unsubscribe(row) {
      let self = this;
      let collatorAddress = row.id;
      console.log(collatorAddress);
      let findIndex = self.linkAccountSubscribeData.watched_address.findIndex(
        (item) => {
          return item.toLowerCase() === collatorAddress.toLowerCase();
        }
      );
      if (findIndex >= 0) {
        stakingService
          .unsubscribe({
            subscribe_address: self.linkAccountSubscribeData.subscribe_address,
            cancel_watched_address: [collatorAddress],
            auto_notify_at_my_stake:
              self.linkAccountSubscribeData.auto_notify_at_my_stake,
          })
          .then((resp) => {
            self.linkAccountSubscribeData.watched_address.splice(findIndex, 1);

            self.$notify({
              message: "Unsubscribe Success",
              position: "bottom-left",
              showClose: false,
              duration: 2000,
              type: "success",
            });
          });
      }
    },

    getMinBond(v) {
      if (this.maxNominator == 0) {
        return this.minBond;
      }
      let maxNominatorPerCollator = this.maxNominator;
      if (v.allNominators.length < maxNominatorPerCollator) {
        return this.minBond;
      } else {
        return (
          this.formatWithDecimals(v.lowestTopDelegationAmount).toNumber() + 1
        );
      }
    },
    getAverageRPM(d) {
      if (d && d.length > 0) {
        // console.log(d.length);
        let sum = 0;
        d.forEach((e) => {
          sum += e.RPM.toNumber();
        });

        return sum / d.length;
      }
      return 0;
    },
    getRewardInRounds(c, rounds) {
      let roundsHasReward = 0;
      let rewardInRounds = 0;
      let startIndex = c.historyReward.length - rounds;
      if (startIndex < 0) {
        startIndex = 0;
      }
      for (let index = startIndex; index < c.historyReward.length; index++) {
        const element = c.historyReward[index];
        let reward = element.reward.toNumber();
        if (reward > 0) {
          roundsHasReward++;
        }
        rewardInRounds += reward;
      }

      startIndex = c.historyNominatorTotalReward.length - rounds;
      if (startIndex < 0) {
        startIndex = 0;
      }
      for (
        let index = startIndex;
        index < c.historyNominatorTotalReward.length;
        index++
      ) {
        const element = c.historyNominatorTotalReward[index];
        rewardInRounds += element.reward.toNumber();
      }

      return {
        collatorRewardInRounds: rewardInRounds,
        rounds: rounds,
        roundsHasReward: roundsHasReward,
      };
    },
    async getAPR(currentCollator) {
      let params = {
        blockPerRound: this.roundInfo.length,
        collatorStake: this.getTotalStake(currentCollator).toNumber(),
        collatorTotalReward: currentCollator.totalReward.toNumber(),
        rounds: 0,
        collatorRewardInRounds: 0,
        totalSupply: this.totalSupply,
        averageBlocks: currentCollator.averageBlocks,
      };
      let rewardInRounds = this.getRewardInRounds(
        currentCollator,
        this.roundsPickedByDropdown
      );
      console.log(
        `filterNoRewardRoundWhenCalcAPR:`,
        this.filterNoRewardRoundWhenCalcAPR
      );
      params.rounds =
        this.filterNoRewardRoundWhenCalcAPR === true
          ? rewardInRounds.roundsHasReward
          : rewardInRounds.rounds;
      params.collatorRewardInRounds = rewardInRounds.collatorRewardInRounds;

      return await aprUtlis.calculate(this.paraChainName, params);
    },
    resetAccountFilter() {
      this.searchAccount = this.linkAccount ? this.linkAccount.address : "";
    },
    getBoundaryReward(row) {
      const min = BigNumber(this.inputValue || 0).multipliedBy(
        new BigNumber(row.averageRPM).minus(row.standardDeviation)
      );
      const max = BigNumber(this.inputValue || 0).multipliedBy(
        new BigNumber(row.averageRPM).plus(row.standardDeviation)
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
      let rankIndex = rank - 1;
      const row = this.tableData.find((v) => v.rankIndex == rankIndex);
      const top = this.getTotalStake(row);
      const bottom = this.totalCollatorStake;
      const percent = top.dividedBy(bottom).multipliedBy(100);
      return Number(percent.toFixed(2));
    },
    getMyStackList() {
      const arr = this.tableData.filter((v) => {
        if (v.id === this.tanganikaPendingUnstakeCollator) {
          return true;
        }
        const result = v.allNominators.find((sv) => {
          if (sv.owner == this.searchAccount) {
            // status definition is available at RevokeStake.vue,
            // and the revokeStatus would be updated by RevokeStake.vue later.
            sv.revokeStatus = sv.revokeStatus || 2;
            return true;
          }
          return false;
        });
        return result;
      });
      this.tableData2 = arr;
      console.log("222", arr);
    },
    getSelfStake(row) {
      return row.bond;
    },
    getCollectorRank(row) {
      const findItem = this.tableData.find((v) => v.id == row.id);
      return findItem.rankIndex + 1;
    },
    getStakeRank(row) {
      const findIndex = row.allNominators.findIndex(
        (v) => v.owner == this.searchAccount
      );
      return findIndex + 1;
    },
    getMyRatio(row) {
      const find = row.allNominators.find((v) => v.owner == this.searchAccount);
      if (!find) {
        return;
      }
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
      return this.formatWithDecimals(row.totalCounted).minus(row.bond);

      //let result = BigNumber(0);
      // row.topDelegations.forEach((v) => {
      //   result = result.plus(v.amount);
      // });
      // return result;
    },
    getTotalStake(row) {
      return this.formatWithDecimals(row.totalCounted);
      // return this.getSelfStake(row).plus(this.getNominatorStake(row));
    },

    getPreviousTotalStake(row) {
      const findItem = this.tableData.find((v) => v.id == row.id);

      let previousRankIndex = findItem.rankIndex - 1;
      if (previousRankIndex <= 0) {
        previousRankIndex = 0;
      }
      const preRow = this.tableData.find(
        (v) => v.rankIndex == previousRankIndex
      );
      return this.getTotalStake(preRow);
    },
    getTotalStakeByRank(rank) {
      let rankIndex = rank - 1;
      if (rankIndex <= 0) {
        rankIndex = 0;
      }
      const row = this.tableData.find((v) => v.rankIndex == rankIndex);
      return this.getTotalStake(row);
    },
    getHeaderData() {
      stakingService.getLatestBlockNumber().then((d) => {
        this.blockNumber = d;
      });
      stakingService.getCurrentRoundInfo().then((d) => {
        this.roundInfo = d;
      });
    },
    getAllData() {
      let self = this;
      stakingService.getLatestBlockNumber().then((d) => {
        this.blockNumber = d;
      });
      stakingService.getMaxNominatorsPerCollator().then((d) => {
        this.maxNominator = d;
      });
      stakingService.getMaxCollatorsPerRound().then((d) => {
        this.maxCollector = d;
      });
      if (this.isFirstQuery) {
        this.loading = true;
        this.isFirstQuery = false;
      }
      //获取round信息
      stakingService.getCurrentRoundInfo().then((d) => {
        this.roundInfo = d;
        // 获取Collator列表
        stakingService.getRealtimeCollatorCandidatePool().then((c) => {
          let collatorAccounts = [];
          c.forEach((v) => {
            collatorAccounts.push(v.owner);
          });
          // 一次性获取Collator详情
          const getCollectorDetailPromise =
            stakingService.getRealtimeCollatorState({
              collators: collatorAccounts,
            });

          //获取CollatortotalReward信息
          const getCollectorTotalRewardPromise =
            stakingService.getCollatorTotalReward({
              collators: collatorAccounts,
            });

          // 获取Collator的历史10次reward
          const getCollector10RewardPromise = stakingService.getCollatorReward({
            startRoundIndex: this.startRoundIndex,
            endRoundIndex: this.endRoundIndex,
            accounts: collatorAccounts,
          });

          // 获取Nominator的历史10次totalStake
          const getNominator10TotalStakePromise = stakingService.atStake({
            startRoundIndex: this.startRoundIndex,
            endRoundIndex: this.endRoundIndex,
          });

          // 获取Nominator的历史10次totalReward
          const getNominator10RewardPromise = stakingService.getNominatorReward(
            {
              startRoundIndex: this.startRoundIndex,
              endRoundIndex: this.endRoundIndex,
            }
          );

          // 获取Collator的历史produced blocks count
          const getCollector10BlocksPromise =
            stakingService.getCollatorProducedBlocks({
              startRoundIndex: this.startRoundIndex,
              endRoundIndex: this.currentRoundIndex,
              accounts: collatorAccounts,
            });

          // 根据下拉框获取Collator的历史produced blocks count，用于计算Average Blocks
          const getCollectorBlocks4AvgBlocksCalculationPromise =
            stakingService.getCollatorProducedBlocks({
              startRoundIndex: this.startRoundIndex4AverageBlocksCalculation,
              endRoundIndex: this.endRoundIndex4AverageBlocksCalculation,
              accounts: collatorAccounts,
            });

          // 获取在当前round开始运行前，已经选中的若干个collator节点列表
          const getSelectedCollators4CurrentRoundPromise =
            stakingService.getSelectedCollators4CurrentRound({});

          const allPromiseArr = [
            getCollectorDetailPromise,
            getCollectorTotalRewardPromise,
            getCollector10RewardPromise,
            getNominator10TotalStakePromise,
            getNominator10RewardPromise,
            getCollector10BlocksPromise,
            getCollectorBlocks4AvgBlocksCalculationPromise,
            getSelectedCollators4CurrentRoundPromise,
          ];

          Promise.all(allPromiseArr).then(async (d) => {
            this.loading = false;
            // 整理Collator列表
            let nominatorRes = d[0];
            nominatorRes.forEach((v) => {
              v.bond = this.formatWithDecimals(v.bond);
              v.topDelegations.forEach((sv) => {
                sv.amount = this.formatWithDecimals(sv.amount);
              });
              v.bottomDelegations.forEach((sv) => {
                sv.amount = this.formatWithDecimals(sv.amount);
              });
              v.allNominators = [...v.topDelegations, ...v.bottomDelegations];

              //排序Nominator
              v.allNominators.sort((a, b) => {
                const totalB = b.amount;
                const totalA = a.amount;
                const result = totalB.minus(totalA);
                return result;
              });

              v.minBond = this.getMinBond(v);
            });
            // 排序Collator
            nominatorRes.sort((a, b) => {
              const totalB = this.getTotalStake(b);
              const totalA = this.getTotalStake(a);
              const result = totalB.minus(totalA);
              return result;
            });
            // 塞入totalReward
            const totalRewardRes = d[1];
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
            // 塞入10次CollatorReward
            const getCollector10RewardRes = d[2];
            nominatorRes.forEach((v) => {
              const arr = [];
              for (let i = this.startRoundIndex; i <= this.endRoundIndex; i++) {
                const find = getCollector10RewardRes.rewards.find(
                  (sv) =>
                    sv.account.toLowerCase() == v.id.toLowerCase() &&
                    Number(sv.roundIndex) == i
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
            //debugger
            // 塞入10次NominatorTotalStake
            const getNominator10TotalStakeRes = d[3];
            nominatorRes.forEach((v) => {
              const arr = [];
              for (let i = this.startRoundIndex; i <= this.endRoundIndex; i++) {
                const find = getNominator10TotalStakeRes.stakes.find(
                  (sv) =>
                    sv.collatorAccount == v.id && Number(sv.roundIndex) == i
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
            // 塞入10次NominatortotalReward (坑点：历史数据返回可能缺失某个roundIndex)

            const getNorminator10RewardRes = d[4];
            nominatorRes.forEach((v) => {
              const arr = [];
              for (let i = this.startRoundIndex; i <= this.endRoundIndex; i++) {
                //按照collator分开reward数据
                const find = getNorminator10RewardRes.rewards.find(
                  (sv) =>
                    Number(sv.roundIndex) == i &&
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
              // debugger
              const arr = [];
              for (let i = this.startRoundIndex; i <= this.endRoundIndex; i++) {
                //debugger;
                const findTop = v.historyNominatorTotalReward.find(
                  (sv) => Number(sv.roundIndex) == i
                );
                const findBottom = v.historyNominatorTotalStake.find(
                  (sv) => Number(sv.roundIndex) == i
                );

                let result = new BigNumber(0);
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
              v.averageRPM = self.getAverageRPM(v.historyRPM);
              v.mimRPM = Math.min.apply(
                null,
                arr.map((sv) => sv.RPM.toNumber())
              );
              v.maxRPM = Math.max.apply(
                null,
                arr.map((sv) => sv.RPM.toNumber())
              );

              // 标准差
              let topSum = BigNumber(0);
              v.historyRPM.forEach((sv) => {
                topSum = topSum.plus(
                  sv.RPM.minus(v.averageRPM).exponentiatedBy(2)
                );
              });
              v.standardDeviation = topSum.dividedBy(10).sqrt();
            });

            // 塞入10次Collator的 produced blocks count
            const getCollector10BlocksRes = d[5];
            nominatorRes.forEach((v) => {
              const arr = [];
              for (let i = this.startRoundIndex; i <= this.endRoundIndex; i++) {
                const find = getCollector10BlocksRes.blocks.find(
                  (sv) =>
                    sv.account.toLowerCase() == v.id.toLowerCase() &&
                    Number(sv.roundIndex) == i
                );
                if (find) {
                  arr.push({
                    roundIndex: i,
                    blocks_count: Number(find.blocks_count),
                  });
                } else {
                  arr.push({
                    roundIndex: i,
                    blocks_count: Number(0),
                  });
                }
              }
              v.historyBlock = arr;

              //current blocks
              const findCurrent = getCollector10BlocksRes.blocks.find(
                (sv) =>
                  sv.account.toLowerCase() == v.id.toLowerCase() &&
                  Number(sv.roundIndex) == this.currentRoundIndex
              );
              if (findCurrent) {
                v.currentBlocks = Number(findCurrent.blocks_count);
              } else {
                v.currentBlocks = 0;
              }
            });

            // 计算平均出块数量
            const getCollectorBlocks4AverageBlocksCalculationResult = d[6];
            nominatorRes.forEach((v) => {
              let totalBlocks = 0;
              let activeRound = 0;

              for (
                let i = this.startRoundIndex4AverageBlocksCalculation;
                i <= this.endRoundIndex4AverageBlocksCalculation;
                i++
              ) {
                const find =
                  getCollectorBlocks4AverageBlocksCalculationResult.blocks.find(
                    (sv) =>
                      sv.account.toLowerCase() == v.id.toLowerCase() &&
                      Number(sv.roundIndex) == i
                  );
                if (find) {
                  activeRound++;
                  totalBlocks += Number(find.blocks_count);
                }
              }
              //averageBlocks
              if (activeRound > 0) {
                v.averageBlocks = Number(totalBlocks / activeRound);
              } else {
                v.averageBlocks = 0;
              }
            });

            //当前round已经选中的若干个collator节点列表,作为Block生产者
            this.activeCollators = d[7];

            for (let index = 0; index < nominatorRes.length; index++) {
              const element = nominatorRes[index];
              element.rankIndex = index;
              let findIndex = this.activeCollators.findIndex(
                (v) => v.toLowerCase() == element.id.toLowerCase()
              );
              element.activeBlockProducer = findIndex >= 0;
            }

            for (const element of nominatorRes) {
              element.apr = await self.getAPR(element);
            }

            this.tableData = this.freshTableStatus(
              this.sort4Display(nominatorRes)
            );

            this.$localforage.setItem(
              this.paraChainName + "CollectorSortList",
              JSON.stringify(nominatorRes)
            );

            // console.log("tableData", nominatorRes);
            this.generateTableChart();
            if (this.searchAccount) {
              this.getMyStackList();
            }
            this.patchForDHXExtraStakes();
          });
        });
      });
    },
    freshTableStatus(tableData) {
      tableData = tableData || this.tableData;
      let hasDelegateRecord = false;
      tableData &&
        tableData.forEach((it) => {
          it.isDelegatable =
            this.ifShowDelegate(it) && this.parachain.canDelegate;
          it.isDelegated =
            this.ifAlreadyDelegate(it) && this.parachain.canDelegate;
          if (!it.isDelegated &&  it.id && this.tanganikaPendingUnstakeCollator === it.id) {
            it.isDelegated = true;
          }
          // status definition is available at RevokeStake.vue,
          // and the revokeStatus would be updated by RevokeStake.vue later.
          // revokeStatus is to control the DelegateMore
          it.revokeStatus = it.revokeStatus || 2;
          hasDelegateRecord = hasDelegateRecord || it.isDelegated;
        });
      this.hasDelegateRecord = hasDelegateRecord;
      return tableData;
    },
    // status definition is available at RevokeStake.vue#data#status,
    onRevokeStatusChange(v) {
      this.freshTableStatus();
      if (v.status <= 1) this.preferedWidthForMyStakeActions = 250;
      //else  this.preferedWidthForMyStakeActions = 200;
      // alert(preferedWidthForMyStakeActions + ',' + v.status)

      const REVOKED = 4;

      if (this.tableData2 && REVOKED === v.status) {
        this.tableData2 = this.tableData2.filter((it) =>  it.id !== v.collator);
        this.delegateSuccess();
      } else {
        const row = this.tableData2.filter((it) => it.id === v.collator)[0];
        if (row) {
          // status definition is available at RevokeStake.vue,
          // and the revokeStatus would be updated by RevokeStake.vue later.
          // revokeStatus is to control the DelegateMore
          this.$nextTick(() => (row.revokeStatus = v.status));
        }
      }
    },
    generateTableChart() {
      this.$nextTick(() => {
        this.chartInstances.forEach((v) => {
          v.dispose();
        });
        this.chartInstances = [];
        const echarts = window.echarts;
        this.onePageTableData.forEach((v) => {
          let chartId = `tableChart${v.id}`;
          const charInstance = echarts.init(document.getElementById(chartId));
          charInstance.setOption({
            tooltip: {
              appendToBody: true,
              confine: true,
              trigger: "axis",
              //formatter: "{b0}: {c0}",
            },
            grid: {
              left: 0,
              top: 20,
              bottom: 0,
              right: 0,
            },
            xAxis: {
              data: v.historyReward.map((v) => "round " + v.roundIndex),
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
            yAxis: [
              {
                type: "value",
                name: "rewards",
                show: false,
                axisLabel: {
                  show: false,
                },
                splitLine: {
                  show: false,
                },
              },
              {
                type: "value",
                name: "blocks",
                show: false,
                axisLabel: {
                  show: false,
                },
                splitLine: {
                  show: false,
                },
              },
            ],
            series: [
              {
                name: "rewards",
                type: "bar",
                yAxisIndex: 0,
                data: v.historyReward.map((v) => v.reward.toNumber()),
                itemStyle: {
                  color: "#17c684",
                },
                symbol: "none",
                silent: true,
              },
              {
                name: "blocks",
                type: "line",
                yAxisIndex: 1,
                data: v.historyBlock.map((v) => v.blocks_count),
                itemStyle: {
                  color: "#A9DF96",
                },
                symbol: "none",
              },
            ],
          });
          this.chartInstances.push(charInstance);
        });
      });
    },
    async handleLinkAccount() {
      this.allAccounts = [];

      // clear delegate status
      this.delegateEventPending = null;

      if (this.parachain.walletSupport === "MetaMask") {
        this.handleLinkAccount_MetaMask(
          this.parachain.chainId,
          this.parachain.rpcUrls,
          this.parachain.blockExplorerUrls
        );
      }

      if (this.parachain.walletSupport === "polkadot.js") {
        let allAccounts = await this.getAccountList_PolkadotJs(
          this.paraChainName,
          this.parachain.ss58Format
        );
        console.log("allAccounts from polkadot.js:", allAccounts);

        this.allAccounts = allAccounts;
        allAccounts.length && (this.showAccountChooseDialog = true);
      }
      console.log(
        `wallet [${this.parachain.walletSupport}] not supported yet. current support: [MetaMask,polkadot.js]`
      );
    },

    async getAccountList_PolkadotJs(chain, ss58Format) {
      let isLinked = false;
      await web3Enable(`Web3Go ${chain} Staking dashboard`).then(
        (injectedExtensions) => {
          isLinked = injectedExtensions && injectedExtensions.length > 0;
        }
      );
      if (!isLinked) {
        this.$message.error(
          "We couldn't connect to wallet, please check the extension and try again."
        );
        return;
      }
      const allAccounts = await web3Accounts({
        ss58Format: ss58Format,
        accountType: ["ed25519", "sr25519", "ecdsa"],
      });
      if (allAccounts && allAccounts.length > 0) {
        for (const ac of allAccounts) {
          ac.key = ac.address + (ac.meta.name || "") + (ac.meta.source || "");
        }
      }
      return allAccounts || [];
    },
    async accountChoosen(account) {
      await web3Enable(`Web3Go ${this.paraChainName} Staking dashboard`);
      localStorage.setItem("currentAccount", JSON.stringify(account));
      this.showAccountChooseDialog = false;

      console.log(`accountChoosen:`, account, `,account:`, account);

      this.linkAccount.address = account.address;
      if (this.delegateEventPending) {
        if (
          this.parachain.canDelegate &&
          this.ifAlreadyDelegate(this.delegateEventPending)
        ) {
          //this.delegateEventPending.isDelegated) {
          this.delegateEventPending = null;
        } else
          this.handleDelegate(this.delegateEventPending).then(() => {
            this.delegateEventPending = null;
          });
      }

      await this.handleLinkAccount_PolkadotJs(
        this.paraChainName,
        this.parachain.ss58Format,
        this.parachain.rpcUrls,
        account
      );
    },
    async initPolkadotApi(chain, rpcUrls) {
      if (this.apiPromise) {
        return;
      }
      const wsProvider = new WsProvider(rpcUrls);
      let types = chainUtlis.getTypes(chain);
      console.log("types:", types);
      const api = await ApiPromise.create({
        provider: wsProvider,
      });
      this.apiPromise = api;
    },
    async handleLinkAccount_PolkadotJs(chain, ss58Format, rpcUrls, account) {
      let currentAddress = account.address;

      this.linkAccount.address = currentAddress;
      this.searchAccount = this.linkAccount.address;
      if (this.tableData.length) {
        this.getMyStackList();
      }
      this.refreshMySubscribe(this.linkAccount);

      if (!this.apiPromise) {
        await this.initPolkadotApi(chain, rpcUrls);
      }
      // const blockHash = await api.rpc.chain.getBlockHash(100);
      // const header = await api.derive.chain.getHeader(blockHash);
      // console.log(`#${header.number}-${blockHash}: ${header.author}`);
      const accountInfo = await this.apiPromise.query.system.account(currentAddress);
      console.log(`accountInfo:${accountInfo}`);
      let freeBalance = this.getFreeBalance(accountInfo);
      console.log(`freeBalance:${freeBalance}`);
      this.linkAccount.freeBalance =
        this.formatWithDecimals(freeBalance).toFixed();
      this.currentWalletAccount = account;
    },
    async handleLinkAccount_MetaMask(
      targetChainId,
      rpcUrls,
      blockExplorerUrls
    ) {
      // 引入web3
      this.linkLoading = true;
      const Web3 = require("web3");
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
          params: [{ chainId: targetChainId }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: targetChainId,
                  chainName: this.paraChainName,
                  rpcUrls: rpcUrls,
                  nativeCurrency: {
                    name: this.symbol,
                    symbol: this.symbol,
                    decimals: this.decimals,
                  },
                  blockExplorerUrls: blockExplorerUrls,
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
          console.error(
            "cannot get account, please check if Metamask has been configured？"
          );
          return;
        }
        this.linkAccount.address = accs[0];
        localStorage.setItem("alreadyLinkMetaMask", true);

        this.searchAccount = this.linkAccount.address;
        if (this.tableData.length) {
          this.getMyStackList();
        }
        this.refreshMySubscribe(this.linkAccount);

        // 查询token余额
        this.web3.eth.getBalance(this.linkAccount.address).then((d) => {
          this.linkAccount.freeBalance = this.formatWithDecimals(d).toString();
          this.inputValue = this.linkAccount.freeBalance;
          this.linkLoading = false;
        });
      };
      this.web3.eth.getAccounts((err, accs) => {
        console.log("web3 accounts:", accs);
        if (err != null) {
          console.error(
            "cannot get account, please check if the MetaMask has been installed."
          );
          this.message = "";
          return;
        }
        solveAccounts(accs);
      });
      ethereum.on("accountsChanged", (accs) => {
        solveAccounts(accs);
      });
      ethereum.on("chainChanged", (chainId) => {
        //connect to parachain
        if (chainId == targetChainId) {
          this.web3.eth.getAccounts((err, accs) => {
            console.log("web3 accounts:", accs);
            if (err != null) {
              console.error(
                "cannot get account, please check if the MetaMask has been installed."
              );
              this.message = "";
              return;
            }
            solveAccounts(accs);
          });
        } else {
          this.linkAccount.address = "";
          this.linkAccount.freeBalance = null;
          this.searchAccount = undefined;
          this.inputValue = 0;
        }
      });
    },
    refreshMySubscribe(account) {
      let self = this;
      stakingService
        .getMySubscribe({ subscribe_address: account.address })
        .then((resp) => {
          if (resp && resp.id) {
            self.linkAccountSubscribeData.auto_notify_at_my_stake =
              resp.auto_notify_at_my_stake;
            self.linkAccountSubscribeData.subscribe_address =
              resp.subscribe_address;
            self.linkAccountSubscribeData.subscribe_email =
              resp.subscribe_email;
            if (resp.watched_address) {
              self.linkAccountSubscribeData.watched_address =
                resp.watched_address.split(",");
            } else {
              self.linkAccountSubscribeData.watched_address = [];
            }
          } else {
            self.linkAccountSubscribeData.subscribe_address =
              this.linkAccount.address;
            self.linkAccountSubscribeData.subscribe_email = "";
            self.linkAccountSubscribeData.auto_notify_at_my_stake =
              self.auto_notify_at_my_stake_inactive;
            self.linkAccountSubscribeData.watched_address = [];
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
    removeScrollEvent() {
      if (this.scrollHandler) {
        window.removeEventListener("scroll", this.scrollHandler);
      }
    },
    showDetail(rowIndex, row) {
      // popover关闭再打开可能会冲突，需要延迟
      setTimeout(() => {
        this.currentSimulate = { ...row, rowIndex };
        // popover定位，以及随滚动条滚动
        const ref = this.$refs.popover;
        const clickBtn = this.$refs["simulateBtn" + row.id];
        if (this.scrollHandler) {
          window.removeEventListener("scroll", this.scrollHandler);
        }
        this.scrollHandler = () => {
          ref.$el.style.top = clickBtn.getBoundingClientRect().top + "px";
          ref.$el.style.left = clickBtn.getBoundingClientRect().left + "px";
        };
        this.scrollHandler();
        window.addEventListener("scroll", this.scrollHandler);
        // 点击外部的时候可能会让popover关闭，有冲突
        setTimeout(() => {
          ref.doShow();
          const detailChart = echarts.init(this.$refs[`detailChart${row.id}`]);
          let totalStake_yAxis = this.getyAxisMinMax(
            row.historyNominatorTotalStake.map((v) =>
              v.nominatorsStake.toNumber()
            ),
            0.005,
            0
          );
          // console.log(totalStake_yAxis);
          let totalReward_yAxis = this.getyAxisMinMax(
            row.historyNominatorTotalReward.map((v) => v.reward.toNumber()),
            0.005,
            2
          );
          // console.log(totalReward_yAxis);
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
                )} </span><br/>
              ${val[1].marker} ${
                  val[1].seriesName
                }  <span style="font-weight: bold;color: rgba(41, 40, 40, 0.8);">${val[1].value.toFixed(
                  2
                )} </span><br/>
              ${val[2].marker} ${
                  val[2].seriesName
                }  <span style="font-weight: bold;color: rgba(41, 40, 40, 0.8);">${val[2].value.toFixed(
                  7
                )} </span>
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
              },
              {
                name: `RPM(Reward Per ${this.symbol}):`,
                yAxisIndex: 2,
                type: "line",
                data: row.historyRPM.map((v) => v.RPM.toNumber()),
                itemStyle: {
                  color: "rgba(255, 86, 48, 1)",
                },
              },
            ],
          });
          this.detailChart = detailChart;
        }, 10);
      }, 10);
    },
    turnActionPage({ row, $index }) {
      let parachainQuery = {
        name: this.paraChainName,
        symbol: this.symbol,
        decimals: this.decimals,
        base_api: stakingService.base_api,
      };
      let routeName4CollectorDetail = "StakingCollectorDetail";
      this.$router.push({
        name: routeName4CollectorDetail,
        query: {
          ...parachainQuery,
          id: row.id,
        },
        meta: this.$route.meta,
        params: { data: row },
      });
    },
    handleClick() {
      if (this.activeTab == "2") {
        this.goToMyStake(true);
      }
    },
    shotFilter(str) {
      return str.slice(0, 6) + "..." + str.slice(str.length - 4, str.length);
    },
    turnDelegatorActionPage(account) {
      let parachainQuery = {
        name: this.paraChainName,
        symbol: this.symbol,
        decimals: this.decimals,
        base_api: stakingService.base_api,
      };
      let routeName4DelegatorDetail = "StakingDelegatorDetail";

      this.$router.push({
        name: routeName4DelegatorDetail,
        query: {
          ...parachainQuery,
          id: account,
        },
        meta: this.$route.meta,
      });
    },

    sortChange(evt) {
      console.log("sortChange", evt);
      this.sort4DisplayConfig = evt;
      this.loading = true;
      this.getAllData();
    },
    sort4Display(d) {
      // debugger;

      if (this.sort4DisplayConfig && this.sort4DisplayConfig.order != null) {
        let key = this.sort4DisplayConfig.prop;

        if (this.sort4DisplayConfig.order == "ascending") {
          d.sort(function (a, b) {
            if (a[key] > b[key]) return 1;
            if (a[key] < b[key]) return -1;
            return 0;
          });
          return d;
        } else if (this.sort4DisplayConfig.order == "descending") {
          d.sort(function (a, b) {
            if (a[key] > b[key]) return -1;
            if (a[key] < b[key]) return 1;
            return 0;
          });
          return d;
        }
      }
      return d;
    },

    async patchForDHXExtraStakes() {
      if (this.symbol !== 'DHX' || !this.parachain.canDelegate) {
        return;
      }
      if (!this.tableData.length || !this.linkAccount.address) {
        return;
      }
      if (!this.apiPromise) {
        await this.initPolkadotApi(this.paraChainName, this.parachain.rpcUrls);
      }
      const unstakingInfo4TanganikaRaw = (
            await this.apiPromise.query.parachainStaking.unstaking(
              this.linkAccount.address
            )
          ).toHuman();
      if (!unstakingInfo4TanganikaRaw || !Object.keys(unstakingInfo4TanganikaRaw).length) {
        return;
      }
      // special for Tanganika: since the unstaking records is mising so keep abreast with
      // other networks, we need to add the part for Revoke functionalities.
      const data = await stakingService.getDelegatorActionHistory(
        {
          delegatorAccount: this.linkAccount.address,
          pageIndex: 1,
          pageSize: 1,
          actionType: 'left'
        }
      )
        //  // TODO TEST
        //  if (data.totalCount < 1) {
        //   data = {
        //     "list": [
        //         {
        //             "roundindex": 866,
        //             "account": this.linkAccount.address,
        //             "collator": "4Mq4E4PWkzK8U8yskS7TRuF3LV62goFtxfxtJwaRbbHZ2YVx",
        //             "actiontype": "left",
        //             "balancechange": 10
        //         }
        //     ],
        //     "totalCount": 9
        //   };
        // }
        // // TODO TEST END
        if (data.totalCount) {
          this.tanganikaPendingUnstakeCollator = data.list[0].collator;
          // this.tableData.forEach((it) => {
          //   it.isDelegated = it.isDelegated || data.list[0].collator === it.id;
          // });
        }
        // debugger;
      

    }

  },
  watch: {
    'linkAccount.address': function(n, o) {
      n && this.patchForDHXExtraStakes();
    }
  }
};
</script>

<style lang="less" scoped>
.staking-page {
  /deep/ .el-progress-bar__innerText {
    color: rgba(41, 40, 40, 0.8);
    font-weight: bold;
  }
  .fixed-popover > span {
    opacity: 0;
    position: fixed;
  }
  .table-btn {
    display: inline-block;
    text-align: center;
    padding: 0 8px;
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
  .table-btn.revoke {
    margin-left: 8px;
    background: #ffffff;
    color: rgba(41, 40, 40, 0.8);
    border: 1px solid rgba(41, 40, 40, 0.3);
  }
  .pagination-wrap {
    margin-top: 10px;
  }
  .el-icon-data-line {
    margin-right: 4px;
  }
  .icon-cell {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 8px;
      width: 32px;
      height: 32px;
    }
    .span {
      font-size: 14px;
      color: rgba(56, 203, 152, 1);
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
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
        color: #38cb98 !important;
        opacity: 0.7;
      }
    }
  }
  .wallet-wrap {
    float: right;
    margin-right: 35px;
    display: flex;
    align-items: center;
    line-height: initial;
    height: 60px;
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

    .switch-icon {
      margin: 0px 15px;
      font-size: 1.4rem;
      cursor: pointer;
      &:hover {
        color: #36f1a6;
      }
    }
  }

  .wallet-list {
    .wallet-item {
      padding: 15px 20px;
      border-radius: 10px;
      cursor: pointer;
      .wallet-item-address {
      }
      .wallet-item-meta {
        font-size: 1rem;
        font-weight: bold;
      }

      &:hover {
        background: #ddd;
      }
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
      position: relative;
      .select-wrap {
        align-items: center;
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
        /deep/ .el-select {
          margin: 0 10px;
          width: 68px;
        }
      }
      .table-chart {
        width: 216px;
        height: 90px;
        position: relative;
      }
      .active-block-producer {
        background: #19d991 !important;
      }
      .rank-icon {
        display: inline-block;
        text-align: center;
        line-height: 30px;
        width: 30px;
        height: 30px;
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
        .reward-history-btn {
          margin-left: 16px;
          width: 120px;
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
<style lang="less">
.simulate-popover {
  background: rgb(250, 250, 250) !important;
  box-shadow: rgba(0, 0, 0, 0.6) 0px 2px 20px 0px !important;
}
.tab-content .stakeTable .el-table__body-wrapper,
.tab-content1 .stakeTable .el-table__body-wrapper {
  overflow: auto !important;
}
.stakeTable {
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    background-color: transparent;
  }
}
</style>
<style lang="less" scoped>
.div-operation {
  padding-left: 10px;
  display: flex;
  align-items: center;
  .subscribe {
    margin-left: 10px;
    font-size: 20px;
    color: #36f1a6;
    cursor: pointer;
  }
  .subscribe-already {
    margin-left: 10px;
    font-size: 20px;
    color: #e96868;
    cursor: pointer;
  }
}

.el-icon-bell {
  color: #36f1a6;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}
.popover-subscribe {
  padding: 10px 10px;
  .title {
    margin-top: 10px;
    font-weight: bold;
  }
  .subscribe-address {
  }
  .subscribe-email {
    .content {
      display: flex;
      padding: 5px 0px;
    }
    .subscribe-email-clear {
      margin-left: 10px;
      color: #e96868;
      cursor: pointer;
    }
  }
  .watched-address {
    .content {
      display: flex;
      padding: 5px 0px;
    }
    .watched-address-item {
      .watched-address-remove {
        margin-left: 10px;
        color: #e96868;
        cursor: pointer;
      }
    }
  }

  .clear-all-subscribe {
    a {
      text-align: center;
      cursor: pointer;
      color: #e96868;
      text-decoration: underline;
    }
  }
}
</style>