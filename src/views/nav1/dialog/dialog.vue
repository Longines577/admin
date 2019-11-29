<template>
  <div class="obox" style="margin-left:20px;">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="一级项目" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" v-model="filters.item1" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级项目" class="testTime2" style="width:40%;">
          <el-select placeholder="请选择" v-model="filters.item2" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课时间" class="testTime1">
          <el-select placeholder="请选择" v-model="filters.item3" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考期" class="testTime" style="width:50%;margin-left:32px;">
          <el-select placeholder="请选择" v-model="filters.item4" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课科目" class="testTime">
          <el-select placeholder="请选择" v-model="filters.item5" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省份" class="testTime" style="width:50%;margin-left:32px;">
          <el-select placeholder="请选择" v-model="filters.item6" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课老师" class="testTime">
          <el-select placeholder="请选择" v-model="filters.item7" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="助教" class="testTime" style="margin-left:32px;">
          <el-select placeholder="请选择" v-model="filters.item8" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
       
        <!-- <el-form-item label="直播间链接">
          <el-input placeholder="请输入内容" v-model="input" clearable class="liveHref"></el-input>
        </el-form-item> -->
       <div>
           <el-form-item label="直播间链接">
          <el-input placeholder="请输入内容" v-model="input" clearable class="liveHref"></el-input>
        </el-form-item>
       </div>
       <div>
          <el-form-item label="物理直播间">
          <el-select placeholder="请选择" v-model="filters.item9" clearable class="physicsLive">
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
       </div>
        <!-- <span>nihao </span> -->
      </el-form>
    </el-col>
  </div>
</template>
<script>
export default {
  data() {
    return {
        filters: {},
        input:''
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped>
  .physicsLive{
      width:232%!important;
  }
  .liveHref{
      width:232%;
  }
</style>



