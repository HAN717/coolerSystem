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
    </div>
  </header>
  <div class="main">
    <!-- content -->
    <!-- left -->
    <div id="left" v-show="isCompare == false">
      <!-- 入风口 -->
      <div id="enterPart">
        <div id="leftPartTitle">冷却器入口处</div>
        <div id="enterPart1" style="width: 23.4vw; height: 35vh"></div>
        <div id="enterPart2" style="width: 23.4vw; height: 35vh"></div>
      </div>
    </div>
    <!-- left2 -->
    <div id="left2" v-show="isCompare == true">
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
          当前风量比:&nbsp;<span>{{ currentAirVR }}</span>
        </h3>
        <!-- <p style="color:white">湿度：{{ humidity }}</p> -->
        <!-- <p style="color:white">温度：{{ temperature }}</p> -->
      </div>
      <div class="sphere">
        <div class="sphere-bg"></div>
        <div class="sum">
          <!-- <span>运行时长</span> -->
          <!-- <p>{{ stayHour }}:{{ stayMin }}:{{ staySec }}</p> -->
        </div>
      </div>
      <div class="cicle3"></div>
      <div class="cicle4"></div>
      <div class="cicle5"></div>
      <div class="cicle6"></div>
      <div class="cicle7"></div>
      <div class="cicle8" style="text-align: center">
        <span style="margin-left: -4px">{{ inlet_tem }}°C</span>
        <p>送风温度</p>
      </div>
      <div class="cicle9">
        <span>{{ inlet_humidity }}%</span>
        <!-- <span>{{currentShidu1}}%</span> -->
        <p>进口湿度</p>
      </div>
      <div class="cicle10" style="text-align: center">
        <span style="margin-left: -4px">{{ outlet_tem }}°C</span>
        <p>进风温度</p>
      </div>
      <div class="cicle11">
        <!-- <span>{{currentShidu2}}%</span> -->
        <span>{{ outlet_humidity }}%</span>
        <p>出口湿度</p>
      </div>
    </div>
    <!-- riht -->
    <div id="right" v-show="isCompare == false">
      <!-- 出风口 -->
      <div id="exitPart">
        <div id="rightPartTitle">冷却器出口处</div>
        <div id="exitPart1" style="width: 23.4vw; height: 35vh"></div>
        <div id="exitPart2" style="width: 23.4vw; height: 35vh"></div>
      </div>
    </div>
    <!-- right2 -->
    <div id="right2" v-show="isCompare == true">
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
    <h5 v-show="isCompare == false"><span>数据状况</span></h5>
    <p v-show="isCompare == false">Data Status</p>
    <h5 v-show="isCompare == true"><span>数据对比</span></h5>
    <p v-show="isCompare == true">Data Compare</p>
  </div>
</template>
<script>
import "./main.css";
import "../../assets/js/main";
import * as echarts from "echarts";
import axios from 'axios'
export default {
  data() {
    return {
      isCompare: false,
      stayHour: "00", // 运行小时数
      stayMin: "00", // 分钟数
      staySec: "00", // 秒数
      staytimeGap: new Date().getTime(),
      humidity: null,
      temperature: null,
      inlet_humidity: 0,
      inlet_tem: 0,
      outlet_tem: 0,
      outlet_humidity: 0,
      airTimer: null,
      changeTime:3000,
      csvData: [],
      historyData:[],
      historyTime:[],
      metaTime:1,
      temDiff: [
        4.5, 5.1, 5, 5.2, 4, 4.4, 4.4, 4.7, 4.8, 4.8, 4.8, 5.6, 4.8, 5.6, 4.5,
        4.5, 4.7, 4.3, 4.2,
      ],
      tem1: [
        27.2, 28.3, 28.2, 28.3, 26.7, 27.2, 27.2, 28.2, 28.1, 28.1, 28, 29.5,
        28.1, 29, 27.7, 27.5, 28.1, 27.2, 27.2,
      ],
      tem2: [
        22.7, 23.2, 23.2, 23.1, 22.7, 22.8, 22.8, 23.5, 23.3, 23.3, 23.2, 23.9,
        23.3, 23.4, 23.2, 23, 23.4, 22.9, 23,
      ],
      shidu1: [
        48.9, 48.9, 48.9, 48.9, 48.9, 48.9, 48.9, 48.9, 49.0, 49.0, 49.0, 49.0,
        49.0, 49.0, 49.1, 49.1, 49.1, 49.1, 49.1, 49.1, 49.1, 49.1, 49.1, 49.1,
        49.2, 49.2, 49.2, 49.2, 49.3, 49.3, 49.3, 49.4, 49.4, 49.4, 49.4, 49.4,
        49.4, 49.5, 49.5, 49.5, 49.5,
      ],
      shidu2: [
        48.8, 48.8, 48.8, 48.8, 48.8, 48.8, 48.8, 48.8, 48.9, 48.9, 48.9, 48.9,
        48.9, 48.9, 48.9, 48.9, 49.0, 49.0, 49.0, 49.0, 49.0, 49.0, 49.0, 49.1,
        49.1, 49.1, 49.1, 49.1, 49.2, 49.2, 49.2, 49.2, 49.2, 49.3, 49.3, 49.3,
        49.3, 49.3, 49.4, 49.4, 49.5,
      ],
      shiducha: [
        0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
        0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0, 0.1, 0.1, 0.1, 0.1, 0.1,
        0.1, 0.1, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.2, 0.1, 0.1, 0,
      ],
      airVR: [
        1.6, 1.6, 1.6, 1.7, 1.8, 1.8, 1.8, 2.4, 2.5, 2.6, 2.8, 2.8, 3.0, 3.1,
        3.1, 3.1, 3.1, 3.1, 3.2,
      ],
      time: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        39, 40, 41,
      ],
      currentTem1: 0,
      currentTem2: 0,
      currentShidu1: 0,
      currentShidu2: 0,
      currentTemDiff: 0,
      currentAirVR: 0.0,
      index: 0,
    };
  },
  methods: {

    // 切换页面数据内容
    changePart() {
      this.isCompare = !this.isCompare;
    },
    // 动态获取并更新、存储数据
    loadData() {
        axios.get('/src/assets/data.csv')
        .then(response => {
          // 处理CSV数据，将其存储到csvData数组中
          this.inlet_humidity = response.data.substring(1, 3);
          this.inlet_tem = response.data.substring(4, 6);
          this.outlet_humidity = response.data.substring(7, 9);
          this.outlet_tem = response.data.substring(10, 12);
          
          // 更新数据数组
          let newData = 0
          newData = this.inlet_humidity
          if (this.historyData.length < 5) {
            // 如果数据数量小于5，直接添加到数组末尾
            this.historyData.push(newData);
          } else {
            // 如果数据数量已经是5个，先移除第一个数据，然后将新数据添加到数组末尾
            this.historyData.shift();
            this.historyData.push(newData);
          }
          let time = 0
          if(this.historyTime.length!= 0){
            time = this.metaTime + this.historyTime[this.historyTime.length-1]
          }
          else{
            time += 1
          }
          if (this.historyTime.length < 5) {
            this.historyTime.push(time)
          } else {
            this.historyTime.shift();
            this.historyTime.push(time)
          }

        })
        .catch(error => {
          console.error('Failed to fetch CSV data:', error);
        });
    },

    // ************************************  数据状况  ************************************
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
          data: this.time,
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
            data: this.tem1,
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
      let index = 0;
      setInterval(() => {
        index = option.dataZoom[0].endValue;
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          this.currentTem1 = this.tem1[index];
          option.dataZoom[0].startValue = 0;
        } else {
          this.currentTem1 = this.tem1[index];
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartL1.setOption(option);
      }, this.changeTime);
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
          data: this.historyTime,
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
            data: this.historyData,
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
      }, this.changeTime);
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
          data: this.time,
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
            data: this.tem2,
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
      let index = 0;
      setInterval(() => {
        index = option.dataZoom[0].endValue;
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          this.currentTem2 = this.tem2[index];
          option.dataZoom[0].startValue = 0;
        } else {
          this.currentTem2 = this.tem2[index];
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartR1.setOption(option);
      }, this.changeTime);
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
          data: this.time,
        },
        yAxis: {},
        series: [
          {
            name: "湿度",
            type: "bar",
            data: this.shidu2,
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
      let index = 0;
      setInterval(() => {
        index = option.dataZoom[0].endValue;
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          this.currentshidu1 = this.shidu1[index];
          option.dataZoom[0].startValue = 0;
        } else {
          this.currentshidu1 = this.shidu1[index];
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartR2.setOption(option);
      }, this.changeTime);
    },

    // ************************************  数据对比  ************************************
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
          data: this.time,
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
            data: this.tem1,
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
            data: this.tem2,
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
      let index = 0;
      setInterval(() => {
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          option.dataZoom[0].startValue = 0;
        } else {
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartL21.setOption(option);
      }, this.changeTime);
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
          data: this.time,
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
            data: this.temDiff,
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
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          option.dataZoom[0].startValue = 0;
        } else {
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartL22.setOption(option);
      }, this.changeTime);
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
          data: this.time,
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
          min: 48,
          max: 49.7,
        },
        series: [
          {
            name: "入口湿度",
            type: "line",
            data: this.shidu1,
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
            data: this.shidu2,
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
      let index = 0;
      setInterval(() => {
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          option.dataZoom[0].startValue = 0;
        } else {
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartR21.setOption(option);
      }, this.changeTime);
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
          data: this.time,
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
          min: 0,
          max: 0.25,
        },
        series: [
          {
            name: "湿度差值",
            type: "line",
            data: this.shiducha,
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
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          option.dataZoom[0].startValue = 0;
        } else {
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartR22.setOption(option);
      }, this.changeTime);
    },

    // 展示风量比
    showAirVR() {
      this.airTimer = setInterval(() => {
        if (this.index == this.airVR.length) {
          this.index = 0;
        } else {
          this.index++;
        }
        let airVR = this.airVR[this.index];
        this.currentAirVR = airVR;
      }, this.changeTime);
    },

  },
  mounted() {
    setInterval(this.loadData, 3000);
    this.inletAirTem();
    this.inletHumidity();
    this.temContrast();
    this.temDifference();
    this.exhaustTem();
    this.exhaustHumidity();
    this.humidityContrast();
    this.humidityDifference();
    this.showAirVR();
    var that = this;
    var timer = "";
    timer = window.setInterval(function logname() {
      // let staytimeGap = new Date().getTime() - new Date('2023-01-01 00:00:00').getTime();
      let leave =
        (new Date().getTime() - that.staytimeGap) % (3600 * 1000 * 24);
      that.stayHour = Math.floor(leave / (3600 * 1000))
        .toString()
        .padStart(2, 0);
      let leave1 = leave % (3600 * 1000);
      that.stayMin = Math.floor(leave1 / (60 * 1000))
        .toString()
        .padStart(2, 0);
      let leave2 = leave1 % (60 * 1000);
      that.staySec = Math.floor(leave2 / 1000)
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
  },
  beforeDestroy() {
    clearInterval(this.airTimer);
  },
};
</script>
<style>
</style>