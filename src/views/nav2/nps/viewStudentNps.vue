<template>
<div class="block" v-infinite-scroll="load" style="overflow:auto">
  <el-timeline>
    <el-timeline-item placement="top"  v-for="(item, index) in viewData" :key="index" >
      <el-card>
        <h4>历史评分：{{item.score}}</h4>
        <p>评论时间：{{item.createTime}}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</div>
   
</template>
<script>
export default {
  data() {
    return {
         count: 0
    };
  },
  props: {
      viewData:Array
  },
  methods: {
      load () {
        // alert('我滚动了，数据加载了')
      }
  },
  mounted() {
    //   console.log(this.viewData,54654654)
  }
};
</script>
<style scoped>
/* .content {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.Nps_span {
  padding-top: 15px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bolder;
  letter-spacing: 1px;
} */
</style>