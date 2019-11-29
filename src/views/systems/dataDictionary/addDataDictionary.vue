<template>
  <div class="content">
    <el-form :inline="true" :model="filters" style="width:100%;" class="form">
      <el-form-item label="名称:" style="width:80%;margin-left:49px;">
        <!-- <el-input v-model="input" placeholder="请输入内容"></el-input> -->
        <el-input placeholder="请输入内容" v-model="data.input" class="name"></el-input>
      </el-form-item>
      <el-form-item label="类别编码:" style="width:80%">
        <el-select v-model="data.categoryCode1" placeholder="请选择" clearable class="encode">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.code" 
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码" style="width:80%;margin-left:58px;">
        <el-input v-model="data.dkey" placeholder="请输入内容" class="name"></el-input>
      </el-form-item>
      <el-form-item label="值" style="width:80%;margin-left:85px;">
        <el-input v-model="data.value" placeholder="请输入内容" class="name"></el-input>
      </el-form-item>
      <el-form-item label="描述" style="width:80%;margin-left:58px;">
        <el-input v-model="data.description" placeholder="请输入内容" class="name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="考期">
						<el-date-picker type="date" placeholder="选择日期" v-model="filters.birth"></el-date-picker>
      </el-form-item>-->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('save-ok')" style="width:200px;">取 消</el-button>
      <el-button type="primary" @click="ok" style="width:200px;">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { addDictionary,queryDictionCategoryAll } from "../../../api/api";
export default {
  data() {
    return {
      filters: {
        item1: "",
        item2: "",
        birth: ""
      },
      options:[],
       apiName: "system/api/queryDictionCategoryAll",
      data: {
        input: "",
        categoryCode1: "",
        dkey: "",
        value: "",
        description: ""
      }
    };
  },
  props: {
  },
  watch:{

  },
  methods: {
    getQueryDictionCategoryAll() {
            this.$http({
                url: 'system/api/queryDictionCategoryAll',
                method: "post",
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            }).then(res=>{
                if (res.data.code == 30000) {
                   
                this.options = res.data.result
            }
            })
            
        },
    ok() {
      console.log(this.data.categoryCode1)
      let dataList = {
        'name':this.data.input,
        'categoryCode':this.data.categoryCode1,
        'dkey':this.data.dkey,
        'value':this.data.value,
        'description':this.data.description
      }
      addDictionary(dataList).then(res => {
        console.log(res)
         if (res.code == 30000) {
                this.$message.success('保存成功！')
                    this.$emit('save-ok')
                    this.data = {}
            } else {
                this.$message.warning(res.message)
            }
         
      })
      
    },
  },
  mounted() {
    this.getQueryDictionCategoryAll()
  }
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
.name {
  width: 260%;
}
.encode {
  width: 240%;
}
.el-form-item__content {
  width: 78% !important;
}
.dialog-footer {
  margin-left: 195px;
}
</style>


