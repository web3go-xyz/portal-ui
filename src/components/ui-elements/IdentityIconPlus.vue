<template>
  <div class="identity-icon-plus">
    <div class="address-icon" @click="copy(address)">
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
    <div class="address" v-if="!showIdentity" @click="copy(address)">
      <div class="address-display" v-if="addressDisplayCompact">
        {{ compactAddress(address) }}
      </div>

      <div class="address-display" v-else>
        {{ address }}
      </div>
    </div>
    <div class="identity" v-if="showIdentity" @click="copy(address)">
      <div class="judgement"></div>
      <el-tooltip placement="top">
        <div slot="content">{{ address }}</div>
        <div class="display">
          {{ identity.display }}
        </div>
      </el-tooltip>
    </div>

    <div class="copy-action"></div>
    <div class="identity-more-info" v-if="showIdentityMoreInfo">
      <div class="legal" v-if="identity.legal" @click="copy(identity.legal)">
        <el-tooltip placement="top">
          <div slot="content">{{ identity.legal }}</div>
          <span class="material-icons"> verified_user </span>
        </el-tooltip>
      </div>
      <div class="email" v-if="identity.email" @click="copy(identity.email)">
        <el-tooltip placement="top">
          <div slot="content">{{ identity.email }}</div>
          <span class="material-icons"> mail_outline </span>
        </el-tooltip>
      </div>
      <div
        class="twitter"
        v-if="identity.twitter"
        @click="copy(identity.twitter)"
      >
        <el-tooltip placement="top">
          <div slot="content">{{ identity.twitter }}</div>
          <img src="@/assets/images/twitter-logo.svg" />
        </el-tooltip>
      </div>
      <div
        class="public-key"
        v-if="identity.accountPublicKey"
        @click="copy(identity.accountPublicKey)"
      >
        <el-tooltip placement="top">
          <div slot="content">{{ identity.accountPublicKey }}</div>
          <span class="material-icons"> key </span>
        </el-tooltip>
      </div>
    </div>
    <div class="tips"></div>
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
    addressDisplayCompact() {
      return this.addressInfo.addressDisplayCompact || false;
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
    identity() {
      return this.addressInfo.identity || {};
    },
    showIdentity() {
      return this.identity && this.identity.display;
    },
    showIdentityMoreInfo() {
      return this.identity && this.identity.showMoreInfo;
    },
  },
  methods: {
    compactAddress(address) {
      if (address && address.length > 20) {
        let subLength = address.length / 5;
        return (
          address.substring(0, subLength) +
          "..." +
          address.substring(address.length - subLength)
        );
      } else {
        return address;
      }
    },
    makeIcon4Ethereum(address) {
      return makeBlockie(address);
    },
    copy(text, notify) {
      if (notify === undefined || notify === null) {
        notify = true;
      }
      const input = document.createElement("input");
      input.id = new Date().getTime();
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
    cursor: pointer;
    .eth-icon {
      border-radius: 2px;
    }
    margin-right: 5px;
  }
  .address {
    padding: 0px 5px;
    .address-display {
      font-size: 18px;
    }
  }

  .identity {
    padding: 0px 5px;
    .judgement {
    }
    .display {
      font-size: 18px;
      text-decoration: underline;
      cursor: pointer;
      font-weight: bold;
    }
  }
  .identity-more-info {
    margin-left: 5px;
    padding-left: 5px;
    border-left: solid 1px #ddd;
    display: flex;
    .legal {
      cursor: pointer;
      padding: 0px 2px;
    }
    .email {
      cursor: pointer;
      padding: 0px 2px;
    }
    .twitter {
      cursor: pointer;
      padding: 0px 2px;
      img {
        height: 20px;
        width: 20px;
      }
    }
    .public-key {
      padding: 0px 2px;
      cursor: pointer;
    }
  }
}
</style>
