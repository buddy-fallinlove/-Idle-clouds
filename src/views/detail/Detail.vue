<template>
  <div class="container">
    <div class="content_left">
      <!-- 面包屑 -->
      <div class="breadcrumb">
        <span class="fwei blue hover" @click="travel">旅游攻略</span>
        <span class="padd-lrs fwei" style="color:#c0c4cc">/</span>
        <span style="color:#606266">攻略详情</span>
      </div>
      <!-- 详情页 -->
      <div v-for="item in detail" :key="item.id">
        <h1 class="title">{{item.title}}</h1>
        <div class="flex-end paddes" style="color:#999999">
          <span class="marg-ries">攻略：{{createdAt}}</span>
          <span>阅读：{{item.watch}}</span>
        </div>
        <!-- 单个文章详情 -->
        <div v-html="item.content"></div>
        <!-- 评论分享 -->
        <div class="flex-cent post-ctrl">
          <div class="d-flex">
            <div class="f-dir-mid marg-ries">
              <FormOutlined class="icon" />
              <div class="icon_name">评论({{total}})</div>
            </div>
            <div class="f-dir-mid" @click="share">
              <ShareAltOutlined class="icon" />
              <div class="icon_name">分享</div>
            </div>
          </div>
        </div>
        <!-- 评论详情 -->
        <div>
          <div class="comment pos-re">
            评论
            <a-tag closable @close="log" class="pos-ab s" v-if="flag == true">回复 @{{name}}</a-tag>
          </div>
          <!-- 评论框 -->
          <div class="el-textarea">
            <textarea
              v-model="value"
              autocomplete="off"
              placeholder="说点什么吧..."
              class="el-textarea__inner"
              style="resize: none; min-height: 33px;"
            ></textarea>
          </div>
          <!-- 图片上传，提交评论 -->
          <div class="flex-j-sb">
            <div class="clearfix">
              <a-upload
                name="files"
                :Header="header"
                action="/upload/upload"
                list-type="picture-card"
                :file-list="fileList"
                @preview="handlePreview"
                @change="handleChange"
              >
                <div>
                  <plus-outlined />
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
            <a-button type="primary" @click="postsComment">提交</a-button>
          </div>
          <!-- 评论详情 -->
          <div v-if="comment.length>0">
            <div class="cmt-list">
              <div v-for="item in comment" :key="item.id" class="cmt-item">
                <!-- 如果右父级评论 -->
                <div v-if="item.parent">
                  <div class="flex-j-sb">
                    <div class="cmt-info">
                      <img
                        :src="`http://157.122.54.189:9095${item.account.defaultAvatar}`"
                        class="defaultAvatar"
                      />
                      <span class="padd-lr">{{item.account.nickname}}</span>
                      <span class="padd-lr">{{createdTime}}</span>
                    </div>
                    <div class="cmt-info">{{item.level}}</div>
                  </div>
                  <!-- 递归 -->
                  <my-tree :parent="item.parent" class="tree paddten"></my-tree>
                  <div class="marg-lees">
                    <div>{{item.content}}</div>
                    <div v-if="item.pics.length>0" class="d-flex f-f-warp">
                      <div v-for="item1 in item.pics" :key="item1.id">
                        <img :src="`http://157.122.54.189:9095${item1.urlr}`" class="pics_img" />
                      </div>
                    </div>
                    <div class="cmt-ctrl">
                      <span class="huifu hover">回复</span>
                    </div>
                  </div>
                </div>
                <!-- 没有父级评论 -->
                <div v-else>
                  <div class="flex-j-sb">
                    <div class="cmt-info">
                      <img
                        :src="`http://157.122.54.189:9095${item.account.defaultAvatar}`"
                        class="defaultAvatar"
                      />
                      <span class="padd-lr">{{item.account.nickname}}</span>
                      <span class="padd-lr">{{createdTime}}</span>
                    </div>
                    <div class="cmt-info">{{item.level}}</div>
                  </div>
                  <div class="marg-lees">
                    <div>{{item.content}}</div>
                    <div v-if="item.pics.length>0" class="d-flex f-f-warp">
                      <div v-for="item1 in item.pics" :key="item1.id">
                        <img :src="`http://157.122.54.189:9095${item1.urlr}`" class="pics_img" />
                      </div>
                    </div>
                    <div class="cmt-ctrl">
                      <span class="huifu hover" @click="postsCommentss(item)">回复</span>
                    </div>
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
                @change="changeSize"
                @showSizeChange="showSizeChange"
              >
                <template v-slot:buildOptionText="props">
                  <span>{{ props.value }}条/页</span>
                </template>
              </a-pagination>
            </div>
          </div>
          <div v-else class="no_cmt flex-j-c">暂无评论，快来抢占沙发</div>
        </div>
      </div>
    </div>
    <div class="content_right">
      <div class="recommend">相关攻略</div>
      <div
        v-for="item in recommend"
        :key="item.id"
        class="recommend_item hover"
        @click="recommendPost(item.id)"
      >
        <img :src="item.images[0]" alt class="recom_images" />
        <div class="pos-re post-text">
          <div>{{item.title}}</div>
          <div class="time">
            <span class="padd-r">{{item.createdAt}}</span>
            <span>阅读 {{item.watch}}</span>
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
import { useRoute, useRouter } from "vue-router";
import api from "@/http/api";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons-vue";
import myTree from "@/components/comment/MyTree.vue";
import { message } from "ant-design-vue";

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
interface HeaderItem {
  Authorization: string;
}
interface Data {
  token: string;
  flag: boolean;
  name: string;
  follow: number;
  id: number;
  detail: any;
  createdAt: string;
  createdTime: string;
  value: string;
  previewVisible: boolean;
  previewImage: string;
  fileList: any[];
  pageSizeOptions: string[];
  current: number;
  pageSize: number;
  comment: any;
  total: number;
  header: HeaderItem;
  recommend: any[];
}
export default defineComponent({
  name: "",
  props: {},
  components: { PlusOutlined, myTree },
  setup(props, ctx: SetupContext) {
    const data: Data = reactive<Data>({
      flag: false,
      token: "",
      name:'',
      follow: 0,
      id: 0,
      detail: [],
      createdAt: "",
      createdTime: "",
      value: "",
      previewVisible: false,
      previewImage: "",
      fileList: [],
      pageSizeOptions: ["3", "5", "10", "15"],
      pageSize: 3,
      current: 1,
      comment: [],
      total: 0,
      header: {
        Authorization: "",
      },
      recommend: [],
    });
    const route = useRoute();
    const router = useRouter();
    // 获取文章详情
    const getPostDetail = (id: number): void => {
      api
        .getPostsDetail({ id: Number(id) })
        .then((res: any) => {
          res.data.map((item: any) => {
            data.createdAt = item.created_at;
            data.createdAt = dayjs(data.createdAt).format("YYYY-MM-DD HH:mm");
          });
          data.detail = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    // 获取评论
    const getComment = (id: string): void => {
      api
        .getComments({
          post: Number(id),
          _limit: data.pageSize,
          _start: data.current-1,
        })
        .then((res) => {
          console.log(res);
          res.data.map((item: any) => {
            data.createdTime = item.updated_at;
            data.createdTime = dayjs(data.createdTime).format(
              "YYYY-MM-DD HH:mm"
            );
          });
          (data.total = res.total), (data.comment = res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const postsCommentss = (item: any): void => {
      data.flag = true
      data.id = item.id
      data.name = item.account.nickname
    };
    // 提交评论
    const postsComment = (): void => {
      if (data.token == null) {
        message.warning("系统检测到你未登录，请先登录");
        router.push("/user/login");
      } else {
      if (data.value === "") {
        message.error("评论内容不能为空！");
      } else {
        if (data.follow === 0) {
          api
            .postComment({ content: data.value, pics: [], post: data.id })
            .then((res: any) => {
              console.log(res);
              if (res.status == 0) {
                message.success(res.message);
                getComment(String(data.id));
              } else {
                message.error(res.message);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          api
            .postsComments({
              content: data.value,
              pics: [],
              post: data.id,
              follow: data.follow,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }}
    };
    const handleCancel = (): void => {
      data.previewVisible = false;
    };
    const handlePreview = (file: any) => {
      console.log(file);
    };
    const handleChange = (a: any, b: any, c: any): void => {
      console.log(a, b, c);
    };
    // 返回旅游攻略
    const travel = (): void => {
      router.push("/travel");
    };
    // 分享
    const share = (): void => {
      message.warning("暂不支持该功能！");
    };
    // 改变页码
    const changeSize = (page: number, pageSize: number): void => {
      console.log(page);
      console.log(pageSize);
      api
        .getComments({
          post: Number(data.id),
          _limit: pageSize,
          _start: (page-1)*pageSize,
        })
        .then((res) => {
          console.log(res);
          res.data.map((item: any) => {
            data.createdTime = item.updated_at;
            data.createdTime = dayjs(data.createdTime).format(
              "YYYY-MM-DD HH:mm"
            );
          });
          (data.total = res.total), (data.comment = res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    // 改变页面条数
    const showSizeChange = (current: number, size: number): void => {
      console.log(current);
      console.log(size);
      api
        .getComments({
          post: Number(data.id),
          _limit: size,
          _start: (current-1)*size,
        })
        .then((res) => {
          console.log(res);
          res.data.map((item: any) => {
            data.createdTime = item.updated_at;
            data.createdTime = dayjs(data.createdTime).format(
              "YYYY-MM-DD HH:mm"
            );
          });
          (data.total = res.total), (data.comment = res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    // 点击相关推荐
    const recommendPost = (id: number): void => {
      getPostDetail(id);
    };
    onMounted(() => {
      data.token = localStorage.getItem("token")!;
      data.header.Authorization = "Bearer " + localStorage.getItem("token");
      const id: string = route.query.id! as string;
      data.id = Number(id);
      getComment(id);
      getPostDetail(Number(id));
      api
        .recommend(Number(id))
        .then((res: any) => {
          console.log(res);
          res.data.map((item: any) => {
            const createdAt = item.created_at;
            item.createdAt = dayjs(item.created_at).format("YYYY-MM-DD HH:mm");
          });
          data.recommend = res.data;
          console.log(data.recommend);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    const log = (e: any): void => {
      data.follow = 0
      data.flag = false
    }
    return {
      ...toRefs(data),
      handleCancel,
      handleChange,
      handlePreview,
      changeSize,
      showSizeChange,
      travel,
      share,
      postsComment,
      postsCommentss,
      log
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../style/detail/Detail.scss";
.s {
  left: 0;
  top: 25px;
}
</style>