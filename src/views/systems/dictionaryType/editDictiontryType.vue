<template>
  <div class="content">
    <el-form :inline="true" :model="argList" style="width:100%;" class="form">
      <el-form-item label="名称:" style="width:80%;margin-left:49px;">
        <!-- <el-input v-model="input" placeholder="请输入内容"></el-input> -->
        <el-input placeholder="请输入内容" v-model="argList.name" class="name"></el-input>
      </el-form-item>

      <el-form-item label="编码" style="width:80%;margin-left:58px;" v-if="argList !== null">
        <el-input v-model="argList.code" placeholder="请输入内容" class="name"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('save-ok')" style="width:200px;">取 消</el-button>
      <el-button type="primary" @click="ok" style="width:200px;">确 定</el-button>
    </div>
  </div>
</template>
<script>
import { updateDictionaryCategory } from "../../../api/api";
export default {
  data() {
    return {
      filters: {
        item2: ""
      },
      argList: {
        name: "",
        code: "",
        id: ""
      }
    };
  },
  watch: {
    data1: {
      handler: function(newVal, oldVal) {
        this.argList.name = newVal.name;
        this.argList.code = newVal.code;
        this.argList.id = newVal.id;
        console.log(this.argList.name);
      },
      deep: true,
      immediate: true
    }
  },
  props: {
    data1: Object
  },
  methods: {
    ok() {
      let data = {
        name: this.argList.name,
        code: this.argList.code,
        id: this.argList.id
      };
      updateDictionaryCategory(data).then(res => {
        if (res.code === 30000) {
          this.$emit("save-ok");
        } else {
          this.$message({
            showClose: true,
            message: "system/api/updateDictionaryCategory",
            type: "error"
          });
        }
      });
    }
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


