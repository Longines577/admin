<template>
	<div>
    <div style="margin: 10px 0;">
      <div class="top">
          <div class="title">材料：</div>
          <quill-editor ref="myTextEditor" class="cont" v-model="content" :disabled="isType==2?true:false" :options="editorOption1"></quill-editor>
      </div>
      </div>
      <el-button type="primary" @click="saveTitle" v-if="isType!=2">保存题干</el-button>
      <el-button type="primary" @click="addTitle" v-if="isType==1">新增小题</el-button>
      <el-table :data="list" border highlight-current-row stripe style="width: 100%;" v-if="isType!=0">
        <el-table-column align="center" type="index" label="编号" width="60"></el-table-column>
        <el-table-column align="center" prop="type" 
        :formatter="row => row.type == 1 ? '单选题' : row.type == 2 ? '多选题' :row.type == 3 ? '填空题' :row.type == 4 ? '填空题' :row.type == 5 ? '判断题' :row.type == 7 ? '文字题' :''"
        label="题目类型"></el-table-column>
        <el-table-column align="center" prop="score" label="分值">
          <!-- <template slot-scope="scope">
            <span v-html="scope.row.subheading"></span>
          </template> -->
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="handleDel(scope.row,scope.$index)">删除</el-button>
            <el-button size="small" @click="seeQuestion(scope.row)">配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="type">
        <span>新增题型：</span>
        <el-radio-group v-model="txType" :disabled="isType==2?true:false" >
          <el-radio-button label="1">单选题</el-radio-button>
          <el-radio-button label="2">多选题</el-radio-button>
          <el-radio-button label="3">填空题</el-radio-button>
          <el-radio-button label="5">判断题</el-radio-button>
          <el-radio-button label="7">简答题</el-radio-button>
        </el-radio-group>
      </div>
      
      <choice @up-ok="editOk" :type='txType' :isType='isType' :data='formData' ref="choiceBox1" v-if="txType==1"></choice>
      <choice2 @up-ok="editOk" :type='txType' :isType='isType' :data='formData' ref="choiceBox2" v-if="txType==2"></choice2>
      <completion @up-ok="editOk" :type='txType' :isType='isType' :data='formData' ref="completionBox" v-if="txType==3"></completion>
      <judgment @up-ok="editOk" :type='txType' :isType='isType' :data='formData' ref="judgmentBox" v-if="txType==5"></judgment>
      <texttitle @up-ok="editOk" :type='txType' :isType='isType' :data='formData' ref="textBox" v-if="txType==7"></texttitle>
      <el-button type="primary" @click="save" v-if="isType==0" class="type">保存当前题目</el-button>
      <el-button type="primary" @click="saveUp" v-if="isType==1" class="type">修改当前题目</el-button>
      <el-dialog :close-on-click-modal='false' title="新增小题" :visible.sync="isShow" append-to-body center width='580px'>
        <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
          <el-form-item label="题型"  prop="txType" :rules="[{ required: true, message: '请选择题型', trigger: 'blur' }]" >
            <el-select v-model="editForm.txType" placeholder="请选择题型">
              <el-option v-for="item in option1" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button  @click.native="isShow=false">取消</el-button>
          <el-button  type="primary" @click.native="editSubmit">确定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import Choice from './choice'
import Choice2 from './choice2'
import Completion from './completion'
import Judgment from './judgment'
import Texttitle from './texttitle'
export default {
  components: {
    Choice,
    Choice2,
    Completion,
    Judgment,
    Texttitle,
  },
  data() {
    return {
      editorOption1: {
        placeholder: ''
      },
      content: '',
      txType: '',
      show: false,
      formData: {},
      list:[],
      form: {},
      parentId: '',
      isShow: false,
      editForm:{},
      option1:[
        {
          name: '单选题',
          value: '1',
        },
        {
          name: '多选题',
          value: '2',
        },
        {
          name: '填空题',
          value: '3',
        },
        {
          name: '判断题',
          value: '5',
        },
        {
          name: '简答题',
          value: '7',
        }
      ]
    }
  },
  props: {
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
    this.show = false
    var arr = this.$store.state.question
    this.list = arr.children
    this.content = arr.title
  },
  methods: {
    addTitle(){
      this.editForm = {}
      this.isShow = true
    },
    editSubmit(){
      	this.$refs.editForm.validate((valid) => {
				if(valid){
          this.addQuest()
				}
			})
    },
    addQuest(){
      let data = [{
        analysisJson: "",
        busId: this.data.busId,
        category: this.data.category,
        createBy: this.data.createBy,
        createId: this.data.createId,
        difficult: this.data.difficult,
        mergeId: this.data.mergeId,
        optionsJson: "",
        parentId:  this.data.id,
        rightOption: "",
        score: 0,
        subheading: '',
        subjectId: this.data.subjectId,
        superId: '',
        title: this.data.title,
        type: this.editForm.txType,
        }
      ]
      console.log(data,this.data,1111)
      this.$http({
            url: 'system/api/question/addQuestionChildrenList',
            method: "post",
            data: data
          }).catch(error => {
            this.$message.error( 'region/addQuestionChildrenList' + "接口出错！");
          }).then(({ data }) => {
            this.$store.state.children = []
            if (data.code == 30000) {
              this.$message({
                message: '新增小题成功，可继续配置',
                type: 'success'
              });
              this.isShow = false
              this.list.push(
                {
                id:data.result,
                analysisJson: "",
                busId: this.data.busId,
                category: this.data.category,
                createBy: this.data.createBy,
                createId: this.data.createId,
                difficult: '',
                mergeId: this.data.mergeId,
                optionsJson: "",
                parentId:  this.data.id,
                rightOption: "",
                score: "",
                subheading: '',
                subjectId: this.data.subjectId,
                superId: '',
                title: this.data.title,
                type: this.editForm.txType,
                }
              )
            } else {
              this.$message.warning(data.message)
            }
          })
    },
    seeQuestion(row){
      this.txType = 0
      this.formData = row
      setTimeout(() => {
          this.txType = row.type.toString()
      }, 100);
      
      this.$emit('set-id',row)
      // console.log(this.txType,this.formData,11)
    },
    submitCform(status,row) {
      let questionChildrenList = this.$store.state.children
      if(questionChildrenList.length<1&&this.isType!=2){
        this.$message.warning('请先保存当前题目')
        return false
      }
      if(this.isType!=0){
        this.form = this.$store.state.children
        this.form.updateBy= JSON.parse(sessionStorage.getItem("userInfo")).user.userName
        this.form.updateId= JSON.parse(sessionStorage.getItem("userInfo")).uc.id
        if(this.isType==1){
          this.form.checkStatus = 0
        }
        if(this.isType==2){
          this.form.id = this.data.id
          this.form.type = this.data.type
          this.form.parentId = 0
          this.form.checkName= JSON.parse(sessionStorage.getItem("userInfo")).user.userName
          this.form.checkId= JSON.parse(sessionStorage.getItem("userInfo")).uc.id
          this.form.checkStatus= status
          if(status==2){
            this.form.backReason= row
          }
          this.form.status = 1
          this.$fetch({
            url: 'system/api/question/examinationQuestions',
            method: "post",
            data: this.form
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
          this.form.status = 1
           this.$fetch({
            url: 'system/api/question/examinationQuestions',
            method: "post",
            data: this.form
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
        }
       
      }else{
        this.$http({
            url: 'system/api/question/addQuestionChildrenList',
            method: "post",
            data: questionChildrenList
          }).catch(error => {
            this.$message.error( 'region/queryAllProvince' + "接口出错！");
          }).then(({ data }) => {
            this.$store.state.children = []
            if (data.code == 30000) {
              this.$message({
                message: '保存成功，可继续填写',
                type: 'success'
              });
              this.content = ''
              
            } else {
              this.$message.warning(data.message)
            }
          })
      }
    },
    save(){
      if(this.show){
        this.$message.warning('请先保存材料')
        return false
      }
      this.formDate = {
        ...this.data,
        title: this.content,
        createBy: JSON.parse(sessionStorage.getItem("userInfo")).user.userName,
        createId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
      }
      this.formDate.parentId = this.parentId
      this.formDate.type = '10'
      
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
      if(this.txType==1){
        this.$refs.choiceBox1.saveCform(this.formDate)
      }
      if(this.txType==2){
        this.$refs.choiceBox2.saveCform(this.formDate)
      }
      if(this.txType==3){
        this.$refs.completionBox.saveCform(this.formDate)
      }
      if(this.txType==5){
        this.$refs.judgmentBox.saveCform(this.formDate)
      }
      if(this.txType==7){
        this.$refs.textBox.saveCform(this.formDate)
      }
     
    },
    saveUp(){
      this.formDate = {
        ...this.data,
        title: this.content,
        createBy: JSON.parse(sessionStorage.getItem("userInfo")).user.userName,
        createId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
      }
      this.formDate.parentId = this.parentId
      this.formDate.type = '10'
      this.formData.score = this.formDate.score
      this.formData.difficult =this.formDate.difficult
      this.formData.superId = this.formDate.superId
       console.log(this.formDate,11111)
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
      if(this.txType==1){
        this.$refs.choiceBox1.saveUpform(this.formData)
      }
      if(this.txType==2){
        this.$refs.choiceBox2.saveUpform(this.formData)
      }
      if(this.txType==3){
        this.$refs.completionBox.saveUpform(this.formData)
      }
      if(this.txType==5){
        this.$refs.judgmentBox.saveUpform(this.formData)
      }
      if(this.txType==7){
        this.$refs.textBox.saveUpform(this.formData)
      }
    },
    saveTitle(){
      
      this.show = false
      this.formDate = {
        ...this.data,
        title: this.content,
        createBy: JSON.parse(sessionStorage.getItem("userInfo")).user.userName,
        createId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
      }
      this.formDate.type = '10'
      console.log(this.formDate,2222)
     
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
      // if(this.formDate.score==undefined||this.formDate.score==''){
      //   this.$message.warning('请先填写分值')
      //   return false
      // }
      if(this.formDate.difficult==undefined||this.formDate.difficult==''){
        this.$message.warning('请先填写难度')
        return false
      }
      if(this.formDate.title==undefined||this.formDate.title==''){
        this.$message.warning('请先填写题干')
        return false
      }
      this.formDate.score = null
      this.formDate.superId = null
      if(this.isType==0){
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
            this.parentId = data.result
          this.formDate.parentId = data.result
          console.log(this.formDate,111111)
          } else {
            this.$message.warning(data.message)
          }
        })
      }else{
        this.formDate.children = undefined
        this.formDate.checkStatus = 0
        this.formDate.status = 1
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
      }

      
    },
    editOk(){

    },
    async handleDel(row,index) {
      var that = this
      that.$confirm('确定删除所选纪录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          that.$fetch({
              url: 'system/api/question/deleteChildren',
              method: "post",
              data: {
                  id: row.id,
                  parentId: row.parentId
              },
          }).catch(error => {
              that.$message.error('question/delQuestion' + "接口出错！");
          }).then(({ data }) => {
              if (data.code == 30000) {
                  that.$message.success('删除成功！')
                  that.list.splice(index,1)
                  var num = 0
                  that.list.forEach((item)=>{
                    num += item.score
                  })
                  that.$emit('set-score',num)
              } else {
                  that.$message.warning(data.message)
              }
          })
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.type{
  margin: 20px 0;
}
.el-radio-button {
  position: relative;
  margin-left: 10px;
  border: 1px #dcdfe6 solid;
  border-radius: 4px !important;
  display: inline-block;
  outline: 0;
}
</style>