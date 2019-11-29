<template>
  <div class="content">
    <span class="return_premium">应退费：{{arrs}}</span>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="收款人">
        <el-input v-model="formInline.user" placeholder="请输入收款人"></el-input>
      </el-form-item>
      <el-form-item label="收款方式" style="margin-left:30px;">
        <el-select v-model="formInline.region" placeholder="请选择收款方式">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款理由" class="remarks">
        <el-input
          type="textarea"
          :rows="7"
          :maxlength="200"
          @input="descInput"
          v-model="formInline.desc"
          placeholder="请输入退款理由"
          style="width:850px;"
        ></el-input>
        <span class="textLeft">{{remnant}}/200</span>
      </el-form-item>
    </el-form>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      arrs: "1000",
      arrsPerson: "",
      value: "",
      remnant:'200',
      formInline: {
        user: "",
        region: "",
         desc:''
      }
    };
  },
  methods: {
       descInput() {
      var txtVal = this.form.desc.length;
      this.remnant = 200 - txtVal;
    },
  },
  mounted() {}
};
</script>
<style scoped>
.content {
  height: 500px;
  margin-left: 60px;
  margin-top: 60px;
  position: relative;
}
.demo-form-inline{
    padding-top:30px;
}
.return_premium{
  font-size: 14px;
  font-family: '微软雅黑';
  font-weight: bolder;
}
.textLeft{
  position: absolute;
  top: 120px;
  left: 790px;
  font-weight: bolder;
  }
</style>


