<template>
  <div class="obox" style="margin-left:20px;">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="所属模块" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" v-model="text1" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块类型" class="testTime3" style="width:40%;">
          <el-select placeholder="请输入" clearable v-model="text2">
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="轮次名称" class="testTime3" style="width:40%;">
          <el-input type="textarea" autosize placeholder="请输入内容" v-model="text3"></el-input>
        </el-form-item>
        <el-form-item label="已排轮次" class="testTime3" style="width:47%;">
          <el-date-picker 
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <!-- <span>nihao </span> -->
      </el-form>
    </el-col>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 1,
      input: "",
      filters: {},
      text1: "赠课专用",
      text2: "赠送",
      text3: "【赠课专用-1】",
      value1: '',
    };
  },
  methods: {
    handleChange(value) {}
  }
};
</script>

