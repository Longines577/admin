<template>
  <div class="content">
    <el-form :inline="true" style="width:100%;" class="form">
      <el-form-item label="名称:" style="width:80%;margin-left:49px;">
        <!-- <el-input v-model="input" placeholder="请输入内容"></el-input> -->
        <el-input placeholder="请输入内容" v-model="data.name" class="name"></el-input>
      </el-form-item>
      <el-form-item label="编码" style="width:80%;margin-left:58px;">
        <el-input v-model="data.code" placeholder="请输入内容" class="name"></el-input>
      </el-form-item>
    
    </el-form>
     <div slot="footer" class="dialog-footer">
          <el-button @click="$emit('save-ok')" style="width:200px;">取 消</el-button>
          <el-button type="primary" @click="ok" style="width:200px;">确 定</el-button>
        </div>
  </div>
</template>
<script>
import {addDictionaryCategory} from '../../../api/api'
export default {
  data() {
    return {
     data: {
        name: "",
        code: "",
      },
    };
  },
  props: {},
  methods: {
    ok(){
      let dataList = {
        'name':this.data.name,
        'code':this.data.code,
      }
      addDictionaryCategory(dataList).then(res=>{
        if (res.code == 30000) {
                this.$message.success('保存成功！')
                    this.$emit('save-ok')
                    this.data = {}
            } else {
                this.$message.warning(res.message)
            }

      })
      // this.$emit('save-ok')

    },
  },
  mounted() {}
};
</script>
<style scoped>
.content {
  width: 100%;
}
.form {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
  background: white;
  margin-bottom: 20px;
  padding-top: 20px;
}
/* .el-select .el-input {
  width: 130px;
} */
.name{
    width: 260%;
}
.encode{
    width:240%;
}
.el-form-item__content {
  width: 78% !important;
}
.dialog-footer{
  margin-left: 195px;
}
.dialog-footer{
  margin-left: 195px;
}
</style>


