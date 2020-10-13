<template>
  <div>
    <div class="flex-j-sb">
      <div class="cmt-info">
        <img
          :src="`http://157.122.54.189:9095${parent.account.defaultAvatar}`"
          class="defaultAvatar"
        />
        <span class="padd-lr">{{parent.account.nickname}}</span>
        <span class="padd-lr">{{createdTime}}</span>
      </div>
      <div class="cmt-info">{{parent.level}}</div>
    </div>
    <!-- 递归 -->
    <tree-menus :parent="parent.parent" v-if="parent.parent" class="tree paddten"></tree-menus>
    <div class="marg-lees">
      <div>{{parent.content}}</div>
      <div v-if="parent.pics.length>0" class="d-flex f-f-warp">
        <div v-for="parent1 in parent.pics" :key="parent1.id">
          <img :src="`http://157.122.54.189:9095${parent1.urlr}`" class="pics_img" />
        </div>
      </div>
      <div class="cmt-ctrl">
        <span class="huifu hover">回复</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import dayjs from "dayjs";
interface Data {
  createdTime: string;
}
export default defineComponent({
  name: "treeMenus",
  props: {
    parent: {
      type: Object,
    },
  },
  components: {},
  setup(props) {
    const data: Data = reactive<Data>({
      createdTime: "",
    });
    onMounted(() => {
      data.createdTime = props.parent!.updated_at;
      data.createdTime = dayjs(data.createdTime).format("YYYY-MM-DD HH:mm");
    });
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../style/detail/Detail.scss"
</style>