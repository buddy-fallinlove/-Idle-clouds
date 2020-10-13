<template>
  <div class="login_container">
    <div class="main flex-cent">
      <div class="form-wrapper">
        <div class="tabs d-flex">
          <span :class="currentIndex == 0?'active':''" @click="chooseLogin">登录</span>
          <span :class="currentIndex == 1?'active':''" @click="chooseRegiste">注册</span>
        </div>
        <div class="a_form" v-if="currentIndex == 0">
          <a-form :model="form" ref="ruleForm" :rules="rules">
            <a-form-item name="username">
              <a-input v-model:value="form.username" placeholder="用户名/手机" />
            </a-form-item>
            <a-form-item name="password">
              <a-input v-model:value="form.password" type="password" placeholder="密码" />
            </a-form-item>
          </a-form>
          <div class="forget">忘记密码?</div>
          <a-button type="primary" @click="login">登录</a-button>
        </div>
        <div v-if="currentIndex == 1" class="a_form">
          <a-form :model="form" ref="ruleForm" :rules="rules">
            <a-form-item name="mobile" has-feedback>
              <a-input v-model:value="form.mobile" placeholder="用户名手机" type="tel" />
            </a-form-item>
            <div class="d-flex">
              <a-form-item name="verification" has-feedback>
                <a-input v-model:value="form.verification" placeholder="验证码" class="msg" />
              </a-form-item>
              <a-button
                class="sendMsg"
                @click="countDown"
                :class="{disabled: !canClick}"
              >{{content}}</a-button>
            </div>
            <a-form-item name="nickname" has-feedback>
              <a-input v-model:value="form.nickname" placeholder="昵称" />
            </a-form-item>
            <a-form-item name="passWords" has-feedback>
              <a-input v-model:value="form.passWords" type="password" placeholder="密码" />
            </a-form-item>
            <a-form-item name="checkPass" has-feedback>
              <a-input v-model:value="form.checkPass" type="password" placeholder="确认密码" />
            </a-form-item>
          </a-form>
          <a-button type="primary" @click="register">注册</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { FormItem, Rules, Res } from "./Login";
import api from "@/http/api";
import { message, notification } from "ant-design-vue";
interface Data {
  currentIndex: number;
  form: FormItem;
  rules: Rules;
  codes: string;
  content: string;
  canClick: boolean;
  totalTime: number;
}
export default defineComponent({
  setup() {
    const data: Data = reactive<Data>({
      currentIndex: 0,
      codes: "",
      content: "发送验证码",
      canClick: true,
      totalTime: 30,
      form: {
        username: "",
        password: "",
        mobile: "",
        verification: "",
        nickname: "",
        passWords: "",
        checkPass: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            message: "密码至少6位",
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
            trigger: "blur",
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
        nickname: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur",
          },
        ],
        passWords: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            message: "密码至少6位",
            trigger: "blur",
          },
        ],
        checkPass: [
          {
            required: true,
            trigger: "blur",
            validator: () => {
              if (data.form.checkPass === "") {
                return Promise.reject("请再次输入密码");
              } else if (data.form.passWords !== data.form.checkPass) {
                return Promise.reject("两次输入密码不一致");
              } else {
                return Promise.resolve();
              }
            },
          },
        ],
      },
    });
    const chooseLogin = (): void => {
      data.currentIndex = 0;
    };
    const chooseRegiste = (): void => {
      data.currentIndex = 1;
    };
    const router = useRouter();
    const store = useStore();
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
            data.content = "重新发送验证码";
            data.totalTime = 30;
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
    // 登录
    const login = (): void => {
      if (data.form.username !== "" && data.form.password !== "") {
        api
          .login({ username: data.form.username, password: data.form.password })
          .then((res: Res) => {
            if (res) {
              message.success("恭喜你，登录成功");
              router.push("/");
              store.commit("setUser", res.user);
              localStorage.setItem("token", res.token);
              localStorage.setItem("user", JSON.stringify(res.user));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        message.error("用户名/手机号或密码不能为空");
      }
    };
    // 注册
    const register = (): void => {
      if (
        data.form.mobile !== "" &&
        data.form.nickname !== "" &&
        data.form.verification !== "" &&
        data.form.passWords !== "" &&
        data.form.checkPass !== ""
      ) {
        api
          .register({
            username: data.form.mobile,
            nickname: data.form.nickname,
            captcha: data.form.verification,
            password: data.form.passWords,
          })
          .then((res: Res) => {
            if (res) {
              message.success("恭喜你，注册成功");
              const router = useRouter();
              router.push("/");
              store.commit("setUser", res.user);
              localStorage.setItem("token", res.token);
              localStorage.setItem("user", JSON.stringify(res.user));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        message.error("请填写完整的信息");
      }
    };
    const users = computed(() => store.state.users);
    return {
      ...toRefs(data),
      chooseLogin,
      chooseRegiste,
      countDown,
      login,
      register,
      users
    };
  },
});
</script>

<style scoped lang="scss">
@import "../../style/login/login.scss";
</style>