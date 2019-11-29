<template>
  <div>
    <el-form :model="formData" label-width="80px" :rules="rules" ref="ruleForm">
        <el-form-item label="试卷名称" prop="name" :rules="[{ required: true, message: '请填写试卷名称', trigger: 'blur' }]">
          <el-input placeholder="请输入" v-model="formData.name" clearable style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="试卷类型" prop="type" :rules="[{ required: true, message: '请填写试卷类型', trigger: 'blur' }]">
          <el-select placeholder="请选择" v-model="formData.type" clearable style="width:220px">
            <el-option label="真题" value="1"></el-option>
            <el-option label="模拟题" value="0"></el-option>
          </el-select>
        </el-form-item>
       <el-form-item label="科目" prop="subjectId" :rules="[{ required: true, message: '请填写科目', trigger: 'blur' }]">
          <el-select placeholder="请选择" v-model="formData.subjectId"  @change="getMerge" clearable filterable style="width:220px">
            <el-option v-for="item in option3" :key="item.value" :label="item.subjectName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="省份" prop="regionId" :rules="[{ required: true, message: '请填写省份', trigger: 'blur' }]">
          <el-select placeholder="请选择" v-model="formData.regionId" clearable filterable style="width:220px">
            	<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考期" v-if="formData.type==1" prop="examTime" >
					<el-date-picker
						v-model="formData.examTime"
						type="month"
            value-format="yyyy-MM"
						placeholder="选择考期">
					</el-date-picker>
				</el-form-item>
        <el-form-item label="答题时间">
         <el-input-number  v-model="formData.answerTime" controls-position="right" :min="0" style="width:220px"></el-input-number>
        </el-form-item>
      
        <el-form-item label="难度" prop="diffcult" :rules="[{ required: true, message: '请选择难度', trigger: 'blur' }]">
          <el-select placeholder="请选择" v-model="formData.diffcult" clearable style="width:220px">
            <el-option label="容易" value="1"></el-option>
            <el-option label="中偏易" value="2"></el-option>
            <el-option label="中" value="3"></el-option>
            <el-option label="中偏难" value="4"></el-option>
            <el-option label="难" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" :rules="[{ required: true, message: '请选择状态', trigger: 'blur' }]">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">上线</el-radio>
            <el-radio :label="0">下线</el-radio>
          </el-radio-group>
        </el-form-item>
    </el-form>
     
    <div slot="footer" class="dialog-footer"> 
        <el-button class="btn" type="primary" @click="submitCform">保存</el-button>
        <el-button class="btn" @click="$emit('save-ok')">取消</el-button>
      </div>
  </div>
</template>
<script>
import listMixin from '@/api/list'
export default {
  mixins: [listMixin],
  data() {
    return {
      addName: 'system/api/paper/addPaper',
      updateName:'system/api/paper/updatePaper',
      formData: {
        status: 0,
      },
      editForm:{},
      rules: {},
      option3:[],
      option: [],
    }
  },
  props: {
      data:{
         type: Object
      },
      type:{
          type: Number
      },
  },
  mounted(){
    this.getItem()
    if(this.type==1){
      this.getMerge(this.data.subjectId)
      this.data && (this.formData = this.data) && (this.formData.type = this.data.type.toString())
    }
    
    
  },
  methods: {
  
    submitCform(){
      this.editForm = this.formData
      this.editForm.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      this.editForm.createBy=JSON.parse(sessionStorage.getItem("userInfo")).user.userName
      this.editForm.createId= JSON.parse(sessionStorage.getItem("userInfo")).uc.id
       if(this.type){
          this.update()
        }else{
          this.add()
        }
    },
    editOk(){
      this.$emit('save-ok');
    },
    async getMerge(id) {
        let { data } = await this.$fetch({
          url: 'system/api/provinceMerge/queryProvinceBySubjectId',
          method: "post",
          data: {
              subjectId: id,
              busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
          },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
          this.option = data.result
        }
    },
   
  },

}
</script>
<style lang="scss" scoped>
.el-radio-button {
  margin: 0 0 20px;
  position: relative;
  margin-left: 10px;
  border: 1px #dcdfe6 solid;
  border-radius: 4px !important;
  display: inline-block;
  outline: 0;
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
</style>
<style scoped>


</style>