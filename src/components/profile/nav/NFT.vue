<template>
  <div class="profileNFT">
    <div class="common-profile-sort">
      <span
        v-for="(sort, index) in sortList"
        :key="sort.name"
        :class="actSortIndex === index ? 'act' : ''"
        @click="clickSort(index)"
        >{{ sort.name }}</span
      >
    </div>
    <div class="common-profile-component">
      <Component :is="actComponent" :addressList="addressList"></Component>
    </div>
  </div>
</template>
<script>
import RMRK from "./NFT/rmrk.vue";

export default {
  name: "ProfileNFT",
  props: {
    addressList: {
      type: Array
    }
  },
  data() {
    return {
      actSortIndex: 1,
      actComponent: RMRK,
      sortList: [
        {
          name: "All"
        },
        {
          name: "RMRK",
          view: RMRK
        },
        {
          name: "ETH"
        },
        {
          name: "Others"
        }
      ]
    };
  },
  components: {
    RMRK
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
