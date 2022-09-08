<template>
  <div class="content address-tag-manage">
    <div class="top-operation">
      <el-button type="primary" @click="handleNew()">New insight</el-button>
    </div>
    <div class="">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="icon" width="70">
          <template slot-scope="scope">
            <img
              class="icon"
              :src="'static/parachain-icon/' + scope.row.icon"
              alt=""
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="name"></el-table-column>
        <el-table-column
          prop="dashboard_id"
          label="dashboard_id"
        ></el-table-column>
        <el-table-column
          prop="description"
          label="description"
        ></el-table-column>
        <el-table-column label="operation">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >Remove</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <div>
        <div class="form-row">
          <div class="desc">name</div>
          <div class="value">
            <el-input v-model="currentRow.name"></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">dashboard_id</div>
          <div class="value">
            <el-input
              v-model="currentRow.dashboard_id"
            ></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">type</div>
          <div class="value">
            <el-input
              v-model="currentRow.type"
              placeholder="type of dashboard, sample as : Moonbeam, Polkadot"
            ></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">description</div>
          <div class="value">
            <el-input v-model="currentRow.description"></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">tags</div>
          <div class="value">
            <el-input v-model="currentRow.tags"></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">icon</div>
          <div class="value">
            <el-input v-model="currentRow.icon"></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">snapshot</div>
          <div class="value">
            <el-input v-model="currentRow.snapshot"></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">link</div>
          <div class="value">
            <el-input v-model="currentRow.link"></el-input>
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
import {
  queryDataBoardList,
  publishDashboard,
  removeDashboard,
  snapshotUpload,
} from "@/api/Insight";
export default {
  name: "AddressTagManage",
  data() {
    return {
      name: "AddressTagManage",
      tableData: [],
      dialogVisible: false,
      dialogTitle: "",
      currentRow: {
        id: 0,
        address: "",
        addressTag: "",
        description: "",
        showTagInsteadOfAddress: false,
        simpleDescription: "",
      },
    };
  },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      var self = this;
      return queryDataBoardList().then((resp) => {
        if (resp && resp) {
          self.tableData = resp.list;
        }
      });
    },
    handleNew() {
      this.currentRow = {
        id: 0,
        name: "",
        type: "",
        description: "",
        tags: "",
        icon: "",
        snapshot: "",
        link: "",
      };
      this.dialogVisible = true;
      this.dialogTitle = "New";
    },
    handleEdit(index, row) {
      this.currentRow = row;
      this.dialogVisible = true;
      this.dialogTitle = "Edit";
    },
    handleDelete(index, row) {
      let self = this;
      self.currentRow = row;

      this.$confirm("Remove current insight, continue?", "Confirm", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          removeDashboard(self.currentRow).then((resp) => {
            self.$notify({
              type: "success",
              message: "Remove success!",
              position: "bottom-left",
            });
            self.dialogVisible = false;
            self.getData();
          });
        })
        .catch(() => {});
    },
    onSave() {
      let self = this;
      publishDashboard(self.currentRow).then((resp) => {
        self.$notify({
          type: "success",
          message: "Update success!",
          position: "bottom-left",
        });
        self.getData();
        self.dialogVisible = false;
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.address-tag-manage {
  width: 95vw;
  margin: 10px auto;
}
.top-operation {
  text-align: left;
  padding: 10px 0px;
}
.icon {
  width: 24px;
  height: 24px;
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
