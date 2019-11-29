<template>
  <div>
    <el-card>
    <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px" :inline="true">
        <el-form-item label="姓名"  prop="userName" :rules="[{ required: true, message: '请填写姓名', trigger: 'blur' }]">
          <el-input placeholder="请输入" v-model="formData.userName" clearable ></el-input>
        </el-form-item>
        <el-form-item label="性别" >
          <el-select v-model="formData.gender" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in ['男','女','未知']" :key="index" :label="item"	:value="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="民族" >
          <el-input placeholder="请输入" v-model="formData.nation" clearable ></el-input>
        </el-form-item>
        <el-form-item label="上课手机号" >
          <el-input placeholder="请输入" v-model="formData.classMobile" clearable ></el-input>
        </el-form-item>
        <el-form-item label="电话1" prop="firstMobile" >
          <el-input placeholder="请输入" v-model="formData.firstMobile" clearable ></el-input>
        </el-form-item>
        <el-form-item label="电话2" >
          <el-input placeholder="请输入" v-model="formData.secondMobile" clearable ></el-input>
        </el-form-item>
        <el-form-item label="微信" >
          <el-input placeholder="请输入" v-model="formData.wx" clearable ></el-input>
        </el-form-item>
        <el-form-item label="QQ" >
          <el-input placeholder="请输入" v-model="formData.qq" clearable ></el-input>
        </el-form-item>
        <el-form-item label="地域"  prop="province" :rules="[{ required: true, message: '请选择', trigger: 'blur' }]">
          <el-select v-model="formData.province" placeholder="请选择" filterable clearable>
              <el-option v-for="(item,index) in province" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入" v-model="formData.email" clearable ></el-input>
        </el-form-item>
        <el-form-item label="出生日期" >
					<el-date-picker
						v-model="formData.birthDate"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="出生日期">
					</el-date-picker>
        </el-form-item>
        <el-form-item label="年龄" >
          <el-input placeholder="请输入" v-model="formData.years" clearable ></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="certificateType" :rules="[{ required: true, message: '请填写证件类型', trigger: 'blur' }]">
          <el-select v-model="formData.certificateType" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in ['身份证']" :key="index" :label="item" :value="index+1"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="certificateCode">
          <el-input placeholder="请输入" v-model="formData.certificateCode" clearable ></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergenContact" :rules="[{ required: true, message: '请填写紧急联系人', trigger: 'blur' }]">
          <el-input placeholder="请输入" v-model="formData.emergenContact" clearable ></el-input>
        </el-form-item>
        <el-form-item label="联系人号码" prop="emergenMobile" :rules="[{ required: true, message: '请填写联系人号码', trigger: 'blur' }]">
          <el-input placeholder="请输入" v-model="formData.emergenMobile" clearable ></el-input>
        </el-form-item>
        <el-form-item label="最高学历" >
          <el-select v-model="formData.education" placeholder="请选择" clearable>
              <el-option v-for="(item,index) in education" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称" >
          <el-input placeholder="请输入" v-model="formData.unitName" clearable ></el-input>
        </el-form-item>
        <el-form-item label="家庭住址" prop="homeAddress">
            <el-input type="textarea" autosize :row='2'  v-model="formData.homeAddress" placeholder="请输入家庭住址" clearable></el-input>
        </el-form-item>
    </el-form>
     
      <div  class="dialog-footer"> 
        <el-button class="btn" type="primary" @click="submitCform">保存</el-button>
      </div>
      </el-card>
  </div>
</template>
<script>

export default {
  data() {
    return {
      formData: {},
      rules: {
        certificateCode:[
            { required: true, message: '证件号不能为空', trigger: 'blur' },
            {   
                pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                message: '证件号格式有误！',
            },
        ],
        email:[
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            {   
                pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                message: '请输入正确邮箱！',
            },
        ]
      },
      education:[],
      province:[],
    }
  },
  props:{
    data: {
      type: Object
    },
  },
  mounted(){
    this.getEducation()
    this.getProvince()
    this.getData()
  },
  methods: {
    submitCform() {
      this.$refs.ruleForm.validate((valid) => {
        if(valid){
      let params = {
        id: this.formData.id,
        userName: this.formData.userName,
        gender: this.formData.gender,
        nation: this.formData.nation,
        classMobile: this.formData.classMobile,
        firstMobile: this.formData.firstMobile,
        secondMobile: this.formData.secondMobile,
        wx: this.formData.wx,
        qq: this.formData.qq,
        province: this.formData.province,
        email: this.formData.email,
        birthDate: this.formData.birthDate,
        years: this.formData.years,
        certificateType: this.formData.certificateType,
        certificateCode: this.formData.certificateCode,
        emergenContact: this.formData.emergenContact,
        emergenMobile: this.formData.emergenMobile,
        education: this.formData.education,
        unitName: this.formData.unitName,
        homeAddress: this.formData.homeAddress,
      }
     this.$fetch({
          url: 'system/api/student/updateStudent',
          method: "post",
          data: params,
      }).catch(error => {
          this.$message.error(this.updateName + "接口出错！");
      }).then(({data})=>{
         if (data.code == 30000) {
          this.$message.success('保存成功！')
          } else {
              this.$message.warning(data.message)
          }
      })
        }
      })
    },
    async getEducation() { 
        let { data } = await this.$fetch({
            url: 'system/api/queryDictionaryByCode',
            method: "post",
            data: {
                categoryCode: 'education'
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.education = data.result
        } else {
          this.$message.warning(data.message)
      }
    },
    async getProvince () { 
        let { data } = await this.$fetch({
            url: 'system/api/region/queryAllProvince',
            method: "post",
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.province = data.result
        } else {
          this.$message.warning(data.message)
      }
    },
    async getData() { 
        let { data } = await this.$fetch({
            url: 'system/api/student/detailStudent',
            method: "post",
            data: {
                id: this.$route.query.id
            },
        }).catch(error => {
            this.$message.error('student/detailStudent' + "接口出错！");
        });
        if (data.code == 30000) {
          this.formData = data.result
          this.formData.education = this.data.education.toString()
        }else {
          this.$message.warning(data.message)
        }
    },
  },

}
</script>

<style scoped>
.el-card{
  margin-top: 20px;
}
.dialog-footer{
text-align: center;

}
.el-textarea{
    display: block;
    width: 850px !important;
}
</style>