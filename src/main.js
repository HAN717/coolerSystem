import { createApp } from 'vue'
import * as echarts from 'echarts'
const app = createApp(App);
app.config.globalProperties.$echarts = echarts
import App from './App.vue'
createApp(App).mount('#app')
