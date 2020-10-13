<template>
  <div class="content">
    <div class="content_a">
      <!-- 页面位置 -->
      <div>
        <a-breadcrumb>
          <a-breadcrumb-item>
            <a href>酒店</a>
          </a-breadcrumb-item>
          <a-breadcrumb-item>成都市酒店预订</a-breadcrumb-item>
          <a-breadcrumb-item>{{obj.name}}</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <!-- 酒店信息 -->
      <div class="jiu" v-if="obj">
        <div>
          {{obj.name}}
          <span>
            <img class="imgss" src="../image/huangguan.png" alt />
            <img class="imgss" src="../image/huangguan.png" alt />
            <img class="imgss" src="../image/huangguan.png" alt />
          </span>
        </div>
        <div class="jiu_a">{{obj.alias}}</div>
        <div class="jiu_b">{{obj.address}}</div>
        <!-- 图片 -->
        <div class="jiu_c">
          <div class="jiu_d">
            <img src alt />
          </div>
          <div class="jiu_e">
            <div class="jiu_f" v-for="(item,index) in obj.pics" :key="index">
              <img :src="`http://157.122.54.189:9095${item.url}`" alt="图片加载失败" />
            </div>
          </div>
        </div>
        <!-- 酒店表格-->
        <div class="jiu_g">
          <div class="jiu_z">
            <div class="jiu_k">价格来源</div>
            <div>低价房型</div>
            <div class="jiu_i">最低价格/每晚</div>
          </div>
          <div class="jiu_h" v-for="(item,index) in obj.products" :key="index">
            <div class="jiu_k">{{item.name}}</div>
            <div>{{item.bestType}}</div>
            <div class="jiu_i">
              <span class="jiu_j">￥{{item.price}}</span>起
              <span class="goright"></span>
            </div>
          </div>
        </div>
        <!-- 酒店表格-->
        <div class="jiu_l">
          <!-- 地图-->
          <div class="jiu_m">
            <div id="container"></div>
          </div>
          <!-- 选项卡-->
          <div class="jiu_n">
            <div>
              <a-tabs>
                <a-tab-pane key="1" tab="风景">
                  <div class="jiu_o">
                    <div class="jiu_p">
                      <span>龙泉驿区音乐广场</span>
                      <span>0.87公里</span>
                    </div>
                    <div class="jiu_p">
                      <span>巴金纪念馆</span>
                      <span>1.33公里</span>
                    </div>
                    <div class="jiu_p">
                      <span>牛王庙</span>
                      <span>0.36公里</span>
                    </div>
                    <div class="jiu_p">
                      <span>大象门</span>
                      <span>0.87公里</span>
                    </div>
                    <div class="jiu_p">
                      <span>桃花仙子</span>
                      <span>1.5公里</span>
                    </div>
                    <div class="jiu_p">
                      <span>中天法治广场</span>
                      <span>2.04公里</span>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="交通" force-render>
                  <div class="jiu_o">
                    <div class="jiu_p">
                      <span>龙泉驿区汽车总站</span>
                      <span>0.23公里</span>
                    </div>
                    <div class="jiu_p">
                      <span>龙泉驿（地铁站）</span>
                      <span>0.86公里</span>
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
        <!-- 基本信息-->
        <div class="msg">
          <div class="msg_a">
            <div class="msg_b">基本信息</div>
            <div class="msg_c">
              <div>入住时间: 14:00之后</div>
              <div>离店时间: 12:00之前</div>
              <div>{{obj.renovat_time}}</div>
              <div>酒店规模:{{obj.roomCount}}</div>
            </div>
          </div>
          <div class="msg_a">
            <div>基本信息</div>
            <div></div>
          </div>
          <div class="msg_a">
            <div>主要设施</div>
            <div></div>
          </div>
          <div class="msg_a">
            <div>停车服务</div>
            <div></div>
          </div>
          <div class="msg_a">
            <div>品牌信息</div>
            <div></div>
          </div>
        </div>
        <!-- 评论-->
        <div class="msg_d">真实用户评论</div>
        <div class="msg_e">
          <div class="msg_f">
            <div>总评数:{{obj.all_remarks}}条</div>
            <div>好评数:{{obj.bad_remarks}}条</div>
            <div>差评数:{{obj.good_remarks}}条</div>
          </div>
          <div class="msg_g" v-if="obj.scores">
            <div>
              <span>
                <a-rate :default-value="obj.stars" :tooltips="desc" disabled />
                <span class="ant-rate-text">{{ desc[obj.stars - 1] }}</span>
              </span>
            </div>
            <div>
              <a-progress
                type="circle"
                :percent="obj.scores.environment*10"
                :format="percent => `${percent} 环境`"
              />
            </div>
            <div v-if="obj.scores.product">
              <a-progress
                type="circle"
                :percent="obj.scores.product*10"
                :format="percent => `${percent} 产品`"
              />
            </div>
            <div v-if="obj.scores.service">
              <a-progress
                type="circle"
                :percent="obj.scores.service*10"
                :format="percent => `${percent} 服务`"
              />
            </div>
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
} from "vue";
import api from "@/http/api";

import { useRoute, useRouter } from "vue-router";
interface Data {
  obj: any;
  desc: string[];
}
export default defineComponent({
  name: "",
  props: {},
  components: {},
  setup(props, ctx: SetupContext) {
    let data: Data = reactive<Data>({
      obj: [],
      desc: ["差", "普通", "一般", "好", "非常好"],
    });
    //使用router
    const route = useRoute();
    onMounted(() => {
      var map = new AMap.Map("container", {});
      console.log(map);
      data.obj = JSON.parse(route.params.hotel! as string);
      if (route.params.hotel) {
        data.obj = JSON.parse(route.params.hotel! as string);
        console.log(data.obj);
      }
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style scoped lang='scss'>
.content {
  display: flex;
  justify-content: center;
}
.content_a {
  width: 1000px;
  padding: 20px 0;
}
.jiu {
  margin-top: 20px;
}
.jiu_a {
  font-size: 12px;
  color: #666;
}
.jiu_b {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}
.jiu_c {
  display: flex;
  justify-content: space-between;
}
.jiu_d {
  height: 360px;
  width: 640px;
  border: 1px solid #ddd;
}
.jiu_d img {
  height: 360px;
  width: 640px;
}
.jiu_e {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 33%;
}
.jiu_f {
  height: 110px;
  width: 160px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
}
.jiu_f img {
  height: 110px;
  width: 160px;
}
.jiu_g {
  margin: 40px 0;
  font-size: 14px;
}
.jiu_z {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.jiu_z div {
  width: 25%;
  color: #606266;
  font-weight: bold;
}
.jiu_h {
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  border-bottom: 1px solid #ddd;
}
.jiu_h div {
  width: 25%;
}
.jiu_h:hover {
  background-color: #f5f7fa;
}
.goright {
  width: 10px;
  height: 10px;
  border-top: 1px solid #e0620d;
  border-right: 1px solid #e0620d;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
.jiu_i {
  display: flex;
  align-items: center;
  justify-content: center;
}
.jiu_j {
  color: #e0620d;
}
.jiu_k {
  padding-left: 20px;
}
.jiu_l {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.jiu_m {
  width: 65%;
  height: 360px;
}
#container {
  width: 100%;
  height: 360px;
}
.jiu_n {
  width: 330px;
  height: 360px;
}
.jiu_o {
  height: 300px;
  overflow: auto;
}
.jiu_p {
  display: flex;
  justify-content: space-between;
  margin: 0 20px 20px 10px;
}
.msg {
  margin: 40px 0;
  font-size: 14px;
  color: #666666;
}
.msg_a {
  border-bottom: 1px solid #eee;
  height: 60px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  display: flex;
}
.msg_b {
  width: 17%;
}
.msg_c {
  display: flex;
  justify-content: space-between;
  width: 80%;
}
.msg_d {
  font-size: 20px;
  margin-bottom: 15px;
}
.msg_f {
  font-size: 14px;
  line-height: 30px;
  margin-right: 40px;
}
.ant-progress-circle-wrap,
.ant-progress-line-wrap {
  margin-right: 8px;
  margin-bottom: 5px;
}
.msg_e {
  display: flex;
  align-items: center;
}
.msg_g {
  display: flex;
  align-items: center;
}
.msg_g div {
  margin-left: 20px;
}
</style>