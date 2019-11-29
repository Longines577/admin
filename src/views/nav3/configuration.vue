<template>
  <div>
    <el-form
      :model="editForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-- <el-form-item label="课件上传" prop="type">
        <el-radio-group v-model="editForm.type" size="small">
          <el-radio-button label="0">文件</el-radio-button>
          <el-radio-button label="1">视频</el-radio-button>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="上传的资源">
        <el-button type="text" @click="upLoad(item)" v-for="(item,index) in config.courseUrl.split(',')" :key='index'>
          {{item}}
        </el-button>
      </el-form-item> -->
      <!-- <el-form-item label="文件" prop="url"  v-if="editForm.type==0">
					<el-upload
            :action="uploadUrl"
            :http-request="upload" 
            :on-success="handleAvatarSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            multiple
            :limit="5"
            :file-list="fileList">
            <el-button size="small" type="success">
            <div class="el-upload__text">点击上传</div></el-button>
          </el-upload>
				</el-form-item>
        <el-form-item label="视频" prop="url" v-if="editForm.type==1">
					<el-upload
            :action="uploadUrl"
            :http-request="upload2" 
            :on-success="handleAvatarSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
              multiple
            :limit="5"
            :file-list="fileList">
            <el-button size="small" type="success">
            <div class="el-upload__text">点击上传</div></el-button>
          </el-upload>
				</el-form-item> -->
      <el-form-item label="随堂考" prop="name">
        <el-input v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="作业" prop="region">
        <el-input v-model="editForm.region"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import listMixin from "@/api/list";
import {updateCourseTurnsTime} from '../../api/api'
export default {
  mixins: [listMixin],
  data() {
    return {
      ruleForm: {
        name: "",
        region: "",
        type: ""
      },
      editForm:{},
      fileList:[],
      fileArr:[],
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
        ],
      }
    };
  },
  props:{
    config:Object
  },
  methods: {
    // sendUrl(){
    //   this.$emit('func',this.editForm.url)
    //   console.log(this.config.id)
    //   // alert('46546')
    // },
    upLoad(item){
      console.log(item)
      window.location.href = 'item'
    },
    saveConfig(){
      let that = this;
      let params = {
        id:this.config.id,
        courseUrl:this.fileArr.join(','),
      }
      updateCourseTurnsTime(params).then(res=>{
            if(res.code === 30000){
                // that.sendUrl()
                // sessionStorage.setItem('url',this.editForm.url)
                // alert('13213')
            }else{
              that.$message(res.message)
            }
      })
    },
     handleAvatarSuccess(res, file) {
      this.editForm.url = this.files;
      this.fileArr.push(this.editForm.url)
      console.log(this.fileArr,'132132')
      this.editForm.viewImg = this.img;
    },
    	handleRemove(file, fileList) {
      this.fileArr = this.fileArr.splice(0,1)
      this.editForm.url = ''
      this.editForm.viewImg = ''
    },
     handlePreview(file) {
      console.log(file);
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