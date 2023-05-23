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
          当前风量比:&nbsp;<span>{{ currentair_VR }}</span>
        </h3>
      </div>
      <div class="sphere">
        <div class="sphere-bg"></div>
        <div class="sum">
          <img src="../../assets/img/logo.png" style="width: 160px;margin: 110px 0 0 110px;">
          <!-- <span>运行时长</span> -->
          <!-- <p>{{ stay_hour }}:{{ stay_min }}:{{ stay_sec }}</p> -->
        </div>
      </div>
      <div class="cicle3"></div>
      <div class="cicle4"></div>
      <div class="cicle5"></div>
      <div class="cicle6"></div>
      <div class="cicle7"></div>
      <div class="cicle8" style="text-align: center">
        <span style="margin-left: -4px">{{ outlet_tem[outlet_tem.length-1] }}°C</span>
        <p>送风温度</p>
      </div>
      <div class="cicle9">
        <span>{{ inlet_humidity[inlet_humidity.length-1] }}%</span>
        <p>进口湿度</p>
      </div>
      <div class="cicle10" style="text-align: center">
        <span style="margin-left: -4px">{{ inlet_tem[inlet_tem.length-1] }}°C</span>
        <p>进风温度</p>
      </div>
      <div class="cicle11">
        <span>{{ outlet_humidity[outlet_humidity.length-1] }}%</span>
        <p>出口湿度</p>
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
</template>
<script>
import "./main.css";
import "../../assets/js/main";
import * as echarts from "echarts";
import axios from 'axios'
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
      currentair_VR: 0.0,
    };
  },
  methods: {
    // 切换页面数据内容
    changePart() {
      this.is_compare = !this.is_compare;
    },
    // 动态获取并更新、存储数据
    loadData() {
        axios.get('/src/assets/data.csv')
        .then(response => {

          // 处理CSV数据，分割取得，将其新数据存储到局部变量
          // let new_inlet_humidity = response.data.substring(1, 3);   // 入口湿度
          // let new_inlet_tem = response.data.substring(4, 6);        // 入口温度
          // let new_outlet_humidity = response.data.substring(7, 9);  // 出口湿度
          // let new_outlet_tem = response.data.substring(10, 12);     // 出口温度
          let new_outlet_humidity = response.data.substring(1, 3);   // 入口湿度
          let new_outlet_tem = response.data.substring(4, 6);        // 入口温度
          let new_inlet_humidity = response.data.substring(7, 9);  // 出口湿度
          let new_inlet_tem = response.data.substring(10, 12);     // 出口温度
          let new_tem_diff = new_inlet_tem - new_outlet_tem         // 出入口温度差
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

        })
        // 抛出异常
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

    // 展示风量比
    showair_VR() {
      this.air_timer = setInterval(() => {
        if (this.index == this.air_VR.length) {
          this.index = 0;
        } else {
          this.index++;
        }
        let air_VR = this.air_VR[this.index];
        this.currentair_VR = air_VR;
      }, this.change_time);
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
    this.showair_VR();
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
  },
  beforeDestroy() {
    clearInterval(this.air_timer);
  },
};
</script>
<style>
</style>