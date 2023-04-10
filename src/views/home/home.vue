<template>
    <header>
        <div id="header">
            <h1 id="title" style="color: white;text-align: center;">基于露点间接蒸发的智能冷却器可视化系统</h1>
            <div id="subTitle">Intelligent cooler visualization system based on dew point indirect evaporation</div>
        </div>
    </header>
    <div class="main">
        <!-- content -->
        <!-- left -->
        <div id="left" v-show="isCompare==false">
            <!-- 入风口 -->
            <div id="enterPart">
                <div id="leftPartTitle">冷却器入口处</div>
                <div id="enterPart1" style="width: 23.4vw; height: 35vh"></div>
                <div id="enterPart2" style="width: 23.4vw; height: 35vh"></div>
            </div>
        </div>
        <!-- left2 -->
        <div id="left2" v-show="isCompare==true">
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
                <h3>当前风量比:&nbsp;<span>1.25</span></h3>
              </div>
            <div class="sphere">
                <div class="sphere-bg"></div>
                <div class="sum">
                    <span>运行时长</span>
                    <p>{{stayHour}}:{{stayMin}}:{{staySec}}</p>
                </div>
            </div>
            <div class="cicle3"></div>
            <div class="cicle4"></div>
            <div class="cicle5"></div>
            <div class="cicle6"></div>
            <div class="cicle7"></div>
            <div class="cicle8">
                <span>21°C</span>
                <p>送风温度</p>
            </div>
            <div class="cicle9">
                <span>89RH</span>
                <p>湿度监测</p>
            </div>
            <div class="cicle10">
                <span>23°C</span>
                <p>送风温度</p>
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
        <h5 v-show="isCompare==false"><span>数据状况</span></h5>
        <p  v-show="isCompare==false">Data Status</p>
        <h5 v-show="isCompare==true"><span>数据对比</span></h5>
        <p  v-show="isCompare==true">Data Compare</p>
    </div>
</template>
<script>
import "./main.css";
import "../../assets/js/main";
import * as echarts from 'echarts';
export default {
  data() {
    return {
      isCompare:false,
      stayHour:'00',  // 运行小时数
      stayMin:'00',   // 分钟数 
      staySec:'00',   // 秒数
      staytimeGap:new Date().getTime()
    }
  },
  methods:{
    changePart(){
      this.isCompare = !this.isCompare;
    },
    // 左侧part1
    leftPart1(){  
      let myChartL1 = echarts.init(document.getElementById("enterPart1"));
      // 绘制图表
      myChartL1.setOption({
        title: { text: "进风温度(°C)",textStyle:{color:'rgba(10, 191, 197)'} },
        tooltip: { // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: 'axis',
          backgroundColor: 'rgba(10, 191, 197,.4)',
          borderColor: 'rgba(32, 33, 36,0.20)',
          borderWidth: 1,
          textStyle: { // 文字提示样式
            color: '#fff',
            fontSize: '12'
          },
          axisPointer: { // 坐标轴虚线
            type: 'cross',
            label: {
                backgroundColor: '#0abfc5'
            }
          },
        },
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: { },
        series: [
          {
            name: "温度",
            type: "line",
            data: [36, 35, 34, 35, 33, 32],
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            itemStyle: {// 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(51,192,197)"
                }
              }
            },
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartL1.resize();
      };
    }, 
    // 左侧part2  
    leftPart2(){
    let myChartL2 = echarts.init(document.getElementById("enterPart2")); 
      // 绘制图表
      myChartL2.setOption({
        title: { text: "进风湿度(RH)" ,textStyle:{color:'rgb(242, 151, 1)'} },
        tooltip: { // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: 'axis',
          backgroundColor: 'rgba(242, 151, 1,.4)',
          borderColor: 'rgba(32, 33, 36,0.20)',
          borderWidth: 1,
          textStyle: { // 文字提示样式
            color: '#fff',
            fontSize: '12'
          },
          axisPointer: { // 坐标轴虚线
            type: 'cross',
            label: {
                backgroundColor: 'rgb(242, 151, 1)'
            }
          },
        },
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: {},
        series: [
          {
            name: "湿度",
            type: "bar",
            data: [23, 35, 45, 55, 66, 77],
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            color: echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: 'rgb(242, 151, 1, 0.1)' // 0% 处的颜色
              },{
                offset: 1,
                color: "rgb(242, 151, 1, .7)" // 100% 处的颜色
            }], false),
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartL2.resize();
      };
    },
    // 左侧2part1
    left2Part1(){
    let myChartL21 = echarts.init(document.getElementById("enter2Part1"));
      // 绘制图表
      myChartL21.setOption({
        title: { text: "温度对比(°C)",textStyle:{color:'rgba(10, 191, 197)'} },
        tooltip: { // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: 'axis',
          backgroundColor: 'rgba(10, 191, 197,.4)',
          borderColor: 'rgba(32, 33, 36,0.20)',
          borderWidth: 1,
          textStyle: { // 文字提示样式
            color: '#fff',
            fontSize: '12'
          },
          axisPointer: { // 坐标轴虚线
            type: 'cross',
            label: {
                backgroundColor: '#0abfc5'
            }
          },
        },
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: { },
        series: [
          {
            name: "入口温度",
            type: "line",
            data: [36, 35, 34, 35, 33, 32],
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            itemStyle: {// 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(51,192,197)"
                }
              }
            },
          },
          {
            name: "出口温度",
            type: "line",
            data: [29, 25, 26, 25, 23, 22],
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            itemStyle: {// 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(242, 151, 1)"
                }
              }
            },
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartL21.resize();
      };
    },
    // 左侧2part2
    left2Part2(){
      let myChartL22 = echarts.init(document.getElementById("enter2Part2")); 
      // 绘制图表
      myChartL22.setOption({
        title: { text: "温差(°C)" ,textStyle:{color:'rgb(242, 151, 1)'} },
        tooltip: { // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: 'axis',
          backgroundColor: 'rgba(242, 151, 1,.4)',
          borderColor: 'rgba(32, 33, 36,0.20)',
          borderWidth: 1,
          textStyle: { // 文字提示样式
            color: '#fff',
            fontSize: '12'
          },
          axisPointer: { // 坐标轴虚线
            type: 'cross',
            label: {
                backgroundColor: 'rgb(242, 151, 1)'
            }
          },
        },
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: {},
        series: [
          {
            name: "温差值",
            type: "line",
            data: [7, 10, 8, 10, 10, 10],
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            itemStyle: {// 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(242, 151, 1)"
                }
              }
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
      window.onresize = function () {//自适应大小
        myChartL22.resize();
      };
    },
    // 右侧part1
    rightPart1(){
    let myChartR1 = echarts.init(document.getElementById("exitPart1"));
      // 绘制图表
      myChartR1.setOption({
        title: { text: "排风温度(°C)",textStyle:{color:'rgba(10, 191, 197)'} },
        tooltip: { // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: 'axis',
          backgroundColor: 'rgba(10, 191, 197,.4)',
          borderColor: 'rgba(32, 33, 36,0.20)',
          borderWidth: 1,
          textStyle: { // 文字提示样式
            color: '#fff',
            fontSize: '12'
          },
          axisPointer: { // 坐标轴虚线
            type: 'cross',
            label: {
                backgroundColor: '#0abfc5'
            }
          },
        },
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: { },
        series: [
          {
            name: "温度",
            type: "line",
            data: [36, 35, 34, 35, 33, 32],
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            itemStyle: {// 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(51,192,197)"
                }
              }
            },
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartR1.resize();
      };
    },
    // 右侧part2
    rightPart2(){
    let myChartR2 = echarts.init(document.getElementById("exitPart2")); 
      // 绘制图表
      myChartR2.setOption({
        title: { text: "排风湿度(RH)" ,textStyle:{color:'rgb(242, 151, 1)'} },
        tooltip: { // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: 'axis',
          backgroundColor: 'rgba(242, 151, 1,.4)',
          borderColor: 'rgba(32, 33, 36,0.20)',
          borderWidth: 1,
          textStyle: { // 文字提示样式
            color: '#fff',
            fontSize: '12'
          },
          axisPointer: { // 坐标轴虚线
            type: 'cross',
            label: {
                backgroundColor: 'rgb(242, 151, 1)'
            }
          },
        },
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: {},
        series: [
          {
            name: "湿度",
            type: "bar",
            data: [23, 35, 45, 55, 66, 77],
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            color: echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: 'rgb(242, 151, 1, 0.1)' // 0% 处的颜色
              },{
                offset: 1,
                color: "rgb(242, 151, 1, .7)" // 100% 处的颜色
            }], false),
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartR2.resize();
      };
    },
    // 右侧2part1
    right2Part1(){
    let myChartR21 = echarts.init(document.getElementById("exit2Part1"));
      // 绘制图表
      myChartR21.setOption({
        title: { text: "湿度对比(RH)",textStyle:{color:'rgba(10, 191, 197)'} },
        tooltip: { // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: 'axis',
          backgroundColor: 'rgba(10, 191, 197,.4)',
          borderColor: 'rgba(32, 33, 36,0.20)',
          borderWidth: 1,
          textStyle: { // 文字提示样式
            color: '#fff',
            fontSize: '12'
          },
          axisPointer: { // 坐标轴虚线
            type: 'cross',
            label: {
                backgroundColor: '#0abfc5'
            }
          },
        },
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: { },
        series: [
          {
            name: "入口湿度",
            type: "line",
            data: [36, 35, 34, 35, 33, 32],
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            itemStyle: {// 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(51,192,197)"
                }
              }
            },
          },
          {
            name: "出口湿度",
            type: "line",
            data: [29, 25, 26, 25, 23, 22],
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            itemStyle: {// 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(242, 151, 1)"
                }
              }
            },
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartR21.resize();
      };
    },
    // 右侧2part2
    right2Part2(){
    let myChartR22 = echarts.init(document.getElementById("exit2Part2")); 
      // 绘制图表
      myChartR22.setOption({
        title: { text: "湿度差(RH)" ,textStyle:{color:'rgb(242, 151, 1)'} },
        tooltip: { // 鼠标悬浮提示框显示 X和Y 轴数据
          trigger: 'axis',
          backgroundColor: 'rgba(242, 151, 1,.4)',
          borderColor: 'rgba(32, 33, 36,0.20)',
          borderWidth: 1,
          textStyle: { // 文字提示样式
            color: '#fff',
            fontSize: '12'
          },
          axisPointer: { // 坐标轴虚线
            type: 'cross',
            label: {
                backgroundColor: 'rgb(242, 151, 1)'
            }
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
            label: { // 显示数值
              show: true,
              position: 'top',
              color: '#FFFFFF',
            },
            itemStyle: {// 元素样式设置
              normal: {
                color: "#FFF",
                lineStyle: {
                  color: "rgb(242, 151, 1)"
                }
              }
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
      window.onresize = function () {//自适应大小
        myChartR22.resize();
      };
    },
  },
  mounted(){
    this.leftPart1();
    this.leftPart2();
    this.left2Part1();
    this.left2Part2();
    this.rightPart1();
    this.rightPart2();
    this.right2Part1();
    this.right2Part2();
    var that = this
    var timer = ''
    timer = window.setInterval(function logname() {
        // let staytimeGap = new Date().getTime() - new Date('2023-01-01 00:00:00').getTime();
        let leave = (new Date().getTime() - that.staytimeGap) % (3600 * 1000 * 24);
        that.stayHour = Math.floor(leave / (3600 * 1000)).toString().padStart(2, 0);
        let leave1 = leave % (3600 * 1000);
        that.stayMin = Math.floor(leave1 / (60 * 1000)).toString().padStart(2, 0);
        let leave2 = leave1 % (60 * 1000);
        that.staySec = Math.floor(leave2 / 1000).toString().padStart(2, 0);
    }, 1000);
    
    // 防止误触关闭网页
    window.onbeforeunload = e => {
	    e = e || window.event
	    // 兼容IE8和Firefox 4之前的版本
	    if (e) {
	      e.returnValue = '关闭提示'
	    }
	    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
	    return '关闭提示'
    }
  },
}
</script>
<style>
</style>