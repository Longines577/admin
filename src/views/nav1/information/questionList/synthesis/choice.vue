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
      radio1: 0,
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
    if(this.isType!=0){
      if(this.data.optionsJson==''){
        return false
      }
      this.selectList = JSON.parse(this.data.optionsJson) 
      JSON.parse(this.data.optionsJson).forEach((item,i)=>{
        this.selectList[i].isCorrect = item.isCorrect.toString()
        if(item.isCorrect==1){
          this.radio1 = item.index-1
        }
      })
      this.content = this.data.subheading
      this.content2 = JSON.parse(this.data.analysisJson)[0].content
    }
    
  },
  methods: {
    // submitCform(status,row) {
    //   console.log('测试1111111')
    // },
    saveUpform(data){
      if(this.content == ''){
        this.$message.warning('请先填写题目')
        return false
      }
      this.selectList.forEach((item,index)=>{
        this.selectList[index].index=index+1
        this.selectList[index].option=String.fromCharCode((65+index))
      })
      if(this.type==1){
         this.selectList.forEach((item,index)=>{
          this.selectList[index].isCorrect = 0
        })
        if(this.radio1){
          this.selectList[this.radio1].isCorrect = 1
        }
      }
      let obj = {
        ...data,
        type: this.type,
        subheading: this.content,
        analysisJson: JSON.stringify([
          {index: 1,content:this.content2}
        ]),
        optionsJson:JSON.stringify(this.selectList),
      }
      obj.checkStatus = 0
      if(this.type==1){
        obj.rightOption = JSON.stringify([
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
        obj.rightOption = JSON.stringify([
          {index: 1,option:arr,fraction:this.data.score}
        ])
      }
      if(this.content==''){
        this.$message.warning('题干未填写')
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
            
            return false
          };
      };
      if(this.content2==''){
        this.$message.warning('解析未填写')
        return false
      }
        this.$store.state.children = obj
        this.$message.success('保存修改成功')
        console.log(this.$store.state.children,1111)
    },
    saveCform(data){
      if(this.content == ''){
        this.$message.warning('请先填写题目')
        return false
      }
      this.selectList.forEach((item,index)=>{
        this.selectList[index].index=index+1
        this.selectList[index].option=String.fromCharCode((65+index))
      })
      if(this.type==1){
        this.selectList[this.radio1].isCorrect = 1
      }
      let obj = {
        ...data,
        type: this.type,
        subheading: this.content,
        analysisJson: JSON.stringify([
          {index: 1,content:this.content2}
        ]),
        optionsJson:JSON.stringify(this.selectList),
      }
      if(this.type==1){
        obj.rightOption = JSON.stringify([
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
        obj.rightOption = JSON.stringify([
          {index: 1,option:arr,fraction:this.data.score}
        ])
      }
      if(this.content==''){
        this.$message.warning('题干未填写')
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
            
            return false
          };
      };
      if(this.content2==''){
        this.$message.warning('解析未填写')
        return false
      }
     if(this.$store.state.children.length<1){
       var arr1 = []
     }else{
       var arr1 = this.$store.state.children
     }
        arr1.push(obj)
        this.$store.state.children = arr1
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
      this.$message({
        message: '保存成功，可继续填写',
        type: 'success'
      });
      console.log(this.$store.state.children,1111)
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
    .ql-container{
      min-height: 150px !important;
      max-height: 200px;
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
    .ql-container{
      min-height: 100px !important;
      max-height: 160px;
    }
  }
  .option{
    margin: 20px;

  }
}
</style>
