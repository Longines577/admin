<template>
  <div class="table1">
    
    <div class="box">
      <el-col :span="6">上传试题总数：{{count.totalCount}}</el-col>
      <el-col :span="6">审核中：{{count.ingCount}}</el-col>
      <el-col :span="6">合格：{{count.yesCount}}</el-col>
      <el-col :span="6">不合格：{{count.noCount}}</el-col>
    </div>
    <div class="box">
      <span class="subject">科目</span>
			<el-select v-model="filters.subjectId" placeholder="请选择"  @change="getMerge" class="subjectSelect" filterable clearable>
				<el-option
				v-for="item in option3"
				:key="item.value"
				:label="item.subjectName"
				:value="item.id"
				></el-option>
			</el-select>
			<span class="province">省份</span>
			<el-select v-model="filters.mergeId" placeholder="请选择"  @change="getTree" class="subjectSelect" filterable clearable>
				<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.id"></el-option>
			</el-select>
    </div>
    <div class="container">
      <div class="obox">
      <el-col :span="24" class="toolbar" style="width:90%;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="题目类型">
            <el-select v-model="filters.category" placeholder="请选择" clearable>
              <el-option label="真题" value="1"></el-option>
              <el-option label="模拟题" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考期">
            <el-select v-model="examTime" placeholder="请选择" multiple clearable @change="getExamTime">
             <el-option v-for="(item,index) in examTimeList" :key="index" :label="item.exam_time" :value="item.exam_time"></el-option>
            </el-select>
					</el-form-item>
          <el-form-item label="题型">
            <el-select v-model="type" placeholder="请选择" multiple clearable @change="getTmType">
             <el-option v-for="item in examType" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度">
            <el-select v-model="difficult" placeholder="请选择" multiple clearable @change="getDifficult">
              <el-option label="容易" value="1"></el-option>
              <el-option label="中偏易" value="2"></el-option>
              <el-option label="中" value="3"></el-option>
              <el-option label="中偏难" value="4"></el-option>
              <el-option label="难" value="5"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="审核状态">
            <el-select v-model="filters.checkStatus" placeholder="请选择" clearable>
              <el-option label="待审核" value="0"></el-option>
              <el-option label="合格" value="1"></el-option>
              <el-option label="不合格" value="2"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="状态">
            <el-select v-model="filters.status" placeholder="请选择" clearable>
              <el-option label="已禁用" value="0"></el-option>
              <el-option label="已启用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="正确率" >
            <el-slider v-model="per" :format-tooltip="formatTooltip" range :max='100' @change="setPer" style="width:200px"></el-slider>
            <!-- <slider :min=0 :max=100 v-model="per" @setPer="setPer" style="top:-7px;"></slider> -->
          </el-form-item>
          <el-form-item label="上传时间" >
						<el-date-picker type="datetime" placeholder="选择开始日期" v-model="filters.startTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker> —
            <el-date-picker type="datetime" placeholder="选择结束日期" v-model="filters.endTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					</el-form-item>
          <!-- <el-form-item >
            <el-checkbox v-model="filters.status" true-label="0">仅查看被禁用的试题</el-checkbox>
          </el-form-item> -->
        </el-form>
      </el-col>
      <div class="sides">
        <!-- <span  >本知识树共有 99 道题，启用筛选得到 99 道题</span> -->
        <el-button  class="right" type="primary" @click="getTree">搜索</el-button>
        <el-button  type="primary" @click="clear">重置</el-button>
      </div>
   
    </div>
   
    </div>
    <div class="cont" >
      <div class="left" :style="{width:myWidth}" @mousedown.stop.prevent="mouseDownLeft" ref='box'>
        <el-checkbox v-model="filters.status" true-label="1" @change="getTree">仅查看被启用的节点</el-checkbox>
        <el-tree
        :data="treeList"
        node-key="index"
        @node-click="handleNodeClick"
        :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node,data }">
            <span class="tit"><i class="el-icon-document"></i>&nbsp;&nbsp;{{ data.noteNo }}&nbsp;&nbsp;{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
      <div class="right">
        <!-- <el-checkbox v-model="filters.checked3">全选本页</el-checkbox>
        <el-checkbox v-model="filters.checked4">全选全部</el-checkbox> -->
        <el-button size="small" @click="enabling(1)" >启用</el-button>
        <el-button size="small" @click="enabling(0)" >禁用</el-button>
        <!-- <el-button size="small"  >批量导入</el-button> -->
        <el-input placeholder="请输入内容" v-model="cont" class="input-with-select" @change="getType" clearable>
          <el-select v-model="select" slot="prepend" placeholder="请选择" >
            <el-option label="试题ID" value="1"></el-option>
            <el-option label="题干" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
        </el-input>
        <div class="titleList">
          <el-table :data="users" ref="multipleTable" v-loading="loading" :span-method="arraySpanMethod" @selection-change="selsChange">
          <el-table-column align="center" type="selection" width="40"></el-table-column>
            <el-table-column  prop="titleData" width="10">
              <template slot-scope="scope">
                <div style="display:flex; align-items: center;">
                <div v-if="scope.row.type!=10" style="width:90%">
                  <div class="introduce">
                    <span style="color:red">（{{scope.row.score}}分）</span>
                    <span>试题编号:{{scope.row.questionNo}}</span>
                    <span>考期：{{scope.row.examTime}}</span>
                    <span>省份：{{scope.row.label}}</span>
                    <span>题型：{{scope.row.typeName}}</span>
                    <span>组卷次数：{{scope.row.combineTime}}</span>
                    <span>正确率：{{scope.row.rightRate}}</span>
                    <span>试题状态：{{scope.row.status==0?'禁用':'启用'}}</span>
                    <span>难度：{{scope.row.difficultName}}</span>
                    <span>修改人：{{scope.row.updateBy}}</span>
                    <span>修改时间：{{scope.row.updateTime}}</span>
                  </div>
                  <div class="analysis">
                  
                  <div class="stem" v-html="scope.row.title"></div>
                  <div class="option" v-if="scope.row.optionsJson">
                    <div v-for="(item, index) in JSON.parse(scope.row.optionsJson)" :key="index" v-show="item.title" class="sel">
                     {{item.option}}.<span v-html="item.title"></span>
                    </div>
                  </div>
                  </div>
                  <div @click="scope.row.isDeleted = !scope.row.isDeleted" class="btn">{{scope.row.isDeleted?'收起':'查看'}}答案</div>
                  <el-collapse-transition>
                    <div class="analysis" v-show="scope.row.isDeleted">
                      <div><b>知识点</b>： {{scope.row.nodeNo}} &nbsp;&nbsp;{{scope.row.nodeName}}</div>
                      <div v-if="scope.row.rightOption" style=" display: flex; flex-wrap: wrap;"><b>答案</b>：<span v-for="(item, index) in JSON.parse(scope.row.rightOption)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp;<span v-if='JSON.parse(scope.row.rightOption).length>1'>{{index+1}}、</span> <span v-if='scope.row.type==5||scope.row.type==6' v-html="item.option==0?'错误':item.option==1?'正确':item.option"></span><span v-html="item.option" v-else></span></span></div>
                      <div v-if="scope.row.analysisJson" style=" display: flex; flex-wrap: wrap;"><b>解析</b>：<span v-for="(item, index) in JSON.parse(scope.row.analysisJson)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp;<span v-if='JSON.parse(scope.row.analysisJson).length>1'>{{index+1}}、</span> <span v-html="item.content"></span></span></div>
                    </div>
                  </el-collapse-transition>
                </div>
                <div v-if="scope.row.type ==10" style="width:90%">
                  <div class="introduce">
                    <span style="color:red">（{{scope.row.score}}分）</span>
                    <span>试题编号:{{scope.row.questionNo}}</span>
                    <span>考期：{{scope.row.examTime}}</span>
                    <span>省份：{{scope.row.label}}</span>
                    <span>题型：{{scope.row.typeName}}</span>
                    <span>组卷次数：{{scope.row.combineTime}}</span>
                    <span>正确率：{{scope.row.rightRate}}</span>
                    <span>试题状态：{{scope.row.status==0?'禁用':'启用'}}</span>
                    <span>难度：{{scope.row.difficultName}}</span>
                    <span>修改人：{{scope.row.updateBy}}</span>
                    <span>修改时间：{{scope.row.updateTime}}</span>
                  </div>
                  <div class="analysis">
                  <div class="stem" v-html="scope.row.title"></div>
                  </div>
                  <div v-for="(child, index) in scope.row.children" :key="index" style="margin-left:20px">
                      <div class="flex" style=" display: flex; flex-wrap: wrap;"><span style="color:red;margin-right:10px">(分数：{{child.score}})</span><span>{{index+1}}、</span> <span  v-html="child.subheading"></span></div>
                    <div class="option" v-if="child.optionsJson">
                      <div v-for="(item, index) in JSON.parse(child.optionsJson)" :key="index" v-show="item.title" class="sel">
                        {{item.option}}.<span v-html="item.title"></span>
                      </div>
                    </div>
                    <div @click="child.isDeleted = !child.isDeleted" class="btn">{{child.isDeleted?'收起':'查看'}}答案</div>
                    <el-collapse-transition>
                      <div class="analysis" v-show="child.isDeleted">
                        <div><b>知识点</b>：{{child.nodeNo}} &nbsp;&nbsp;{{child.nodeName}}</div>
                        <div v-if="child.rightOption" style=" display: flex; flex-wrap: wrap;"><b>答案</b>：<span v-for="(item, index) in JSON.parse(child.rightOption)" :key="index" style="margin-right:10px;display:flex;"> &nbsp;&nbsp;<span v-if='JSON.parse(child.rightOption).length>1'>{{index+1}}、</span><span v-if='child.type==5'>{{item.option==0?'错误':item.option==1?'正确':item.option}}</span><span v-html="item.option" v-else></span></span></div>
                        <div v-if="child.analysisJson" style=" display: flex; flex-wrap: wrap;"><b>解析</b>：<span v-for="(item, index) in JSON.parse(child.analysisJson)" :key="index" style="margin-right:10px;display:flex;"> &nbsp;&nbsp;<span v-if='JSON.parse(child.analysisJson).length>1'>{{index+1}}、</span><span v-html="item.content"></span></span></div>
                      </div>
                    </el-collapse-transition>
                  </div>
                  
                </div>
                <el-tooltip  effect="dark" content="修改" placement="top">
                  <el-button circle type="primary" class="upBtn" size='medium' @click="handleEdit(scope.row,1)" icon="el-icon-li-xiugai1"></el-button>
                </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column  label="试题排序：" width="100"></el-table-column>
            <el-table-column  label="难度" prop="difficult" sortable width="100"></el-table-column>
            <el-table-column  label="组卷次数" prop="combineTime" sortable width="100"></el-table-column>
            <el-table-column label="考期" prop="examTime" sortable></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 30, 40]"
              :current-page="filters.curPage"
              :page-size="filters.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal='false' class="uploadEdit" :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" v-if="isShowEdit" :before-close='editOk' width="1280px">
      <questions-edit @save-ok="editOk" :type='isEdit' :data='editForm'></questions-edit>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from '@/api/list'
import QuestionsEdit from './questions-edit'
export default {
  mixins: [listMixin],
  components: {
    QuestionsEdit,
  },
  data() {
    return {
      apiName: 'system/api/question/listQuestionByTreePage',
      filters:{
        curPage: 1,
        pageSize: 10,
        subjectId: '',
        mergeId: '',
        checkStatus: 1,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      select: '2',
      cont: '',
      examType:[],
      examTime:[],
      type:[],
      difficult:[],
      examTimeList: [],
      per: 0,
      treeList:[],
      option:[],
      option3:[],
      count: {},
      total: 2,
      users: [],
      sels: '',
      myWidth: '20%',
      loading: false,
      isEdit: 1,
      editForm:{},
      isShowEdit:false,
    };
  },
  methods: {
    handleEdit(row, isEdit) {
      this.isShowEdit = true;
      this.isEdit = isEdit
      this.editForm = row
      this.editForm.type = row.type.toString() 
      var arr = {
        title: row.title,
        rightOption: row.rightOption?JSON.parse(row.rightOption):row.rightOption,
        optionsJson: row.optionsJson?JSON.parse(row.optionsJson):row.optionsJson,
        analysisJson: row.analysisJson?JSON.parse(row.analysisJson):row.analysisJson,
        children: row.children
      }
     this.$store.state.question = arr
    },
    editOk() {
      this.isShowEdit = false
      this.getList()
    },
    mouseDownLeft(){
      var that = this;
      that.$refs.box.onmousedown = function(e) {
        var disX = e.clientX;
        var width =  that.$refs.box.offsetWidth
        document.onmousemove = function(e) {
          var newWidth = e.clientX - disX + width;
         that.myWidth = newWidth+'px'
         if (newWidth <= 200) {
          that.myWidth = '200px';
        }
          console.log(that.myWidth,111111)
        };
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null;
        };
        return false;
      }
    },
    async enabling(index) {
			var arr = this.sels
			if(arr.length<1){
				this.$message.error(`请选择要${index === 0 ? '禁用' : '启用'}的记录`)
				return false
			}
			var treeJr = []
			 arr.forEach((item,i)=> {
				return treeJr.push({id:item.id})
			})
			this.$confirm(`确定要${index === 0 ? '禁用' : '启用'}所选纪录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
				this.$http({
					url: 'system/api/question/updateStatusByAttch',
					method: "post",
					data: {
						status: index,
						treeJr: treeJr,
						ucId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
					},
				}).catch(error => {
					this.$message.error(this.updateName + "接口出错！");
				}).then(({ data }) => {
					if (data.code == 30000) {
						this.$message.success('执行成功！')
						this.getList()
					} else {
						this.$message.warning(data.message)
					}
				})
			})
    },
     arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex <=5&&columnIndex>0) {
          return [1,5];
        } 
    },
    formatTooltip(val) {
      return val+'%';
    },
    setPer(val){
       console.log(val,11111)
      this.filters.startRate = val[0]
      this.filters.endRate = val[1]
    },
    getType(){
      if(this.select==1){
        this.filters.questionNo = this.cont
      }
      if(this.select==2){
        this.filters.title = this.cont
      }
    },
    selsChange(sels) {
      this.sels = sels;
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    },
    handleNodeClick(node,data){
      this.filters.nodeId = node.id
      this.getList()
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        subjectId: '',
        mergeId: '',
        checkStatus: 1,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
      this.type = ''
      this.difficult = ''
      this.examTime = ''
      this.treeList = []
    },
    async getMerge(id) {
        this.filters.mergeId = ''
        this.treeList = []
        this.count = {}
        this.users = []
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
    async getCount() {
        let { data } = await this.$fetch({
          url: 'system/api/question/questionStatusByCount',
          method: "post",
          data: {
              mergeId:  this.filters.mergeId,
              subjectId: this.filters.subjectId,
              busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
          },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
           this.count = data.result
        }
    },
    async getTime() {
        let { data } = await this.$fetch({
          url: 'system/api/question/queryAllExamTimeByQues',
          method: "post",
          data: {
              mergeId:  this.filters.mergeId,
              subjectId: this.filters.subjectId,
              busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
          },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
           this.examTimeList = data.result
        }
    },
    async getTreeList() {
        let { data } = await this.$fetch({
            url: 'system/api/knowledgeTree/generateKnowledgeTree',
            method: "post",
            data: {
              mergeId:  this.filters.mergeId,
              subjectId: this.filters.subjectId,
              status: this.filters.status,
              busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.treeList = data.result
        }else {
            this.$message.warning(data.message)
        }
    },
    getExamTime(){
      this.filters.examTimes = this.examTime.join(',')
      console.log(this.examTime.join(','))
    },
    getTmType(){
       this.filters.type = this.type.join(',')
      console.log(this.type.join(','))
    },
    getDifficult(){
       this.filters.difficult = this.difficult.join(',')
      console.log(this.difficult.join(','))
    },
    getTree(){
      if(this.filters.subjectId==''||this.filters.mergeId==''){
        this.$message.warning('请先选择科目和省份')
      }else{
        this.getTreeList()
        this.getCount()
        this.getTime()
        this.getList()
      }
    },
    
  },
  mounted() {
    this.getItem()
    this.getExamType()
  }
};
</script>
<style lang="">
.el-tree-node.is-current > .el-tree-node__content {
      color:#409EFF !important;
      background-color: #ccc !important;
}
</style>
<style lang="scss" scoped>
.box {
  margin: 0 0 20px;
  width: 100%;
  min-height: 60px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  align-items: center;
  text-align: center;
  background: #fff;
  // border: 1px solid #ddd;
  // border-radius: 5px;
}

.el-radio-button {
  margin: 0 0 20px;
  position: relative;
  margin-left: 10px;
  border: 1px #dcdfe6 solid;
  border-radius: 4px !important;
  display: inline-block;
  outline: 0;
}
.subject{
  margin-left: 50px;
 font-size: 14px;
  color: black;
}
.subjectSelect{
  margin-left: 15px;
  
}
.province{
  margin-left: 50px;
   font-size: 14px;
  color: black;
}
.sides{
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-align: center;
  background: #fff;
  .right{
    margin-left: 50%;
  }
}
.cont{
  width: 100%;
  margin-top: 20px;
  display: flex;
  min-height: 300px;
  // justify-content: space-between;
  .left{
    width: 25%;
    min-height: 100px;
    box-sizing: border-box;
    padding: 10px;
    background: #fff;
   
  }
  .right{
    flex: 1;
    box-sizing: border-box;
    padding: 20px;
    margin-left: 10px;
    min-height: 100px;
    background: #fff;
    overflow: auto;
  }
}
.titleList{
  margin-top: 20px;
  .introduce{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    align-items: center;
    span{
      display: inline-block;
      margin-right: 30px;
    }
  }
  .stem{
    width: 80%;
  }
  .option{
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    .sel{
      display: flex;
      flex-wrap: wrap;
      margin-right: 40px;
    }
  }
  .btn{
    width: 100px;
    cursor: pointer;
    text-align: center;
    background: #ccc;
  }
  .analysis{
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
    background: #edf0f4;
  }
  .upBtn{
    width: 40px;
    height: 40px;
    margin-left: 3%;
  }
}
</style>
<style>
.cont>.right>.el-input {
    float: right;
    width: 330px;
  }
  .cont>.right .el-select {
    width: 100px;
  }
.cont .right .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-radio-button__inner {
  border: none !important;
  border-radius: 4px !important;
}
.container {
  border: none;
}
.obox{
  width: 100%;
}


.uploadEdit .el-dialog__header{
  background: #426cb1;
}
.uploadEdit .el-dialog__title{ 
  color: #fff;
}
.uploadEdit .el-dialog__header .el-dialog__headerbtn i{
  color: #fff;
}
.ban {
  margin-top: 10px;
}
.btnSelect{
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}
</style>
