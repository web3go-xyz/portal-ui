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
    <div>
      <router-view name="sub" />
    </div>
  </div>
</template>

<script>
export default {
  name: "MaintenanceDashboard",
  data() {
    return {
      name: "Maintenance Dashboard",
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
      ],
    };
  },
  computed: {},
  mounted() {
    this.handleSelect(this.activeIndex, "");
  },
  methods: {
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
