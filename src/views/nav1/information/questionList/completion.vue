<template>
	<div>
      <div style="margin: 10px 0;">
        <div class="top1">
            <div class="title">题目：</div>
            <quill-editor ref="myTextEditor" class="cont" v-model="content" :disabled="isType==2?true:false" :options="editorOption1"></quill-editor>
        </div>
        <div class="tips">正确答案：</div>
        <div class="answer" v-for="(item, index) in selectList" :key="index">
            <div class="title">第{{index+1}}空</div>
            <el-input-number controls-position="right" :min="1" placeholder="请输入" :disabled="isType==2?true:false" v-model="item.fraction" @change="setScore" style="width:150px">
                <template slot="append">分</template>
            </el-input-number>
            <el-input placeholder="请输入" v-model="item.option" @input="change($event)" :disabled="isType==2?true:false" style="flex: 1;margin-left:10px;">
            </el-input>
            <el-button type="text" icon="el-icon-delete" @click="del(index)">删除</el-button>
        </div>
        </div>
        <div style="margin: 20px 50px;">
            <el-button type="primary" @click="add">增加空格</el-button>
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
      rules: {},
      selectList: [
        {
          option: '',
          fraction: 1,
        },
        // {
        //   option: '',
        //   fraction: '',
        // },
        // {
        //   option: '',
        //   fraction: '',
        // },
        // {
        //  option: '',
        //  fraction: '',
        // }
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
    if(this.type==3||this.type==4){
      var arr = this.$store.state.question
      this.selectList = arr.optionsJson
      console.log(arr,111111)
      arr.optionsJson.forEach((item,i)=>{
        this.selectList[i].fraction=item.fraction
      })
      arr.rightOption.forEach((item,i)=>{
        this.selectList[i].option=item.option
      })
      this.content = arr.title
      this.content2 = arr.analysisJson[0].content
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
      var arr1=[],arr2=[]
      this.selectList.forEach((item,index)=>{
        arr1.push({
          index: index+1,
          fraction:item.fraction
        })
        arr2.push({
          index: index+1,
          option:item.option,
          fraction:item.fraction
        })
      })
      this.formDate = {
        ...this.data,
        title: this.content,
        analysisJson: JSON.stringify([
          {index: 1,content:this.content2}
        ]),
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
          arr2.forEach((item,index)=>{
          if(item.option==''){
              this.$message.warning('请先填写答案');
            throw new Error("end");
          }
        })
      } catch(e) {
          if(e.message=="end"){
            console.log(this.selectList,1111)
            return false
          };
      };
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
            this.selectList =　[
              {
                option: '',
                fraction: 1,
              },
              // {
              //   option: '',
              //   fraction: '',
              // },
              // {
              //   option: '',
              //   fraction: '',
              // },
              // {
              //   option: '',
              //   fraction: '',
              // },
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
          option: '',
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