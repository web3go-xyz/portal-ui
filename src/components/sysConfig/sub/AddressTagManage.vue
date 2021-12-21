<template>
  <div class="content address-tag-manage">
    <div class="top-operation">
      <el-button type="primary" @click="handleNew()">New address tag</el-button>
    </div>
    <div class="">
      <el-table :data="addressTagList" style="width: 100%">
        <el-table-column
          prop="address"
          label="address"
          width="400"
        ></el-table-column>
        <el-table-column
          prop="addressTag"
          label="address tag"
          width="180"
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
          <div class="desc">address</div>
          <div class="value">
            <el-input
              :disabled="dialogTitle == 'Edit'"
              v-model="currentRow.address"
            ></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">address tag</div>
          <div class="value">
            <el-input
              v-model="currentRow.addressTag"
              placeholder="if you have multiple tags, please use comma between them"
            ></el-input>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">show tag instead of address</div>
          <div class="value">
            <el-switch v-model="currentRow.showTagInsteadOfAddress">
            </el-switch>
          </div>
        </div>
        <div class="form-row">
          <div class="desc">description</div>
          <div class="value">
            <el-input v-model="currentRow.simpleDescription"></el-input>
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
import service from "@/api/config-manage";
export default {
  name: "AddressTagManage",
  data() {
    return {
      name: "AddressTagManage",
      addressTagList: [],

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
    this.getAddressTagList();
  },
  methods: {
    getAddressTagList() {
      var self = this;
      return service.getAddressTagList().then((resp) => {
        if (resp && resp) {
          self.addressTagList = resp.list;
        }
      });
    },
    handleNew() {
      let self = this;
      self.currentRow.id = 0;
      self.currentRow.address = "";
      self.currentRow.addressTag = "";
      self.currentRow.description = "";
      self.currentRow.showTagInsteadOfAddress = false;
      self.currentRow.simpleDescription = "";

      self.dialogVisible = true;
      self.dialogTitle = "New";
    },
    handleEdit(index, row) {
      let self = this;
      self.currentRow.id = row.id;
      self.currentRow.address = row.address;
      self.currentRow.addressTag = row.addressTag;
      self.currentRow.description = row.description;

      if (self.currentRow.description) {
        let desc = JSON.parse(self.currentRow.description);
        self.currentRow.showTagInsteadOfAddress =
          desc.showTagInsteadOfAddress || false;
        self.currentRow.simpleDescription = desc.simpleDescription || "";
      }
      self.dialogVisible = true;
      self.dialogTitle = "Edit";
    },
    handleDelete(index, row) {
      let self = this;
      self.currentRow = row;

      this.$confirm("Remove current address tag, continue?", "Confirm", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          service.removeAddressTag(self.currentRow).then((resp) => {
            self.$notify({
              type: "success",
              message: "Remove success!",
              position: "bottom-left",
            });
            self.dialogVisible = false;
            self.getAddressTagList();
          });
        })
        .catch(() => {});
    },
    onSave() {
      let self = this;
      let desc = {
        showTagInsteadOfAddress: self.currentRow.showTagInsteadOfAddress,
        simpleDescription: self.currentRow.simpleDescription,
      };
      self.currentRow.description = JSON.stringify(desc);
      service.updateAddressTag(self.currentRow).then((resp) => {
        self.$notify({
          type: "success",
          message: "Update success!",
          position: "bottom-left",
        });
        self.getAddressTagList();
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
