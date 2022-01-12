<template>
  <div class="content">
    <div class="title">{{ name }}</div>
    <div class="sub-menu">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item v-for="m in menus" :key="m.index" :index="m.index">{{
          m.name
        }}</el-menu-item>
      </el-menu>
    </div>
    <div v-show="showSub">
      <router-view name="sub" />
    </div>
  </div>
</template>

<script>
import platformApi from "@/api/platform";
export default {
  name: "MaintenanceDashboard",
  data() {
    return {
      name: "Maintenance Dashboard",
      showSub: false,
      activeIndex: "AddressTagManage",
      menus: [
        {
          index: "AddressTagManage",
          name: "Address Tag",
          routeName: "MaintenanceDashboard-AddressTagManage",
        },
        {
          index: "ParaChainManage",
          name: "ParaChain Manage",
          routeName: "MaintenanceDashboard-ParaChainManage",
        },
        {
          index: "RMRKNFTNameUpdate",
          name: "RMRK NFT NameUpdate",
          routeName: "MaintenanceDashboard-RMRKNFTNameUpdate",
        },
      ],
    };
  },
  computed: {},
  mounted() {
    // this.showSub = true;
    // this.handleSelect(this.activeIndex, "");
    this.validateManagePrivilege();
  },
  methods: {
    validateManagePrivilege() {
      this.$prompt("Please input the code", "Notification", {
        confirmButtonText: "Confirm",
        showCancelButton: false,
        inputType: "text",
      })
        .then(({ value }) => {
          platformApi
            .checkMaintenancePrivilege({ code: value })
            .then((resp) => {
              if (resp === true) {
                // this.$message({
                //   type: "success",
                //   message: "Pass",
                // });
                this.showSub = true;
                this.handleSelect(this.activeIndex, "");
              } else {
                window.location.reload();
              }
            });

          //
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "Code invalid",
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);

      let findMenu = this.menus.find((v, index, array) => v.index === key);
      if (findMenu) {
        this.$router.push({ name: findMenu.routeName, meta: this.$route.meta });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.title {
  text-align: left;
  padding: 10px 10px;
  font-size: 24px;
}
</style>
