<template>
  <div class="content custom-query-page">
    <div class="common-back-title">
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">{{
        editSupport ? "Create New Analysis" : publishData.title
      }}</span>
      <el-button
        v-show="editSupport"
        style="float: right; margin-top: 15px; margin-right: 30px"
        size="small"
        @click="publish"
        class="btn-publish"
        >Publish</el-button
      >
    </div>
    <div class="main g-wrap">
      <div class="div-edit" v-if="editSupport">
        <div class="select-row" v-show="false">
          <div class="select-description">Find tokens</div>
          <el-select
            class="select-token"
            v-model="query.selectedToken"
            clearable
            placeholder="tokens"
          >
            <el-option
              v-for="item in chainList4Select"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="select-description">shown with</div>
          <el-select
            class="select-showfields"
            v-model="query.selectedFields"
            multiple
            collapse-tags
            placeholder="fields"
          >
            <el-option
              v-for="item in fields4Select"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="select-description">sorted by</div>
          <div>
            <el-select
              class="select-orderby"
              v-model="query.orderByFields"
              clearable
              placeholder="fields"
            >
              <el-option
                v-for="item in fields4Orderby"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="select-description">takes</div>
          <div>
            <el-input
              class="input-recordCount"
              v-model="query.recordCount"
              placeholder="some"
            ></el-input>
          </div>
          <div class="select-description">records.</div>
          <div class="buttons">
            <el-button size="small" @click="runQuery" class="btn-run"
              >Run</el-button
            >
            <el-button
              size="small"
              @click="showAdvancedQuery"
              class="btn-advanced-query"
              >Ad. Query</el-button
            >
          </div>
        </div>

        <div class="div-advanced-query" v-show="advancedQueryVisible">
          <div class="div-advanced-query-schema">
            <div class="div-advanced-query-schema-select">
              <el-select
                v-model="schemaOption.schemaType"
                placeholder="select"
                @change="refreshSchema()"
              >
                <el-option
                  v-for="item in schemaTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <div class="tree">
                <div class="table-collapse">
                  <el-collapse accordion>
                    <el-collapse-item
                      v-for="t in dataTables"
                      :key="t.tableName"
                      :name="t.tableName"
                    >
                      <template slot="title">
                        <div class="tableName">
                          <img src="@/assets/images/dropdown-icon.png" alt="" />
                          <!-- <i class="el-icon-s-grid"></i> -->
                          <div class="text">{{ t.tableName }}</div>
                        </div>
                      </template>
                      <div class="tableComment">
                        {{ t.tableComment }}
                      </div>
                      <div v-for="tc in t.columns" :key="tc.columnName">
                        <div class="column-display">
                          <i class="el-icon-document"></i>
                          <div class="columnName">{{ tc.columnName }}</div>
                          <div class="dataType">({{ tc.dataType }})</div>
                        </div>
                        <div class="columnComment">{{ tc.columnComment }}</div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </div>
          </div>
          <div class="div-advanced-query-editor">
            <el-button size="small" @click="runQuery" class="btn-run"
              >Run</el-button
            >
            <el-input
              type="textarea"
              :rows="5"
              placeholder="eg: SELECT count(1) from wallet_address_info "
              v-model="query.queryExpression"
            >
            </el-input>
          </div>
        </div>
      </div>
      <div class="query-result">
        <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
          <el-tab-pane
            v-loading="loading"
            v-for="tab in tabs"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
          >
            <keep-alive>
              <component
                ref="vizComponents"
                v-bind:is="tab.component"
                :data="resultData"
                :options="tab.options"
                :id="tab.name"
                v-on:viz-component-add="vizComponentAdd"
                v-on:viz-component-remove="vizComponentRemove"
                v-on:viz-component-update-options="vizComponentUpdateOptions"
              ></component>
            </keep-alive>
            <div v-if="tab.label == 'Chart'" class="tag-wrap">
              <div
                v-for="v in tags"
                :key="v.name"
                class="tag"
                :class="{ active: activeTagName == v.name }"
                @click="activeTagName = v.name"
              >
                <span>{{ v.label }}</span>
                <i
                  v-if="editSupport"
                  class="el-icon-close"
                  @click.stop="vizComponentRemove(v.name)"
                ></i>
              </div>
            </div>
            <template v-if="tab.label == 'Chart'">
              <div v-for="v in tags" :key="v.name">
                <keep-alive>
                  <component
                    v-show="v.name == activeTagName"
                    ref="tagVizComponents"
                    v-bind:is="v.component"
                    :data="resultData"
                    :options="v.options"
                    :id="v.name"
                    v-on:viz-component-add="vizComponentAdd"
                    v-on:viz-component-remove="vizComponentRemove"
                    v-on:viz-component-update-options="
                      vizComponentUpdateOptions
                    "
                  ></component>
                </keep-alive>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog
      class="custom-query-dialog"
      title=""
      width="520px"
      :visible.sync="publishDialogVisible"
    >
      <div class="dialog-title">Publish Query</div>
      <el-form>
        <el-form-item label="Title">
          <el-input v-model="publishData.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            v-model="publishData.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="Created">
          <el-input v-model="publishData.created" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="publishDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="doPublish">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import wsService from "@/api/wallet-analysis";
import queryService from "@/api/custom-query";
import SimpleQueryResult from "./visualization/SimpleQueryResult.vue";
import NewVisualizationConfig from "./visualization/NewVisualizationConfig";

import LineChart from "./visualization/LineChart";
import BarChart from "./visualization/BarChart";
import PieChart from "./visualization/PieChart";

export default {
  name: "CustomQuery",
  components: {
    SimpleQueryResult,
    NewVisualizationConfig,
    LineChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      loading: false,
      activeTagName: "",
      tags: [],
      msg: "Build New Analysis",

      publishDialogVisible: false,
      advancedQueryVisible: true,
      activeTabName: "@queryResult",
      chainList: [],

      chainList4Select: [],
      fields4Select: [],
      fields4Orderby: [],

      tabs: [],

      totalCount: 0,
      tableData: [],
      query: {
        selectedToken: null,
        selectedFields: null,
        orderByFields: null,
        recordCount: 10,
        queryExpression: "",
      },

      resultData: {
        table: [{ id: 1, name: "just a sample data" }],
      },

      publishData: {
        id: "",
        title: "",
        description: "",
        created: "Web3go User",
        createdTimestamp: "",
        params: "",
      },

      id: 0,
      editSupport: false,

      schemaTypeOptions: [
        {
          lable: "ERC20",
          value: "ERC20",
          refers: {
            schema: "ido-dev",
            tables: [
              "chain_type",
              "wallet_address",
              "wallet_address_ext",
              "wallet_address_info",
              "wallet_address_transaction",
            ],
          },
        },

        {
          lable: "Karura",
          value: "Karura",
          refers: {
            schema: "ido-price",
            tables: [
              "chain_state",
              "chain_statistic",
              "loan_position",
              "loan_action",
              "price",
            ],
          },
        },
        {
          lable: "Moonriver",
          value: "Moonriver",
          refers: {
            schema: "ido-moonriver",
            tables: [
              "round_info",
              "round_collator",
              "reward_history",
              "collator_action_history",
              "collator_point_history",
              "collator_number_history",
              "nominator_action_history",
            ],
          },
        },
        {
          lable: "Kusama Crowdloan",
          value: "Kusama Crowdloan",
          refers: {
            schema: "ido-dev",
            tables: [
              "polk_para_chain",
              "polk_para_chain_crowdloan",
              "polk_para_chain_crowdloan_contribution",
              "polk_para_chain_name_mapping",
            ],
          },
        },
        {
          lable: "Polkdot Crowdloan",
          value: "Polkdot Crowdloan",
          refers: {
            schema: "ido-polkadot",
            tables: [
              "polk_para_chain",
              "polk_para_chain_crowdloan",
              "polk_para_chain_crowdloan_contribution",
              "polk_para_chain_crowdloan_contribution_proxy_detail",
              "polk_para_chain_name_mapping",
            ],
          },
        },
      ],
      schemaOption: {
        schemaType: "ERC20",
        schema: "ido-dev",
        filterTableNames: [],
      },
      dataTables: [],
    };
  },
  computed: {},

  created() {
    var self = this;
    if (self.$route.query) {
      self.id = self.$route.query.id || 0;
      if (
        self.$route.query.editSupport === true ||
        self.$route.query.editSupport === "true"
      ) {
        self.editSupport = true;
      } else {
        self.editSupport = false;
      }
    }

    if (self.editSupport) {
      Promise.all([self.getChainList()]).then((res) => {
        if (self.chainList) {
          self.chainList.forEach((c) => {
            self.chainList4Select.push({
              label: c.chainType,
              value: c.contractAddress,
            });
          });
        }
        self.buildFields4Select();
        self.buildFields4OrderBy();
      });
    }

    if (self.id > 0) {
      queryService.getDetail({ id: self.id }).then((resp) => {
        if (resp) {
          self.publishData = resp;
          if (self.publishData.params) {
            var params = JSON.parse(self.publishData.params);
            if (params.schemaOption) {
              self.schemaOption = params.schemaOption;
            }
          }
          self.refreshSchema();
          self.buildQueryAndComponentTabs(true);
        }
      });
    } else {
      self.refreshSchema();
      self.buildQueryAndComponentTabs(false);
    }
    console.log("CustomQuery created");
  },

  methods: {
    refreshSchema() {
      let self = this;

      if (self.schemaOption.schemaType) {
        for (let index = 0; index < self.schemaTypeOptions.length; index++) {
          const option = self.schemaTypeOptions[index];
          if (option.value == self.schemaOption.schemaType) {
            self.schemaOption.schema = option.refers.schema;
            self.schemaOption.filterTableNames = option.refers.tables;
            break;
          }
        }
      }
      let queryParam = self.schemaOption;

      queryService
        .getTables(queryParam)
        .then((resp) => {
          if (resp) {
            self.dataTables = resp;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    buildQueryAndComponentTabs(runQueryFlag) {
      // debugger;

      let self = this;

      let paramsObj = null;
      if (self.publishData.params) {
        paramsObj = JSON.parse(self.publishData.params);
        console.log("111", paramsObj);
      }
      //build query
      if (paramsObj) {
        self.query = {
          ...paramsObj.query,
        };
      }

      //build tabs
      self.tabs.push({
        name: "@queryResult",
        label: "Query Result",
        component: "SimpleQueryResult",
      });
      if (paramsObj && paramsObj.visualizationConfig) {
        paramsObj.visualizationConfig.forEach((v) => {
          v.options.editSupport = self.editSupport;
          // self.tabs.push(v);
          this.tags.push(v);
        });
        if (paramsObj.visualizationConfig.length) {
          this.activeTagName = this.tags[0].name;
        }
      }
      if (self.editSupport || paramsObj.visualizationConfig.length) {
        self.tabs.push({
          name: "@addNewVisualization",
          label: "Chart",
          component: "NewVisualizationConfig",
        });
      }

      if (runQueryFlag) {
        setTimeout(() => {
          //run query
          self.runQuery();
        }, 100);
      }
    },
    vizComponentUpdateOptions(event) {
      console.log("vizComponentUpdateOptions:", event);
      for (let index = 0; index < this.tags.length; index++) {
        // const tab = this.tabs[index];
        // if (tab.name == event.id) {
        //   tab.options = event;
        //   break;
        // }
        const tag = this.tags[index];
        if (tag.name == event.id) {
          tag.options = event;
          break;
        }
      }
    },
    vizComponentRemove(event) {
      console.log("vizComponentRemove:", event);
      // let findIndex = -1;
      // for (let index = 0; index < this.tabs.length; index++) {
      //   const tab = this.tabs[index];
      //   if (tab.name == event) {
      //     findIndex = index;
      //     break;
      //   }
      // }
      // if (findIndex > -1) {
      //   this.tabs.splice(findIndex, 1);
      // }
      // this.activeTabName = this.tabs[0].name;
      const index = this.tags.findIndex((v) => v.name == event);
      if (index !== -1) {
        this.tags.splice(index, 1);
        this.activeTagName = this.tags[0].name;
      }
    },
    vizComponentAdd(event) {
      console.log("vizComponentAdd:", event);
      let label = event;
      let name = event + new Date().getTime();
      let component = event;
      let insertIndex = this.tabs.length - 1;
      // this.tabs.splice(insertIndex, 0, {
      //   name: name,
      //   label: label,
      //   component: component,
      //   options: {
      //     editSupport: this.editSupport,
      //   },
      // });
      this.tags.splice(this.tags.length, 0, {
        name: name,
        label: label,
        component: component,
        options: {
          editSupport: this.editSupport,
        },
      });
      // this.activeTabName = name;
      this.activeTagName = name;
    },
    handleTabClick(tab, event) {
      console.log("handleTabClick:", tab, event);
    },
    buildFields4Select() {
      var self = this;
      self.fields4Select = [];
      self.fields4Select.push({
        label: "WalletAddress",
        value: "walletAddress",
      });
      self.fields4Select.push({
        label: "Current Balance",
        value: "balance",
      });
      self.fields4Select.push({
        label: "Transaction Count",
        value: "countTotal",
      });
      self.fields4Select.push({
        label: "Transaction Amount",
        value: "amountTotal",
      });
    },
    buildFields4OrderBy() {
      var self = this;
      self.fields4Orderby = [];
      self.fields4Orderby.push({
        label: "Current Balance ASC",
        value: "balance asc",
      });
      self.fields4Orderby.push({
        label: "Current Balance DESC",
        value: "balance desc",
      });

      self.fields4Orderby.push({
        label: "Transaction Count ASC",
        value: "countTotal asc",
      });
      self.fields4Orderby.push({
        label: "Transaction Count DESC",
        value: "countTotal desc",
      });

      self.fields4Orderby.push({
        label: "Transaction Amount ASC",
        value: "amountTotal asc",
      });
      self.fields4Orderby.push({
        label: "Transaction Amount DESC",
        value: "amountTotal desc",
      });
    },
    getChainList() {
      var self = this;
      return wsService.getChainList().then((resp) => {
        if (resp && resp.list) {
          self.chainList = resp.list;
        }
      });
    },

    showAdvancedQuery() {
      this.advancedQueryVisible = !this.advancedQueryVisible;
    },
    runQuery() {
      console.log("runQuery");
      if (!this.query.selectedToken && !this.query.queryExpression) {
        this.$message.error(
          "please choose filter criteria or provide query expression"
        );
        return;
      }

      let self = this;
      self.loading = true;
      let queryParam = {
        ...self.query,
        schema: self.schemaOption.schema,
        queryExpression: this.query.queryExpression,
      };

      queryService
        .executeQuery(queryParam)
        .then((resp) => {
          if (resp && resp.errorCode == 0) {
            self.resultData.table = resp.data;

            console.log("refresh vizComponents", self.$refs);
            if (self.$refs && self.$refs.tagVizComponents) {
              for (
                let index = 0;
                index < self.$refs.tagVizComponents.length;
                index++
              ) {
                const component = self.$refs.tagVizComponents[index];
                if (component.refresh) {
                  component.refresh();
                }
              }
            }
          } else {
            self.$message.error(resp.errorCode + "-" + resp.errorMessage);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          self.loading = false;
        });
    },
    publish() {
      this.publishDialogVisible = true;

      this.publishData.id = this.id;
      this.publishData.createdTimestamp = new Date().getTime();
    },
    doPublish() {
      let self = this;
      if (!self.publishData.title) {
        this.$message.error("please give a title");
        return;
      }

      let visualizationConfig = [];
      self.tags.forEach((tag) => {
        // if (tab.name == "@queryResult" || tab.name == "@addNewVisualization") {
        //   return;
        // }
        visualizationConfig.push(tag);
      });
      self.publishData.params = JSON.stringify({
        query: self.query,
        schemaOption: self.schemaOption,
        visualizationConfig: visualizationConfig,
      });

      if (self.publishData.id > 0) {
        queryService.update(self.publishData).then((resp) => {
          if (resp) {
            self.$message.success({
              message: "update success",
              duration: 1000,
            });
            self.publishDialogVisible = false;
            setTimeout(() => {
              self.$router.push({
                name: "HomePage",
              });
            }, 500);
          }
        });
      } else {
        queryService.create(self.publishData).then((resp) => {
          if (resp) {
            self.$message.success({
              message: "publish success",
              duration: 1000,
            });
            self.id = resp.id;
            self.publishData.id = self.id;
            self.publishDialogVisible = false;
            setTimeout(() => {
              self.$router.push({
                name: "HomePage",
              });
            }, 500);
          }
        });
      }
    },
  },
};
</script> 

<style lang="less">
#app .custom-query-page {
  .main {
    background: url("../../assets/images/list-bg.png") no-repeat top right;
    background-size: 30%;
  }
  .title {
    height: 47px;
    font-size: 40px;
    font-family: Rubik-Medium, Rubik;
    font-weight: 500;
    color: #17c684;
    line-height: 47px;
    text-align: left;
    margin-top: 48px;
  }

  .publish {
    display: flex;
    justify-content: flex-end;
  }
  .btn-publish {
    width: 91px;
    background: #17c684;
    border-radius: 6px;
    border-color: #111111;
  }
  .btn-publish:hover {
    color: #fff;
    border-color: #111111;
    background: #168d5f;
  }

  .select-row {
    margin-top: 20px;
    color: white;
    line-height: 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .select-row .select-description {
    margin-left: 5px;
    margin-right: 5px;
  }

  .input-recordCount {
    width: 70px;
  }
  .select-token {
    width: 120px;
  }
  .select-showfields {
    width: 250px;
  }
  .select-orderby {
    width: 120px;
  }

  .btn-run {
    width: 59px;
    position: absolute;
    bottom: 16px;
    left: 24px;
    background: #17c684;
    border-radius: 6px;
    color: #fff;
    border-color: #111111;
  }
  .btn-run:hover {
    color: #fff;
    border-color: #111111;
    background: #168d5f;
  }
  .btn-advanced-query {
  }

  .div-advanced-query {
    margin-top: 24px;
    display: flex;
    min-height: 200px;
  }
  .div-advanced-query-schema {
    background: white;
    padding: 25px;
    flex-grow: 0;
    width: 30%;
    .tree {
      margin-top: 10px;
      .el-collapse {
        border-top: 0;
        .el-collapse-item__header {
          border-bottom: 0;
        }
        .el-collapse-item__content {
          overflow: auto;
          max-height: 123px;
          padding: 8px;
          padding-left: 25px;
        }
      }
    }
  }

  .schema-title,
  .table-title {
    color: rgb(184, 182, 182);
    background: #3a3a3a;
    cursor: pointer;
    padding: 5px 0px;
    width: 100%;
  }
  .table-collapse {
  }
  .div-advanced-query-schema-select .el-select {
    width: 100%;
  }
  .div-advanced-query-editor {
    position: relative;
    flex-grow: 1;
    padding-bottom: 50px;
    .el-textarea__inner {
      resize: none;
      border: 0;
      border-radius: 0;
    }
  }
  .div-advanced-query-editor .el-textarea {
    height: 100%;
  }

  .el-textarea__inner {
    height: 100%;
  }
  .query-result {
    padding: 30px 0px;
  }

  .el-tabs__active-bar {
    font-size: 24px;
    font-family: Rubik-Medium, Rubik;
    font-weight: 500;
    background-color: #17c684;
  }
  .el-tabs__item {
    color: rgba(255, 255, 255, 0.6);
    font-size: 18px;
  }
  .el-tabs__item.is-active {
    color: #17c684 !important;
  }

  .el-tabs__item:hover {
    color: #17c684 !important;
  }
  .el-tabs__nav-wrap::after {
    background-color: #1b1b1b;
  }
  .query-result .content {
    background: #181818;
    border-radius: 8px;
    min-height: 300px;
  }
  .tableName {
    display: flex;
    padding-left: 10px;
    img {
      width: 22px;
      height: 22px;
      vertical-align: middle;
    }
    .text {
      word-break: break-all;
      line-height: normal;
      text-align: left;
    }
  }
  .el-icon-document {
    color: rgba(41, 40, 40, 0.6);
    margin-right: 2px;
    font-size: 13px;
  }
  .column-display {
    display: flex;
    padding-left: 10px;
    align-items: center;
  }
  .columnName {
    font-size: 14px;
    color: rgba(41, 40, 40, 0.6);
  }
  .dataType {
    font-size: 14px;
    color: rgba(41, 40, 40, 0.6);
    margin-left: 5px;
    font-style: italic;
  }
  .columnComment {
    padding-left: 10px;
    font-style: italic;
    color: #a7a5a5;
    text-align: left;
  }
}
body.white-theme #app .custom-query-page {
  .custom-query-dialog {
    .dialog-title {
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #262626;
      margin-top: -25px;
    }
    .el-form-item__label {
      font-size: 14px;
      font-weight: bold;
      color: rgba(41, 40, 40, 0.8);
    }
  }
  .main {
    background: transparent;
  }
  .schema-title,
  .table-title {
    background: transparent;
    color: #17c684;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__active-bar {
    display: none;
  }
  .el-tabs__item {
    color: rgba(41, 40, 40, 1);
  }
  .btn-run {
    background: #17c684;
    color: #fff;
    border-color: #17c684;
  }
  .btn-run:hover {
    color: #fff;
    border-color: #17c684;
    background: #168d5f;
  }
  .btn-publish {
    background: #17c684;
    color: #fff;
    border-color: #17c684;
  }
  .btn-publish:hover {
    color: #fff;
    border-color: #17c684;
    background: #168d5f;
  }
  .div-advanced-query-editor {
    background: rgba(235, 239, 243, 1);
    .el-textarea__inner {
      background: rgba(235, 239, 243, 1);
    }
  }
  .el-collapse-item__wrap {
    background: rgba(235, 239, 243, 1);
  }
  .tag-wrap {
    margin-bottom: 17px;
    margin-top: 16px;
    text-align: left;
    .tag {
      cursor: pointer;
      margin-right: 16px;
      padding: 9px 12px;
      display: inline-block;
      background: #e1e7ed;
      border-radius: 16px;
      font-size: 12px;
      font-family: Rubik-Regular, Rubik;
      font-weight: 400;
      color: rgba(41, 40, 40, 0.6);
      &.active {
        font-size: 12px;
        font-family: Rubik-Regular, Rubik;
        font-weight: 400;
        color: #ffffff;
        background: #38cb98;
        border-radius: 16px;
      }
      .el-icon-close {
        margin-left: 5px;
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
  .query-result {
    .el-tabs__content {
      overflow: visible;
    }
  }
}
</style>

 