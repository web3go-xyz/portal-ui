<template>
  <div class="login-wrap">
    <i class="el-icon-close" @click="$router.back()"></i>
    <div class="left">
      <img class="left-bg" src="@/assets/images/login/bg1.png" alt="" />
      <div class="login-main">
        <div class="l-logo">
          <img src="@/assets/images/login/logo@2x.png" alt="" />
        </div>
        <el-form
          ref="loginForm"
          label-position="top"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <div class="btn-wrap">
            <el-button
              :loading="loading"
              size="big"
              type="primary"
              @click.native.prevent="handleLogin"
            >
              <span class="login-txt">Sign In with Wallet</span>
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="right">
      <img class="bg" src="@/assets/images/login/bg3.png" alt="" />
      <div class="bg2"></div>
    </div>
  </div>
</template>

<script>
import {
  web3Accounts,
  web3Enable,
  web3FromSource,
} from "@polkadot/extension-dapp";
import {
  cryptoWaitReady,
  decodeAddress,
  signatureVerify,
} from "@polkadot/util-crypto";
import { u8aToHex } from "@polkadot/util";
export default {
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      loginRules: {
        email: [
          { required: true, trigger: "blur", message: "please input Email" },
          {
            type: "email",
            message: "please input the correct email address",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, trigger: "blur", message: "please input password" },
        ],
      },
      loading: false,
    };
  },
  created() {},
  methods: {
    hexDecode(hex) {
      var j;
      var hexes = hex.match(/.{1,4}/g) || [];
      var back = "";
      for (j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
      }
      return back;
    },
    hexEncode(str) {
      var hex, i;

      var result = "";
      for (i = 0; i < str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
      }

      return result;
    },
    async testSigner() {
      const extensions = await web3Enable("my cool dapp");

      const allAccounts = await web3Accounts();
      this.allAccounts = allAccounts;
      console.log("allAccounts", allAccounts);
      if (this.allAccounts.length) {
        const account = allAccounts[0];

        // to be able to retrieve the signer interface from this account
        // we can use web3FromSource which will return an InjectedExtension type
        const injector = await web3FromSource(account.meta.source);
        // this injector object has a signer and a signRaw method
        // to be able to sign raw bytes
        const signRaw = injector?.signer?.signRaw;

        if (signRaw) {
          // after making sure that signRaw is defined
          // we can use it to sign our message
          let accountAddress = account.address;
          let message = accountAddress;
          message = "challenge message at 20210-11-21 10:00:00";
          let messageEncoded = this.hexEncode(message);
          const { signature } = await signRaw({
            address: accountAddress,
            data: messageEncoded,
            type: "bytes",
          });
          console.log("signature", signature);
          const isValid = await this.isValidSignature(
            message,
            signature,
            accountAddress
          );
          console.log("isValid", isValid);
          //fake account
          let messageFake = accountAddress + "_fake";
          let messageEncodedFake = this.hexEncode(messageFake);
          const isValid_fake = await this.isValidSignature(
            messageFake,
            signature,
            accountAddress
          );
          console.log("isValid_fake", isValid_fake);
        }
      }
    },
    async isValidSignature(message, signature, address) {
      await cryptoWaitReady();
      const publicKey = decodeAddress(address);
      const hexPublicKey = u8aToHex(publicKey);
      return signatureVerify(this.hexEncode(message), signature, hexPublicKey)
        .isValid;
    },
    handleLogin() {
      this.testSigner();
    },
  },
};
</script>

<style lang="less" scoped>
.login-wrap {
  text-align: left;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  .el-icon-close {
    position: absolute;
    right: 24px;
    top: 24px;
    color: white;
    z-index: 3;
    font-size: 32px;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
  }
  .left {
    padding-bottom: 100px;
    position: relative;
    flex: 20;
    background: white;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    .left-bg {
      position: absolute;
      width: 523px;
      height: 266px;
      position: absolute;
      right: -340px;
      top: 0;
    }
    .login-main {
      width: 480px;
      .l-logo {
        margin-bottom: 60px;
        width: 127px;
        height: 44px;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .title {
        margin-bottom: 60px;
        font-size: 70px;
        font-weight: bold;
        color: #292828;
      }
    }
  }
  .right {
    flex: 31;
    position: relative;
    .bg {
      width: 100%;
      height: 100%;
    }
    .bg2 {
      position: absolute;
      left: 40px;
      top: 0;
      bottom: 0;
      right: 66px;
      background-image: url("~@/assets/images/login/bg2.png");
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .btn-wrap {
    margin-top: 35px;
    margin-bottom: 9px;
    /deep/ .el-button {
      width: 100%;
      height: 56px;
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
    }
  }
  .tip {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    color: rgba(41, 40, 40, 0.6);
    .tip-left {
      .sign-up {
        cursor: pointer;
        &:hover {
          opacity: 0.7;
        }
        font-size: 16px;
        color: #38cb98;
      }
    }
    .forget {
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  /deep/ .el-input__inner {
    height: 56px;
    // line-height: 56px;
  }
  /deep/ .el-form-item__label {
    padding: 0;
    font-size: 16px;
    line-height: 32px;
    color: #292828;
  }
  /deep/ .el-form-item__label:before {
    display: none;
  }
  /deep/ .el-icon-user {
    &::before {
      display: none;
    }
    background-image: url("~@/assets/images/login/email.png");
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;
  }
  /deep/ .el-icon-lock {
    &::before {
      display: none;
    }
    background-image: url("~@/assets/images/login/password.png");
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;
  }
  /deep/ .el-input__suffix {
    right: 12px;
  }
}
</style>
