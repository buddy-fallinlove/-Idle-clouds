<template>
  <div>
    <div class="createbox flex-j-sb">
      <div class="main">
        <div class="topbox">发表新攻略</div>
        <div class="scendbox">分享你的个人游记，让更多人看到哦</div>
        <div class="inputbox">
          <a-input placeholder="请输入标题" v-model:value="title" />
        </div>
        <div class="editbox">
          <div class="paddten edit">
            <img src="../../image/llllll.png" alt class="edit-img" />
          </div>
          <div class="z-textarea">
            <textarea
              v-model="content"
              autocomplete="off"
              placeholder="说点什么吧..."
              class="el-textarea__inner"
              style="resize: none; min-height: 33px"
            ></textarea>
          </div>
        </div>
        <div class="marg-topes flex-a-c">
          <div class="fongsize">选择城市</div>
          <div>
            <a-select
              show-search
              v-model:value="city"
              placeholder="请搜索游玩城市"
              style="width: 215px"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleSearch"
              @change="handleChange"
              class="picker"
            >
              <a-select-option v-for="d in data" :key="d.name_id">{{
                d.name
              }}</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="botbox">
          <div>
            <a-button type="primary" @click="add">发布</a-button>
          </div>
          <div class="marg-les">或者</div>
          <div class="save hover" @click="save">保存到草稿</div>
        </div>
      </div>
      <div class="rightbox">
        <div>草稿箱({{ arr.length }})</div>
        <div v-if="arr.length > 0" class="marg-tops">
          <div class="marg-tops" v-for="(item, index) in arr" :key="index">
            <div class="namebox">{{ item.title }}</div>
            <div class="flex-j-sb">
              <div class="timebox">{{ item.date }}</div>
              <div class="flex-a-c">
                <img
                  class="imgbox"
                  src="../../image/edit.png"
                  alt
                  @click="edit(item)"
                />
                <img
                  class="imgbox marg-les"
                  src="../../image/delete.png"
                  alt
                  @click="del(index)"
                />
              </div>
            </div>
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
import { message } from "ant-design-vue";
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
interface Draft {
  title: string;
  content: string;
  city: string;
  date?: string;
}
interface Data {
  title: string;
  content: string;
  city: string;
  obj: Draft;
  arr: Draft[];
  data: any[];
  cityId: string;
  token: string;
}
export default defineComponent({
  name: "",
  props: {},
  components: {},
  setup(props, ctx: SetupContext) {
    let data: Data = reactive<Data>({
      title: "",
      content: "",
      city: "",
      cityId: "",
      token: "",
      obj: {
        title: "",
        content: "",
        city: "",
        date: "",
      },
      arr: [],
      data: [],
    });
    const router = useRouter();
    const handleSearch = (value: string): void => {
      data.city = value;
      api
        .citySort(value)
        .then((res: any) => {
          res.data.map((item: any) => {
            item.name_id = item.id + "-" + item.name;
          });
          data.data = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const handleChange = (value: any): void => {
      data.city = value.substring(value.indexOf("-") + 1, value.length);
      data.cityId = value.substring(0, value.indexOf("-"));
    };
    const save = (): void => {
      if (data.title === "") {
        message.error("标题不能为空");
      } else {
        const date = new Date();
        data.obj.date = dayjs(date).format("YYYY-MM-DD");
        data.obj.title = data.title;
        data.obj.content = data.content;
        data.obj.city = data.city;
        data.arr.push(data.obj);
        localStorage.setItem("draft", JSON.stringify(data.arr));
      }
    };
    const edit = (item: any) => {
      data.title = item.title;
      data.content = item.content;
      data.city = item.city;
    };
    const del = (index: number) => {
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "您确定要删除吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          data.arr.splice(index, 1);
          localStorage.setItem("draft", JSON.stringify(data.arr));
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    };
    const add = (): void => {
      if (data.token == null) {
        message.warning("系统检测到你未登录，请先登录");
        router.push("/user/login");
      } else {
        api
          .addposts({
            content: data.content,
            title: data.title,
            city: Number(data.cityId),
          })
          .then((res: any) => {
            console.log(res);
            if (res.status === 0) {
              message.success(res.message);
            } else {
              message.error(res.message);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    onMounted(() => {
      data.token = localStorage.getItem("token")!;
      if (localStorage.getItem("draft")) {
        data.arr = JSON.parse(localStorage.getItem("draft")!);
      }
    });
    return {
      ...toRefs(data),
      handleSearch,
      handleChange,
      save,
      edit,
      del,
      add,
    };
  },
});
</script>

<style scoped lang='scss'>
.edit {
  border-bottom: 1px solid #ccc;
}
.edit-img {
  width: 730px;
}
.z-textarea {
  padding: 12px 15px;
}
.el-textarea__inner {
  border: none;
  width: 720px;
  height: 400px;
  outline: none;
}
.createbox {
  width: 1000px;
  margin: 0 auto;
  margin-top: 20px;
}
.main {
  width: 750px;
}
.rightbox {
  padding: 10px;
  width: 225px;
  border: 1px solid #ccc;
  height: fit-content;
}
.topbox {
  width: 100%;
  height: 30px;
  font-size: 22px;
  margin-bottom: 10px;
}
.scendbox {
  width: 100%;
  height: 16px;
  font-size: 12px;
  margin-bottom: 10px;
}
.inputbox {
  width: 100%;
  height: 40px;
}
.inputbox input {
  width: 100%;
  height: 40px;
}
.editbox {
  margin-top: 20px;
  width: 100%;
  min-height: 460px;
  border: 1px solid #ccc;
}
.fongsize {
  margin-right: 10px;
  font-size: 14px;
}
.botbox {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
.save {
  margin-left: 10px;
  color: orange;
}
.namebox {
  font-size: 14px;
  color: #000000;
}
.timebox {
  font-size: 14px;
  color: #999999;
}
.imgbox {
  width: 14px;
  height: 14px;
}
</style>