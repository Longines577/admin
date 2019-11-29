<template>
	<div>
      <div style="margin: 10px 0;">
        <div class="top1">
            <div class="title">题目：</div>
            <quill-editor ref="myTextEditor" class="cont" v-model="content" :disabled="isType==2?true:false" :options="editorOption1"></quill-editor>
        </div>
        <div class="tips">选项：</div>
        <div v-for="(item, j) in answerList" :key="j">
            <div class="answer">
              <div class="title">{{String.fromCharCode((65+j))}}、</div>
              <el-input placeholder="请输入" v-model="item.content" @input="change($event)" :disabled="isType==2?true:false" style="width:80%;margin: 0 10px;">
              </el-input>
              <el-button type="text" icon="el-icon-delete" @click="delAnswer(j)">删除</el-button>
            </div>
        </div>
        <div style="margin: 20px 50px;">
            <el-button type="primary" @click="addAnswer">插入选项</el-button>
        </div>
        <div class="tips">正确答案：</div>
        <div v-for="(item, index) in selectList" >
            <div class="answer">
              <div class="title">第{{index+1}}空</div>
              <el-input-number controls-position="right" :min="1" placeholder="请输入" :disabled="isType==2?true:false" v-model="item.fraction" @change="setScore" style="width:150px">
                <template slot="append">分</template>
              </el-input-number>
              <el-radio-group v-model="item.select" size="mini" :disabled="isType==2?true:false" style="margin: 0 20px;" >
                <el-radio  v-for="(item, i) in answerList" :key="i" :label="i" :disabled="isType==2?true:false">{{String.fromCharCode((65+i))}}</el-radio>
              </el-radio-group>
              <el-button type="text" icon="el-icon-delete" @click="del(index)">删除</el-button>
            </div>
            <div style="margin: 10px 0;">
              <div class="top1">
                  <div class="title">解析：</div>
                  <quill-editor ref="myTextEditor" class="cont" v-model="item.content" :disabled="isType==2?true:false" :options="editorOption1"></quill-editor>
              </div>
          </div>
        </div>
         <div style="margin: 20px 50px;">
            <el-button type="primary" @click="add">插入填空</el-button>
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
      rules: {},
      answerList: [
        {content: ''},
        {content: ''},
      ],
      selectList: [
        {
          select: '',
          content: '',
          fraction: 1,
        },
        {
          select: '',
          content: '',
          fraction: 1,
        },
      ],
      num: 0
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
    if(this.type==9){
    var arr = this.$store.state.question
    this.content = arr.title
      this.answerList = arr.optionsJson
      arr.optionsJson.forEach((item,i)=>{
        this.answerList[i].content=item.title
      })
      this.selectList = arr.rightOption
      arr.rightOption.forEach((item,i)=>{
        this.selectList[i].select=item.option.charCodeAt()-65
        this.selectList[i].fraction=item.fraction
      })
      arr.analysisJson.forEach((item,i)=>{
        this.selectList[i].content=item.content
      })
    // this.content2 = arr.analysisJson[0].content
    // this.radio = arr.rightOption[0].option
    }
  },
  methods: {
    change(e){
      this.$forceUpdate()
    },
    setScore(val){
       this.num = 0
       this.selectList.forEach((item)=>{
         this.num += item.fraction
       })
       this.$emit('set-score',this.num)
    },
    submitCform(status,row) {
      var arr1=[],arr2=[],arr3=[]
      this.answerList.forEach((item,index)=>{
        arr1.push({
          index: index+1,
          option:String.fromCharCode((65+index)),
          title:item.content
        })
      })
      this.selectList.forEach((item,index)=>{
        arr2.push({
          index: index+1,
          option:String.fromCharCode((65+item.select)),
          fraction:item.fraction
        })
        arr3.push({
          index: index+1,
          content:item.content
        })
      })
      this.formDate = {
        ...this.data,
        title: this.content,
        analysisJson: JSON.stringify(arr3),
        rightOption:JSON.stringify(arr2),
        optionsJson:JSON.stringify(arr1),
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
      try {
          arr1.forEach((item,index)=>{
          if(item.title==''){
              this.$message.warning('请先填写选项');
            throw new Error("end");
          }
        })
      } catch(e) {
          if(e.message=="end"){
            return false
          };
      }
      try {
          this.selectList.forEach((item,index)=>{
          if(item.select===''){
              this.$message.warning('请先选择答案');
            throw new Error("end");
          }
        })
      } catch(e) {
          if(e.message=="end"){
            console.log(this.selectList,arr2)
            return false
          };
      }
      try {
          arr3.forEach((item,index)=>{
          if(item.content==''){
            this.$message.warning('解析未填写')
            throw new Error("end");
          }
        })
      } catch(e) {
          if(e.message=="end"){
            return false
          };
      };
      
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
            this.answerList = [
              {content: ''},
              {content: ''}
            ]
            this.selectList =　[
              {
                select: '',
                content: '',
                fraction: 1,
              },
              {
                select: '',
                content: '',
                fraction: 1,
              },
            ]
          } else {
            this.$message.warning(data.message)
          }
        })
      }
    },
    add(){
      this.num = 0
      if(this.isType==2){
        return false
      }
      this.selectList.push({
          select: '',
          content: '',
          fraction: 1,
      });
       this.selectList.forEach((item)=>{
         this.num += item.fraction
       })
        this.$emit('set-score',this.num)
    },
    del(index){
      if(this.isType==2){
        return false
      }
       if(this.selectList.length > 1){
          this.selectList.splice(index,1);
          this.num = 0
       this.selectList.forEach((item)=>{
         this.num += item.fraction
       })
       this.$emit('set-score',this.num)
        }else{
          this.$message({
                  type: 'error',
                  message: '不可删除'
          })
        }
    },
    addAnswer(){
      if(this.isType==2){
        return false
      }
       this.answerList.push({
          content: ''
      });
    },
    delAnswer(index){
      if(this.isType==2){
        return false
      }
       if(this.answerList.length > 1){
          this.answerList.splice(index,1);
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
.tips{
  margin-top: 30px;
}
.answer{
  display: flex;
  margin: 20px 0;
  align-items: center;
  .title{
    width: 60px;
    text-align: left;
  }
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