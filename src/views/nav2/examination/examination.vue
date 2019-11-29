<template>
  <section class="chart-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 学员信息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>报考管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div id="chartPie1" class="chartPies" style="width:32%; height:300px;"></div>
      <div id="chartPie2" class="chartPies" style="width:32%; height:300px;"></div>
      <div id="chartPie3" class="chartPies" style="width:32%; height:300px;"></div>
      <div id="chartPie4" class="chartPies" style="width:32%; height:300px;"></div>
      <div id="chartPie5" class="chartPies" style="width:32%; height:300px;"></div>
      <div class="yanse">
        <div>
          <span class="p1"></span>
          <span>好</span>
        </div>
        <div>
          <span class="p2"></span>
          <span>一般</span>
        </div>
        <div>
          <span class="p3"></span>
          <span>警告</span>
        </div>
        <div>
          <span class="p4"></span>
          <span>危险</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import echarts from "echarts";

export default {
  data() {
    return {
      chartPie1: null,
      chartPie2: null,
      chartPie3: null,
      chartPie4: null,
      chartPie5: null,
      listData:{
        listData1:[
              { value: 630, name: "已填写", itemStyle: { color: "#0099FF" } },
              { value: 70, name: "未填写", itemStyle: { color: "#DDDDDD" } }
            ],
        listData2:[
              { value: 630, name: "已毕业", itemStyle: { color: "#0099FF" } },
              { value: 70, name: "未毕业", itemStyle: { color: "#DDDDDD" } }
            ],
        listData3:[
              { value: 630, name: "已通过", itemStyle: { color: "#0099FF" } },
              { value: 70, name: "未通过", itemStyle: { color: "#DDDDDD" } }
            ],
        listData4:[
              { value: 630, name: "已参考", itemStyle: { color: "#0099FF" } },
              { value: 70, name: "未参考", itemStyle: { color: "#DDDDDD" } }
            ],
        listData5:[ 
              { value: 630, name: "已报考", itemStyle: { color: "#0099FF" } },
              { value: 70, name: "未报考", itemStyle: { color: "#DDDDDD" } }
            ],
      },
      
    };
  },

  methods: {
    getList(){

        this.drawCharts()
    },
    drawPieChart1() {
      this.chartPie = echarts.init(document.getElementById("chartPie1"));
      this.chartPie.setOption({
        title: {
          text: "准考证填写率",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "准考证填写",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "60%"],
            data: this.listData.listData1,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    drawPieChart2() {
      this.chartPie = echarts.init(document.getElementById("chartPie2"));
      this.chartPie.setOption({
        title: {
          text: "报考率",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "报考率",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "60%"],
            data: this.listData.listData5,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    drawPieChart3() {
      this.chartPie = echarts.init(document.getElementById("chartPie3"));
      this.chartPie.setOption({
        title: {
          text: "参考率",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "参考率",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "60%"],
            data:this.listData.listData4,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    drawPieChart4() {
      this.chartPie = echarts.init(document.getElementById("chartPie4"));
      this.chartPie.setOption({
        title: {
          text: "通过率",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "通过率",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "60%"],
            data:this.listData.listData3,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    drawPieChart5() {
      this.chartPie = echarts.init(document.getElementById("chartPie5"));
      this.chartPie.setOption({
        title: {
          text: "毕业率",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "毕业率",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "60%"],
            data: this.listData.listData2,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    drawCharts() {
      this.drawPieChart1();
      this.drawPieChart2();
      this.drawPieChart3();
      this.drawPieChart4();
      this.drawPieChart5();
    }
  },

  mounted() {
    // this.drawCharts();
    this.getList()
  },
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  //   justify-content: space-between;
  .chartPies {
    margin: 10px 0.5%;
    border: 1px #ccc solid;
  }
}
.yanse {
  position: relative;
  right: -25%;
  top: 120px;
  div {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .p1,
  .p2,
  .p3,
  .p4 {
    display: inline-block;
    width: 40px;
    height: 20px;
    margin-right: 10px;
  }
  .p1 {
    background: #7dd777;
  }
  .p2 {
    background: #0099ff;
  }
  .p3 {
    background: #fcc00a;
  }
  .p4 {
    background: #ff6666;
  }
}
</style>


