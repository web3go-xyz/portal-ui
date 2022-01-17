<template>
  <div class="main">
    <div class="query">
      <el-input v-model="collection_id"></el-input>
      <div><el-button @click="search">Search</el-button></div>
    </div>
    <div class="result">
      {{ collection_item }}
    </div>
    <div class="update">
      <div class="row">
        <div class="title">collection_id:</div>
        <el-input style="width: 400px" v-model="collection_id"></el-input>
      </div>

      <div class="row">
        <div class="title">collection_name:</div>
        <el-input style="width: 400px" v-model="collection_name"></el-input>
      </div>
      <div class="row">
        <el-button type="primary" @click="updateCollectionName"
          >Update Name</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getCollections, updateCollectionEntityName } from "@/api/nft/nftDetail";
export default {
  name: "RMRKNFTNameUpdate",
  data() {
    return {
      collection_id: "",
      collection_name: "",
      collection_item: "",
    };
  },
  methods: {
    search() {
      this.collection_item = "";
      if (!this.collection_id) {
        this.$message({
          type: "error",
          message: "invalid collection_id",
        });
        return;
      }
      getCollections({
        pageSize: 10,
        pageIndex: 1,
        orderBys: [],
        collection_id: this.collection_id,
      }).then((resp) => {
        if (resp && resp.list && resp.list.length > 0) {
          this.collection_item = resp.list[0];
        } else {
          this.$message({
            type: "error",
            message: "invalid collection_id",
          });
        }
      });
    },
    updateCollectionName() {
      if (!this.collection_id) {
        this.$message({
          type: "error",
          message: "invalid collection_id",
        });
        return;
      }
      if (!this.collection_name) {
        this.$message({
          type: "error",
          message: "invalid collection_name",
        });
        return;
      }
      updateCollectionEntityName({
        collection_name: this.collection_name,
        collection_id: this.collection_id,
      }).then((resp) => {
        if (resp) {
          this.$message({
            type: "success",
            message: "Update success",
          });
        } else {
          this.$message({
            type: "error",
            message: "Update failure",
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 30vw;
  margin-left: 50px;
  margin-top: 50px;
  .query {
    display: flex;
  }
  .update {
    margin-top: 20px;
    .row {
      display: flex;
      margin: 5px 0px;
      .title {
        width: 150px;
        display: table;
        text-align: left;
      }
    }
  }
}
</style>