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
        <div id="left">
            <!-- 入风口 -->
            <div id="enterPart">
                <div>冷却机入口处</div>
                <div id="enterPart1" style="width: 23.4vw; height: 35vh"></div>
                <div id="enterPart2" style="width: 23.4vw; height: 35vh"></div>
            </div>
        </div>
        <!-- center -->
        <div class="total">
             <canvas class="rain"></canvas>
            <div class="sphere">
                <div class="sphere-bg"></div>
                <div class="sum">
                    <span>运行时长</span>
                    <p>00:32:31</p>
                </div>
            </div>
            <div class="cicle3"></div>
            <div class="cicle4"></div>
            <div class="cicle5"></div>
            <div class="cicle6"></div>
            <div class="cicle7"></div>
            <div class="cicle8">
                <span>21.2°</span>
                <p>送风温度</p>
            </div>
            <div class="cicle9">
                <span>89%</span>
                <p>湿度监测</p>
            </div>
            <div class="cicle10">
                <span>23.4°</span>
                <p>送风温度</p>
            </div>
            <div class="cicle11">
                <span>89%</span>
                <p>湿度监测</p>
            </div>
        </div>
         <!-- right -->
         <div id="right">
            <!-- 出风口 -->
            <div id="exitPart">
                <div>冷却机出口处</div>
                <div id="exitPart1" style="width: 23.4vw; height: 35vh"></div>
                <div id="exitPart2" style="width: 23.4vw; height: 35vh"></div>
            </div>
        </div>
    </div>
     <!-- 底部模块 -->
     <div class="bottom">
        <h5><span>数据状况</span></h5>
        <p>Data Status</p>
    </div>
</template>
<script>
import "./main.css";
import "../../assets/js/main";
import {onMounted} from "vue";
import * as echarts from 'echarts';
export default {
  data() {
    return {

    }
  },
  setup() {
    onMounted(() => {//需要获取到element,所以是onMounted的Hook

    // 左侧part1
      let myChartL1 = echarts.init(document.getElementById("enterPart1"));
      // 绘制图表
      myChartL1.setOption({
        title: { text: "送风温度" },
        tooltip: {},
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: {},
        series: [
          {
            name: "tem",
            type: "line",
            data: [36, 35, 34, 35, 33, 32],
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartL1.resize();
      };

    // 左侧part2  
    let myChartL2 = echarts.init(document.getElementById("enterPart2")); 
      // 绘制图表
      myChartL2.setOption({
        title: { text: "送风湿度" },
        tooltip: {},
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: {},
        series: [
          {
            name: "tem",
            type: "line",
            data: [23, 35, 45, 55, 66, 77],
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartL2.resize();
      };

    // 右侧part1
    let myChartR1 = echarts.init(document.getElementById("exitPart1"));
      // 绘制图表
      myChartR1.setOption({
        title: { text: "送风温度" },
        tooltip: {},
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: {},
        series: [
          {
            name: "tem",
            type: "line",
            data: [36, 35, 34, 35, 33, 32],
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartR1.resize();
      };

    // 右侧part2  
    let myChartR2 = echarts.init(document.getElementById("exitPart2")); 
      // 绘制图表
      myChartR2.setOption({
        title: { text: "送风湿度" },
        tooltip: {},
        xAxis: {
          data: ["12:05", "12:06", "12:07", "12:08", "12:09", "12:10"],
        },
        yAxis: {},
        series: [
          {
            name: "tem",
            type: "line",
            data: [23, 35, 45, 55, 66, 77],
          },
        ],
      });
      window.onresize = function () {//自适应大小
        myChartR2.resize();
      };

    });
  }
}
</script>
<style>
</style>