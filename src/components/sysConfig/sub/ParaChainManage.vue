<template>
  <div class="content parachain-manage">
    <div class="parachain-type">
      <el-radio-group v-model="parachainType" @change="changeParaChainType">
        <el-radio-button label="Polkadot"></el-radio-button>
        <el-radio-button label="Kusama"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="top-operation">
      <el-button @click="handleNew()">New Parachain</el-button>
    </div>
    <div class="">
      <el-table :data="dataList" style="width: 100%">
        <el-table-column prop="id" label="id" width="100"></el-table-column>
        <el-table-column
          prop="paraId"
          label="paraId"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="projectName"
          label="projectName"
        ></el-table-column>
        <el-table-column label="icon">
          <template slot-scope="scope">
            <div class="project-icon">
              <img :src="'/static/parachain-icon/' + scope.row.icon" />
              <div>{{ scope.row.icon }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="operation">
          <template slot-scope="scope">
            <el-button
              type="default"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >Edit</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <div>
        <div class="form-row">
          <div class="desc">paraId</div>
          <div class="value">
            <el-input
              :disabled="dialogTitle == 'Edit'"
              v-model="currentRow.paraId"
            ></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">projectName</div>
          <div class="value">
            <el-input v-model="currentRow.projectName"></el-input>
          </div>
        </div>

        <div class="form-row">
          <div class="desc">icon name</div>
          <div class="value">
            <el-input v-model="currentRow.icon"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSave()">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import kusamaApi from "@/api/paraChain-analysis-kusama";
import polkadotApi from "@/api/paraChain-analysis-polkadot";
export default {
  name: "ParaChainManage",
  data() {
    return {
      name: "ParaChainManage",
      parachainType: "Polkadot",
      dataList: [],

      dialogVisible: false,
      dialogTitle: "",

      currentRow: {},
    };
  },
  computed: {},
  mounted() {
    this.changeParaChainType();
    this.resetRow(this.currentRow);
  },
  methods: {
    resetRow(row) {
      row = {
        id: 0,
        paraId: "",
        projectName: "",
        lastUpdateTime: "",
        icon: "",
      };
    },
    changeParaChainType() {
      let self = this;
      if (self.parachainType === "Polkadot") {
        polkadotApi.getPolkParaChainList().then((resp) => {
          self.dataList = resp.list;
        });
      }
      if (self.parachainType === "Kusama") {
        kusamaApi.getPolkParaChainList().then((resp) => {
          self.dataList = resp.list;
        });
      }
    },

    handleNew() {
      let self = this;
      self.resetRow(self.currentRow);
      self.dialogVisible = true;
      self.dialogTitle = "New";
    },
    handleEdit(index, row) {
      let self = this;
      self.currentRow = {
        ...row,
      };

      self.dialogVisible = true;
      self.dialogTitle = "Edit";
    },
    onSave() {
      let self = this;
      let api = {};
      if (self.parachainType === "Polkadot") {
        api = polkadotApi.updatePolkParaChain;
      }
      if (self.parachainType === "Kusama") {
        api = kusamaApi.updatePolkParaChain;
      }
      api(self.currentRow).then((resp) => {
        self.$notify({
          type: "success",
          message: "Update success!",
          position: "bottom-left",
          duration: 1000,
        });
        self.changeParaChainType();
        self.dialogVisible = false;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.parachain-manage {
  width: 95vw;
  margin: 10px auto;
}

.parachain-type {
  text-align: left;
}
.top-operation {
  text-align: right;
  padding: 10px 0px;
}
.project-icon {
  display: flex;
  align-items: center;
  img {
    width: 64px;
    margin: 0px 5px;
  }
}
.form-row {
  .desc {
    font-size: 16px;
    text-align: left;
    margin: 10px 0px;
  }
  .value {
    text-align: left;
  }
}
</style>
