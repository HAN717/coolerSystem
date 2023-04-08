<template>
    <header>
        <div id="header">
            <h1 id="title" style="color: white;text-align: center;">基于露点间接蒸发的智能冷却器可视化系统</h1>
            <div id="subTitle">Intelligent cooler visualization system based on dew point indirect evaporation</div>
        </div>
    </header>
    <div class="main">
         <!-- content -->
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
</script>
<style>
</style>