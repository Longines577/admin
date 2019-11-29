<template>
  <div class="content">
    <el-form :inline="true" :model="filters" style="width:100%;" class="form">
      <el-form-item label="名称:" style="width:80%;margin-left:49px;">
        <!-- <el-input v-model="input" placeholder="请输入内容"></el-input> -->
        <el-input placeholder="请输入内容" v-model="argList.name" class="name"></el-input>
      </el-form-item>
      <el-form-item label="类别编码:" style="width:80%">
        <el-select v-model="argList.categoryCode" placeholder="请选择" clearable class="encode">
          <el-option v-for="item in options" :key="item.id" :label="item.code" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码" style="width:80%;margin-left:58px;">
        <el-input v-model="argList.dkey" placeholder="请输入内容" class="name"></el-input>
      </el-form-item>
      <el-form-item label="值" style="width:80%;margin-left:85px;">
        <el-input v-model="argList.value" placeholder="请输入内容" class="name"></el-input>
      </el-form-item>
      <el-form-item label="描述" style="width:80%;margin-left:58px;">
        <el-input v-model="argList.description" placeholder="请输入内容" class="name"></el-input>
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
import { updateDictionary } from "../../../api/api";
export default {
  data() {
    return {
      filters: {
        item2: ""
      },
      options: [],
      argList: {
        name: "",
        categoryCode: "",
        description: "",
        dkey: "",
        value: "",
        id: ""
      }
    };
  },
  watch: {
    data1: {
      handler: function(newVal, oldVal) {
        this.list = newVal;
        this.argList.name = this.list.name;
        this.argList.categoryCode = this.list.categoryCode;
        this.argList.description = this.list.description;
        this.argList.dkey = this.list.dkey;
        this.argList.value = this.list.value;
        this.argList.id = this.list.id;
      },
      deep: true,
      immediate: true
    }
  },
  props: {
    data1: Object
  },
  methods: {
    getQueryDictionCategoryAll() {
      this.$http({
        url: "system/api/queryDictionCategoryAll",
        method: "post"
      })
        .catch(error => {
          this.$message.error(this.apiName + "接口出错！");
        })
        .then(res => {
          if (res.data.code == 30000) {
            this.options = res.data.result;
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        });
    },
    ok() {
      let data = {
        name: this.argList.name,
        categoryCode: this.argList.categoryCode,
        description: this.argList.description,
        dkey: this.argList.dkey,
        value: this.argList.value,
        id: this.argList.id
      };
      updateDictionary(data).then(res => {
      if(res.code === 30000){
      this.$emit("save-ok");
      }else{
        this.$message({
            showClose: true,
            message: "system/api/updateDictionary",
            type: "error"
          });
      }
      });
    }
  },
  mounted() {
    this.getQueryDictionCategoryAll();
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


