<template>
  <div class="container">
    <div data-v-edb404ec class="main">
      <div data-v-edb404ec class="pay-title">
        支付总金额
        <span data-v-edb404ec class="pay-price">￥ {{price}}</span>
      </div>
      <div data-v-edb404ec class="pay-main">
        <h4 data-v-edb404ec>微信支付</h4>
        <div
          data-v-edb404ec
          class="pay-qrcode el-row is-justify-space-between is-align-middle el-row--flex"
        >
          <div data-v-edb404ec class="qrcode">
            <img
              :src="imgUrl"
              id="qrcode-stage"
              height="200"
              width="200"
              style="height: 200px; width: 200px;"
            />
            <p data-v-edb404ec>请使用微信扫一扫</p>
            <p data-v-edb404ec>扫描二维码支付</p>
          </div>
          <div data-v-edb404ec class="pay-example">
            <img data-v-edb404ec src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  defineComponent,
  reactive,
  toRefs,
  SetupContext,
  onMounted,
} from "vue";
import api from "@/http/api";
import { useRoute } from "vue-router";
import QRCode from "qrcode";
import { message, Modal } from "ant-design-vue";
interface Data {
  imgUrl: string;
  price: string;
}
export default defineComponent({
  name: "",
  props: {},
  components: {},
  setup(props, ctx: SetupContext) {
    let data: Data = reactive<Data>({
      imgUrl: "",
      price: "",
    });
    const route = useRoute();
    onMounted(() => {
      const id = Number(route.query.id! as string);
      api
        .airorderDetail(id)
        .then((res: any) => {
          console.log(res);
          data.price = res.price;
          QRCode.toDataURL(res.payInfo.code_url).then((res: string) => {
            data.imgUrl = res;
          });
          const myInterval = setInterval(() => {
            api
              .checkpay({
                id: Number(res.id),
                nonce_str: Number(res.price),
                out_trade_no: res.orderNo,
              })
              .then((res: any) => {
                console.log(res);
                if (res.trade_state === "SUCCESS") {
                  clearInterval(myInterval);
                  Modal.success({
                    title: "提示",
                    content: "支付成功，感谢0.01巨款",
                  });
                } else {
                  message.warning("订单未支付，请尽快支付")
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }, 5000);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style scoped lang='scss'>
.container {
  background: #f5f5f5;
  width: 100%;
  height: 100%;
  padding: 30px 0;
  margin: 0;
}
.main[data-v-edb404ec] {
  width: 1000px;
  margin: 0 auto;
}
.main .pay-title[data-v-edb404ec] {
  text-align: right;
}
.main .pay-title span[data-v-edb404ec] {
  font-size: 28px;
  color: #ff4500;
}
.main .pay-main[data-v-edb404ec] {
  background: #fff;
  margin-top: 10px;
  border-top: 5px solid orange;
  padding: 30px;
}
.main .pay-main .pay-qrcode[data-v-edb404ec] {
  padding: 0 80px;
}
h4[data-v-edb404ec] {
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 10px;
}
.el-row--flex.is-align-middle {
  align-items: center;
}
.el-row--flex.is-justify-space-between {
  justify-content: space-between;
}
.el-row--flex {
  display: flex;
}
.el-row {
  box-sizing: border-box;
}
.main .pay-main .qrcode[data-v-edb404ec] {
  border: 1px solid #ddd;
  padding: 15px;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
}
.main .pay-main .qrcode #qrcode-stage[data-v-edb404ec] {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
}
.main .pay-main .qrcode p[data-v-edb404ec] {
  line-height: 2;
  text-align: center;
}
</style>