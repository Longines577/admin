<template>
    <div class="obox" style="margin-left:20px;">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
       <el-form-item label="产品编号:" class="testTime3" style="width:40%;">
            5454545
        </el-form-item>
        <el-form-item label="产品包名称:" class="testTime3" style="width:40%;">
           人力资源精品班
        </el-form-item>
        <el-form-item label="一级项目:" class="testTime3" style="width:40%;">
          自考
        </el-form-item>
        <el-form-item label="二级项目:" class="testTime3" style="width:40%;">
                汉本(安徽)
        </el-form-item>
        <el-form-item label="价格:" class="testTime3" style="width:40%;">
                8888
        </el-form-item>
        <el-form-item label="最低价格:" class="testTime3" style="width:40%;">
                8888
        </el-form-item>
        <el-form-item label="服务期配置:" class="testTime3" style="width:40%;">
                已配置
        </el-form-item>
        <el-form-item label="协议配置:" class="testTime3" style="width:40%;">
                已配置
        </el-form-item>
        <el-form-item label="模块配置:" class="testTime3" style="width:40%;">
                未配置
        </el-form-item>
        <el-form-item label="教材教辅:" class="testTime3" style="width:40%;">
               人力资源管理
        </el-form-item>
        <el-form-item label="保险:" class="testTime3" style="width:40%;">
               是
        </el-form-item>
        <el-form-item label="分期:" class="testTime3" style="width:40%;">
               百度分期
        </el-form-item>
        <el-form-item label="状态:" class="testTime3" style="width:40%;">
                在售
        </el-form-item>
        <el-form-item label="承接学院:" class="testTime3" style="width:40%;">
        <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承接家族:" class="testTime3" style="width:40%;">
        <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承接运营组:" class="testTime3" style="width:40%;">
        <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营长:" class="testTime3" style="width:40%;">
        <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- <span>nihao </span> -->
      </el-form>
    </el-col>
  </div>
</template>
<script>
export default {
    data(){
        return{
            num:1,
            filters:[],
        }
    },
    methods:{
        handleChange(value){
            
        }
    }
    
}
</script>


