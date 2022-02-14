<template>
  <div class="insight-page">
    <div class="layout">
      <div class="title">Insight</div>
      <div class="card-wrap">
        <div v-for="v in cardList" :key="v.id" class="item">
          <div class="card hover-item" @click="goDetail(v)">
            <div class="c-title">
              <img :src="'static/parachain-icon/' + v.icon" alt="" />
              <span>{{ v.name }}</span>
            </div>
            <img class="img" :src="v.snapshot" alt="" />
          </div>
          <div class="info">
            <span>{{ v.created }}</span>
            <div class="right">
              <img src="@/assets/images/home/eye.png" alt="" />
              <span>234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryDataBoardList } from "@/api/Insight";
export default {
  data() {
    return {
      cardList: [],
    };
  },
  created() {
    queryDataBoardList({
      pageSize: 99999999999,
      pageIndex: 1,
    }).then((d) => {
      this.cardList = d.list;
    });
  },
  methods: {
    goDetail(v) {
      this.$router.push({
        name: "InsightDetail",
        query: {
          id: v.id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.insight-page {
  background: rgb(245, 247, 249);
  text-align: left;
  .layout {
    padding: 24px 100px;

    .title {
      font-size: 32px;
      font-weight: bold;
      color: #292828;
    }
    .card-wrap {
      padding: 16px 0;
      .item {
        margin-left: 24px;
        margin-top: 24px;
        display: inline-block;
        .card {
          width: 400px;
          height: 248px;
          background: #ffffff;
          border-radius: 10px;
          padding: 24px;
          box-sizing: border-box;
          .c-title {
            display: flex;
            align-items: center;
            img {
              width: 32px;
              height: 32px;
            }
            span {
              font-size: 18px;
              font-weight: bold;
              color: #292828;
              margin-left: 8px;
            }
          }
          .img {
            width: 338px;
            height: 161px;
          }
        }
        .info {
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          .right {
            font-size: 14px;
            color: #545353;
            display: flex;
            align-items: center;
            img {
              margin-right: 4px;
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
  }
}
</style>