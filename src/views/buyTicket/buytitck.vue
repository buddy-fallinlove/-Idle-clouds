<template>
  <div class="buy">
    <div class="buy_a">
      <!-- 左边 -->
      <div class="buy_b">
        <div class="biao">乘机人</div>
        <!-- 乘机人 -->
        <div class="biao_b">
          <a-form
            :model="item"
            class="biao_d pos-re"
            action
            v-for="(item,index) in arr"
            :key="index"
            
          >
            <a-form-item :label="item.passenger">
              <a-input v-model:value="item.username" placeholder="姓名" class="username" />
            </a-form-item>
            <a-form-item :label="item.cdcared">
              <div class="d-flex">
                <a-select default-value="身份证" style="width: 130px;">
                  <a-select-option value="护照">护照</a-select-option>
                  <a-select-option value="身份证">身份证</a-select-option>
                </a-select>
                <a-input placeholder="证件号码" default-value v-model:value="item.id" />
              </div>
            </a-form-item>
            <MinusCircleFilled class="delect hover" v-if="index>0" @click="del(index)" />
          </a-form>
          <div class="biao_c">
            <a-button type="primary" @click="addpassenger">添加乘客</a-button>
          </div>
        </div>
        <!-- 保险 -->
        <div class="biao mar-boes">保险</div>
        <div class="biao_e">
          <a-checkbox v-model:checked="checked1" @change="onChange1">航空意外险：￥30/份×1 最高赔付260万</a-checkbox>
        </div>
        <div class="biao_e">
          <a-checkbox v-model:checked="checked2" @change="onChange2">航空延误险：￥30/份×1 最高赔付300元</a-checkbox>
        </div>
        <div class="xian"></div>
        <!-- 联系人 -->
        <div class="biao mar-boes">联系人</div>
        <div class="submit">
          <a-form :model="form" ref="ruleForm" :rules="rules">
            <a-form-item name="username" label="姓名">
              <a-input v-model:value="form.username" class="ai_input" />
            </a-form-item>
            <div class="d-flex">
              <a-form-item name="mobile" label="手机">
                <a-input v-model:value="form.mobile" placeholder="请输入内容" class="msg" />
              </a-form-item>
              <a-button
                class="sendMsg"
                @click="countDown"
                :class="{disabled: !canClick}"
              >{{content}}</a-button>
            </div>
            <a-form-item name="verification" label="验证码">
              <a-input v-model:value="form.verification" class="ai_input" />
            </a-form-item>
          </a-form>
          <div style="width:590px;" class="order">
            <button type="button" class="el-button" @click="order">
              <span>提交订单</span>
            </button>
          </div>
        </div>
      </div>
      <!-- 右边 -->
      <div class="buy_c" v-if="list.seat_infos">
        <div class="buy_d">
          <div class="buy_e">
            <span>{{list.dep_date}}</span>
            <span>
              <span>{{list.org_city_name}}</span> -
              <span>{{list.dst_city_name}}</span>
            </span>
          </div>
          <div class="buy_f">
            <div class="buy_h">
              <div class="buy_g">{{list.dep_time}}</div>
              <div>{{list.dst_airport_name}}{{list.dst_airport_quay}}</div>
            </div>
            <div class="buy_i">
              <div>--- {{list.durationHour}}小时{{list.durationMinutes}}分 ---</div>
              <div>{{list.airline_name}}{{list.flight_no}}</div>
            </div>
            <div class="buy_h">
              <div class="buy_g">{{list.arr_time}}</div>
              <div>{{list.org_airport_name}}{{list.org_airport_quay}}</div>
            </div>
          </div>
        </div>
        <div class="buy_j">
          <span>订单总价</span>
          <span>金额</span>
          <span>数量</span>
        </div>
        <div class="buy_j">
          <span>成人机票</span>
          <span>￥{{list.seat_infos.par_price}}</span>
          <span>x{{arr.length}}</span>
        </div>
        <div class="buy_j">
          <span>机建＋燃油</span>
          <span>¥{{list.airport_tax_audlet}}/人/单程</span>
          <span>x{{arr.length}}</span>
        </div>
        <div class="buy_k">
          <span>应付总额：</span>
          <span
            class="buy_l"
            v-if="checked1 === true && checked2 === true"
          >￥{{(obj.settle_price_coupon+110)*arr.length}}.00</span>
          <span
            class="buy_l"
            v-else-if="checked1 === false && checked2 === false"
          >￥{{(obj.settle_price_coupon+50)*arr.length}}.00</span>
          <span class="buy_l" v-else>￥{{(obj.settle_price_coupon+80)*arr.length}}.00</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  SetupContext,
  onMounted,
} from "vue";
import api from "@/http/api";
import { Rules } from "../login/Login";
import { useRoute, useRouter } from "vue-router";
import { message, notification } from "ant-design-vue";
import dayjs from "dayjs";
interface FormItem {
  username: string;
  mobile: string;
  verification: string;
}
interface Form1Item {
  name?: string;
  cdnumber?: string;
  cdcared?: string;
  username?: string;
  id?: string;
  passenger?: string;
}
interface Data {
  obj: any;
  seatXid: string;
  otaId: number;
  list: object;
  form: FormItem;
  arr: Form1Item[];
  rules: Rules;
  codes: string;
  content: string;
  canClick: boolean;
  totalTime: number;
  token: string;
  checked1: boolean;
  checked2: boolean;
  users: Form1Item;
  ars: number[];
}
export default defineComponent({
  name: "",
  props: {},
  components: {},
  setup(props, ctx: SetupContext) {
    const data: Data = reactive<Data>({
      obj: [],
      ars: [],
      seatXid: "",
      otaId: 1,
      list: {},
      codes: "",
      content: "发送验证码",
      canClick: true,
      totalTime: 60,
      token: "",
      checked1: false,
      checked2: false,
      arr: [{ cdcared: "证件类型", passenger: "乘机人", id: "", username: "" }],
      users: {},
      form: {
        username: "",
        mobile: "",
        verification: "",
      },
      rules: {
        cdcared: [
          {
            pattern:  /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/,
            message: "身份证格式不正确",
            trigger: "change",
          },
        ],
        username: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur",
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机格式不正确",
            trigger: "change",
          },
        ],
        verification: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: () => {
              if (data.form.verification === "") {
                return Promise.reject("请输入验证码");
              } else if (data.form.verification !== data.codes) {
                return Promise.reject("验证码错误");
              } else {
                return Promise.resolve();
              }
            },
          },
        ],
      },
    });
    //使用router
    const route = useRoute();
    const router = useRouter();
    // 获取验证码
    const countDown = (): void => {
      if (data.form.mobile !== "") {
        if (!data.canClick) return; //改动的是这两行代码
        data.canClick = false;
        data.content = data.totalTime + "s后重新发送";
        const clock = window.setInterval(() => {
          data.totalTime--;
          data.content = data.totalTime + "s后重新发送";
          if (data.totalTime < 0) {
            window.clearInterval(clock);
            data.content = "重新发送";
            data.totalTime = 60;
            data.canClick = true; //这里重新开启
          }
        }, 1000);
        api
          .captchas({ tel: data.form.mobile })
          .then((res: any) => {
            data.codes = res.code;
            notification["success"]({
              message: "获取成功",
              description: `你的验证码为：${res.code}`,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        message.error("手机号不能为空");
      }
    };
    // 添加乘机人
    const addpassenger = (): void => {
      const obj = {
        cdcared: "证件类型",
        passenger: "乘机人",
        id: "",
        username: "",
      };
      data.arr.push(obj);
    };
    // 删除乘机人
    const del = (index: number): void => {
      data.arr.splice(index, 1);
    };
    // 买保险1
    const onChange1 = (e: any): void => {
      data.checked1 = e.target.checked;
    };
    // 买保险2
    const onChange2 = (e: any): void => {
      data.checked2 = e.target.checked;
    };
    // 提交订单
    const order = (): void => {
      if (
        data.arr[0].username == "" ||
        data.arr[0].id == "" ||
        data.form.username == "" ||
        data.form.mobile == "" ||
        data.form.verification == ""
      ) {
        message.warning("请输入完整的乘车人或联系人信息");
      } else {
        if (data.token == null) {
          message.warning("系统检测到你未登录，请先登录");
          router.push("/user/login");
        } else {
          const ass: Form1Item[] = [];
          data.arr.map((item: Form1Item) => {
            const obj: Form1Item = {
              username: "",
              id: "",
            };
            obj.username = item.username;
            obj.id = item.id;
            ass.push(obj);
          });
          if (data.checked1 === true && data.checked2 === true) {
            data.ars = [1, 2];
          } else if (data.checked1 === true) {
            data.ars = [1];
          } else if (data.checked2 === true) {
            data.ars = [2];
          } else {
            data.ars = [];
          }
          api
            .airorders({
              users: ass,
              captcha: data.codes,
              insurances: data.ars,
              contactName: data.form.username,
              contactPhone: data.form.mobile,
              invoice: false,
              seat_xid: data.seatXid,
              air: data.otaId,
            })
            .then((res: any) => {
              console.log(res);
              if (res.status == 0) {
                message.success(res.message);
                router.push({
                  path: "/settlement",
                  query: { id: res.data.id },
                });
              } else {
                message.error(res.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    };
    onMounted(() => {
      data.token = localStorage.getItem("token")!;
      if (route.params.buyair) {
        data.obj = JSON.parse(route.params.buyair! as string);
        data.seatXid = data.obj.seat_xid;
        data.otaId = Number(route.params.id! as string);
      }
      //推荐机票
      api
        .choose({
          id: data.otaId,
          seatXid: data.seatXid,
        })
        .then((res: any) => {
          // 将起飞时间转换成Unix 时间戳 (秒)
          const startTime = dayjs(res.dep_datetime).unix();
          // 将到达时间转换成Unix 时间戳 (秒)
          const endTime = dayjs(res.arr_datetime).unix();
          const duration = endTime - startTime;
          if (duration > 0) {
            // 计算出小时数差
            res.durationHour = Math.floor(duration / 60 / 60);
            // 计算出小时数后剩余的秒钟数
            const durationSeconds = duration % 3600;
            // 计算分钟数
            res.durationMinutes = Math.floor(durationSeconds / 60);
          }
          if (duration < 0) {
            // 计算出小时数差
            res.durationHour = Math.floor(duration / 60 / 60) + 24;
            // 计算出小时数后剩余的秒钟数
            const durationSeconds = duration % 3600;
            // 计算分钟数
            res.durationMinutes = Math.floor(durationSeconds / 60) + 60;
          }
          data.list = res;
        })
        .catch((err) => {
          console.log(err);
        });
    });
    return {
      ...toRefs(data),
      addpassenger,
      del,
      countDown,
      order,
      onChange1,
      onChange2,
    };
  },
});
</script>

<style scoped lang='scss'>
.delect {
  position: absolute;
  font-size: 14px;
  color: #dddddd;
  top: 115px;
  right: -30px;
}
.ant-form-item {
  margin-bottom: 15px;
}
.submit {
  border-bottom: 1px dashed #ddd;
  margin-bottom: 20px;
}
.order {
  margin: 50px 0;
  display: flex;
  justify-content: center;
}
.el-button {
  width: 250px;
  height: 50px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #e6a23c;
  border: 1px solid #e6a23c;
  color: #fff;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.sendMsg {
  color: #909399;
  width: 120px;
  height: 40px;
  background: #eee;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.msg {
  height: 40px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 150px;
}
.ai_input {
  width: 270px;
  height: 40px;
}
.submit {
  .ant-row {
    display: flex;
  }
  /deep/.ant-form-item-label {
    width: 80px;
    height: 40px;
    margin-right: 10px;
  }
}

.buy {
  display: flex;
  justify-content: center;
}
.buy_a {
  width: 1000px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
}
.biao {
  font-size: 22px;
  font-weight: 400;
}
.username {
  border-radius: 5px;
  width: 590px;
}
.ant-form-item-label {
  text-align: left;
  margin-right: 0;
}
/deep/.ant-select-selection {
  width: 130px;
  height: 40px;
  display: flex;
  align-items: center;
}
.biao_a {
  font-size: 14px;
  margin: 10px 0;
}
.biao_b {
  width: 590px;
}
.biao_c {
  margin: 40px 0;
}
.biao_d {
  padding: 20px 0;
  border-bottom: 1px dotted #eee;
}
.biao_e {
  padding: 9px 20px 9px 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  line-height: normal;
  height: 40px;
  margin-bottom: 20px;
}
.xian {
  border-bottom: 1px dotted #eee;
  margin: 20px 0;
}
.buy_c {
  width: 350px;
  height: 310px;
  border: 1px solid #ddd;
  font-size: 14px;
}
.buy_d {
  padding: 15px;
}
.buy_e {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.buy_f {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}
.buy_g {
  font-size: 22px;
  font-weight: 400;
}
.buy_h {
  text-align: center;
  width: 22%;
}
.buy_i {
  text-align: center;
  width: 40%;
}
.buy_j {
  border-top: 1px dashed #ddd;
  padding: 10px 15px;
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
}
.buy_k {
  border-top: 1px dashed #ddd;
  padding: 10px 15px;
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.buy_l {
  font-size: 28px;
  color: #e0620d;
}
.ant-input {
  height: 40px;
}
</style>