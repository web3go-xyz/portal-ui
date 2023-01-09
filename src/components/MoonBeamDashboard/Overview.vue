<template>
  <div class="component-wrap">
    <div class="row">
      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/c3fbc52a-343f-45f6-bd40-841f6fa2fe57"
          frameborder="0"
          width="100%"
          height="350"
          allowtransparency
        ></iframe>
      </div>

      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/cc4dbe19-a97d-4a2d-96ea-b73c5d699f32"
          frameborder="0"
          width="100%"
          height="350"
          allowtransparency
        ></iframe>
      </div>
      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/6bfe4a87-2034-457a-b7bc-b3f46e5b46fc"
          frameborder="0"
          width="100%"
          height="350"
          allowtransparency
        ></iframe>
      </div>
      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/633c5aab-9009-41b7-8c33-52410aa80e74"
          frameborder="0"
          width="100%"
          height="350"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/89ceab6e-9028-4fb5-9ec8-60ad9a9dcf6a"
          frameborder="0"
          width="100%"
          height="500"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/4ba55dfa-f461-4a5d-beb7-6d5654fd2161"
          frameborder="0"
          width="100%"
          height="500"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/4b884dee-285c-482b-94e8-6297b3c02a16"
          frameborder="0"
          width="100%"
          height="500"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/ac6d3130-dea4-4990-9eb0-89a52d2ee44f"
          frameborder="0"
          width="100%"
          height="650"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/185cff5d-9baa-4056-94d7-e0cb6d7c4ee2"
          frameborder="0"
          width="100%"
          height="600"
          allowtransparency
        ></iframe>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <iframe
          src="https://mb.web3go.xyz/public/question/4d703600-a8ff-4217-a21d-beef5918c649"
          frameborder="0"
          width="100%"
          height="700"
          allowtransparency
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";
import basApi from "@/api/bas";

export default {
  components: { countTo },
  data() {
    return {
      numData: {},
    };
  },
  created() {
    basApi
      .basOverview({
        apikey: 123456,
      })
      .then((d) => {
        d.total_gas = this.$utils.formatTokenNumber(
          d.total_gas,
          Math.pow(10, d.gas_token_decimals)
        );
        this.numData = d;
      });
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.component-wrap {
  margin-top: 40px;
  .info-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 114px;
    .info {
      background: #ffffff;
      box-shadow: 14px 17px 37px 18px rgba(112, 144, 176, 0.08);
      border-radius: 30px;
      width: 1185px;
      height: 141px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .item {
        flex: 1;
        position: relative;
        &:last-child {
          &::after {
            display: none;
          }
        }
        &::after {
          content: "";
          height: 54px;
          width: 2px;
          background: #e9edf7;
          display: block;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
        .num {
          font-weight: 700;
          font-size: 36px;
          color: #2b3674;
        }
        .label {
          display: block;
          margin-top: 12px;
          font-weight: 500;
          font-size: 16px;
          color: #a3aed0;
        }
      }
    }
  }
  .row {
    display: flex;
    .col {
      flex: 1;
    }
  }
  // .chart {
  //   margin-bottom: 24px;
  //   iframe {
  //     border-radius: 8px;
  //   }
  // }
}
</style>