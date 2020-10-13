<template>
  <div class="choose">
    <div class="choose_a">
      <!-- 左边 -->
      <div class="choose_b">
        <!-- 筛选 -->
        <div class="xuan">
          <div class="xuan_a">
            <div class="xuan_b">
              <span>单程 {{departCity}}-{{destCity}}</span> /
              <span>{{departDate}}</span>
            </div>
            <!-- 选择 -->
            <div v-if="list.options">
              <!--起飞机场  -->
              <a-select
                :size="size"
                placeholder="起飞机场"
                style="width:100px"
                @change="company"
                v-model:value="orgAirports"
              >
                <a-select-option v-for="(item) in list.options.airport" :key="item">{{item}}</a-select-option>
              </a-select>
              <!-- 起飞时间 -->
              <a-select
                :size="size"
                placeholder="起飞时间"
                style="width: 120px"
                class="marg-les"
                @change="company"
                v-model:value="flightTime"
              >
                <a-select-option
                  v-for="(item) in list.options.flightTimes"
                  :key="item.section"
                >{{item.from}}:00 - {{item.to}}:00</a-select-option>
              </a-select>
              <!-- 航空公司 -->
              <a-select
                :size="size"
                placeholder="航空公司"
                style="width: 100px"
                class="marg-les"
                @change="company"
                v-model:value="companys"
              >
                <a-select-option v-for="(item) in list.options.company" :key="item">{{item}}</a-select-option>
              </a-select>
              <!-- 机型 -->
              <a-select
                :size="size"
                placeholder="机型"
                style="width: 100px"
                class="marg-les"
                @change="company"
                v-model:value="planeSizes"
              >
                <a-select-option value="L">大</a-select-option>
                <a-select-option value="M">中</a-select-option>
                <a-select-option value="S">小</a-select-option>
              </a-select>
            </div>
          </div>
          <div class="xuan_c">
            筛选：
            <a-button type="primary" shape="round" size="small" @click="revoke">撤销</a-button>
          </div>
        </div>
        <!--机票信息-->
        <div class="titck">
          <div class="titck_a">航空信息</div>
          <div class="titck_a">起飞时间</div>
          <div class="titck_a">到达时间</div>
          <div class="titck_a">价格</div>
        </div>
        <!--机票列表-->
        <div class="titck_b" v-if="flights.length>0">
          <div
            class="titck_c"
            v-for="(item,index) in flights.slice((current-1)*pageSize, current*pageSize)"
            :key="index"
          >
            <!--显示-->
            <div class="titck_d" @click="watch(index)">
              <div class="titck_e">
                <div class="titck_f">
                  {{item.airline_name}}
                  <span>{{item.flight_no}}</span>
                </div>
                <div class="titck_g">
                  <div class="titck_h">
                    <div class="titck_i">
                      <div class="titck_j">{{item.dep_time}}</div>
                      <span>{{item.org_airport_name}}{{item.org_airport_quay}}</span>
                    </div>
                    <div class="titck_i">
                      <span class="titck_k">{{item.durationHour}}小时{{item.durationMinutes}}分</span>
                    </div>
                    <div class="titck_i">
                      <div class="titck_j">{{item.arr_time}}</div>
                      <span>{{item.dst_airport_name}}{{item.dst_airport_quay}}</span>
                    </div>
                  </div>
                </div>
                <div>
                  ￥
                  <span class="titck_l">{{item.seat_infos[0].org_settle_price_child}}</span>起
                </div>
              </div>
            </div>
            <!--隐藏-->
            <div class="hide" v-if="currentIndex == index">
              <div class="hide_a">
                <div class="hide_b">低价推荐</div>
                <div class="hide_c">
                  <!-- 小列表 -->
                  <div
                    class="hide_d"
                    v-for="(item1,index1) in item.seat_infos"
                    :key="index1"
                    @click="buy(item1,item.id)"
                  >
                    <div class="hide_e">
                      <span>{{item1.group_name}}</span>
                      | {{item1.supplierName}}
                    </div>
                    <div class="hide_f">￥{{item1.settle_price}}</div>
                    <div class="hide_g">
                      <div>
                        <a-button type="danger" size="small">选定</a-button>
                      </div>
                      <div>剩余：{{item1.discount}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-j-c marg-tops">
            <a-pagination
              :page-size-options="pageSizeOptions"
              :total="flights.length"
              show-size-changer
              show-quick-jumper
              v-model:current="current"
              v-model:pageSize="pageSize"
              :show-total="total => `共 ${total} 条`"
            >
              <template v-slot:buildOptionText="props">
                <span>{{ props.value }}条/页</span>
              </template>
            </a-pagination>
          </div>
        </div>
        <div v-else style="text-align: center;">暂无数据</div>
      </div>
      <!-- 右边 -->
      <div class="choose_c">
        <!-- 资质 -->
        <div class="choose_d">
          <div class="choose_e">
            <div class="choose_f">
              <img src="../../image/huizhang.png" alt />
              <div>航协认证</div>
            </div>
            <div class="choose_f">
              <img src="../../image/renzheng.png" alt />
              <div>出行保证</div>
            </div>
            <div class="choose_f">
              <img src="../../image/phonenew.png" alt />
              <div>7x24</div>
            </div>
          </div>
          <div class="choose_g">免费客服电话：4006345678转2</div>
        </div>
        <!-- 历史记录 -->
        <div class="choose_h">
          <div class="choose_i">历史查询</div>
          <div v-for="(item, index) in Ars" :key="index" class="chaxun flex-j-sb">
            <div>
              <div>{{ item.departCity }} - {{ item.destCity }}</div>
              <div class="marg-topw date">{{ item.departDate }}</div>
            </div>
            <div class="choice flex-cent" @click="choices(item)">选择</div>
          </div>
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
  watch,
} from "vue";
import api from "@/http/api";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
interface Data {
  value: string;
  obj: any;
  departCity: string;
  departCode: string;
  departDate: string;
  destCity: string;
  destCode: string;
  list: object;
  size: string;
  total: number;
  pageSizeOptions: string[];
  current: number;
  pageSize: number;
  flights: any[];
  flightss: any[];
  currentIndex: number;
  orgAirports: string;
  flightTime: string;
  companys: string;
  planeSizes: string;
  Ars: string[];
}
export default defineComponent({
  name: "ChooseAir",
  props: {},
  components: {},
  setup(props, ctx: SetupContext) {
    const data: Data = reactive<Data>({
      orgAirports: "",
      Ars: [],
      flightTime: "",
      companys: "",
      planeSizes: "",
      currentIndex: -1,
      value: "",
      obj: [],
      departCity: "",
      departCode: "",
      departDate: "",
      destCity: "",
      destCode: "",
      list: {},
      size: "small",
      total: 0,
      pageSizeOptions: ["10", "20", "30", "40"],
      pageSize: 10,
      current: 1,
      flights: [],
      flightss: [],
    });
    //使用router
    const route = useRoute();
    onMounted(() => {
      data.Ars = JSON.parse(localStorage.getItem("history")!);
      if (route.params.plane) {
        data.obj = JSON.parse(route.params.plane! as string);
        data.departCity = data.obj.departCity;
        data.departCode = data.obj.departCode;
        data.departDate = data.obj.departDate;
        data.destCity = data.obj.destCity;
        data.destCode = data.obj.destCode;
      }
      //推荐机票
      api
        .airslist({
          departCity: data.departCity,
          departCode: data.departCode,
          departDate: data.departDate,
          destCity: data.destCity,
          destCode: data.destCode,
        })
        .then((res: any) => {
          res.options.flightTimes.map((item: any) => {
            item.section = item.from + "-" + item.to;
          });
          res.flights.map((item: any) => {
            // 将起飞时间转换成Unix 时间戳 (秒)
            const startTime = dayjs(item.dep_datetime).unix();
            // 将到达时间转换成Unix 时间戳 (秒)
            const endTime = dayjs(item.arr_datetime).unix();
            const duration = endTime - startTime;
            if (duration > 0) {
              // 计算出小时数差
              item.durationHour = Math.floor(duration / 60 / 60);
              // 计算出小时数后剩余的秒钟数
              const durationSeconds = duration % 3600;
              // 计算分钟数
              item.durationMinutes = Math.floor(durationSeconds / 60);
            }
            if (duration < 0) {
              // 计算出小时数差
              item.durationHour = Math.floor(duration / 60 / 60) + 24;
              // 计算出小时数后剩余的秒钟数
              const durationSeconds = duration % 3600;
              // 计算分钟数
              item.durationMinutes = Math.floor(durationSeconds / 60) + 60;
            }
          });
          res.flights.map((item: any) => {
            if (item.dep_time[0] == 0) {
              item.depTime = item.dep_time.substring(
                1,
                item.dep_time.indexOf(":")
              );
            } else {
              item.depTime = item.dep_time.substring(
                0,
                item.dep_time.indexOf(":")
              );
            }
          });
          data.list = res;
          data.flights = res.flights;
          data.flightss = res.flights;
        });
    });
    const choices = (item: any): void =>{
      api
        .airslist({
          departCity: item.departCity,
          departCode: item.departCode,
          departDate: item.departDate,
          destCity: item.destCity,
          destCode: item.destCode,
        })
        .then((res: any) => {
          res.options.flightTimes.map((item: any) => {
            item.section = item.from + "-" + item.to;
          });
          res.flights.map((item: any) => {
            // 将起飞时间转换成Unix 时间戳 (秒)
            const startTime = dayjs(item.dep_datetime).unix();
            // 将到达时间转换成Unix 时间戳 (秒)
            const endTime = dayjs(item.arr_datetime).unix();
            const duration = endTime - startTime;
            if (duration > 0) {
              // 计算出小时数差
              item.durationHour = Math.floor(duration / 60 / 60);
              // 计算出小时数后剩余的秒钟数
              const durationSeconds = duration % 3600;
              // 计算分钟数
              item.durationMinutes = Math.floor(durationSeconds / 60);
            }
            if (duration < 0) {
              // 计算出小时数差
              item.durationHour = Math.floor(duration / 60 / 60) + 24;
              // 计算出小时数后剩余的秒钟数
              const durationSeconds = duration % 3600;
              // 计算分钟数
              item.durationMinutes = Math.floor(durationSeconds / 60) + 60;
            }
          });
          res.flights.map((item: any) => {
            if (item.dep_time[0] == 0) {
              item.depTime = item.dep_time.substring(
                1,
                item.dep_time.indexOf(":")
              );
            } else {
              item.depTime = item.dep_time.substring(
                0,
                item.dep_time.indexOf(":")
              );
            }
          });
          data.list = res;
          data.flights = res.flights;
          data.flightss = res.flights;
        });
    }
    //使用router
    const router = useRouter();
    // 点击购买
    const buy = (item1: any, id: string) => {
      router.push({
        name: "BuyTicket",
        params: { buyair: JSON.stringify(item1), id: id },
      });
    };
    // 撤销
    const revoke = (): void => {
      data.orgAirports = "";
      data.flightTime = "";
      data.companys = "";
      data.planeSizes = "";
      data.flights = data.flightss;
    };
    // 航空公司
    const company = (): void => {
      if (
        data.flightTime !== "" &&
        data.companys === "" &&
        data.orgAirports === "" &&
        data.planeSizes === ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          const from = data.flightTime.substring(
            0,
            data.flightTime.indexOf("-")
          );
          const to = data.flightTime.substring(
            data.flightTime.indexOf("-") + 1,
            data.flightTime.length
          );
          return (
            Number(item.depTime) < Number(to) &&
            Number(item.depTime) >= Number(from)
          );
        });
      } else if (
        data.flightTime !== "" &&
        data.companys !== "" &&
        data.orgAirports === "" &&
        data.planeSizes === ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          const from = data.flightTime.substring(
            0,
            data.flightTime.indexOf("-")
          );
          const to = data.flightTime.substring(
            data.flightTime.indexOf("-") + 1,
            data.flightTime.length
          );
          return (
            item.airline_name == data.companys &&
            Number(item.depTime) < Number(to) &&
            Number(item.depTime) >= Number(from)
          );
        });
      } else if (
        data.flightTime !== "" &&
        data.companys !== "" &&
        data.orgAirports !== "" &&
        data.planeSizes === ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          const from = data.flightTime.substring(
            0,
            data.flightTime.indexOf("-")
          );
          const to = data.flightTime.substring(
            data.flightTime.indexOf("-") + 1,
            data.flightTime.length
          );
          return (
            item.org_airport_name == data.orgAirports &&
            item.airline_name == data.companys &&
            Number(item.depTime) < Number(to) &&
            Number(item.depTime) >= Number(from)
          );
        });
      } else if (
        data.flightTime !== "" &&
        data.companys !== "" &&
        data.orgAirports === "" &&
        data.planeSizes !== ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          const from = data.flightTime.substring(
            0,
            data.flightTime.indexOf("-")
          );
          const to = data.flightTime.substring(
            data.flightTime.indexOf("-") + 1,
            data.flightTime.length
          );
          return (
            item.plane_size == data.planeSizes &&
            item.airline_name == data.companys &&
            Number(item.depTime) < Number(to) &&
            Number(item.depTime) >= Number(from)
          );
        });
      } else if (
        data.flightTime !== "" &&
        data.companys !== "" &&
        data.orgAirports !== "" &&
        data.planeSizes !== ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          const from = data.flightTime.substring(
            0,
            data.flightTime.indexOf("-")
          );
          const to = data.flightTime.substring(
            data.flightTime.indexOf("-") + 1,
            data.flightTime.length
          );
          return (
            item.plane_size == data.planeSizes &&
            item.org_airport_name == data.orgAirports &&
            item.airline_name == data.companys &&
            Number(item.depTime) < Number(to) &&
            Number(item.depTime) >= Number(from)
          );
        });
      } else if (
        data.flightTime !== "" &&
        data.companys === "" &&
        data.orgAirports !== "" &&
        data.planeSizes === ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          const from = data.flightTime.substring(
            0,
            data.flightTime.indexOf("-")
          );
          const to = data.flightTime.substring(
            data.flightTime.indexOf("-") + 1,
            data.flightTime.length
          );
          return (
            item.org_airport_name == data.orgAirports &&
            item.airline_name == data.companys &&
            Number(item.depTime) < Number(to) &&
            Number(item.depTime) >= Number(from)
          );
        });
      } else if (
        data.flightTime !== "" &&
        data.companys === "" &&
        data.orgAirports !== "" &&
        data.planeSizes !== ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          const from = data.flightTime.substring(
            0,
            data.flightTime.indexOf("-")
          );
          const to = data.flightTime.substring(
            data.flightTime.indexOf("-") + 1,
            data.flightTime.length
          );
          return (
            item.plane_size == data.planeSizes &&
            item.org_airport_name == data.orgAirports &&
            Number(item.depTime) < Number(to) &&
            Number(item.depTime) >= Number(from)
          );
        });
      } else if (
        data.flightTime !== "" &&
        data.companys === "" &&
        data.orgAirports === "" &&
        data.planeSizes !== ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          const from = data.flightTime.substring(
            0,
            data.flightTime.indexOf("-")
          );
          const to = data.flightTime.substring(
            data.flightTime.indexOf("-") + 1,
            data.flightTime.length
          );
          return (
            item.plane_size == data.planeSizes &&
            Number(item.depTime) < Number(to) &&
            Number(item.depTime) >= Number(from)
          );
        });
      } else if (
        data.flightTime === "" &&
        data.companys !== "" &&
        data.orgAirports === "" &&
        data.planeSizes === ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          return item.airline_name == data.companys;
        });
      } else if (
        data.flightTime === "" &&
        data.companys !== "" &&
        data.orgAirports !== "" &&
        data.planeSizes === ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          return (
            item.org_airport_name == data.orgAirports &&
            item.airline_name == data.companys
          );
        });
      } else if (
        data.flightTime === "" &&
        data.companys !== "" &&
        data.orgAirports !== "" &&
        data.planeSizes !== ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          return (
            item.org_airport_name == data.orgAirports &&
            item.airline_name == data.companys &&
            item.plane_size == data.planeSizes
          );
        });
      } else if (
        data.flightTime === "" &&
        data.companys !== "" &&
        data.orgAirports === "" &&
        data.planeSizes !== ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          return (
            item.airline_name == data.companys &&
            item.plane_size == data.planeSizes
          );
        });
      } else if (
        data.flightTime === "" &&
        data.companys === "" &&
        data.orgAirports !== "" &&
        data.planeSizes == ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          return item.org_airport_name == data.orgAirports;
        });
      } else if (
        data.flightTime === "" &&
        data.companys == "" &&
        data.orgAirports !== "" &&
        data.planeSizes !== ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          return (
            item.org_airport_name == data.orgAirports &&
            item.plane_size == data.planeSizes
          );
        });
      } else if (
        data.flightTime === "" &&
        data.companys === "" &&
        data.orgAirports === "" &&
        data.planeSizes !== ""
      ) {
        data.flights = data.flightss.filter((item: any) => {
          return item.plane_size == data.planeSizes;
        });
      }
    };
    // 展开
    const watch = (index: number) => {
      if (data.currentIndex == index) {
        data.currentIndex = -1;
      } else {
        data.currentIndex = index;
      }
    };
    return {
      ...toRefs(data),
      buy,
      company,
      watch,
      revoke,
      choices,
    };
  },
});
</script>

<style scoped lang='scss'>
.chaxun {
  padding: 10px 0;
  align-items: center;
}
.date {
  font-size: 12px;
  color: #666;
}
.choice {
  color: #fff;
  display: block;
  padding: 2px 10px;
  background: orange;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

/deep/.ant-select {
  margin-left: 10px;
  line-height: 28px;
}
.choose {
  display: flex;
  justify-content: center;
  margin: 20px auto;
}
.choose_a {
  width: 1000px;
  display: flex;
  justify-content: space-between;
}
.choose_b {
  width: 745px;
  font-size: 14px;
}
.xuan {
  margin-bottom: 20px;
}
.xuan_a {
  display: flex;
  justify-content: space-between;
}
.xuan_b {
  width: 33.33333%;
}
.xuan_c {
  margin-top: 10px;
}
.titck {
  padding: 0 15px;
  border: 1px solid #ddd;
  background: #f6f6f6;
  height: 38px;
  line-height: 38px;
  color: #666;
  font-size: 12px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-around;
}
.titck_a {
  width: 21%;
  text-align: center;
}
.titck_b {
  font-size: 14px;
}
.titck_c {
  border: 1px solid #ddd;
  margin-bottom: 10px;
}
.titck_e {
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.titck_g {
  width: 50%;
}
.titck_h {
  padding: 0 30px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.titck_i {
  width: 33%;
}
.titck_i span {
  font-size: 12px;
}
.titck_j {
  font-size: 24px;
  font-weight: 400;
}
.titck_k {
  display: inline-block;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  color: #999;
}
.titck_l {
  font-size: 24px;
  color: #e0620d;
  margin: 0 2px;
}

.hide {
  background: #f6f6f6;
  border-top: 1px solid #eee;
  padding: 0 20px;
}
.hide_a {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.hide_b {
  width: 16%;
}
.hide_c {
  width: 83%;
}
.hide_d {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.hide_e {
  width: 66%;
  font-size: 12px;
}
.hide_e span {
  padding-left: 10px;
}
.hide_f {
  font-size: 20px;
  color: #e0620d;
}
.hide_g {
  text-align: center;
  color: #666;
  width: 12%;
}

.choose_c {
  width: 240px;
}
.choose_d {
  border: 1px solid #ddd;
  font-size: 14px;
}
.choose_e {
  padding-top: 10px;
  display: flex;
  justify-content: space-around;
}
.choose_f {
  text-align: center;
}
.choose_g {
  height: 32px;
  line-height: 32px;
  background: #f6f6f6;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
.choose_h {
  border: 1px solid #ddd;
  padding: 10px;
  margin-top: 10px;
}
.choose_i {
  font-size: 16px;
  font-weight: 400;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
</style>