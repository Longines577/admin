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
            <el-input-number controls-position="right" :min="1" placeholder="请输入" :disabled="isType==2?true:false" v-model="item.fraction" style="width:150px">
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
          fraction: '',
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
       var arr = this.data
     JSON.parse(arr.optionsJson).forEach((item,i)=>{
        this.selectList[i].fraction=item.fraction
      })
      JSON.parse(arr.rightOption).forEach((item,i)=>{
        this.selectList[i].option=item.option
      })
      this.content = arr.subheading
      this.content2 = JSON.parse(arr.analysisJson)[0].content
    }
  },
  methods: {
    change(e){
      this.$forceUpdate()
    },
    saveUpform(data) {
      if(this.content == ''){
        this.$message.warning('请先填写题目')
        return false
      }
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
      let obj = {
        ...data,
        type: this.type,
        subheading: this.content,
        analysisJson: JSON.stringify([
          {index: 1,content:this.content2}
        ]),
        rightOption:JSON.stringify(arr2),
        optionsJson:JSON.stringify(arr1),
      }
      obj.checkStatus = 0
       if(this.content==''){
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
      this.$store.state.children = obj
      console.log(this.$store.state.children,1111)
      this.$message.success('保存修改成功')
    },
    saveCform(data){
      if(this.content == ''){
        this.$message.warning('请先填写题目')
        return false
      }
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
      let obj = {
        ...data,
        type: this.type,
        subheading: this.content,
        analysisJson: JSON.stringify([
          {index: 1,content:this.content2}
        ]),
        rightOption:JSON.stringify(arr2),
        optionsJson:JSON.stringify(arr1),
      }
       if(this.content==''){
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
       if(this.$store.state.children.length<1){
        var arr1 = []
      }else{
        var arr1 = this.$store.state.children
      }
        arr1.push(obj)
        this.$store.state.children = arr1
        this.content = ''
        this.content2 = ''
        this.selectList =　[
          {
            option: '',
            fraction: '',
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
          option: '',
          fraction: '',
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