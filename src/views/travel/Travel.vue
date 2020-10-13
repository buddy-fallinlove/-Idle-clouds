<template>
  <div class="container_box pos-re flex-j-sb">
    <div class="content_left">
      <div v-for="(item,index) in citiesList" :key="index" class="menu">
        <div class="menu_item flex-j-sb flex-a-c" :class="index>0?'noneBorder':''">
          <div>{{item.type}}</div>
          <div>
            <RightOutlined />
          </div>
        </div>
        <div class="paddten pos-ab desc">
          <div v-for="(item1,index1) in item.children" :key="index1" class="flex-a-c padd-tobo">
            <i>{{index1+1}}</i>
            <div class="city under">{{item1.city}}</div>
            <div class="under">{{item1.desc}}</div>
          </div>
        </div>
      </div>
      <div class="recommend">推荐城市</div>
      <img src="http://157.122.54.189:9093/images/pic_sea.jpeg" alt class="img_left" />
    </div>
    <div class="content_right">
      <div class="search1 flex-j-sb">
        <input
          type="text"
          placeholder="请输入想去的地方，比如:'广州'"
          class="input"
          v-model="value"
          @keydown.enter="search"
        />
        <SearchOutlined class="SearchOutlined" />
      </div>
      <div class="search_recommend">
        <span>推荐：</span>
        <span class="padd_r">广州</span>
        <span class="padd_r">北京</span>
        <span class="padd_r">上海</span>
      </div>
      <div class="flex-j-sb recommend_strategy">
        <div class="xxxx flex-a-c">推荐攻略</div>
        <button type="button" class="el-button">
          <EditOutlined />
          <span class="marg-les" @click="create">写游记</span>
        </button>
        <div class="line"></div>
      </div>
      <div
        class="padd-tbes"
        v-for="(item,index) in postsList.slice((current-1)*pageSize, current*pageSize)"
        :key="index"
      >
        <div v-if="item.images.length==1" class="d-flex">
          <div v-for="(item1,index1) in item.images" :key="index1" class="marg-ries image-wai">
            <img :src="item1" class="images hvr-grow" />
          </div>
          <div class="left-msg">
            <div class="title" @click="postsDetail(item.id)">{{item.title}}</div>
            <p class="post-desc">{{item.summary}}</p>
            <div class="flex-j-sb marg-tops flex-a-c">
              <div class="flex-a-c fsse">
                <div>
                  <EnvironmentOutlined />
                  <span class="padd-lr">{{item.cityName}}</span>
                </div>
                <div class="padd-lr hover" @click="personal">
                  <span>by</span>
                  <img
                    :src="`http://157.122.54.189:9095${item.account.defaultAvatar}`"
                    alt
                    class="account_img"
                  />
                  <span class="orange">{{item.account.nickname}}</span>
                </div>
                <div class="padd-lr">
                  <EyeOutlined />
                  <span class="padd-lr">{{item.watch}}</span>
                </div>
              </div>
              <div class="orange">
                <span v-if="item.like">{{item.like}}点赞</span>
                <span v-else>0点赞</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="title" @click="postsDetail(item.id)">{{item.title}}</div>
          <p class="post-desc">{{item.summary}}</p>
          <div class=" flex-j-sb" v-if="item.images.length>0">
            <div class="image-wai" v-for="(item1,index1) in item.images.slice(0,3)" :key="index1">
              <img :src="item1" class="images hvr-grow " :class="index1 == 1?'marg-lre':''" />
            </div>
          </div>
          <div class="flex-j-sb marg-tops flex-a-c">
            <div class="flex-a-c fsse">
              <div>
                <EnvironmentOutlined />
                <span class="padd-lr">{{item.cityName}}</span>
              </div>
              <div class="padd-lr hover" @click="personal">
                <span>by</span>
                <img
                  :src="`http://157.122.54.189:9095${item.account.defaultAvatar}`"
                  alt
                  class="account_img"
                />
                <span class="orange">{{item.account.nickname}}</span>
              </div>
              <div class="padd-lr">
                <EyeOutlined />
                <span class="padd-lr">{{item.watch}}</span>
              </div>
            </div>
            <div class="orange">
              <span v-if="item.like">{{item.like}}点赞</span>
              <span v-else>0点赞</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-j-c marg-tops">
        <a-pagination
          :page-size-options="pageSizeOptions"
          :total="total"
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
import { Res, ResItem } from "./Travel";
import { useRouter, useRoute } from "vue-router";
interface Data {
  citiesList: ResItem[];
  total: number;
  postsList: any;
  pageSizeOptions: string[];
  current: number;
  pageSize: number;
  value: string;
}
export default defineComponent({
  name: "",
  props: {},
  components: {},
  setup(props, ctx: SetupContext) {
    const data: Data = reactive<Data>({
      citiesList: [],
      value: "",
      total: 0,
      postsList: [],
      pageSizeOptions: ["3", "5", "10", "15"],
      pageSize: 3,
      current: 1,
    });
    const router = useRouter();
    const route = useRoute();
    const personal = (): void => {
      router.push("/user/personal");
    };
    const postsDetail = (id: number): void => {
      router.push({ path: "/detail", query: { id: id } });
    };
    const search = (): void => {
      api
          .getpost(data.value)
          .then((res: any) => {
            console.log(res);
            data.total = res.total;
            data.postsList = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
    };
    const create = (): void =>{
      router.push("/create")
    }
    onMounted(() => {
      api
        .getCities()
        .then((res: Res) => {
          data.citiesList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
      if (route.params.msgs) {
        data.value = route.params.msgs! as string;
        api
          .getpost(data.value)
          .then((res: any) => {
            console.log(res);
            data.total = res.total;
            data.postsList = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        api
          .getPosts()
          .then((res: any) => {
            console.log(res);
            data.total = res.total;
            data.postsList = res.data;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
    return {
      ...toRefs(data),
      personal,
      postsDetail,
      search,
      create,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../style/travel/travel.scss";
</style>