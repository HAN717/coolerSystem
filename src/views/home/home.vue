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
          <span>运行时长</span>
          <p>{{ stayHour }}:{{ stayMin }}:{{ staySec }}</p>
        </div>
      </div>
      <div class="cicle3"></div>
      <div class="cicle4"></div>
      <div class="cicle5"></div>
      <div class="cicle6"></div>
      <div class="cicle7"></div>
      <div class="cicle8" style="text-align: center;">
        <span style="margin-left: -4px;">{{currentTem1}}°C</span>
        <p>送风温度</p>
      </div>
      <div class="cicle9">
        <span>89RH</span>
        <p>湿度监测</p>
      </div>
      <div class="cicle10" style="text-align: center;">
        <span style="margin-left: -4px;">{{currentTem2}}°C</span>
        <p>入风温度</p>
      </div>
      <div class="cicle11">
        <span>89RH</span>
        <p>湿度监测</p>
      </div>
    </div>
    <!-- right -->
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
import * as d3 from "d3";
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
      airTimer: null,
      temDiff: [
        3.1, 3.5, 3.3, 2.8, 2.9, 3.4, 1.8, 2.5, 1.9, 3.1, 3.2, 2.6, 2, 2, 3.2,
        2.5, 2.2, 2.3, 2.2, 2.4, 1.5, 1.9, 1.5, 1.8, 1.4, 1.6, 1.9, 1.9, 2, 1.9,
        2.2, 2.2, 2.2, 2.2, 2, 1.7, 2.1, 2.5, 2, 2.9, 1.6,
      ],
      tem1: [
        20.6, 20.6, 20.5, 20.2, 20.2, 20.5, 19.2, 19.1, 19.1, 20.1, 20.2, 19.0,
        18.2, 18.2, 20.5, 18.5, 18.2, 18.1, 18.5, 18.5, 19.5, 19.2, 19.6, 18.5,
        19.6, 18.8, 19.3, 19.2, 19.2, 19.3, 18.3, 18.7, 18.7, 18.7, 18.7, 19.3,
        18.7, 18.8, 18.7, 19.8, 19.3,
      ],
      tem2: [
        17.5, 17.1, 17.2, 17.4, 17.3, 17.1, 17.4, 16.6, 17.2, 17, 17, 16.4,
        16.2, 16.2, 17.3, 16.0, 16.0, 15.8, 16.3, 16.1, 18, 17.3, 18.1, 16.7,
        18.2, 17.2, 17.4, 17.3, 17.2, 17.4, 16.1, 16.5, 16.5, 16.5, 16.7, 17.6,
        16.6, 16.3, 16.7, 16.9, 17.7,
      ],
      airVR: [
        2.0, 2.1, 2.3, 2.3, 2.4, 2.5, 2.5, 2.6, 2.6, 2.6, 2.6, 2.7, 2.7, 2.7,
        2.7, 2.8, 2.8, 2.8, 2.9, 3.1, 3.1, 3.1, 3.1, 3.2, 3.2, 3.2, 3.2, 3.2,
        3.3, 3.3, 3.3, 3.4, 3.4, 3.4, 3.4, 3.5, 3.5, 3.6, 3.6, 3.6, 3.7,
      ],
      time: [
        3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57,
        60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99, 102, 105, 108,
        111, 114, 117, 120, 123,
      ],
      currentTem1:0,
      currentTem2:0,
      currentTemDiff:0,
      currentAirVR: 0.0,
      index: 0,
    };
  },
  methods: {
    changePart() {
      this.isCompare = !this.isCompare;
    },
    // fetchData() {
    //   d3.csv("/data/data.csv") // 使用 d3.csv() 方法加载 CSV 文件
    //     .then((data) => {
    //       let tem = data[0]; // 将读取到的 CSV 文件内容存储到数据属性中
    //       this.temperature = tem[0];
    //       console.log("data", this.temperature);
    //     })
    //     .catch((error) => {
    //       console.error("读取 CSV 文件失败", error);
    //     });
    //   // fetch('/src/assets/data/data.csv') // 替换成你的 CSV 文件路径
    //   //   .then(response => response.text())
    //   //   .then(data => {
    //   //     // // 将 CSV 数据按行分割为数组
    //   //     // const lines = data.split('\n');
    //   //     // // 获取第二行数据（去掉表头），并按逗号分割为数组
    //   //     // const rowData = lines[1].split(',');
    //   //     // // 提取湿度和温度数据
    //   //     // const humidity = rowData[0].slice(0, 2);
    //   //     // const temperature = rowData[0].slice(2);
    //   //     // // 更新数据
    //   //     // this.humidity = humidity;
    //   //     // this.temperature = temperature;
    //   //     this.temperature = data
    //   //   })
    //   //   .catch(error => console.error(error));
    // },
    // 左侧part1
    leftPart1() {
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
        index = option.dataZoom[0].endValue
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          this.currentTem1= this.tem1[index];
          option.dataZoom[0].startValue = 0;
        } else {
          this.currentTem1= this.tem1[index];
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartL1.setOption(option);
      }, 3000);
    },
    // 左侧part2
    leftPart2() {
      let myChartL2 = echarts.init(document.getElementById("enterPart2"));
      // 绘制图表
      var option
      option = {
        title: {
          text: "进风湿度(RH)",
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
            name: "湿度",
            type: "bar",
            data: this.tem1,
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
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          option.dataZoom[0].startValue = 0;
        } else {
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartL2.setOption(option);
      }, 3000);
    },
    // 左侧2part1
    left2Part1() {
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
      }, 3000);
    },
    // 左侧2part2
    left2Part2() {
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
      }, 3000);
    },
    // 右侧part1
    rightPart1() {
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
        index = option.dataZoom[0].endValue
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          this.currentTem2= this.tem2[index];
          option.dataZoom[0].startValue = 0;
        } else {
          this.currentTem2= this.tem2[index];
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartR1.setOption(option);
      }, 3000);
    },
    // 右侧part2
    rightPart2() {
      let myChartR2 = echarts.init(document.getElementById("exitPart2"));
      // 绘制图表
      var option
      option = {
        title: {
          text: "排风湿度(RH)",
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
            data: this.tem2,
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
        if (option.dataZoom[0].endValue == option.series[0].data.length - 1) {
          option.dataZoom[0].endValue = 4;
          option.dataZoom[0].startValue = 0;
        } else {
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChartR2.setOption(option);
      }, 3000);
    },
    // 右侧2part1
    right2Part1() {
      let myChartR21 = echarts.init(document.getElementById("exit2Part1"));
      // 绘制图表
      myChartR21.setOption({
        title: {
          text: "湿度对比(RH)",
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
        },
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: {},
        series: [
          {
            name: "入口湿度",
            type: "line",
            data: [36, 35, 34, 35, 33, 32],
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
            data: [29, 25, 26, 25, 23, 22],
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
          },
        ],
      });
      window.onresize = function () {
        //自适应大小
        myChartR21.resize();
      };
    },
    // 右侧2part2
    right2Part2() {
      let myChartR22 = echarts.init(document.getElementById("exit2Part2"));
      // 绘制图表
      myChartR22.setOption({
        title: { text: "湿度差(RH)", textStyle: { color: "rgb(242, 151, 1)" } },
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
        },
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: {},
        series: [
          {
            name: "湿度差值",
            type: "line",
            data: [7, 10, 8, 10, 10, 10],
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
      });
      window.onresize = function () {
        //自适应大小
        myChartR22.resize();
      };
    },
    showAirVR() {
      this.airTimer = setInterval(() => {
        if (this.index == this.airVR.length) {
          this.index = 0;
        } else {
          this.index++;
        }
        let airVR = this.airVR[this.index];
        this.currentAirVR = airVR;
      }, 3000);
    },
  },
  mounted() {
    // setInterval(this.fetchData, 5000);
    this.leftPart1();
    this.leftPart2();
    this.left2Part1();
    this.left2Part2();
    this.rightPart1();
    this.rightPart2();
    this.right2Part1();
    this.right2Part2();
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