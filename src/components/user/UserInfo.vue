<template>
  <div class="user-info">
    <div class="big-left">
      <div class="title">UserProfile</div>
      <div class="left-nav">
        <div
          class="nav-item"
          @click="tabIndex = 1"
          :class="{ active: tabIndex == 1 }"
        >
          <img src="@/assets/images/login/info.png" alt="" />
          <span>User info</span>
          <div class="right-line"></div>
        </div>
        <div
          class="nav-item"
          @click="tabIndex = 2"
          :class="{ active: tabIndex == 2 }"
        >
          <img src="@/assets/images/login/favority.png" alt="" />
          <span>Favorites</span>
          <div class="right-line"></div>
        </div>
      </div>
    </div>
    <div class="big-right">
      <div v-show="tabIndex == 1" class="tab-content info">
        <div class="inner">
          <div class="info-top">
            <div class="avatar-wrap">
              <userAvatar ref="userAvatar" />
              <div class="name">{{ form.name }}</div>
            </div>
          </div>
          <el-form
            label-position="top"
            class="form"
            ref="form"
            :model="form"
            label-width="80px"
          >
            <el-form-item label="Name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="Email">
              <el-input disabled v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn" type="primary" @click="save"
                >Save Changes</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="tabIndex == 2" class="tab-content favourity">
        <el-row>
          <el-col class="col" :span="6" v-for="v in favorityList" :key="v.id">
            <div class="item">
              <img class="icon" :src="v.icon" alt="" />
              <div class="text-wrap" @click="showCardDetail(v.linkUrl)">
                <span :title="v.link">{{ splitWord(v.link) }}</span>
              </div>
              <div class="del-icon-wrap">
                <img
                  @click="remove(v)"
                  class="del-icon"
                  src="@/assets/images/login/del.png"
                  alt=""
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import userAvatar from "./component/userAvatar";
import { updateUserInfo, getUserFavorite, removeFavorite } from "@/api/user";
import platformApi from "@/api/platform";

export default {
  components: { userAvatar },
  data() {
    return {
      tabIndex: 1,
      form: {
        name: "",
        email: "",
      },
      userInfo: {},
      favorityList: [],
    };
  },
  mounted() {
    this.getUserInfo();
    this.refreshCollectList();
  },
  methods: {
    refreshCollectList() {
      getUserFavorite().then((d) => {
        this.favorityList = d.map((v) => ({
          ...v,
          icon: this.getIcon(v),
          linkUrl: JSON.parse(v.linkUrl),
        }));
      });
    },
    remove(v) {
      removeFavorite({
        id: v.id,
      }).then(() => {
        this.refreshCollectList();
      });
    },
    splitWord(word) {
      if (word.length > 50) {
        return word.slice(0, 50) + "...";
      }
      return word;
    },
    getIcon(obj) {
      const map = {
        "RMRK NFT": "/static/images/rmrk-logo.png",
        Moonriver: require("@/assets/images/home_slices/moonriver.png"),
        Karura: require("@/assets/images/home_slices/karura.png"),
        Kusama: "/static/images/kusama.png",
        Polkadot: "/static/images/polkadot.svg",
        ERC20: require("@/assets/images/home_slices/erc20.png"),
        Custom: require("@/assets/images/home_slices/customQuery.png"),
      };
      return map[obj.type];
    },
    showCardDetail(d) {
      if (d.id) {
        platformApi.reportDataBoardViewCount({
          dataBoardId: d.id,
        });
      }

      if (d.type == "ERC20") {
        this.$router.push({
          name: "WalletProfiler",
          query: {
            data: JSON.stringify(d),
          },
        });
      }

      if (d.type == "Polkadot") {
        let routeName = "ParaChainProfiler4Polkadot";
        this.$router.push({
          name: routeName,
          params: {
            data: d,
          },
          query: {
            chainType: d.type,
          },
        });
      }
      if (d.type == "Kusama") {
        let routeName = "ParaChainProfiler";
        this.$router.push({
          name: routeName,
          params: {
            data: d,
          },
          query: {
            chainType: d.type,
          },
        });
      }
      if (d.type == "Karura") {
        this.$router.push({
          name: "CDPProfiler",
          params: {
            data: d,
          },
        });
      }
      if (d.type == "Custom") {
        this.handleCustomQueryActionCommand(d.id + "-view");
      }

      if (d.type == "Moonriver") {
        this.$router.push({
          name: "MoonRiver",
          params: {
            data: d,
          },
        });
      }
      if (d.type == "RMRK NFT") {
        this.$router.push({
          name: "NFTProfiler",
          params: {
            data: d,
          },
        });
      }
    },
    handleCustomQueryActionCommand(command) {
      console.log("handleCustomQueryActionCommand:", command);
      let id = command.split("-")[0];
      command = command.split("-")[1];
      if (command == "remove") {
        this.removeCustomQueryId = id;
        this.removeCustomQueryDialogVisible = true;
      }
      if (command == "edit" || command == "view") {
        let self = this;
        self.$router.push({
          name: "CustomQuery",
          query: {
            id: id,
            editSupport: command == "edit",
          },
        });
      }
    },
    getUserInfo() {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      this.userInfo = userInfo;
      this.form = {
        name: userInfo.name,
        email: userInfo.email,
      };
      const avatar = userInfo.avatar
        ? userInfo.avatar
        : require("@/assets/images/avatar.png");
      this.$refs.userAvatar.init(avatar);
    },
    save() {
      updateUserInfo({
        userId: this.userInfo.userId,
        displayName: this.form.name,
        imageBase64: this.$refs.userAvatar.options.img,
      }).then((res) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            ...userInfo,
            name: res.displayName,
            avatar: res.imageBase64,
          })
        );
        this.$eventBus.$emit("refreshUser");
        this.$message.success("save success");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.user-info {
  height: calc(100vh - 60px);
  text-align: left;
  display: flex;
  .big-left {
    background: #ffffff;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.04);
    width: 200px;
    flex: none;
    .title {
      padding: 16px 19px;
      font-size: 18px;
      font-weight: bold;
      color: #292828;
    }
    .left-nav {
      .nav-item {
        cursor: pointer;
        padding: 16px 19px;
        width: 145px;
        position: relative;
        &:hover {
          span {
            color: #292828;
          }
        }
        &.active {
          background: rgba(56, 203, 152, 0.1);
          span {
            color: #292828;
          }
          .right-line {
            position: absolute;
            top: 0;
            bottom: 0;
            right: -5px;
            width: 5px;
            background: linear-gradient(
              209deg,
              #55e9a8 0%,
              #55e9a8 13%,
              #21dbc1 45%,
              #7c4fff 100%
            );
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
          }
        }
        img {
          width: 16px;
          height: 16px;
          vertical-align: middle;
        }
        span {
          margin-left: 3px;
          font-size: 14px;
          vertical-align: middle;
          color: #7f7e7e;
        }
      }
    }
  }
  .big-right {
    flex: 1;
    background: rgb(243, 245, 247);
    padding: 16px;
    .tab-content {
      height: 100%;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 10px;
      &.info {
        text-align: center;
        .inner {
          padding: 64px 0;
          display: inline-block;
          width: 480px;
          text-align: left;
          .info-top {
            text-align: center;
            .avatar-wrap {
              padding-left: 30px;
              margin-bottom: 20px;
              .name {
                margin-top: 8px;
                font-size: 32px;
                font-weight: bold;
                color: #292828;
              }
            }
          }
          .form {
            /deep/ .el-form-item__label {
              font-size: 16px;
              color: #292828;
              padding: 0;
            }
            /deep/ .el-input__inner {
              border-radius: 6px;
              height: 56px;
            }
            .btn {
              height: 56px;
              font-size: 24px;
            }
          }
        }
      }
      &.favourity {
        padding: 20px 12px;
        .col {
          padding: 12px;
        }
        .item {
          background: #f5f7f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          padding: 16px;
          .icon {
            flex: none;
            width: 48px;
            height: 48px;
            margin-right: 8px;
          }
          .text-wrap {
            height: 52px;
            display: flex;
            align-items: center;
            flex: 1;
            cursor: pointer;
            &:hover {
              opacity: 0.7;
            }
          }
          .del-icon-wrap {
            flex: none;
            display: flex;
            .del-icon {
              display: block;
              width: 24px;
              height: 24px;
              cursor: pointer;
              &:hover {
                opacity: 0.7;
              }
            }
          }
        }
      }
    }
  }
}
</style>