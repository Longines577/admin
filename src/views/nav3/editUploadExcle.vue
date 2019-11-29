<template>
  <div>
    <el-form
      :model="editForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- <el-form-item
        label="上传的资源"
        v-for="(val,index) in edit.courseUrl.split(',') "
        :key="index"
      >{{val}}</el-form-item>-->

      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox
          v-for="(val,index) in edit.courseUrl.split(',')"
          :label="val"
          :key="index"
        >{{val}}</el-checkbox>
      </el-checkbox-group>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="cancle">删除</el-button> -->
    </div>
  </div>
</template>
<script>
import listMixin from "@/api/list";
import { updateCourseTurnsTime } from "../../api/api";
export default {
  mixins: [listMixin],
  data() {
    return {
      editForm: {},
      checkedCities: [],
      fileList: [],
      fileArr: [],
      delArr: null,
      delArr1: null,
      length:null,
      params: "",
      uploadUrl: $UPLOAD,
      rules: {
        upLoad: [
          {
            required: true,
            message: "请上传课件",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    edit: Object
  },
  methods: {
    handleCheckedCitiesChange(value) {
      var arr = ['0','1','2','3','4']
      var index = 3
        var arr6 =  arr.slice(index).slice(1)
        var arr1 = arr.slice(0,index)
        var arr4 = arr1.concat(arr6)
        console.log(arr4)
      this.delArr = value;
      // this.length = this.delArr.length
    },
    del() {
      if (this.delArr.length != 0) {
        var index = this.edit.courseUrl.split(',').indexOf(this.delArr.join(','))
        if(index ==0){
        this.delArr1 = this.edit.courseUrl.split(',').slice(1);
        }else if(index+1 ==this.edit.courseUrl.split(',').length){
      this.delArr1 = this.edit.courseUrl.split(',').slice(0,this.edit.courseUrl.split(',').length-1);
        }else{
          var arr6 = this.edit.courseUrl.split(',').slice(index).slice(1);
          var arr5 = this.edit.courseUrl.split(',').slice(0,index)
          this.delArr1 = arr5.concat(arr6)
        // this.delArr1 = this.edit.courseUrl.split(',').slice(1);
        }
       
        console.log(this.delArr1,'121')
        // console.log(this.delArr1,'123132')
        let params = {
          id: this.edit.id,
          courseUrl: this.delArr1.join(",")
        };
        updateCourseTurnsTime(params).then(res=>{
            if(res.code ===30000){

            }else{
                this.$message({
          showClose: true,
          message: "保存文件接口出错",
          type: "warning"
        });
            }
        })
        
      } else {
        this.$message({
          showClose: true,
          message: "请选择要删除的文件",
          type: "warning"
        });
      }
    },
    // sendUrl(){
    //   this.$emit('func',this.editForm.url)
    //   console.log(this.config.id)
    //   // alert('46546')
    // },
    upLoad(item) {
      console.log(item);
      //   window.location.href = 'item'
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {}
};
</script>