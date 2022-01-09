<template>
  <div class="profileDefi">
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
      <Component :is="actComponent"></Component>
    </div>
  </div>
</template>
<script>
import Karura from "./Defi/karura.vue";

export default {
  name: "ProfileDefi",
  data() {
    return {
      actSortIndex: 1,
      actComponent: Karura,
      sortList: [
        {
          name: "All"
        },
        {
          name: "Karura",
          view: Karura
        },
        // {
        //   name: "Others"
        // }
      ]
    };
  },
  components: {
    Karura
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
