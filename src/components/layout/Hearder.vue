<template>
  <div class="hearder flex-cent">
    <div class="d-flex">
      <div class="logo">
        <img src="http://157.122.54.189:9093/images/logo.jpg" alt style="width:156px" />
      </div>
      <div class="padd-lres nav ">
        <div
          class="padd-lres nav_item hover"
          v-for="(item,index) in arr"
          :key="index"
          @click="navItem(index)"
          :class="currenIndexs == index?'active':'hvr-underline-from-center blue'"
        >{{item}}</div>
      </div>
    </div>
    <div v-if="users">
      <a-popover placement="bottom">
        <template v-slot:content>
          <p class="p" @click="personal">个人中心</p>
          <p class="p" @click="out">退出</p>
        </template>
        <div class="flex-cent">
          <div class="padd">
            <img :src="`http://157.122.54.189:9095${users.defaultAvatar}`" class="defaultAvatar" />
          </div>
          <div class="padd-lr">{{users.nickname}}</div>
        </div>
      </a-popover>
    </div>
    <div class="hover blue login" @click="toLogin" v-else>登录/注册</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, ComputedRef } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { User } from "@/types/home.ts";
interface Data {
  arr: string[];
  currenIndex: number;
}
export default {
  components: {},
  setup() {
    const data: Data = reactive<Data>({
      arr: ["首页", "旅游攻略", "酒店", "国内机票"],
      currenIndex: 1,
    });
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const navItem = (index: number) => {
      store.commit("setIndex", index);
      localStorage.setItem('index',String(index))
      if (index === 0) {
        router.push("/");
      } else if (index === 1) {
        router.push("/travel");
      } else if (index === 2) {
        router.push("/hotel");
      } else if (index === 3) {
        router.push("/ticket");
      }
    };
    const toLogin = (): void => {
      router.push("/user/login");
      data.currenIndex = -1;
    };
    const personal = (): void => {
      router.push("/user/personal");
    };
    const out = (): void => {
      store.state.users = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    };
    const users: ComputedRef<User> = computed(() => store.state.users);
    const currenIndexs: ComputedRef<number> = computed(() => store.state.currenIndex)
    return {
      ...toRefs(data),
      navItem,
      toLogin,
      users,
      personal,
      out,
      currenIndexs,
    };
  },
};
</script>

<style lang="scss">
@import "../../style/layout/layout.scss";
</style>