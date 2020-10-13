<template>
  <div class="container">
    <div class="air_title">
      <DingtalkOutlined />
      <span>国内机票</span>
    </div>
    <div class="flex-j-sb">
      <div class="search_form">
        <div class="search-tab hover">
          <span class="activea search_item">
            <ReloadOutlined class="padd_r" />单程
          </span>
          <span data-v-7dab4474 class="search_item hover" @click="warn">
            <SyncOutlined class="padd_r" />往返
          </span>
        </div>
        <div class="search_form_content">
          <div>
            <span class="padd-l">出发城市</span>
            <a-select
              show-search
              v-model:value="value1"
              placeholder="请搜索出发城市"
              style="width: 215px"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleSearch1"
              @change="handleChange1"
              class="picker"
            >
              <a-select-option v-for="d in data1" :key="d.sortName">{{
                d.name
              }}</a-select-option>
            </a-select>
          </div>
          <div class="marg-topss">
            <span class="padd-l">到达城市</span>
            <a-select
              show-search
              v-model:value="value2"
              placeholder="请搜索到达城市"
              style="width: 215px"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleSearch2"
              @change="handleChange2"
              class="picker"
            >
              <a-select-option v-for="d in data2" :key="d.sortName">{{
                d.name
              }}</a-select-option>
            </a-select>
          </div>
          <div class="marg-topss">
            <span class="padd-l">出发时间</span>
            <a-date-picker
              v-model:value="date"
              :disabled-date="disabledDate"
              placeholder="请选择日期"
              @change="onChangeDate"
              class="picker"
            />
          </div>
          <div class="search flex-cent marg-topss hover" @click="search">
            <SearchOutlined class="marg-ris" />搜索
          </div>
          <div class="jiaohuan">
            <div class="top-line"></div>
            <div class="line"></div>
            <div class="exchange flex-cent hover" @click="exchange">换</div>
            <div class="line"></div>
            <div class="top-line"></div>
          </div>
        </div>
      </div>
      <div class="sale-banner">
        <img src="http://157.122.54.189:9093/images/pic_sale.jpeg" />
      </div>
    </div>
    <div data-v-4b1fa026 class="statement el-row el-row--flex">
      <div data-v-4b1fa026 class="el-col el-col-8">
        <ReadFilled style="color: rgb(64, 158, 255); font-size: 20px" />
        <span data-v-4b1fa026>100%航协认证</span>
      </div>
      <div data-v-4b1fa026 class="el-col el-col-8">
        <SafetyCertificateFilled style="color: green; font-size: 20px" />
        <span data-v-4b1fa026>出行保证</span>
      </div>
      <div data-v-4b1fa026 class="el-col el-col-8">
        <PhoneFilled style="color: rgb(64, 158, 255); font-size: 20px" />
        <span data-v-4b1fa026>7x24小时服务</span>
      </div>
    </div>
    <div class="special"><TwitterCircleFilled />特价机票</div>
    <div class="paddes flex-j-sb air-sale">
      <div v-for="item in specialTicket" :key="item.id">
        <div class="pos-re hover" @click="chooseAir(item)">
          <img :src="specialTicket[0].cover" alt class="specialImg" />
          <div class="layer-bar flex-j-sa">
            <span>{{ item.departCity }}-{{ item.destCity }}</span>
            <span>￥{{ item.price }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, render, toRefs } from "vue";
import { message } from "ant-design-vue";
import api from "@/http/api";
import { useRouter } from "vue-router";
import moment from "moment";
import dayjs from "dayjs";
interface Data {
  date: string;
  value1: string;
  value2: string;
  data1: any[];
  data2: any[];
  disabledDate: any;
  specialTicket: any[];
  obj: any;
  departDate: string;
}
export default {
  setup() {
    const data: Data = reactive<Data>({
      date: "",
      value1: "",
      value2: "",
      data1: [],
      data2: [],
      specialTicket: [],
      obj: {
        departCity: "",
        departCode: "",
        departDate: "",
        destCity: "",
        destCode: "",
      },
      departDate: "",
      disabledDate(current: any) {
        return current && current <= moment().subtract("day", 1);
      },
    });
    const router = useRouter();
    const handleSearch1 = (value: string): void => {
      data.value1 = value;
      api
        .citySort(value)
        .then((res: any) => {
          res.data.map((item: any) => {
            item.sortName = item.sort + "-" + item.name;
          });
          data.data1 = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const handleChange1 = (value: any): void => {
      data.obj.departCode = value.substring(0, value.indexOf("-"));
      data.obj.departCity = value.substring(
        value.indexOf("-") + 1,
        value.length - 1
      );
    };
    const handleSearch2 = (value: string): void => {
      data.value2 = value;
      api
        .citySort(value)
        .then((res: any) => {
          res.data.map((item: any) => {
            item.sortName = item.sort + "-" + item.name;
          });
          data.data2 = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const handleChange2 = (value: any): void => {
      if (data.obj.destCity == data.obj.departCity) {
        message.warning("出发和到达城市不能一样");
      } else {
        data.obj.destCode = value.substring(0, value.indexOf("-"));
        data.obj.destCity = value.substring(
          value.indexOf("-") + 1,
          value.length - 1
        );
      }
    };
    const onChangeDate = (value: string): void => {
      data.obj.departDate = dayjs(value).format("YYYY-MM-DD");
    };
    const warn = (): void => {
      message.warning("暂不支持往返机票！");
    };
    const exchange = (): void => {
      const val1 = data.obj.departCity;
      const val2 = data.obj.destCity;
      data.value2 = val1;
      data.value1 = val2;
    };
    const search = (): void => {
      if (data.value1 == "") {
        message.warning("请输入出发城市");
      } else if (data.value2 == "") {
        message.warning("请输入到达城市");
      } else if (data.date == "") {
        message.warning("请输入出发时间");
      } else {
        router.push({
          name: "ChooseAir",
          params: { plane: JSON.stringify(data.obj) },
        });
        if (localStorage.getItem("history")) {
          const arr = JSON.parse(localStorage.getItem("history")!);
          const ass = arr.map((item: any) => {
            return (
              item.departCity == data.obj.departCity &&
              item.departDate == data.obj.departDate &&
              item.destCity == data.obj.destCity
            );
          });
          if (ass.length === 0) {
            arr.push(data.obj);
          }
        } else {
          const arr = [];
          arr.push(data.obj);
          localStorage.setItem("history", JSON.stringify(arr));
        }
      }
    };
    const chooseAir = (item: any): void => {
      router.push({
        name: "ChooseAir",
        params: { plane: JSON.stringify(item) },
      });
    };
    onMounted(() => {
      api
        .airsSale()
        .then((res: any) => {
          data.specialTicket = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    });
    return {
      ...toRefs(data),
      handleSearch1,
      handleChange1,
      handleSearch2,
      handleChange2,
      onChangeDate,
      warn,
      exchange,
      chooseAir,
      search,
    };
  },
};
</script>

<style lang="scss">
@import "../../style/ticket/ticket.scss";
</style>