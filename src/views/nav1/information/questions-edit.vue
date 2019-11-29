<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="ruleForm" :inline="true">
        <el-form-item label="科目" prop="subjectId" >
          <el-select v-model="formData.subjectId" placeholder="请选择" :disabled="type!=0?true:false"  @change="getMerge" filterable clearable>
          <el-option v-for="item in option3" :key="item.value" :label="item.subjectName" :value="item.id"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="省份" prop="mergeId">
					<el-select v-model="formData.mergeId" placeholder="请选择" :disabled="type!=0?true:false"  @change="getTree" filterable clearable>
            <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.id"></el-option>
          </el-select>
				</el-form-item>
        <el-form-item label="类型" prop="category" >
          <el-select v-model="formData.category" placeholder="请选择" :disabled="type!=0?true:false" clearable>
            <el-option v-for="(item,index) in ['模拟题','真题']" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.category==1" label="考期" prop="examTime" >
        <el-date-picker
            :disabled="type!=0?true:false" 
            v-model="formData.examTime"
            type="month"
						value-format="yyyy-MM"
            placeholder="选择考期">
          </el-date-picker>
        </el-form-item>
        <br>
        <el-form-item  label="知识点匹配" prop="superId">
          <el-cascader
            clearable
            :disabled="type==2?true:false" 
            v-model="formData.superId"
            :props="props"
            :options="treeList"
            :show-all-levels="false"
            @change="handleChange">
          </el-cascader>
      </el-form-item>
      <el-form-item label="分值" prop="score" >
        <el-input v-model="formData.score" placeholder="请输入分值" :disabled="type==2?true:false"  @input="change($event)" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="难度"  prop="difficult" >
        <el-select v-model="formData.difficult" placeholder="请选择" :disabled="type==2?true:false" clearable>
          <el-option v-for="(item,index) in ['容易','中偏易','中','中偏难','难']" :key="index" :label="item" :value="index+1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
     <div style="margin: 10px;">
      <el-radio-group v-model="formData.type" :disabled="type==2?true:false" >
        <el-radio-button label="1">单选题</el-radio-button>
        <el-radio-button label="2">多选题</el-radio-button>
        <el-radio-button label="3">填空题(有序)</el-radio-button>
        <el-radio-button label="4">填空题(无序)</el-radio-button>
        <el-radio-button label="5">判断题</el-radio-button>
        <el-radio-button label="6">判断论述题</el-radio-button>
        <el-radio-button label="7">文字题</el-radio-button>
        <el-radio-button label="8">完形填空题</el-radio-button>
        <el-radio-button label="9">多选多</el-radio-button>
        <el-radio-button label="10">综合题</el-radio-button>
      </el-radio-group>
    </div>
    <choice @up-ok="editOk" :type='formData.type' :isType='type' :data='formData' ref="choiceBox" v-if="formData.type==1||formData.type==2"></choice>
    <completion @up-ok="editOk" @set-score='setScore' :type='formData.type' :isType='type' :data='formData' ref="completionBox" v-if="formData.type==3||formData.type==4"></completion>
    <judgment @up-ok="editOk" :type='formData.type' :isType='type' :data='formData' ref="judgmentBox" v-if="formData.type==5"></judgment>
    <discuss @up-ok="editOk" :type='formData.type' :isType='type' :data='formData' ref="discussBox" v-if="formData.type==6"></discuss>
    <texttitle @up-ok="editOk" :type='formData.type' :isType='type' :data='formData' ref="textBox" v-if="formData.type==7"></texttitle>
    <cloze @up-ok="editOk"  @set-score='setScore' :type='formData.type' :isType='type' :data='formData' ref="clozeBox" v-if="formData.type==8"></cloze>
    <multiple @up-ok="editOk"  @set-score='setScore' :type='formData.type' :isType='type' :data='formData' ref="multipleBox" v-if="formData.type==9"></multiple>
    <synthesis @up-ok="editOk" @set-id="setOk" @set-score='setScore' :type='formData.type' :isType='type' :data='formData' ref="synthesisBox" v-if="formData.type==10"></synthesis>
    <div slot="footer" class="dialog-footer"> 
      <el-button type="primary" v-if="type!=2" @click="submitCform">{{type==0?'保存并继续填写':type==1?'保存修改':''}}</el-button>
      <el-button type="primary" v-if="type==2" @click="qualified(1)">审核通过</el-button>
      <el-button type="primary" v-if="type==2" @click="unqualified()">不合格</el-button>
      <el-button @click="$emit('save-ok')">取消</el-button>
    </div>
    <el-dialog :close-on-click-modal='false' title="提示" :visible.sync="isShowTips" v-if="isShowTips" append-to-body center width="580px">
      <div  style="text-align: center;">
        <el-form :model="tipsForm" label-width="80px" :inline="true" ref="editForm">
          <!-- <el-form-item  prop="backReason" > -->
            <!-- <el-select v-model="tipsForm.backReason" placeholder="请选择" multiple clearable>
              <el-option v-for="(item,i) in tipsList" :label="item" :key="i" :value="item"></el-option>
            </el-select> -->
            <!-- <el-checkbox-group v-model="tipsForm.backReason" size="medium">
              <el-checkbox-button v-for="(item,i) in tipsList" :label="item" :key="i">{{item}}</el-checkbox-button>
            </el-checkbox-group> -->
          <!-- </el-form-item> -->
          <el-form-item  prop="backReason" >
            <el-input  type="textarea" :rows="2" v-model="tipsForm.backReason" placeholder="请输入驳回原因" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="btn2" @click.native="isShowTips=false">取消</el-button>
          <el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
        </div>
      </div>
		</el-dialog>
  </div>
</template>
<script>
import Choice from './questionList/choice'
import Completion from './questionList/completion'
import Judgment from './questionList/judgment'
import Discuss from './questionList/discuss'
import Texttitle from './questionList/texttitle'
import Cloze from './questionList/cloze'
import Multiple from './questionList/multiple'
import Synthesis from './questionList/synthesis/index'
export default {
  components: {
    Choice,
    Completion,
    Judgment,
    Discuss,
    Texttitle,
    Cloze,
    Multiple,
    Synthesis
  },
  data() {
    return {
      option: '',
      option3: '',
      treeList: [],
      tipsList:['知识点混乱','分值错误','格式错误','解析错误','题型错误','其他错误'],
      tipsForm:{},
      isShowTips: false,
      props: {
				value: 'id',
				label: 'name',
        children: 'children',
        expandTrigger: 'hover'
			},
      formData: {
        type: '',
      },
      rules: {},
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
    if(this.formData.type==''){
      this.formData.type = '1'
    }
    if(this.type!=0){
      this.formData = this.data
      this.getMerge(this.data.subjectId)
      this.getTree(this.data.mergeId)
    }
    this.getItem()
  },
  methods: {
    change(e){
      this.$forceUpdate()
    },
    editOk(){
      this.$emit('save-ok')
    },
    setOk(data){
      this.formData.score = data.score
      this.formData.difficult = data.difficult
      this.formData.superId = data.superId
      console.log(data.score, data.difficult,data.superId,11)
    },
    setScore(data){
      console.log(data,1111)
      this.formData.score = data
      this.$forceUpdate()
    },
    handleChange(val) {
      this.formData.superId = val[val.length-1] ? val[val.length-1] : 0
		},
    async getItem() {
        let { data } = await this.$fetch({
            url: 'system/api/item/queryAllItem',
            method: "post",
            data: {
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.option3 = data.result
        }
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
    getTree(id){
			this.$fetch({
				url: 'system/api/knowledgeTree/generateKnowledgeTree',
        method: "post",
        data:{
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
          subjectId: this.formData.subjectId,
          mergeId: id,
          status: 1,
        }
			}).catch(error => {
				this.$message.error( 'region/queryAllProvince' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					this.treeList =this.getTreeData(data.result) 
				} else {
					this.$message.warning(data.message)
				}
			})
    },
     getTreeData(data){
        // 循环遍历json数据
        for(var i=0;i<data.length;i++){
            
            if(data[i].children.length<1){
                // children若为空数组，则将children设为undefined
                data[i].children=undefined;
            }else {
                // children若不为空数组，则继续 递归调用 本方法
                this.getTreeData(data[i].children);
            }
        }
        return data;
    },

    qualified(index){
        this.$confirm('判定为合格将会加入试题库，确定判定为合格？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          this.submitCform(index) 
        })
    },
    unqualified(){
      this.isShowTips = true
    },
    editSubmit(){
      this.submitCform(2,this.tipsForm.backReason)
      this.isShowTips = false
    },
    submitCform(index,tips) {
      this.$refs.ruleForm.validate((valid) => { 
        if(valid){
        if(this.formData.type==1||this.formData.type==2){
          this.$refs.choiceBox.submitCform(index,tips)
          if(this.type!=0){
            setTimeout(() => {
              this.$emit('save-ok')
            }, 200);
          }
        }
        if(this.formData.type==3||this.formData.type==4){
          this.$refs.completionBox.submitCform(index,tips)
          if(this.type!=0){
            setTimeout(() => {
              this.$emit('save-ok')
            }, 200);
          }
        }
        if(this.formData.type==5){
          this.$refs.judgmentBox.submitCform(index,tips)
          if(this.type!=0){
           setTimeout(() => {
              this.$emit('save-ok')
            }, 200);
          }
        }
        if(this.formData.type==6){
          this.$refs.discussBox.submitCform(index,tips)
          if(this.type!=0){
            setTimeout(() => {
              this.$emit('save-ok')
            }, 200);
          }
        }
        if(this.formData.type==7){
          this.$refs.textBox.submitCform(index,tips)
          if(this.type!=0){
            setTimeout(() => {
              this.$emit('save-ok')
            }, 200);
          }
        }
        if(this.formData.type==8){
          this.$refs.clozeBox.submitCform(index,tips)
          if(this.type!=0){
            setTimeout(() => {
              this.$emit('save-ok')
            }, 200);
          }
        }
        if(this.formData.type==9){
          this.$refs.multipleBox.submitCform(index,tips)
          if(this.type!=0){
            setTimeout(() => {
              this.$emit('save-ok')
            }, 200);
          }
        }
        if(this.formData.type==10){
          this.$refs.synthesisBox.submitCform(index,tips)
          if(this.type!=0){
            setTimeout(() => {
              this.$emit('save-ok')
            }, 200);
          }
        }
        }
      })
    },
  }
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
.el-textarea{
    display: block;
    width: 400px !important;
}
</style>

