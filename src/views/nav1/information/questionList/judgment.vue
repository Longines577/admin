<template>
	<div>
      <div style="margin: 10px 0;">
        <div class="top1">
            <div class="title">题目：</div>
            <quill-editor ref="myTextEditor" class="cont" v-model="content" :disabled="isType==2?true:false" :options="editorOption1"></quill-editor>
        </div>
        <div class="answer">
          <el-radio-group v-model="radio" :disabled="isType==2?true:false">
            <el-radio :label="1">正确</el-radio>
            <el-radio :label="0">错误</el-radio>
          </el-radio-group>
        </div>
        <div class="tips">正确答案：{{radio==1?'正确':'错误'}}</div>
        
        </div>
      
        <div style="margin: 10px 0;">
            <div class="top1">
                <div class="title">解析：</div>
                <quill-editor ref="myTextEditor" class="cont" v-model="content2" :disabled="isType==2?true:false" :options="editorOption1"></quill-editor>
            </div>
        </div>
	</div>
</template>
<script>
export default {
  data() {
    return {
      content: '',
      content2: '',
      editorOption1: {
        placeholder: ''
      },
      option: '',
      editorOption2: {
        placeholder: ''
      },
      radio: 1,
    }
  },
  props: {
      type:{
          type: String
      },
      data:{
         type: Object
      },
      isType:{
          type: Number
      }
  },
  mounted(){
     if(this.isType==0){
      return false
    }
    if(this.type==5){
    var arr = this.$store.state.question
    this.content = arr.title
    this.content2 = arr.analysisJson[0].content
    this.radio = arr.rightOption[0].option
    }
  },
  methods: {
    submitCform(status,row) {
      this.formDate = {
        ...this.data,
        title: this.content,
        analysisJson: JSON.stringify([
          {index: 1,content:this.content2}
        ]),
        rightOption:JSON.stringify([
          {index: 1,option:this.radio,fraction:this.data.score}
        ]),
        optionsJson:JSON.stringify([
          {index: 1,fraction:this.data.score}
        ]),
        createBy: JSON.parse(sessionStorage.getItem("userInfo")).user.userName,
        createId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
      }
      if(this.formDate.subjectId==undefined||this.formDate.subjectId==''){
        this.$message.warning('请先填写科目')
        return false
      }
      if(this.formDate.mergeId==undefined||this.formDate.mergeId==''){
        this.$message.warning('请先填写省份')
        return false
      }
      if(this.formDate.category!=1&&this.formDate.category!=0){
        this.$message.warning('请先填写类型')
        return false
      }
      if(this.formDate.category==1){
        if(this.formDate.examTime==undefined||this.formDate.examTime==''){
          this.$message.warning('请先填写考期')
          return false
        }
      }
       if(this.formDate.superId==undefined||this.formDate.superId==''){
        this.$message.warning('请先填写知识点')
        return false
      }
      if(this.formDate.score==undefined||this.formDate.score==''){
        this.$message.warning('请先填写分值')
        return false
      }
      if(this.formDate.difficult==undefined||this.formDate.difficult==''){
        this.$message.warning('请先填写难度')
        return false
      }
      if(this.formDate.title==''){
        this.$message.warning('题干未填写')
        return false
      }
      if(this.content2==''){
        this.$message.warning('解析未填写')
        return false
      }
      this.formDate.type = this.data.type
      console.log(this.formDate,11111)
      if(this.isType!=0){
        this.formDate.updateBy= JSON.parse(sessionStorage.getItem("userInfo")).user.userName
        this.formDate.updateId= JSON.parse(sessionStorage.getItem("userInfo")).uc.id
        if(this.isType==1){
          this.formDate.checkStatus = 0
        }
        if(this.isType==2){
          this.formDate.checkName= JSON.parse(sessionStorage.getItem("userInfo")).user.userName
          this.formDate.checkId= JSON.parse(sessionStorage.getItem("userInfo")).uc.id
          this.formDate.checkStatus= status
          if(status==2){
            this.formDate.backReason= row
          }
        }
        this.$fetch({
          url: 'system/api/question/examinationQuestions',
          method: "post",
          data: this.formDate
        }).catch(error => {
          this.$message.error( 'region/queryAllProvince' + "接口出错！");
        }).then(({ data }) => {
          if (data.code == 30000) {
            this.$message({
              message: '执行成功',
              type: 'success'
            });
          } else {
            this.$message.warning(data.message)
          }
        })
      }else{
        this.$fetch({
          url: 'system/api/question/addQuestion',
          method: "post",
          data: this.formDate
        }).catch(error => {
          this.$message.error( 'region/queryAllProvince' + "接口出错！");
        }).then(({ data }) => {
          if (data.code == 30000) {
            this.$message({
              message: '保存成功，可继续填写',
              type: 'success'
            });
            this.content = ''
            this.content2 = ''
          } else {
            this.$message.warning(data.message)
          }
        })
      }
    },
   
  }
}
</script>
<style lang="scss" scoped>
.tips{
  margin: 30px 50px;
}
.answer{
  display: flex;
  margin-left: 50px;
  align-items: center;
}
</style>
<style lang="scss">
.top1{
  display: flex;
  height: 260px;
  .title{
    width: 50px;
  }
  .cont{
    width: 100%;
    .ql-container,.ql-editor{
      min-height: 150px!important;
      max-height: 200px!important;
    }
  }
}
</style>