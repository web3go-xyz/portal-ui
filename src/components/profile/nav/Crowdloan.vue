<template>
  <div class="ProfileCrowdloan">
    <div class="common-profile-sort">
      <span
        v-for="(sort, index) in sortList"
        :key="sort.code"
        :class="actSortIndex === index ? 'act' : ''"
        @click="clickSort(index)"
        >{{ sort.name }}</span
      >
    </div>
    <div class="common-profile-component">
      <Component :is="actComponent"></Component>
    </div>
  </div>
</template>
<script>
import Polkadot from "./Crowdloan/polkadot.vue";
import Kusama from "./Crowdloan/kusama.vue";

export default {
  name: "ProfileCrowdloan",
  data() {
    return {
      actSortIndex: 0,
      actComponent: Polkadot,
      sortList: [
        {
          name: "Polkadot",
          view: Polkadot
        },
        {
          name: "Kusama",
          view: Kusama
        }
      ]
    };
  },
  components: {
    Polkadot
  },
  methods: {
    clickSort(index) {
      this.actSortIndex = index;
      this.actComponent = this.sortList[index].view;
    }
  }
};
</script>

<style></style>
