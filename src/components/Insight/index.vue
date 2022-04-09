<template>
  <div class="insight-page">
    <div class="layout">
      <div class="type-list">
        <div class="item" :class="{ active: !type }" @click="type = null">
          <img class="icon" src="@/assets/images/allInsight.png" alt="" />
          <span class="text">All Chain</span>
        </div>
        <div
          class="item"
          v-for="(v, i) in typeStrList"
          :key="i"
          :class="{ active: type == v }"
          @click="type = v"
        >
          <img class="icon" :src="getTypeIcon(v)" alt="" />
          <span class="text">{{ v }}</span>
        </div>
      </div>
      <div class="card-wrap">
        <div v-for="v in currentTypeList" :key="v.id" class="item">
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
              <span>{{ v.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import platformApi from "@/api/platform";

import { queryDataBoardList } from "@/api/Insight";
export default {
  data() {
    return {
      allList: [],
      typeMap: {},
      type: null,
    };
  },
  created() {
    queryDataBoardList({
      pageSize: 99999999999,
      pageIndex: 1,
    }).then((d) => {
      platformApi.queryDataBoardViewCount().then((resp) => {
        d.list.forEach((v) => {
          const find = resp.find((sv) => sv.dataBoardId == v.dashboard_id);
          if (find) {
            v.viewCount = find.viewCount;
          } else {
            v.viewCount = 0;
          }
        });
        const typeMap = {};
        d.list.forEach((v) => {
          if (!typeMap[v.type]) {
            typeMap[v.type] = [v];
          } else {
            typeMap[v.type].push(v);
          }
        });
        this.typeMap = typeMap;
        this.allList = d.list;
      });
    });
  },
  computed: {
    currentTypeList() {
      if (!this.type) {
        return this.allList;
      }
      return this.typeMap[this.type];
    },
    typeStrList() {
      return Object.keys(this.typeMap);
    },
  },
  methods: {
    getTypeIcon(v) {
      if (!this.typeMap[v]) {
        return "";
      }
      return "/static/parachain-icon/" + this.typeMap[v][0].icon;
    },
    goDetail(v) {
      platformApi.reportDataBoardViewCount({
        dataBoardId: v.dashboard_id,
      });
      this.$router.push({
        name: "InsightDetail",
        query: {
          link: `${v.link}#${window.BASE_API}/static/parachain-icon/${v.icon}`,
          name: v.name,
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
    .type-list {
      margin-top: 20px;
      .item {
        margin-top: 15px;
        display: inline-block;
        width: 147px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid #d6d6d6;
        margin-right: 24px;
        cursor: pointer;
        &:hover {
          background: rgba(56, 203, 152, 0.1);
        }
        &.active {
          background: rgba(56, 203, 152, 0.1);
          border: 1px solid #38cb98;
        }

        .icon {
          width: 24px;
          height: 24px;
          margin-right: 8px;
          vertical-align: middle;
        }
        .text {
          font-size: 16px;
          color: #292828;
          vertical-align: middle;
        }
      }
    }
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