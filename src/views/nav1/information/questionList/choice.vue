<template>
	<div>
      <div style="margin: 10px 0;">
        <div class="top1">
            <div class="title">题目：</div>
            <quill-editor ref="myTextEditor" class="cont" v-model="content" :disabled="isType==2?true:false" :options="editorOption1"></quill-editor>
        </div>
        <div class="select1" v-for="(item, index) in selectList" :key="index">
            <div class="title">{{String.fromCharCode((65+index))}}、</div>
            <quill-editor ref="myTextEditor" class="cont" v-model="item.title" :disabled="isType==2?true:false" :options="editorOption2"></quill-editor>
            <el-radio class="option" v-if="type==1" v-model="radio1" :label="index" :disabled="isType==2?true:false" true-label="1" false-label="0">设为正确答案</el-radio>
            <el-checkbox class="option" v-if="type==2" v-model="item.isCorrect" :label="index" :disabled="isType==2?true:false" true-label="1" false-label="0">设为正确答案</el-checkbox>
            <el-button type="text" icon="el-icon-delete" @click="del(index)"></el-button>
        </div>
        </div>
        <div style="margin: 20px 50px;">
            <el-button type="primary" @click="add">增加选项</el-button>
            <div class="answer" v-if="type==1">正确答案：{{String.fromCharCode((65+radio1))}}</div>
            <div class="answer" v-if="type==2">正确答案：<span v-for="(item, index) in selectList" :key="index" v-show="item.isCorrect==1">{{String.fromCharCode((65+index))}}</span></div>
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
      formDate:{},
      rules: {},
      radio1:0,
      selectList: [
        {
          title: '',
          fraction: -1,
          isCorrect: '0'
        },
        {
          title: '',
          fraction: -1,
          isCorrect: '0'
        },
        {
          title: '',
          fraction: -1,
          isCorrect: '0'
        },
        {
          title: '',
          fraction: -1,
          isCorrect: '0'
        },
      ],
    }
  },
  props: {
      data:{
         type: Object
      },
      type:{
          type: String
      },
      isType:{
          type: Number
      }
  },
  mounted(){
    if(this.isType==0){
      return false
    }
    if(this.type==1||this.type==2){
      var arr = this.$store.state.question
      this.selectList = arr.optionsJson
      arr.optionsJson.forEach((item,i)=>{
        this.selectList[i].isCorrect = item.isCorrect.toString()
        if(item.isCorrect==1){
          this.radio1 = item.index-1
        }
      })
      console.log(this.selectList)
      this.content = arr.title
      this.content2 = arr.analysisJson[0].content
    }
   
    
  },
  methods: {
    submitCform(status,row) {
      
      this.selectList.forEach((item,index)=>{
        this.selectList[index].index=index+1
        this.selectList[index].option=String.fromCharCode((65+index))
      })
      if(this.type==1){
         this.selectList.forEach((item,index)=>{
          this.selectList[index].isCorrect = 0
        })
        this.selectList[this.radio1].isCorrect = 1
      }
      this.formDate = {
        ...this.data,
        title: this.content,
        analysisJson: JSON.stringify([
          {index: 1,content:this.content2}
        ]),
        
        optionsJson:JSON.stringify(this.selectList),
        createBy: JSON.parse(sessionStorage.getItem("userInfo")).user.userName,
        createId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
      }
      if(this.type==1){
        this.formDate.rightOption = JSON.stringify([
          {index: 1,option:String.fromCharCode((65+this.radio1)),fraction:this.data.score}
        ])
      }else{
        var arr =''
        var i = 0
        this.selectList.forEach((item,index)=>{
          if(item.isCorrect==1){
            arr = arr + String.fromCharCode((65+index))+','
          }
        })
        this.formDate.rightOption = JSON.stringify([
          {index: 1,option:arr,fraction:this.data.score}
        ])
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
      if(this.formDate.title==undefined||this.formDate.title==''){
        this.$message.warning('请先填写题干')
        return false
      }
      try {
          this.selectList.forEach((item,index)=>{
          if(item.title==''){
              this.$message.warning('请先填写选项');
            throw new Error("end");
          }
        })
      } catch(e) {
          if(e.message=="end"){
            console.log(this.selectList,1111)
            return false
            
          };
      };
      if(this.type==2&&arr == ''){
        this.$message.warning('答案未选择')
        return false
      }
      if(this.content2==''){
        this.$message.warning('解析未填写')
        return false
      }
      this.formDate.type = this.data.type
      // console.log(this.formDate,11111)
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
            this.radio1 = 0
            this.selectList =　[
              {
                title: '',
                fraction: -1,
                isCorrect: 0
              },
              {
                title: '',
                fraction: -1,
                isCorrect: 0
              },
              {
                title: '',
                fraction: -1,
                isCorrect: 0
              },
              {
                title: '',
                fraction: -1,
                isCorrect: 0
              },
            ]
          } else {
            this.$message.warning(data.message)
          }
        })
      }
    },
    add(){
      if(this.isType==2){
        return false
      }
      this.selectList.push({
          title: '',
          fraction: -1,
          isCorrect: 0
      });
    },
    del(index){
      if(this.isType==2){
        return false
      }
       if(this.selectList.length > 1){
          this.selectList.splice(index,1);
        }else{
          this.$message({
                  type: 'error',
                  message: '不可删除'
          })
        }
    },

   
  }
}
</script>
<style lang="scss" scoped>
.answer{
  margin: 20px 0;
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
.select1{
  display: flex;
  margin-top: 20px;
  height: 160px;
  align-items: center;
  .title{
    width: 50px;
    text-align: center;
  }
  .cont{
    width: 70%;
    .ql-container,.ql-editor{
      min-height: 100px !important;
      max-height: 160px;
    }
  }
  .option{
    margin: 20px;

  }
}
</style>
