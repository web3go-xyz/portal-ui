<template>
  <div class="login-wrap">
    <div class="left">
      <img class="left-bg" src="@/assets/images/login/bg1.png" alt="" />
      <div class="login-main">
        <div class="l-logo"></div>
        <div class="title">New Password</div>
        <el-form
          ref="form"
          label-position="top"
          :model="form"
          :rules="rules"
          class="login-form"
        >
          <el-form-item prop="password" label="Password">
            <el-input
              v-model="form.password"
              :type="input1Show ? 'text' : 'password'"
              auto-complete="off"
            >
              <i
                v-if="input1Show"
                @click="changeInput1Show"
                slot="suffix"
                class="el-input__icon el-icon-lock"
              ></i>
              <i
                v-else
                @click="changeInput1Show"
                slot="suffix"
                class="el-input__icon el-icon-minus"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="rePassword" label="Password Confirm">
            <el-input
              v-model="form.rePassword"
              :type="input2Show ? 'text' : 'password'"
              auto-complete="off"
              @keyup.enter.native="send"
            >
              <i
                v-if="input2Show"
                @click="changeInput2Show"
                slot="suffix"
                class="el-input__icon el-icon-lock"
              ></i>
              <i
                v-else
                @click="changeInput2Show"
                slot="suffix"
                class="el-input__icon el-icon-minus"
              ></i>
            </el-input>
          </el-form-item>
          <div class="btn-wrap">
            <el-button size="big" type="primary" @click.native.prevent="send">
              <span class="login-txt">change Password</span>
            </el-button>
          </div>
          <!-- <div class="tip">
            <div class="tip-left">
              <span>create account?</span>
              <span class="sign-up" @click="$router.push({ name: 'Register' })">
                sign up
              </span>
            </div>
            <span class="forget" @click="$router.push({ name: 'VerifyEmail' })">
              Forget your password?
            </span>
          </div> -->
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
import { changePassword } from "@/api/user";

export default {
  data() {
    const validateRepsd = (rule, value, callback) => {
      if (!value) {
        callback();
        return;
      } else if (value != this.form.password) {
        callback(new Error("password confirm error"));
      } else {
        callback();
      }
    };
    return {
      input1Show: false,
      input2Show: false,
      form: {
        password: "",
        rePassword: "",
      },
      rules: {
        password: [
          { required: true, trigger: "blur", message: "please input password" },
          {
            min: 6,
            message: "Password length is more than 6",
            trigger: "blur",
          },
        ],
        rePassword: [
          { required: true, trigger: "blur", message: "please input password" },
          {
            validator: validateRepsd,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    changeInput1Show() {
      this.input1Show = !this.input1Show;
    },
    changeInput2Show() {
      this.input2Show = !this.input2Show;
    },
    send() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          changePassword({
            userId: this.$route.query.userId,
            code: this.$route.query.code,
            newPassword: this.form.password,
          }).then((d) => {
            if (d) {
              this.$message.success("reset success");
              this.$router.push({ name: "Login" });
            }
          });
        }
      });
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
    cursor: pointer;
    &::before {
      display: none;
    }
    background-image: url("~@/assets/images/login/show.png");
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;
  }
  /deep/ .el-input__suffix {
    right: 12px;
  }
  /deep/ .el-icon-minus {
    cursor: pointer;
    &::before {
      display: none;
    }
    background-image: url("~@/assets/images/login/hide.png");
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
