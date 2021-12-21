<template>
  <div class="content moonriver-action-page">
    <div class="common-back-title">
      <i class="el-icon-back" @click="$router.back()"></i>
      <span class="text">{{ $route.query.id }}</span>
    </div>
    <div class="big-bg">
      <div class="info-wrap">
        <div class="info-item">
          <img src="@/assets/images/moonriver1.png" alt="" />
          <div class="right">
            <div class="title">Rank</div>
            <div class="number-wrap">
              <span class="number">{{ $route.query.rank }}</span>
            </div>
          </div>
        </div>
        <div class="info-item">
          <img src="@/assets/images/moonriver2.png" alt="" />
          <div class="right">
            <div class="title">Self-Bonded</div>
            <div class="number-wrap">
              <span class="number">{{
                $route.query.selfStake | roundNumber(2)
              }}</span>
              <span class="unit">MOVR</span>
            </div>
          </div>
        </div>
        <div class="info-item">
          <img src="@/assets/images/moonriver3.png" alt="" />
          <div class="right">
            <div class="title">Total Bonded</div>
            <div class="number-wrap">
              <span class="number">{{
                $route.query.totalStake | roundNumber(2)
              }}</span>
              <span class="unit">MOVR</span>
            </div>
          </div>
        </div>
      </div>
      <el-table class="table" v-loading="loading" :data="tableData">
        <el-table-column prop="roundindex" label="RoundIndex">
        </el-table-column>
        <el-table-column prop="actiontype" label="Action"></el-table-column>
        <!-- <el-table-column prop="name1" label="Extrinsics">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.name1" placement="top">
              <span>{{ shotFilter(scope.row.name1) }}</span>
            </el-tooltip>
          </template>
        </el-table-column> -->
        <el-table-column prop="blocknumber" label="Block"></el-table-column>
        <el-table-column label="Balance Change">
          <template slot-scope="scope">
            <span>{{ scope.row.balancechange | roundNumber(2) }} MOVR</span>
          </template>
        </el-table-column>
        <el-table-column label="Balance Current">
          <template slot-scope="scope">
            <span>{{ scope.row.balancecurrent | roundNumber(2) }} MOVR</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import moonriverService from "@/api/moonriver";

export default {
  data() {
    return {
      loading: false,
      tableData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      moonriverService
        .getCollatorActionHistory({
          collatorAccount: this.$route.query.id,
        })
        .then((res) => {
          this.loading = false;
          this.tableData = res;
          // this.tableData = res.list.map((v) => ({
          //   ...v,
          //   name1: "0x000000000000006f6502b7f2bbac8c30a3f67e9a",
          //   name2: "100.0MOVR",
          // }));
        });
    },
    shotFilter(str) {
      return str.slice(0, 6) + "..." + str.slice(str.length - 4, str.length);
    },
  },
};
</script>

<style lang="less" scoped>
.moonriver-action-page {
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
            font-size: 16px;
            color: rgba(41, 40, 40, 0.6);
            text-align: left;
          }
          .number-wrap {
            margin-top: 4px;
            .number {
              font-weight: bold;
              font-family: Rubik-Regular, Rubik;
              font-size: 32px;
              color: #292828;
            }
            .unit {
              margin-left: 8px;
              font-size: 18px;
              font-weight: 400;
              color: rgba(41, 40, 40, 0.6);
            }
          }
        }
        .circle {
          margin-left: 16px;
        }
      }
    }
    .table {
      margin-top: 24px;
      /deep/ td {
        padding: 18.5px 8.5px !important;
      }
      /deep/ .el-table__body .el-table__row:nth-child(2n) {
        background: transparent !important;
      }
      /deep/ .el-table__body {
        border-spacing: 0 !important;
      }
    }
  }
}
</style>