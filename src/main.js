import { createApp } from 'vue'
import App from './App.vue'
import * as echarts from 'echarts'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);
app.config.globalProperties.$echarts = echarts
app.use(ElementPlus)
app.mount('#app')