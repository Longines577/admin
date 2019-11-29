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
    if(this.isType!=0){
      if(this.data.analysisJson==''){
        return false
      }
       var arr = this.data
      this.content = arr.subheading
      this.content2 = JSON.parse(arr.analysisJson)[0].content
      this.radio = JSON.parse(arr.rightOption)[0].option
    }
  },
  methods: {
    saveUpform(data){
      if(this.content == ''){
        this.$message.warning('请先填写题目')
        return false
      }
      let obj = {
        ...data,
        type: this.type,
        subheading: this.content,
        analysisJson: JSON.stringify([
          {index: 1,content:this.content2}
        ]),
        rightOption:JSON.stringify([
          {index: 1,option:this.radio,fraction:this.data.score}
        ]),
        optionsJson:JSON.stringify([
          {index: 1,fraction:this.data.score}
        ]),
      }
      obj.checkStatus = 0
      if(this.content==''){
        this.$message.warning('题干未填写')
        return false
      }
      if(this.content2==''){
        this.$message.warning('解析未填写')
        return false
      }
      this.$store.state.children = obj
      console.log(this.$store.state.children,1111)
      this.$message.success('保存修改成功')
    },
    saveCform(data){
      if(this.content == ''){
        this.$message.warning('请先填写题目')
        return false
      }
      let obj = {
        ...data,
        type: this.type,
        subheading: this.content,
        analysisJson: JSON.stringify([
          {index: 1,content:this.content2}
        ]),
        rightOption:JSON.stringify([
          {index: 1,option:this.radio,fraction:this.data.score}
        ]),
        optionsJson:JSON.stringify([
          {index: 1,fraction:this.data.score}
        ]),
      }
      if(this.content==''){
        this.$message.warning('题干未填写')
        return false
      }
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
      this.$message({
        message: '保存成功，可继续填写',
        type: 'success'
      });
      console.log(this.$store.state.children,1111)
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