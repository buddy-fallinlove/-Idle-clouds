import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as Icons from '@ant-design/icons-vue';
const app = createApp(App);

const icons: any = Icons
for(const i in icons) {
  app.component(i,icons[i])
}
app.use(store).use(router).mount('#app')
app.use(Antd);