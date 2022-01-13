<template>
  <div class="identity-icon-plus">
    <div class="address-icon">
      <div v-if="isPolkadot">
        <Identicon :size="iconSize" :theme="'polkadot'" :value="address" />
      </div>
      <div v-if="isEthereum">
        <img
          class="eth-icon"
          v-bind:style="{ width: iconSize + 'px' }"
          :src="makeIcon4Ethereum(address)"
          alt=""
        />
      </div>
    </div>
    <div class="identity-judgement-icon"></div>
    <div class="identity-name"></div>
    <div class="address">
      <div class="address-display">
        {{ address }}
      </div>
    </div>
    <div class="copy-action"></div>
    <div class="more-info">
      <div class="legal-name"></div>
      <div class="email"></div>
      <div class="twitter"></div>
      <div class="public-key"></div>
      <div class="tips"></div>
    </div>
  </div>
</template>

<script>
import Identicon from "@polkadot/vue-identicon";
import makeBlockie from "ethereum-blockies-base64";
export default {
  components: { Identicon },
  name: "Identity-Icon-Plus",
  props: {
    addressInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  created() {},
  computed: {
    iconSize() {
      return this.addressInfo.iconSize || 32;
    },
    address() {
      return this.addressInfo.address;
    },
    isPolkadot() {
      if (this.addressInfo.isEthereum === true) {
        return false;
      }
      return this.addressInfo.isPolkadot || true;
    },
    isEthereum() {
      return this.addressInfo.isEthereum || false;
    },
  },
  methods: {
    makeIcon4Ethereum(address) {
      return makeBlockie(address);
    },
    copy(text, notify) {
      if (notify === undefined || notify === null) {
        notify = true;
      }
      const input = document.createElement("input-Identity-Icon-Plus");
      document.body.appendChild(input);
      input.setAttribute("value", text);
      input.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        if (notify) {
          this.$notify({
            message: "Copied Success",
            position: "bottom-left",
            showClose: false,
            duration: 1000,
            type: "success",
          });
        }
      }
      document.body.removeChild(input);
    },
  },
};
</script>

<style lang="less" scoped>
.identity-icon-plus {
  display: flex;
  align-items: center;
  .address-icon {
    .eth-icon {
      border-radius: 2px;
    }
    margin-right: 5px;
  }
}
</style>
