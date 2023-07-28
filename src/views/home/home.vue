<template>
  <header>
    <div id="header">
      <h1 id="title" style="color: white; text-align: center">
        基于露点间接蒸发的智能冷却器可视化系统
      </h1>
      <div id="subTitle">
        Intelligent cooler visualization system based on dew point indirect
        evaporation
      </div>
      <div id="topTools" style="position:absolute;top:0.65vw;left:3.6vw;width: 20vw;height:3vw;">
          <img @click="resetAll()" src="../../assets/img/reset.png" alt="重置" title="图表重置"
          style="cursor: pointer;opacity: 0.6;width: 1.3vw; height:1.3vw;margin-left: -17vw;
          margin-right: 1.5vw;" class="reset">
          <!-- <el-input v-model="change_time_Input" :placeholder="change_time" @change="changeTime()" 
          size="small" style="width: 71px;margin-top: -0.8vw;"/> -->
      </div>
    </div>
  </header>  
  <div ref="canvas" style="display: block;z-index: 100;position: absolute;">
    <div style="width: 35vw;height: 20vw;position: absolute;z-index: 101;margin: 15vw 0 0 32%;" id="canvas_mb"></div>
  </div>
  <div class="main">
    <!-- content -->
    <!-- left -->
    <div id="left" v-show="is_compare == false">
      <!-- 入风口 -->
      <div id="enterPart">
        <div id="leftPartTitle">冷却器入口处</div>
        <div id="enterPart1" style="width: 23.4vw; height: 35vh"></div>
        <div id="enterPart2" style="width: 23.4vw; height: 35vh"></div>
      </div>
    </div>
    <!-- left2 -->
    <div id="left2" v-show="is_compare == true">
      <!-- 入风口 -->
      <div id="enterPart">
        <div id="leftPartTitle">冷却器出入口温度比较</div>
        <div id="enter2Part1" style="width: 23.4vw; height: 35vh"></div>
        <div id="enter2Part2" style="width: 23.4vw; height: 35vh"></div>
      </div>
    </div>
    <!-- center -->
    <div class="total">
      <canvas class="rain"></canvas>
      <div id="ratio">
        <h3>
          当前风量比:&nbsp;<span>{{ showair_VR(inlet_tem[inlet_tem.length-1]) }}</span>
        </h3>
      </div>
   
      <div class="sphere">
        <!-- <div class="sphere-bg"></div> -->
        <!-- <div class="sum"> -->
          
          <!-- <img src="../../assets/img/logo.png" style="width: 160px;margin: 110px 0 0 110px;
           -webkit-user-drag: none;-webkit-touch-callout: none;"> -->
          <!-- <span>运行时长</span> -->
          <!-- <p>{{ stay_hour }}:{{ stay_min }}:{{ stay_sec }}</p> -->
        <!-- </div> -->
      </div>
      <div class="cicle3"></div>
      <div class="cicle4"></div>
      <div class="cicle5"></div>
      <div class="cicle6"></div>
      <div class="cicle7"></div>
      <div class="cicle8" style="text-align: center" @click="showWbLengend()">
        <!-- <span style="margin-left: -4px">{{ outlet_tem[outlet_tem.length-1] }}°C</span>
        <p>送风温度</p> -->
        <span style="margin-left: -4px">{{ this.wb_efficiency }}%</span>
        <p>湿球效率</p>
      </div>
      <div class="cicle9" @click="showDpLengend()">
        <!-- <span>{{ inlet_humidity[inlet_humidity.length-1] }}%</span>
        <p>进口湿度</p> -->
        <span>{{ this.dp_efficiency}}%</span>
        <p>露点效率</p>
      </div>
      <div class="cicle10" style="text-align: center" @click="showDpWbLengend()">
        <!-- <span style="margin-left: -4px">{{ inlet_tem[inlet_tem.length-1] }}°C</span>
        <p>进风温度</p> -->
        <span style="margin-left: -4px">{{ this.t_wb }}°C</span>
        <p>湿球温度</p>
      </div>
      <div class="cicle11" @click="showDpWbLengend()">
        <!-- <span>{{ outlet_humidity[outlet_humidity.length-1] }}%</span>
        <p>出口湿度</p> -->
        <span style="margin-left: 15px">{{ this.t_dp }}°C</span>
        <p>露点温度</p>
      </div>
    </div>
    <!-- riht -->
    <div id="right" v-show="is_compare == false">
      <!-- 出风口 -->
      <div id="exitPart">
        <div id="rightPartTitle">冷却器出口处</div>
        <div id="exitPart1" style="width: 23.4vw; height: 35vh"></div>
        <div id="exitPart2" style="width: 23.4vw; height: 35vh"></div>
      </div>
    </div>
    <!-- right2 -->
    <div id="right2" v-show="is_compare == true">
      <!-- 出风口 -->
      <div id="exitPart">
        <div id="rightPartTitle">冷却器出入口湿度比较</div>
        <div id="exit2Part1" style="width: 23.4vw; height: 35vh"></div>
        <div id="exit2Part2" style="width: 23.4vw; height: 35vh"></div>
      </div>
    </div>
  </div>
  <!-- 底部模块 -->
  <div class="bottom" @click="changePart()">
    <h5 v-show="is_compare == false"><span>数据状况</span></h5>
    <p v-show="is_compare == false">Data Status</p>
    <h5 v-show="is_compare == true"><span>数据对比</span></h5>
    <p v-show="is_compare == true">Data Compare</p>
  </div>
  <!-- 历史湿球效率对话框 -->
  <el-dialog
    v-model="wbDialogVisible"
    width="80%"
    destroy-on-close
    center draggable
  >
    <div style="margin-top: -30px;">
      <h2 style="text-align: center;color: #ffffffc1;letter-spacing: 2px;font-family: 幼圆;">
        历史湿球效率变化图</h2>
    </div>
    <div v-if="t_wb_data.length!==0" id="wbHistoryLegend" style="width: 100%; height: 400px;"></div>
    <div v-else-if="t_wb_data.length===0" style="width: 100%; height: 400px;"></div>
    <div  style="position: absolute;right:30px;top:100px">
    <!-- <div v-if="t_wb_data.length!==0" style="position: absolute;right:30px;top:100px"> -->
      <div style="margin-top: 3px;">
        <div><span style="color: #9e9c9c;font-size: 8px;">存储时间间隔</span></div>
        <el-input v-model="input" :placeholder="meta_storage_time" @change="changeMetaTime()" 
        size="small" style="width: 71px;"/>
      </div>
      <el-button @click="refreshWbLegend()" size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff">刷新图表</span></el-button>
      <!-- <br>
        <el-button @click="changeLabelState()" size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff">{{showLabel==true?'隐藏':'显示'}}数值</span></el-button> -->
      <br>
        <el-button @click="clearWbData()" size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff">清除记录</span></el-button>
      <br>
        <el-button size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff"  @click="downloadWbCSV()">下载记录</span></el-button>
    </div>
  </el-dialog>
  <!-- 历史露点效率对话框 -->
  <el-dialog
    v-model="dpDialogVisible"
    width="80%"
    destroy-on-close
    center draggable
  >
    <div style="margin-top: -30px;">
      <h2 style="text-align: center;color: #ffffffc1;letter-spacing: 2px;font-family: 幼圆;">
        历史露点效率变化图</h2>
    </div>
    <div v-if="t_dp_data.length!==0" id="dpHistoryLegend" style="width: 100%; height: 400px;"></div>
    <div v-else-if="t_dp_data.length===0" style="width: 100%; height: 400px;"></div>
    <div style="position: absolute;right:30px;top:100px">
    <!-- <div v-if="t_dp_data.length!==0" style="position: absolute;right:30px;top:100px"> -->
      <div style="margin-top: 3px;">
        <div><span style="color: #9e9c9c;font-size: 8px;">存储时间间隔</span></div>
        <el-input v-model="input" :placeholder="meta_storage_time" @change="changeMetaTime()" 
        size="small" style="width: 71px;"/>
      </div>
      <el-button @click="refreshDpLegend()" size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff">刷新图表</span></el-button>
      <!-- <br>
        <el-button @click="changeLabelState()" size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff">{{showLabel==true?'隐藏':'显示'}}数值</span></el-button> -->
      <br>
        <el-button @click="clearDpData()" size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff">清除记录</span></el-button>
      <br>
        <el-button size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff"  @click="downloadDpCSV()">下载记录</span></el-button>
    </div>
  </el-dialog>
  <!-- 历史露点温度湿球温度对话框 -->
  <el-dialog
    v-model="dpWbDialogVisible"
    width="80%"
    destroy-on-close
    center draggable
  >
    <div style="margin-top: -30px;">
      <h2 style="text-align: center;color: #ffffffc1;letter-spacing: 2px;font-family: 幼圆;">
        历史露点温度及湿球温度变化图</h2>
    </div>
    <div v-if="dp_data.length!==0" id="dpTemHistoryLegend" style="width: 100%; height: 400px;"></div>
    <div v-else-if="dp_data.length===0" style="width: 100%; height: 400px;"></div>
    <div  style="position: absolute;right:30px;top:100px">
    <!-- <div v-if="t_dp_data.length!==0" style="position: absolute;right:30px;top:100px"> -->
      <div style="margin-top: 3px;">
        <div><span style="color: #9e9c9c;font-size: 8px;">存储时间间隔</span></div>
        <el-input v-model="input" :placeholder="meta_storage_time" @change="changeMetaTime()" 
        size="small" style="width: 71px;"/>
      </div>
      <el-button @click="refreshDpWbLegend()" size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff">刷新图表</span></el-button>
      <!-- <br>
        <el-button @click="changeLabelState()" size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff">{{showLabel==true?'隐藏':'显示'}}数值</span></el-button> -->
      <br>
        <el-button @click="clearDpWbData()" size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff">清除记录</span></el-button>
      <br>
        <el-button size="small" color="#0ac1c7b6" style="margin-top: 8px;">
        <span style="color:#fff"  @click="downloadDpWbCSV()">下载记录</span></el-button>
    </div>
  </el-dialog>
</template>
<script>
import "./main.css";
import "../../assets/js/main";
import * as echarts from "echarts";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import $ from "jquery";
import { ElNotification , ElMessage } from 'element-plus'
import axios from 'axios'
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      is_compare: false, // 是否展示数据对比 （bool）
      stay_hour: "00",   // 运行小时数
      stay_min: "00",    // 分钟数
      stay_sec: "00",    // 秒数
      staytime_gap: new Date().getTime(), // 系统运行时间
      inlet_humidity:[],   // 入口湿度数据数组
      inlet_tem: [],       // 入口温度数据数组
      outlet_tem: [],      // 出口温度数据数组
      outlet_humidity: [], // 出口湿度数据数组
      tem_diff:[],         // 出入口温度差
      humidity_diff:[],    // 出入口湿度差
      air_timer: null,  // 当前风量比
      change_time:3000, // 所有图例渲染更新时间（1000ms = 1s）
      max_length: 5,   // 所有展示数据最大长度
      history_time:[],  // 当前展示数据的所属时间（次）
      meta_time:1,      // 最小测量时间单位（次）
      air_VR: [         // 风量比数据数组
        1.6, 1.6, 1.6, 1.7, 1.8, 1.8, 1.8, 2.4, 2.5, 2.6, 2.8, 2.8, 3.0, 3.1,
        3.1, 3.1, 3.1, 3.1, 3.2,
      ],
      currentair_VR: 3.2,// 当前风量比
      wb_efficiency: 0,   // 湿球效率
      dp_efficiency: 0, // 露点效率
      t_wb:0, // 湿球温度 
      t_dp:0, // 露点效率
      wbDialogVisible:false,  // 历史湿球效率对话框
      dpDialogVisible:false, // 历史露点效率对话框
      dpWbDialogVisible:false, // 历史湿球露点温度对话框
      t_wb_data:[],  // 湿球效率历史记录
      t_dp_data:[],  // 露点效率历史记录
      wb_data:[],    // 湿球温度历史记录
      dp_data:[],    // 露点温度历史记录
      showLabel:true, // 是否历史图表显示数值
      meta_storage_time:10, // 存储历史数据最小间隔时间
      wb_history_storage_time:[], // 存储湿球历史数据时间
      dp_history_storage_time:[], // 存储露点历史数据时间
      input:'', // 记录修改后的存储间隔
      change_time_Input:'', // 记录修改后的全局图表刷新时间间隔
      wb_csvData:[],  // 提供下载的湿球效率数据
      dp_csvData:[],  // 提供下载的露点效率数据
      dp_wb_csvData:[],  // 提供下载的露点与湿球温度数据
      isDragging: false, // 是否可以拖动模型
      lastMouseX: 0, // 鼠标x坐标
      lastMouseY: 0, // 鼠标y坐标
      autoRotate: true, // 是否启用自动旋转
      loadedModel: null, // 存储加载的模型
      isAutoRotating: true,    // 启用自动旋转
      isMouseDragging: false,   // 鼠标交互时禁用模型自传
      temperatureRanges: [      // 风量比区间
        { min: 0, max: 27, value: 2.8 },
        { min: 27, max: 29, value: 2.8 },
        { min: 29, max: 30, value: 2.5 },
        { min: 30, max: 31, value: 1.8 },
        { min: 31, max: 32, value: 3.5 },
        { min: 32, max: 33, value: 2.2 },
        { min: 33, max: 1000, value: 2.2 }
      ],
    };
  },
  methods: {

    // ************************************  数据获取  ************************************
    // 动态获取并更新、存储串口数据
    loadData() {
        axios.get('/src/assets/data.csv')
        .then(response => {

          // 处理CSV数据，分割取得，将其新数据存储到局部变量
          let new_inlet_humidity = response.data.substring(1, 3);   // 入口湿度
          let new_inlet_tem = parseFloat(response.data.substring(4, 6));        // 入口温度整数部分
          let new_inlet_tem_l = parseFloat(response.data.substring(7, 8)*0.1);        // 入口温度小数部分
          new_inlet_tem+=new_inlet_tem_l;
          let new_outlet_humidity = response.data.substring(10, 12);  // 出口湿度
          let new_outlet_tem = parseFloat(response.data.substring(13, 15));     // 出口温度整数部分
          let new_outlet_humidity_l = parseFloat(response.data.substring(16, 17)*0.1);  // 出口温度小数部分
          new_outlet_tem+=new_outlet_humidity_l;

          // let rn = Math.floor(Math.random() * 10) + 1;
          // // 将整数除以 100，得到 0.01 到 0.1 之间的随机小数
          // rn = rn / 10;
          // let new_outlet_humidity = (parseFloat(response.data.substring(1, 3))-rn).toFixed(1);   // 入口湿度
          // let new_outlet_tem = (parseFloat(response.data.substring(4, 6))-rn).toFixed(1)        // 入口温度
          // let new_inlet_humidity = (parseFloat(response.data.substring(7, 9))-rn).toFixed(1) // 出口湿度
          // let new_inlet_tem = (parseFloat(response.data.substring(10, 12))-rn).toFixed(1);     // 出口温度

          let new_tem_diff = (new_inlet_tem - new_outlet_tem ).toFixed(1)      // 出入口温度差
          let new_humidity_diff = new_inlet_humidity - new_outlet_humidity   // 出入口温度差
          
          // 更新数据数组，最大存入5个数据，若达到5个则数据前移一位，第五位存最新数据
          if (this.inlet_humidity.length < this.max_length) {

            // 如果数据数量小于5，直接添加到数组末尾
            this.inlet_humidity.push(new_inlet_humidity);
            this.inlet_tem.push(new_inlet_tem);
            this.outlet_humidity.push(new_outlet_humidity);
            this.outlet_tem.push(new_outlet_tem);
            this.tem_diff.push(new_tem_diff);
            this.humidity_diff.push(new_humidity_diff);
            
          } else {

            // 如果数据数量已经是5个，先移除第一个数据，然后将新数据添加到数组末尾
            this.inlet_humidity.shift();
            this.inlet_humidity.push(new_inlet_humidity);
            this.inlet_tem.shift();
            this.inlet_tem.push(new_inlet_tem);
            this.outlet_humidity.shift()
            this.outlet_humidity.push(new_outlet_humidity);
            this.outlet_tem.shift();
            this.outlet_tem.push(new_outlet_tem);
            this.tem_diff.shift()
            this.tem_diff.push(new_tem_diff);
            this.humidity_diff.shift();
            this.humidity_diff.push(new_humidity_diff);
          }

          // 更新数据检测时间
          let time = 0
          // 同样只取五个
          if(this.history_time.length!= 0){
            time = this.meta_time + this.history_time[this.history_time.length-1]
          }
          else{
            time += 1
          }
          if (this.history_time.length < this.max_length) {
            this.history_time.push(time)
          } else {
            this.history_time.shift();
            this.history_time.push(time)
          }
          // 存放历史数据时间
          if(this.history_time[this.history_time.length-1]%this.meta_storage_time==0){
            this.wb_history_storage_time.push(time)
            this.dp_history_storage_time.push(time)
          }
        })
        // 抛出异常
        .catch(error => {
          console.error('Failed to fetch CSV data:', error);
        });
    },
    // 获取湿球和露点温度并生成效率
    catchData(){
      axios.get('/src/assets/twb_tdp.txt')
        .then(response => {
          const arr = response.data.split(" "); // 分割出两个参数
          this.t_wb = arr[0]; // 存放湿球温度
          this.t_dp = arr[1]; // 存放露点温度
          let in_t_db =  this.inlet_tem[this.inlet_tem.length-1] // 当前入口温度
          let tem_diff = Math.abs(this.tem_diff[this.tem_diff.length-1]) // 温降(温差)
          this.wb_efficiency = parseFloat( tem_diff / ( in_t_db- this.t_wb ) ).toFixed(1)
          this.dp_efficiency = parseFloat( tem_diff / ( in_t_db- this.t_dp ) ).toFixed(1)

          // console.log('data',this.wb_efficiency, this.wb_efficiency)
          // let out_t_db =  this.outlet_tem[this.outlet_tem.length-1] // 当前排风干球温度
          // this.wb_efficiency = (( in_t_db - out_t_db ) / ( in_t_db - this.t_wb ) * 100 ).toFixed(1)
          // this.dp_efficiency = (( in_t_db - out_t_db ) / ( in_t_db - this.t_dp ) * 100 ).toFixed(1)
          // let wb = ( parseFloat(this.wb_efficiency) + Math.random()*20/10 ).toFixed(2)
          // let dp = ( parseFloat(this.dp_efficiency) + Math.random()*20/10 ).toFixed(2)

          if(this.history_time[this.history_time.length-1]%this.meta_storage_time==0){
            // 在间隔设定时间内存储一次数据
            this.t_wb_data.push(this.wb_efficiency)
            this.t_dp_data.push(this.dp_efficiency)
            this.wb_data.push(this.t_wb)
            this.dp_data.push(this.t_dp)
          }
      })
    },

    // ************************************  数据状况图例  ************************************
    // 入口温度图例
    inletAirTem() {
      let myChartL1 = echarts.init(document.getElementById("enterPart1"));
      var option;

      option = {
        title: {
          text: "进风温度(°C)",
          textStyle: { color: "rgba(10, 191, 197)" },
        },
        tooltip: {
          // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: "axis",
          backgroundColor: "rgba(10, 191, 197,.4)",
          borderColor: "rgba(32, 33, 36,0.20)",
          borderWidth: 1,
          textStyle: {
            // 文字提示样式
            color: "#fff",
            fontSize: "12",
          },
          axisPointer: {
            // 坐标轴虚线
            type: "cross",
            label: {
              backgroundColor: "#0abfc5",
            },
          },
          formatter:function(params){
            var html = '第' + params[0].name + '次记录' + "<br/>";
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fff"></span>'
            for(var i=0;i<params.length;i++){
            html +=
              dotHtml +params[i].seriesName+"&emsp;&emsp;"+
              params[i].value +"°C"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          data: this.history_time,
        },
        yAxis: {},
        dataZoom: [
          {
            // 第一个 dataZoom 组件
            type: "inside",
            xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
            startValue: 0, // 数据窗口范围的起始数值index
            endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
          },
        ],
        series: [
          {
            name: "温度",
            type: "line",
            data: this.inlet_tem,
            label: {
              // 显示数值
              show: true,
              position: "top",
              color: "#FFFFFF",
            },
            itemStyle: {
              // 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(51,192,197)",
                },
              },
            },
          },
        ],
      };

      option && myChartL1.setOption(option);
      window.onresize = function () {
        //自适应大小
        myChartL1.resize();
      };
      setInterval(() => {
        myChartL1.setOption(option);
      }, this.change_time);
    },
    // 入口湿度图例
    inletHumidity() {
      let myChartL2 = echarts.init(document.getElementById("enterPart2"));
      // 绘制图表
      var option;
      option = {
        title: {
          text: "进风湿度(%)",
          textStyle: { color: "rgb(242, 151, 1)" },
        },
        tooltip: {
          // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: "axis",
          backgroundColor: "rgba(242, 151, 1,.4)",
          borderColor: "rgba(32, 33, 36,0.20)",
          borderWidth: 1,
          textStyle: {
            // 文字提示样式
            color: "#fff",
            fontSize: "12",
          },
          axisPointer: {
            // 坐标轴虚线
            type: "cross",
            label: {
              backgroundColor: "rgb(242, 151, 1)",
            },
          },
          formatter:function(params){
            var html = '第' + params[0].name + '次记录' + "<br/>";
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fff"></span>'
            for(var i=0;i<params.length;i++){
            html +=
              dotHtml +params[i].seriesName+"&emsp;&emsp;"+
              params[i].value +"%"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          data: this.history_time,
        },
        yAxis: {},
        dataZoom: [
          {
            // 第一个 dataZoom 组件
            type: "inside",
            xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
            startValue: 0, // 数据窗口范围的起始数值index
            endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
          },
        ],
        series: [
          {
            name: "湿度",
            type: "bar",
            data: this.inlet_humidity,
            label: {
              // 显示数值
              show: true,
              position: "top",
              color: "#FFFFFF",
            },
            color: echarts.graphic.LinearGradient(
              0,
              1,
              0,
              0,
              [
                {
                  offset: 0,
                  color: "rgb(242, 151, 1, 0.1)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgb(242, 151, 1, .7)", // 100% 处的颜色
                },
              ],
              false
            ),
          },
        ],
      };
      option && myChartL2.setOption(option);
      window.onresize = function () {
        //自适应大小
        myChartL2.resize();
      };
      let index = 0;
      setInterval(() => {
        // index = option.dataZoom[0].endValue;
        // if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
        //   option.dataZoom[0].endValue = 4;
        //   this.currentshidu2 = this.shidu2[index];
        //   option.dataZoom[0].startValue = 0;
        // } else {
        //   this.currentshidu2 = this.shidu2[index];
        //   option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
        //   option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        // }
        myChartL2.setOption(option);
      }, this.change_time);
    },
    // 出口温度图例
    exhaustTem() {
      let myChartR1 = echarts.init(document.getElementById("exitPart1"));
      // 绘制图表
      var option;

      option = {
        title: {
          text: "排风温度(°C)",
          textStyle: { color: "rgba(10, 191, 197)" },
        },
        tooltip: {
          // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: "axis",
          backgroundColor: "rgba(10, 191, 197,.4)",
          borderColor: "rgba(32, 33, 36,0.20)",
          borderWidth: 1,
          textStyle: {
            // 文字提示样式
            color: "#fff",
            fontSize: "12",
          },
          axisPointer: {
            // 坐标轴虚线
            type: "cross",
            label: {
              backgroundColor: "#0abfc5",
            },
          },
          formatter:function(params){
            var html = '第' + params[0].name + '次记录' + "<br/>";
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fff"></span>'
            for(var i=0;i<params.length;i++){
            html +=
              dotHtml +params[i].seriesName+"&emsp;&emsp;"+
              params[i].value +"°C"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          data: this.history_time,
        },
        yAxis: {},
        dataZoom: [
          {
            // 第一个 dataZoom 组件
            type: "inside",
            xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
            startValue: 0, // 数据窗口范围的起始数值index
            endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
          },
        ],
        series: [
          {
            name: "温度",
            type: "line",
            data: this.outlet_tem,
            label: {
              // 显示数值
              show: true,
              position: "top",
              color: "#FFFFFF",
            },
            itemStyle: {
              // 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(51,192,197)",
                },
              },
            },
          },
        ],
      };
      myChartR1.setOption(option);
      window.onresize = function () {
        //自适应大小
        myChartR1.resize();
      };
      setInterval(() => {
        myChartR1.setOption(option);
      }, this.change_time);
    },
    // 出口湿度图例
    exhaustHumidity() {
      let myChartR2 = echarts.init(document.getElementById("exitPart2"));
      // 绘制图表
      var option;
      option = {
        title: {
          text: "排风湿度(%)",
          textStyle: { color: "rgb(242, 151, 1)" },
        },
        tooltip: {
          // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: "axis",
          backgroundColor: "rgba(242, 151, 1,.4)",
          borderColor: "rgba(32, 33, 36,0.20)",
          borderWidth: 1,
          textStyle: {
            // 文字提示样式
            color: "#fff",
            fontSize: "12",
          },
          axisPointer: {
            // 坐标轴虚线
            type: "cross",
            label: {
              backgroundColor: "rgb(242, 151, 1)",
            },
          },
          formatter:function(params){
            var html = '第' + params[0].name + '次记录' + "<br/>";
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#fff"></span>'
            for(var i=0;i<params.length;i++){
            html +=
              dotHtml +params[i].seriesName+"&emsp;&emsp;"+
              params[i].value +"%"+"<br/>";
            }
            return html 
          },
        },
        dataZoom: [
          {
            // 第一个 dataZoom 组件
            type: "inside",
            xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
            startValue: 0, // 数据窗口范围的起始数值index
            endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
          },
        ],
        xAxis: {
          data: this.history_time,
        },
        yAxis: {},
        series: [
          {
            name: "湿度",
            type: "bar",
            data: this.outlet_humidity,
            label: {
              // 显示数值
              show: true,
              position: "top",
              color: "#FFFFFF",
            },
            color: echarts.graphic.LinearGradient(
              0,
              1,
              0,
              0,
              [
                {
                  offset: 0,
                  color: "rgb(242, 151, 1, 0.1)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgb(242, 151, 1, .7)", // 100% 处的颜色
                },
              ],
              false
            ),
          },
        ],
      };
      option && myChartR2.setOption(option);
      window.onresize = function () {
        //自适应大小
        myChartR2.resize();
      };
      setInterval(() => {
        myChartR2.setOption(option);
      }, this.change_time);
    },

    // ************************************  数据对比图例  ************************************
    // 出入口温度对比图例
    temContrast() {
      let myChartL21 = echarts.init(document.getElementById("enter2Part1"));
      // 绘制图表
      var option;

      option = {
        title: {
          text: "温度对比(°C)",
          textStyle: { color: "rgba(10, 191, 197)" },
        },
        tooltip: {
          // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: "axis",
          backgroundColor: "rgba(10, 191, 197,.4)",
          borderColor: "rgba(32, 33, 36,0.20)",
          borderWidth: 1,
          textStyle: {
            // 文字提示样式
            color: "#fff",
            fontSize: "12",
          },
          axisPointer: {
            // 坐标轴虚线
            type: "cross",
            label: {
              backgroundColor: "#0abfc5",
            },
          },
          formatter:function(params){
            var html = '第' + params[0].name + '次记录' + "<br/>";
            for(var i=0;i<params.length;i++){
            html +=
              params[i].marker +params[i].seriesName+"&emsp;&emsp;"+
              params[i].value +"°C"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          data: this.history_time,
        },
        dataZoom: [
          {
            // 第一个 dataZoom 组件
            type: "inside",
            xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
            startValue: 0, // 数据窗口范围的起始数值index
            endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
          },
        ],
        yAxis: {},
        series: [
          {
            name: "入口温度",
            type: "line",
            data: this.inlet_tem,
            label: {
              // 显示数值
              show: true,
              position: "top",
              color: "#FFFFFF",
            },
            itemStyle: {
              // 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(51,192,197)",
                },
              },
            },
          },
          {
            name: "出口温度",
            type: "line",
            data: this.outlet_tem,
            label: {
              // 显示数值
              show: true,
              position: "bottom",
              color: "#FFFFFF",
            },
            itemStyle: {
              // 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(242, 151, 1)",
                },
              },
            },
          },
        ],
      };
      option && myChartL21.setOption(option);
      window.onresize = function () {
        //自适应大小
        myChartL21.resize();
      };
      setInterval(() => {
        myChartL21.setOption(option);
      }, this.change_time);
    },
    // 温度差图例
    temDifference() {
      let myChartL22 = echarts.init(document.getElementById("enter2Part2"));
      // 绘制图表
      var option;
      option = {
        title: { text: "温差(°C)", textStyle: { color: "rgb(242, 151, 1)" } },
        tooltip: {
          // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: "axis",
          backgroundColor: "rgba(242, 151, 1,.4)",
          borderColor: "rgba(32, 33, 36,0.20)",
          borderWidth: 1,
          textStyle: {
            // 文字提示样式
            color: "#fff",
            fontSize: "12",
          },
          axisPointer: {
            // 坐标轴虚线
            type: "cross",
            label: {
              backgroundColor: "rgb(242, 151, 1)",
            },
          },
          formatter:function(params){
            var html = '第' + params[0].name + '次记录' + "<br/>";
            for(var i=0;i<params.length;i++){
            html +=
              params[i].marker +params[i].seriesName+"&emsp;&emsp;"+
              params[i].value +"°C"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          data: this.history_time,
        },
        dataZoom: [
          {
            // 第一个 dataZoom 组件
            type: "inside",
            xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
            startValue: 0, // 数据窗口范围的起始数值index
            endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
          },
        ],
        yAxis: {},
        series: [
          {
            name: "温差值",
            type: "line",
            data: this.tem_diff,
            label: {
              // 显示数值
              show: true,
              position: "top",
              color: "#FFFFFF",
            },
            itemStyle: {
              // 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(242, 151, 1)",
                },
              },
            },
            areaStyle: {
              //区域填充渐变颜色
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(242, 151, 1,0.7)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(242, 151, 1,0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      };
      option && myChartL22.setOption(option);
      window.onresize = function () {
        //自适应大小
        myChartL22.resize();
      };
      setInterval(() => {
        myChartL22.setOption(option);
      }, this.change_time);
    },
    // 出入口湿度对比图例
    humidityContrast() {
      let myChartR21 = echarts.init(document.getElementById("exit2Part1"));
      // 绘制图表
      var option;

      option = {
        title: {
          text: "湿度对比(%)",
          textStyle: { color: "rgba(10, 191, 197)" },
        },
        tooltip: {
          // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: "axis",
          backgroundColor: "rgba(10, 191, 197,.4)",
          borderColor: "rgba(32, 33, 36,0.20)",
          borderWidth: 1,
          textStyle: {
            // 文字提示样式
            color: "#fff",
            fontSize: "12",
          },
          axisPointer: {
            // 坐标轴虚线
            type: "cross",
            label: {
              backgroundColor: "#0abfc5",
            },
          },
          formatter:function(params){
            var html = '第' + params[0].name + '次记录' + "<br/>";
            for(var i=0;i<params.length;i++){
            html +=
              params[i].marker +params[i].seriesName+"&emsp;&emsp;"+
              params[i].value +"%"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          data: this.history_time,
        },
        dataZoom: [
          {
            // 第一个 dataZoom 组件
            type: "inside",
            xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
            startValue: 0, // 数据窗口范围的起始数值index
            endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
          },
        ],
        yAxis: {
          // min: 48,
          // max: 49.7,
        },
        series: [
          {
            name: "入口湿度",
            type: "line",
            data: this.inlet_humidity,
            label: {
              // 显示数值
              show: true,
              position: "top",
              color: "#FFFFFF",
            },
            itemStyle: {
              // 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(51,192,197)",
                },
              },
            },
          },
          {
            name: "出口湿度",
            type: "line",
            data: this.outlet_humidity,
            label: {
              // 显示数值
              show: true,
              position: "bottom",
              color: "#FFFFFF",
            },
            itemStyle: {
              // 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(242, 151, 1)",
                },
              },
            },
          },
        ],
      };
      option && myChartR21.setOption(option);
      window.onresize = function () {
        //自适应大小
        myChartR21.resize();
      };
      setInterval(() => {
        myChartR21.setOption(option);
      }, this.change_time);
    },
    // 湿度差图例
    humidityDifference() {
      let myChartR22 = echarts.init(document.getElementById("exit2Part2"));
      // 绘制图表
      var option;
      option = {
        title: { text: "湿度差(%)", textStyle: { color: "rgb(242, 151, 1)" } },
        tooltip: {
          // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: "axis",
          backgroundColor: "rgba(242, 151, 1,.4)",
          borderColor: "rgba(32, 33, 36,0.20)",
          borderWidth: 1,
          textStyle: {
            // 文字提示样式
            color: "#fff",
            fontSize: "12",
          },
          axisPointer: {
            // 坐标轴虚线
            type: "cross",
            label: {
              backgroundColor: "rgb(242, 151, 1)",
            },
          },
          formatter:function(params){
            var html = '第' + params[0].name + '次记录' + "<br/>";
            for(var i=0;i<params.length;i++){
            html +=
              params[i].marker +params[i].seriesName+"&emsp;&emsp;"+
              params[i].value +"%"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          data: this.history_time,
        },
        dataZoom: [
          {
            // 第一个 dataZoom 组件
            type: "inside",
            xAxisIndex: 0, // 表示这个 dataZoom 组件控制 第一个 xAxis
            startValue: 0, // 数据窗口范围的起始数值index
            endValue: 4, // 数据窗口范围的结束数值index，即一次性展示多少个
          },
        ],
        yAxis: {
          // min: 0,
          // max: 0.25,
        },
        series: [
          {
            name: "湿度差值",
            type: "line",
            data: this.humidity_diff,
            label: {
              // 显示数值
              show: true,
              position: "top",
              color: "#FFFFFF",
            },
            itemStyle: {
              // 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(242, 151, 1)",
                },
              },
            },
            areaStyle: {
              //区域填充渐变颜色
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(242, 151, 1,0.7)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(242, 151, 1,0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      };
      option && myChartR22.setOption(option);
      window.onresize = function () {
        //自适应大小
        myChartR22.resize();
      };
      setInterval(() => {
        myChartR22.setOption(option);
      }, this.change_time);
    },

    // ************************************  历史记录面板  ************************************ 
    // ************ 湿球效率 **************
    // 展示湿球图例
    showWbLengend(){
      this.wbDialogVisible=true
      $(document).ready(()=>{ // 确保元素已加载完成
        this.wbHistoricalLegend();
      });
    },
    // 历史湿球效率图例
    wbHistoricalLegend(){
      let historyChart = echarts.init(document.getElementById("wbHistoryLegend"));
      // 绘制图表
      var option;
      option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          },
          formatter:function(params){
            var html = '第 ' + params[0].name + ' 次记录' + "<br/>";
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:rgb(235, 147, 2)"></span>'
            for(var i=0;i<params.length;i++){
            html +=
              dotHtml +params[i].seriesName+"&emsp;&emsp;"+ params[i].value +"%"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.wb_history_storage_time
        },
        yAxis: {
          type: 'value',
          // boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [
          {
            name: '湿球效率',
            type: 'line',
            // symbol: 'none',
            // sampling: 'lttb',
            itemStyle: {
              color: 'rgb(235, 147, 2,.7)'
            },
            splitLine: {
              lineStyle: {
                  color: "#a0a1a1"
              }
            },
            label: {
              // 显示数值
              show: this.showLabel,
              position: "top",
              color: "#FFFFFF",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(235, 147, 2,.1)'
                },
                {
                  offset: 1,
                  color: 'rgb(235, 147, 2)'
                }
              ])
            },
            data: this.t_wb_data
          }
        ]
      };
      option && historyChart.setOption(option);
      window.onresize = function () {
        //自适应大小
        historyChart.resize();
      };
      setInterval(() => {
        historyChart.setOption(option);
      }, this.change_time*this.meta_storage_time);
    },
    // 修改历史图表数值显示或隐藏
    changeLabelState(){
      this.showLabel = !this.showLabel
      this.showWbLengend()
    },
    // 刷新图表
    refreshWbLegend(){
      if(this.t_wb_data.length==0){
        ElMessage({
          message: '时间间隔较短，暂无数据，请稍后再试',
          type: 'warning',
        })
      }
      this.wbHistoricalLegend()
    },
    // 修改历史数据存储时间间隔
    changeMetaTime(){
      ElNotification({
        // title: 'Success',
        message: '修改成功',
        type: 'success',
      })
      this.meta_storage_time = this.input
    },
    // 清除记录
    clearWbData(){
      this.t_wb_data=[]
      this.wb_history_storage_time=[]
    },
    // 下载历史记录
    downloadWbCSV(){
      // 将时间和效率数组转换为对象数组
      this.wb_csvData = this.wb_history_storage_time.map((t, i) => ({
        time: t,
        wb_efficiency: this.t_wb_data[i]
      }));

      // 使用 Papa.unparse() 和 FileSaver.saveAs() 将对象数组转换为 CSV 文件并下载
      const csv = Papa.unparse(this.wb_csvData, { header: true });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, '湿球效率历史数据.csv');
    },    
    
    // ************ 露点效率 **************
    // 展示露点图例
    showDpLengend(){
      this.dpDialogVisible=true
      $(document).ready(()=>{ // 确保元素已加载完成
        this.dpHistoricalLegend();
      });
    },
    // 历史露点效率图例
    dpHistoricalLegend(){
      let historyChart2 = echarts.init(document.getElementById("dpHistoryLegend"));
      // 绘制图表
      var option;
      option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          },
          formatter:function(params){
            var html = '第 ' + params[0].name + ' 次记录' + "<br/>";
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:rgb(235, 147, 2)"></span>'
            for(var i=0;i<params.length;i++){
            html +=
              dotHtml +params[i].seriesName+"&emsp;&emsp;"+ params[i].value +"%"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dp_history_storage_time
        },
        yAxis: {
          type: 'value',
          // boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [
          {
            name: '露点效率',
            type: 'line',
            // symbol: 'none',
            // sampling: 'lttb',
            itemStyle: {
              color: 'rgb(46, 192, 196,.7)'
            },
            splitLine: {
              lineStyle: {
                  color: "#a0a1a1"
              }
            },
            label: {
              // 显示数值
              show: this.showLabel,
              position: "top",
              color: "#FFFFFF",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(46, 192, 196,.1)'
                },
                {
                  offset: 1,
                  color: 'rgb(46, 192, 196)'
                }
              ])
            },
            data: this.t_dp_data
          }
        ]
      };
      option && historyChart2.setOption(option);
      window.onresize = function () {
        //自适应大小
        historyChart2.resize();
      };
      setInterval(() => {
        historyChart2.setOption(option);
      }, this.change_time*this.meta_storage_time);
    },
    // 修改历史图表数值显示或隐藏
    changeLabelState(){
      this.showLabel = !this.showLabel
      this.showWbLengend()
    },
    // 刷新图表
    refreshDpLegend(){
      if(this.t_dp_data.length==0){
        ElMessage({
          message: '时间间隔较短，暂无数据，请稍后再试',
          type: 'warning',
        })
      }
      this.dpHistoricalLegend()
    },
    // 修改历史数据存储时间间隔
    changeMetaTime(){
      ElNotification({
        // title: 'Success',
        message: '修改成功',
        type: 'success',
      })
      this.meta_storage_time = this.input
    },
    // 清除记录
    clearDpData(){
      this.t_dp_data=[]
      this.dp_history_storage_time=[]
    },
    // 下载历史记录
    downloadDpCSV(){
      // 将时间和效率数组转换为对象数组
      this.dp_csvData = this.dp_history_storage_time.map((t, i) => ({
        time: t,
        dp_efficiency: this.t_dp_data[i]
      }));

      ElMessage({
          message: '正在下载，请稍等',
          type: 'success',
        })

      // 使用 Papa.unparse() 和 FileSaver.saveAs() 将对象数组转换为 CSV 文件并下载
      const csv = Papa.unparse(this.dp_csvData, { header: true });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, '露点效率历史数据.csv');
    },    

    // ************ 湿球&&露点温度 **************
    // 展示湿球露点温度图例
    showDpWbLengend(){
      this.dpWbDialogVisible=true
      $(document).ready(()=>{ // 确保元素已加载完成
        this.dpWbHistoricalLegend();
      });
    },
    // 历史湿球&&露点温度图例
    dpWbHistoricalLegend(){
      let historyChart3 = echarts.init(document.getElementById("dpTemHistoryLegend"));
      // 绘制图表
      var option;
      option = {
        tooltip: {
          trigger: 'axis',
          position: function (pt) {
            return [pt[0], '10%'];
          },
          formatter:function(params){
            var html = '第' + params[0].name + '次记录' + "<br/>";
            for(var i=0;i<params.length;i++){
            html +=
              params[i].marker +params[i].seriesName+"&emsp;&emsp;"+
              params[i].value +"°C"+"<br/>";
            }
            return html 
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dp_history_storage_time
        },
        yAxis: {
          type: 'value',
          // boundaryGap: [0, '100%']
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [
          {
            name: '湿球温度',
            type: 'line',
            // symbol: 'none',
            // sampling: 'lttb',
            itemStyle: {
              color: 'rgb(51,192,197,.7)'
            },
            splitLine: {
              lineStyle: {
                  color: "#a0a1a1"
              }
            },
            label: {
              // 显示数值
              show: this.showLabel,
              position: "top",
              color: "#FFFFFF",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(51,192,197,.9)'
                },
                {
                  offset: 1,
                  color: 'rgb(51,192,197)'
                }
              ])
            },
            data: this.wb_data
          },
          {
            name: '露点温度',
            type: 'line',
            // symbol: 'none',
            // sampling: 'lttb',
            itemStyle: {
              color: 'rgb(242, 151, 1,.7)'
            },
            splitLine: {
              lineStyle: {
                  color: "#a0a1a1"
              }
            },
            label: {
              // 显示数值
              show: this.showLabel,
              position: "top",
              color: "#FFFFFF",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(242, 151, 1,.9)'
                },
                {
                  offset: 1,
                  color: 'rgb(242, 151, 1)'
                }
              ])
            },
            data: this.dp_data
          }
        ]
      };
      option && historyChart3.setOption(option);
      window.onresize = function () {
        //自适应大小
        historyChart3.resize();
      };
      setInterval(() => {
        historyChart3.setOption(option);
      }, this.change_time*this.meta_storage_time);
    },
    // 刷新图表
    refreshDpWbLegend(){
      if(this.dp_data.length==0){
        ElMessage({
          message: '时间间隔较短，暂无数据，请稍后再试',
          type: 'warning',
        })
      }
      this.dpWbHistoricalLegend()
    },
    // 修改历史数据存储时间间隔
    changeMetaTime(){
      ElNotification({
        // title: 'Success',
        message: '修改成功',
        type: 'success',
      })
      this.meta_storage_time = this.input
    },
    // 清除记录
    clearDpWbData(){
      this.dp_data=[]
      this.wb_data=[]
      this.dp_history_storage_time=[]
    },
    // 下载历史记录
    downloadDpWbCSV(){
      // 将时间和效率数组转换为对象数组
      this.dp_wb_csvData = this.dp_history_storage_time.map((t, i) => ({
        time: t,
        dp: this.dp_data[i],
        wb: this.wb_data[i]
      }));

      ElMessage({
        message: '正在下载，请稍等',
        type: 'success',
      })

      const csv = Papa.unparse(this.dp_wb_csvData, { header: true });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, '露点温度与湿球温度历史数据.csv');
    }, 

    // ************************************  3D模型  ************************************
    // 初始化three.js场景
    initThree() {
      // 创建场景
      this.scene = new THREE.Scene();
      
      // 创建相机
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 13;

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // 将渲染器的 alpha 属性设置为 true，即开启透明背景
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x000000, 0); // 将场景背景设置为透明

      // 将渲染器添加到页面中
      this.$refs.canvas.appendChild(this.renderer.domElement);
    },
    // 记载obj模型文件
    loadOBJModel() {
      // 创建OBJ加载器
      const loader = new OBJLoader();

      // 加载OBJ模型
      loader.load(
        'src/assets/demo.obj', // 替换为你的OBJ文件路径
        (object) => {
          // 将加载的模型添加到场景中
          this.scene.add(object);

           // 添加光源
          const ambientLight = new THREE.AmbientLight(0x0c1727, 1.0); // 白色环境光
          this.scene.add(ambientLight);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // 白色平行光
          directionalLight.position.set(1, 1, 1); // 设置光源位置
          this.scene.add(directionalLight);

          // 添加材质
          const material = new THREE.MeshPhongMaterial({ 
            color: 0xbfd6dd, 
            transparent: true,    // 设置材质为透明
            opacity: 0.8          // 透明度
          }); // 使用Phong材质，颜色设置为浅灰色
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = material;
            }
          });
           // 保存加载的模型
           this.loadedModel = object;
           this.loadedModel.rotation.z = Math.PI / 1.5; // 旋转模型
        },
        (xhr) => {
          // 进度回调（可选）
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          // 错误回调（可选）
          console.error('加载模型时出错', error);
        }
      );
        
      // 添加事件监听器来跟踪鼠标在canvas上的悬浮状态并更改鼠标样式
      this.$refs.canvas.addEventListener('mouseleave', this.onMouseLeaveCanvas);

      // 添加事件监听器来启用或禁用自动旋转
      this.$refs.canvas.addEventListener('click', this.toggleAutoRotation);

      // 添加事件监听器来跟踪鼠标在canvas上的交互
      this.$refs.canvas.addEventListener('mousedown', this.onMouseDown);
      this.$refs.canvas.addEventListener('mouseup', this.onMouseUp);
      this.$refs.canvas.addEventListener('mousemove', this.onMouseMove);

    },
    addMouseInteractions() {
      // 添加鼠标事件监听器
      this.$refs.canvas.addEventListener('mousedown', this.onMouseDown);
      this.$refs.canvas.addEventListener('mouseup', this.onMouseUp);
      this.$refs.canvas.addEventListener('mousemove', this.onMouseMove);
    },
    onMouseDown(event) {
      // 鼠标按下时，记录鼠标位置
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
      this.isDragging = true;
    },
    onMouseUp() {
      // 鼠标松开时，停止拖动
      this.isDragging = false;
    },
    onMouseMove(event) {
      // 鼠标拖动时，根据鼠标位移旋转模型
      if (this.isDragging && this.loadedModel) {
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;

        // 根据鼠标位移更新模型的旋转角度
        this.loadedModel.rotation.y += deltaX * 0.01;

        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
      }
    },
    // 添加新方法来切换自动旋转
    toggleAutoRotation() {
      this.isAutoRotating = !this.isAutoRotating;
    },
    // 添加新方法来处理鼠标进入canvas并更改鼠标样式
    onMouseEnterCanvas(event) {
      this.$refs.canvas.style.cursor = 'url(../../assets/img/3D.png),auto';
    },
    // 修改animate()方法以包含新的功能
    animate() {
      requestAnimationFrame(this.animate);

      // 自动旋转模型
      if (this.isAutoRotating && this.loadedModel) {
        this.loadedModel.rotation.y += 0.005;
      }

      // 仅在不使用鼠标拖动时渲染场景
      if (!this.isMouseDragging) {
        this.renderer.render(this.scene, this.camera);
      }

    },

    // ************************************  其他方法  ************************************
    // 展示风量比
    showair_VR(temperature) {
      const range = this.temperatureRanges.find(
        (range) => temperature >= range.min && temperature < range.max
      );
      return range ? range.value : 2.8;
    },
    // 底部切换页面数据内容
    changePart() {
      this.is_compare = !this.is_compare;
    },
    // 重置图表
    resetAll(){
      this.history_time.length = 0 
      this.inlet_humidity.length = 0    // 入口湿度数据数组
      this.inlet_tem.length = 0        // 入口温度数据数组
      this.outlet_tem.length = 0       // 出口温度数据数组
      this.outlet_humidity.length = 0  // 出口湿度数据数组
      this.tem_diff.length = 0         // 出入口温度差
      this.humidity_diff.length = 0     // 出入口湿度差
      this.inletAirTem();
      this.inletHumidity();
      this.temContrast();
      this.temDifference();
      this.exhaustTem();
      this.exhaustHumidity();
      this.humidityContrast();
      this.humidityDifference();

      ElMessage({
        message: '图表重置成功！',
        type: 'success',
      })
    },
    // 修改全局图表刷新时间间隔
    changeTime(){
      ElNotification({
        message: '修改成功',
        type: 'success',
      })
      this.change_time = this.change_time_Input
      this.inletAirTem();
      this.inletHumidity();
      this.temContrast();
      this.temDifference();
      this.exhaustTem();
      this.exhaustHumidity();
      this.humidityContrast();
      this.humidityDifference();
    },

  },
  mounted() {
    setInterval(this.loadData, this.change_time);
    setInterval(this.catchData, this.change_time );
    this.inletAirTem();
    this.inletHumidity();
    this.temContrast();
    this.temDifference();
    this.exhaustTem();
    this.exhaustHumidity();
    this.humidityContrast();
    this.humidityDifference();
    // this.showair_VR();
    var that = this;
    var timer = "";
    timer = window.setInterval(function logname() {
      // let staytime_gap = new Date().getTime() - new Date('2023-01-01 00:00:00').getTime();
      let leave =
        (new Date().getTime() - that.staytime_gap) % (3600 * 1000 * 24);
      that.stay_hour = Math.floor(leave / (3600 * 1000))
        .toString()
        .padStart(2, 0);
      let leave1 = leave % (3600 * 1000);
      that.stay_min = Math.floor(leave1 / (60 * 1000))
        .toString()
        .padStart(2, 0);
      let leave2 = leave1 % (60 * 1000);
      that.stay_sec = Math.floor(leave2 / 1000)
        .toString()
        .padStart(2, 0);
    }, 1000);

    // 防止误触关闭网页
    window.onbeforeunload = (e) => {
      e = e || window.event;
      // 兼容IE8和Firefox 4之前的版本
      if (e) {
        e.returnValue = "关闭提示";
      }
      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
      return "关闭提示";
    };

    // 3D模型
    this.initThree();
    this.loadOBJModel();
    this.animate();
    this.addMouseInteractions();
  },
  beforeDestroy() {
    clearInterval(this.air_timer);
  },
};
</script>
<style>
</style>