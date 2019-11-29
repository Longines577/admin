<template>
    <div class="obox" style="margin-left:20px;">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="产品包编号" class="testTime3" style="width:40%;">
          <el-input placeholder="请输入" v-model="input" clearable class="lowOrder"></el-input>
        </el-form-item>
        <el-form-item label="产品包名称" class="testTime3" style="width:40%;">
          <!-- <el-select placeholder="请输入" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select> -->
          <el-input placeholder="请输入" v-model.lazy="input" clearable class="liveHref"></el-input>
        </el-form-item>
        <el-form-item label="一级项目" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" v-model="text1" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级项目" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" v-model="text1" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" class="testTime3" style="width:40%;">
         <el-input-number v-model="num" controls-position="right" @change="handleChange" :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="最低价格" class="testTime3" style="width:40%;">
         <el-input-number v-model="num" controls-position="right" @change="handleChange" :min="0" :max="10"></el-input-number>
        </el-form-item>
         <el-form-item label="服务期配置" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协议配置" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块配置" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教材配置" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保险" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分期" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承接学院" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承接家族" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="承接运营组" class="testTime3" style="width:40%;">
          <el-select placeholder="请选择" clearable>
            <el-option label="简单" value="0"></el-option>
            <el-option label="一般" value="1"></el-option>
            <el-option label="中等" value="2"></el-option>
            <el-option label="复杂" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营长" class="testTime3" style="width:40%;">
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
            input: '',
            filters: {}
        }
    },
    methods:{
        handleChange(value){
            
        }
    }
    
}
</script>

