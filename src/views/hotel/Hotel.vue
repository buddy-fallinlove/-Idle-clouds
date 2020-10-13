<template>
  <div class="hotelbox">
    <!--面包屑-->
    <div class="topbox">
      <a-breadcrumb separator="/">
        <a-breadcrumb-item>酒店</a-breadcrumb-item>
        <a-breadcrumb-item>酒店预订</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <!--搜索框-->
    <div class="searchbox">
      <div class="citybox d-f a-l">
        <a-auto-complete
          v-model:value="cityname"
          :data-source="choselist"
          style="width: 100%"
          placeholder="选择城市"
          @select="onSelect"
          @search="onSearch"
          @change="onChange1"
        />
      </div>
      <div class="timebox d-f a-l">
        <img class="imgtime" src="../../image/data.png" alt />
        <a-range-picker @change="onChange" :placeholder="['入驻日期','离店日期']" />
      </div>
      <div class="peobox d-f a-l">
        <div class="flex-cent" @click="openbox">
          <a-input placeholder="人数未定" v-model:value="choseNum" class="ipt" />
          <img class="imgsss" src="../../image/user.png" alt />
        </div>
        <div v-if="flag1 == true" class="chosebox">
          <div class="chtopbox">
            <div>每间</div>
            <div class="d-f">
              <div class="m-r-10">
                <a-select
                  show-search
                  placeholder="2成人"
                  option-filter-prop="children"
                  style="width: 100px"
                  :filter-option="filterOption"
                  @focus="handleFocus"
                  @blur="handleBlur"
                  @change="handleChange"
                >
                  <a-select-option value="1成人">1成人</a-select-option>
                  <a-select-option value="2成人">2成人</a-select-option>
                  <a-select-option value="3成人">3成人</a-select-option>
                  <a-select-option value="4成人">4成人</a-select-option>
                  <a-select-option value="5成人">5成人</a-select-option>
                  <a-select-option value="6成人">6成人</a-select-option>
                  <a-select-option value="7成人">7成人</a-select-option>
                </a-select>
              </div>
              <div>
                <a-select
                  show-search
                  placeholder="1儿童"
                  option-filter-prop="children"
                  style="width: 100px"
                  :filter-option="filterOption1"
                  @focus="handleFocus1"
                  @blur="handleBlur1"
                  @change="handleChange1"
                >
                  <a-select-option value="1儿童">1儿童</a-select-option>
                  <a-select-option value="2儿童">2儿童</a-select-option>
                  <a-select-option value="3儿童">3儿童</a-select-option>
                  <a-select-option value="4儿童">4儿童</a-select-option>
                </a-select>
              </div>
            </div>
          </div>
          <div class="chbtbox">
            <a-button type="primary" size="small" @click="choseend">确定</a-button>
          </div>
        </div>
      </div>
      <div class="m-l-10">
        <a-button type="primary">查看价格</a-button>
      </div>
    </div>
    <!--地图区域-->
    <div class="d-f w-1 m-b-15">
      <div class="l-box">
        <div class="d-f">
          <div class="lbposition marg-topw">区域：</div>
          <div v-if="flag === false">
            <div class="lbwords" v-for="(item,index) in scenics" :key="index">
              <div v-for="(item1,index1) in item.scenics" :key="index1">
                <div class="m-r-10 itembox">{{item1.name}}</div>
              </div>
            </div>
            <div @click="openhigeht" class="fs14">
              <img class="imgss" src="../../image/open.png" alt /> 等25个区域
            </div>
          </div>
          <div v-if="flag === true">
            <div class="lbwords1" v-for="(item,index) in scenics" :key="index">
              <div v-for="(item1,index1) in item.scenics" :key="index1">
                <div class="m-r-10 itembox">{{item1.name}}</div>
              </div>
            </div>
            <div @click="opendown" class="fs14">
              <img class="imgss" src="../../image/close.png" alt /> 等25个区域
            </div>
          </div>
        </div>
        <div class="d-f m-t-30">
          <div class="lbposition1">
            <span class="m-r-10">均价</span>
            <a-tooltip placement="topLeft">
              <template v-slot:title>
                <span class="pro">均价由平均假日价格计算得出，节假日价格可能上浮</span>
              </template>
              <span class="sloatas">?</span>
            </a-tooltip>
            <span>：</span>
          </div>
          <div class="d-f ratebox">
            <div class="m-r-10">
              <a-tooltip placement="bottom">
                <template v-slot:title>
                  <span class="pro">等级评定是针对房价，设施和服务等各方面水平的综合评估</span>
                </template>
                <div>
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  ¥322
                </div>
              </a-tooltip>
            </div>
            <div class="m-r-10">
              <a-tooltip placement="bottom">
                <template v-slot:title>
                  <span class="pro">等级评定是针对房价，设施和服务等各方面水平的综合评估</span>
                </template>
                <div>
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  ¥521
                </div>
              </a-tooltip>
            </div>
            <div class="m-r-10">
              <a-tooltip placement="bottom">
                <template v-slot:title>
                  <span class="pro">等级评定是针对房价，设施和服务等各方面水平的综合评估</span>
                </template>
                <div>
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  <img class="imgss" src="../../image/huangguan.png" alt />
                  ¥768
                </div>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="r-box">
        <div id="container"></div>
      </div>
    </div>
    <!--条件搜索-->
    <div class="searchBox d-f w-1 m-t-10 m-b-15">
      <div class="searchBoxin">
        <div class="moneybox f-dir-c flex-j-c">
          <div class="d-f a-l j-c-sb">
            <div>价格</div>
            <div class="m-r-10">0-{{value1}}</div>
          </div>
          <div class="m-t-20">
            <a-slider
              @change="onChange"
              @afterChange="onAfterChange"
              v-model:value="value1"
              :max="4000"
            />
          </div>
        </div>
        <div class="levelbox f-dir-c flex-j-c">
          <div class="fs14">住宿等级</div>
          <div class="chosefont">
            <div class="chosefont1">
              <a-dropdown>
                <template v-slot:overlay>
                  <a-menu>
                    <a-menu-item
                      v-for="(item,index) in levellist"
                      :key="index"
                      @change="handlelevel(item)"
                    >
                      <a-radio v-model:checked="item.checked"></a-radio>
                      {{item.name}}
                    </a-menu-item>
                  </a-menu>
                </template>
                <div class="w-1 d-f a-l j-c-sb hotelsearchbox fs13">
                  <div>
                    <a-input v-model:value="reslevel" placeholder="不限" />
                  </div>
                  <div class="m-r-10">
                    <img class="imgsss" src="../../image/down.png" alt />
                  </div>
                </div>
              </a-dropdown>
            </div>
          </div>
        </div>
        <div class="stybox f-dir-c flex-j-c">
          <div class="fs14">住宿类型</div>
          <div class="chosefont">
            <div class="chosefont1">
              <a-dropdown>
                <template v-slot:overlay>
                  <a-menu>
                    <a-menu-item
                      v-for="(item,index) in types"
                      :key="index"
                      @change="handletype(item)"
                    >
                      <a-radio v-model:checked="item.checked"></a-radio>
                      {{item.name}}
                    </a-menu-item>
                  </a-menu>
                </template>
                <div class="w-1 d-f a-l j-c-sb hotelsearchbox">
                  <div>
                    <a-input v-model:value="type" placeholder="不限" />
                  </div>
                  <div class="m-r-10">
                    <img class="imgsss" src="../../image/down.png" alt />
                  </div>
                </div>
              </a-dropdown>
            </div>
          </div>
        </div>
        <div class="shebox f-dir-c flex-j-c">
          <div class="fs14">酒店设施</div>
          <div class="chosefont">
            <div class="chosefont1">
              <a-dropdown>
                <template v-slot:overlay>
                  <a-menu>
                    <a-menu-item v-for="(item,index) in assets" :key="index" @change="handleasset">
                      <a-radio v-model:checked="item.checked"></a-radio>
                      {{item.name}}
                    </a-menu-item>
                  </a-menu>
                </template>
                <div class="w-1 d-f a-l j-c-sb hotelsearchbox">
                  <div>
                    <a-input v-model:value="asset" placeholder="不限" />
                  </div>
                  <div class="m-r-10">
                    <img class="imgsss" src="../../image/down.png" alt />
                  </div>
                </div>
              </a-dropdown>
            </div>
          </div>
        </div>
        <div class="pinpaibox f-dir-c flex-j-c xxxx">
          <div class="fs14">酒店品牌</div>
          <div class="chosefont">
            <div class="chosefont1 h">
              <a-dropdown >
                <template v-slot:overlay>
                  <a-menu>
                    <a-menu-item
                      v-for="(item,index) in brands"
                      :key="index"
                      @change="handlebrand(item)"
                    >
                      <a-radio v-model:checked="item.checked"></a-radio>
                      {{item.name}}
                    </a-menu-item>
                  </a-menu>
                </template>
                <div class="w-1 d-f a-l j-c-sa hotelsearchbox">
                  <div>
                    <a-input v-model:value="brand" placeholder="不限" />
                  </div>
                  <div class="m-r-10">
                    <img class="imgsss" src="../../image/down.png" alt />
                  </div>
                </div>
              </a-dropdown>
            </div>
          </div>
        </div>
        <div class="retrunbox d-f j-c a-l">
          <div>
            <a-button type="primary">撤销条件</a-button>
          </div>
        </div>
      </div>
    </div>

    <!--酒店展示-->
    <div class="d-f w-1 m-t-10">
      <div>
        <!--循环体-->
        <div
          class="d-f w-1 m-t-10 m-b-15"
          v-for="(item,index) in hotellist"
          :key="index"
          @click="toHotel(item)"
        >
          <div class="hbimgbox m-r-10">
            <img class="imghb" :src="item.photos" alt />
          </div>
          <div class="hbmsgbox">
            <div class="hbmsgbox-fs">{{item.name}}</div>
            <div class="hbmsgbox-fs2">
              {{item.alias}}
              <span v-if="item.hotellevel">
                <img class="imgss" src="../../image/huangguan.png" alt />
                <img class="imgss" src="../../image/huangguan.png" alt />
                <img class="imgss" src="../../image/huangguan.png" alt />
              </span>
              <span v-if="item.hoteltype">{{item.hoteltype.name}}</span>
            </div>
            <div class="d-f m-b-15">
              <div>
                <span class="obfs">
                  <a-rate v-model:value="item.stars" disabled allow-half />
                  {{item.stars}}
                </span>星
              </div>
              <div class="hbmsgfont m-l-10">{{item.very_bad_remarks +item.very_good_remarks}}条评论</div>
              <div></div>
            </div>
            <div class="hbmsgfont">
              <img class="imgss" src="../../image/location.png" alt />
              位于:{{item.address}}
            </div>
          </div>
          <div class="otherbox">
            <div class="otherbox1 d-f j-c-sb" v-for="(item1,index1) in item.products" :key="index1">
              <div class="m-l-10">{{item1.name}}</div>
              <div>
                <span class="obfs">¥{{item1.price}}</span>
                <span>起</span>
                <img class="rightimg" src="../../image/right.png" alt />
              </div>
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
import { useRoute, useRouter } from "vue-router";
import api from "@/http/api";
import { Modal } from "ant-design-vue";
interface Data {
  value1: number;
  reslevel: string;
  asset: string;
  brand: string;
  type: string;
  name: string;
  scenics: string[];
  flag: boolean;
  flag1: boolean;
  choseNum: string;
  adpt: string;
  children: string;
  city: number;
  hotellist: string[];
  choselist: string[];
  cityname: string;
  levellist: string[];
  assets: string[];
  brands: string[];
  types: string[];
  checkedlevel: boolean;
  checkedbrand: boolean;
  checkedasset: boolean;
  checkedtype: boolean;
}
export default defineComponent({
  city: "",
  props: {},
  components: {},
  setup(props, ctx: SetupContext) {
    const router = useRouter();
    let data: Data = reactive<Data>({
      name: "",
      value1: 4000,
      reslevel: "",
      asset: "",
      brand: "",
      type: "",
      scenics: [],
      flag: false,
      flag1: false,
      choseNum: "",
      adpt: "",
      children: "",
      city: 0,
      hotellist: [],
      cityname: "",
      choselist: [],
      levellist: [],
      assets: [],
      brands: [],
      types: [],
      checkedlevel: false,
      checkedbrand: false,
      checkedasset: false,
      checkedtype: false,
    });
    const getCity = (name: string) => {
      api
        .getcities({ name: name })
        .then((res: any) => {
          data.scenics = res.data;
          res.data.map((item: any) => {
            data.city = item.id;
          });
          console.log(data.city);
          api
            .getHotel({ city: data.city })
            .then((res: any) => {
              data.hotellist = res.data;
            })
            .catch();
        })
        .catch();
    };
    const gethotel = (city: number) => {
      api
        .getHotel({ city: city })
        .then((res: any) => {
          console.log(res);
        })
        .catch();
    };
    const openhigeht = () => {
      data.flag = true;
    };
    const opendown = () => {
      data.flag = false;
    };
    const openbox = () => {
      data.flag1 = !data.flag1;
    };
    const handleChange = (value: any) => {
      data.adpt = value;
    };
    const filterOption = (input: any, option: any) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };
    const handleChange1 = (value: any) => {
      data.children = value;
    };
    const filterOption1 = (input: any, option: any) => {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    };
    const choseend = () => {
      data.choseNum = data.adpt + data.children;
      data.flag1 = false;
    };
    const onChange = (value: number) => {
      console.log("change: ", value);
    };
    const onAfterChange = (value: number) => {
      console.log("afterChange: ", value);
      data.value1 = value;
    };
    const choseitem = (item: any) => {
      data.cityname = item.name;
    };
    // 搜索城市
    const onSearch = (searchText: string) => {
      if (data.cityname !== null) {
        data.cityname = searchText;
        api
          .getcities({ name: data.cityname.slice(0, data.cityname.length - 1) })
          .then((res: any) => {
            console.log(res);
            res.data.map((item: any) => {
              data.choselist.push(item.name);
            });
          })
          .catch();
      }
    };
    const onSelect = (value: string) => {
      console.log("onSelect", value);
    };

    const onChange1 = (value: string) => {
      data.cityname = value;
    };
    //选中level
    const handlelevel = (item: any) => {
      data.checkedlevel = true;
      console.log(item);
      data.reslevel = `已选择${item.name}`;
    };
    const handletype = (item: any) => {
      data.checkedtype = true;
      data.type = `已选择${item.name}`;
    };
    const handleasset = (item: any) => {
      data.checkedasset = true;
      console.log(item);
      data.asset = `已选择${item.name}`;
    };
    const handlebrand = (item: any) => {
      data.checkedbrand = true;
      console.log(item);
      data.brand = `已选择${item.name}`;
    };

    const route = useRoute();
    //获取传递过来的值
    onMounted(() => {
      data.name = route.query.msgs! as string;
      const map = new AMap.Map("container", {
        zoom: 12, //层级
      });
      console.log(map);
      var marker: any = new AMap.Marker({
        position: new AMap.LngLat(104.259259, 30.562096), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: "成都",
      });
      map.add(marker);
      if (route.query.msgs! as string) {
        getCity(data.name);
      } else {
        Modal.success({
          title: "提示",
          content: "当前定位显示“成都”",
        });
        getCity("成都");
      }
      api
        .getoptions()
        .then((res: any) => {
          data.levellist = res.data.levels;
          data.levellist.map((item: any) => {
            item.checked = false;
          });
          data.types = res.data.types;
          data.types.map((item: any) => {
            item.checked = false;
          });
          data.assets = res.data.assets;
          data.assets.map((item: any) => {
            item.checked = false;
          });
          data.brands = res.data.brands;
          data.brands.map((item: any) => {
            item.checked = false;
          });
        })
        .catch();
    });
    const toHotel = (item: any): void => {
      router.push({
        name: "Pickhotel",
        params: {
          hotel: JSON.stringify(item),
        },
      });
    };
    return {
      ...toRefs(data),
      getCity,
      gethotel,
      openhigeht,
      opendown,
      openbox,
      handleChange,
      filterOption,
      handleChange1,
      filterOption1,
      choseend,
      onChange,
      onAfterChange,
      choseitem,
      onSearch,
      onSelect,
      onChange1,
      handlelevel,
      handletype,
      handleasset,
      handlebrand,
      toHotel,
    };
  },
});
</script>

<style scoped lang='scss'>
@import "../../style/hotel/hotel.scss";
</style>