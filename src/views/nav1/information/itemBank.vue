<template>
  <div class="table1">
    <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-tickets"></i> 产品包与排课
          </el-breadcrumb-item>
            <el-breadcrumb-item>题库</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="bank">
      <div class="total" @click="lanShow = !lanShow">
        <div>试</div>
        <div>题</div>
        <div>篮</div>
        <div>({{lanList.totalCount}})</div>
      </div>
      <el-collapse-transition>
        <div class="lan" v-show="lanShow">
          <div class="title">试题篮</div>
          <div class="text">共<span>{{lanList.totalCount}}</span>题,平均难易度<span>{{lanList.difficultyName}}</span>,总分:<span>{{lanList.totalScore}}</span></div>
          <div class="text" v-for="(item, index) in lanList.rootList" :key="index">{{item.name}}：{{item.typeCount}} 题,占比 {{item.percentageStr}},分数：{{item.typeScore}}</div>
          <el-button type="primary" class="seeBtn" @click="preview">预览试卷</el-button>
        </div>
      </el-collapse-transition>
    </div>
    <div class="box">
      <span class="subject">科目</span>
			<el-select v-model="filters.subjectId" placeholder="请选择" @change="getMerge" class="subjectSelect" disabled clearable>
				<el-option
				v-for="item in option3"
				:key="item.value"
				:label="item.subjectName"
				:value="item.id"
				></el-option>
			</el-select>
			<span class="province">省份</span>
			<el-select v-model="filters.mergeId" placeholder="请选择" @change="getTree" class="subjectSelect" disabled clearable>
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
          <el-form-item label="状态" class="active">
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
						<el-date-picker type="datetime" placeholder="选择开始日期" v-model="filters.startTime"></el-date-picker> —
            <el-date-picker type="datetime" placeholder="选择结束日期" v-model="filters.endTime"></el-date-picker>
					</el-form-item>
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
      <div class="left">
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
        <!-- <el-checkbox v-model="filters.checked4">全选全部</el-checkbox> -->
        <el-button size="small"  @click="joinTest">加入试题篮</el-button>
       
        <el-input placeholder="请输入内容" v-model="filters.input" class="input-with-select" @change="getType" clearable>
          <el-select v-model="filters.select" slot="prepend" placeholder="请选择">
            <el-option label="试题ID" value="1"></el-option>
            <el-option label="题干" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
        </el-input>
        <div class="titleList">
          <el-table :data="users" ref="multipleTable" v-loading="loading" :span-method="arraySpanMethod" @selection-change="selsChange">
          <el-table-column align="center" type="selection" width="40"></el-table-column>
            <el-table-column  prop="titleData"  width="10">
              <template slot-scope="scope">
               <div v-if="scope.row.type!=10">
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
                      <div><b>知识点</b>：{{scope.row.nodeNo}} &nbsp;&nbsp; {{scope.row.nodeName}}</div>
                      <div v-if="scope.row.rightOption" style=" display: flex; flex-wrap: wrap;"><b>答案</b>：<span v-for="(item, index) in JSON.parse(scope.row.rightOption)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp;<span v-if='JSON.parse(scope.row.rightOption).length>1'>{{index+1}}、</span> <span v-if='scope.row.type==5||scope.row.type==6' v-html="item.option==0?'错误':item.option==1?'正确':item.option"></span><span v-html="item.option" v-else></span></span></div>
                      <div v-if="scope.row.analysisJson" style=" display: flex; flex-wrap: wrap;"><b>解析</b>：<span v-for="(item, index) in JSON.parse(scope.row.analysisJson)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp;<span v-if='JSON.parse(scope.row.analysisJson).length>1'>{{index+1}}、</span> <span v-html="item.content"></span></span></div>
                    </div>
                  </el-collapse-transition>
                </div>
                <div v-if="scope.row.type ==10">
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
                        <div><b>知识点</b>： {{child.nodeNo}} &nbsp;&nbsp;{{child.nodeName}}</div>
                        <div v-if="child.rightOption" style=" display: flex; flex-wrap: wrap;"><b>答案</b>：<span v-for="(item, index) in JSON.parse(child.rightOption)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp;<span v-if='JSON.parse(child.rightOption).length>1'>{{index+1}}、</span> <span v-if='child.type==5'>{{item.option==0?'错误':item.option==1?'正确':item.option}}</span><span v-html="item.option" v-else></span></span></div>
                        <div v-if="child.analysisJson" style=" display: flex; flex-wrap: wrap;"><b>解析</b>：<span v-for="(item, index) in JSON.parse(child.analysisJson)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp;<span v-if='JSON.parse(child.analysisJson).length>1'>{{index+1}}、</span> <span v-html="item.content"></span></span></div>
                      </div>
                    </el-collapse-transition>
                  </div>
                  
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
    <el-dialog :close-on-click-modal='false' title="预览试卷" :visible.sync="isShowEdit" center width="1200px">
			<div class="testContent">
        <div class="title">{{paper.name}}</div>
        <div class="rootlist" v-for="(item, index) in rootList" :key="index">
          <div class="title" v-if="item.typeScore>0">{{item.name}}（总分{{item.typeScore}}分）</div>
          <div class="question" v-for="(row, i) in item.questionList" :key="i">
            <div v-if="row.type!=10" style="width:95%">
                  <div class="introduce">
                    <span style="color:red">（{{row.score}}分）</span>
                    <span>试题编号:{{row.questionNo}}</span>
                    <span>考期：{{row.examTime}}</span>
                    <span>省份：{{row.label}}</span>
                    <span>题型：{{row.typeName}}</span>
                    <span>组卷次数：{{row.combineTime}}</span>
                    <span>正确率：{{row.rightRate}}</span>
                    <span>试题状态：{{row.status==0?'禁用':'启用'}}</span>
                    <span>难度：{{row.difficultName}}</span>
                  </div>
                  <div class="stem" v-html="row.title"></div>
                  <div class="option" v-if="row.optionsJson">
                    <div v-for="(item, index) in JSON.parse(row.optionsJson)" :key="index" v-show="item.title" class="sel">
                      {{item.option}}.<span v-html="item.title"></span>
                    </div>
                  </div>
                  <div class="analysis">
                    <div><b>知识点</b>： {{row.nodeNo}} &nbsp;&nbsp;{{row.nodeName}}</div>
                    <div v-if="row.rightOption" style=" display: flex; flex-wrap: wrap;"><b>答案</b>：<span v-for="(item, index) in JSON.parse(row.rightOption)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp;<span v-if='JSON.parse(row.rightOption).length>1'>{{index+1}}、</span> <span v-if='row.type==5||row.type==6' v-html="item.option==0?'错误':item.option==1?'正确':item.option"></span><span v-html="item.option" v-else></span></span></div>
                    <div v-if="row.analysisJson" style=" display: flex; flex-wrap: wrap;"><b>解析</b>：<span v-for="(item, index) in JSON.parse(row.analysisJson)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp; <span v-if='JSON.parse(row.analysisJson).length>1'>{{index+1}}、</span><span v-html="item.content"></span></span></div>
                  </div>
                </div>
                <div v-if="row.type ==10"  style="width:95%">
                  <div class="introduce">
                    <span style="color:red">（{{row.score}}分）</span>
                    <span>试题编号:{{row.questionNo}}</span>
                    <span>考期：{{row.examTime}}</span>
                    <span>省份：{{row.label}}</span>
                    <span>题型：{{row.typeName}}</span>
                    <span>组卷次数：{{row.combineTime}}</span>
                    <span>正确率：{{row.rightRate}}</span>
                    <span>试题状态：{{row.status==0?'禁用':'启用'}}</span>
                    <span>难度：{{row.difficultName}}</span>
                  </div>
                  <div class="stem" v-html="row.title"></div>
                  <div v-for="(child, index) in row.children" :key="index" style="margin-left:20px">
                      <div class="flex" style=" display: flex; flex-wrap: wrap;"><span style="color:red;margin-right:10px">(分数：{{child.score}})</span><span>{{index+1}}、</span> <span  v-html="child.subheading"></span></div>
                    <div class="option" v-if="child.optionsJson">
                      <div v-for="(item, index) in JSON.parse(child.optionsJson)" :key="index" v-show="item.title" class="sel">
                        {{item.option}}.<span v-html="item.title"></span>
                      </div>
                    </div>
                    <div class="analysis" >
                      <div><b>知识点</b>： {{child.nodeNo}} &nbsp;&nbsp;{{child.nodeName}}</div>
                      <div v-if="child.rightOption" style=" display: flex; flex-wrap: wrap;"><b>答案</b>：<span v-for="(item, index) in JSON.parse(child.rightOption)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp;<span v-if='JSON.parse(child.rightOption).length>1'>{{index+1}}、</span> <span v-if='child.type==5'>{{item.option==0?'错误':item.option==1?'正确':item.option}}</span><span v-html="item.option" v-else></span></span></div>
                      <div v-if="child.analysisJson" style=" display: flex; flex-wrap: wrap;"><b>解析</b>：<span v-for="(item, index) in JSON.parse(child.analysisJson)" :key="index" style="margin-right:10px;display:flex;">&nbsp;&nbsp;<span v-if='JSON.parse(child.analysisJson).length>1'>{{index+1}}、</span> <span v-html="item.content"></span></span></div>
                    </div>
                  </div>
                  
                </div>
                <el-tooltip  effect="dark" content="删除" placement="top">
                  <el-button circle type="danger" class="upBtn" size='medium' @click="handleDel(row)" icon="el-icon-delete"></el-button>
                </el-tooltip>
            <!-- <div class="introduce">
                <span>分数：{{row.score}}分</span>
                <span>试题编号:{{row.questionNo}}</span>
                <span>考期：{{row.examTime}}</span>
                <span>省份：{{row.label}}</span>
                <span>题型：{{row.typeName}}</span>
                <span>组卷次数：{{row.combineTime}}</span>
                <span>正确率：{{row.rightRate}}</span>
                <span>试卷状态：{{row.status==0?'禁用':'启用'}}</span>
                <span>难度：{{row.difficultName}}</span>
              </div>
              <div class="stem"><span v-html="row.title"></span></div>
              <div class="option" v-if="row.optionsJson">
                <div v-for="(item, index) in JSON.parse(row.optionsJson)" :key="index" v-show="item.title" class="sel">
                  {{item.option}}、<span v-html="item.title"></span>
                </div>
              </div>
              <div class="analysis">
                <div><b>知识点</b>：{{row.nodeNo}}. {{row.nodeName}}</div>
                <div v-if="row.rightOption" style=" display: flex; flex-wrap: wrap;"><b>答案</b>：<span v-for="(item, index) in JSON.parse(row.rightOption)" :key="index" style="margin-right:10px;display:flex;">{{item.index}}、 <span v-html="item.option"></span></span></div>
                <div v-if="row.analysisJson" style=" display: flex; flex-wrap: wrap;"><b>解析</b>：<span v-for="(item, index) in JSON.parse(row.analysisJson)" :key="index" style="margin-right:10px;display:flex;">{{item.index}}、 <span v-html="item.content"></span></span></div>
              </div> -->
          </div>
        </div>
      </div>
			<div slot="footer" class="dialog-footer">
				<el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
				<el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
// import slider from "@/components/slider";
import listMixin from '@/api/list'
export default {
  mixins: [listMixin],
  // components: {
  //   slider,
  // },
  data() {
    return {
      apiName: 'system/api/question/listQuestionByTreePage',
      delName: "system/api/paperDetail/delPaperDetail",
      filters:{
        curPage: 1,
        pageSize: 10,
        subjectId: this.$route.query.subjectId,
        mergeId: this.$route.query.mergeId,
        checkStatus: 1,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      examType:[],
      per: 0,
      treeList:[],
      option:[],
      option3:[],
      count: {},
      total: 0,
      select:'2',
      users: [],
      lanList: {},
      sels: {},
      loading: false,
      totalNum: 0,
      lanShow: false,
      isShowEdit: false,
      paper:'',
      rootList: '',
      examTimeList:[],
      examTime:[],
      type:[],
      difficult:[],
    };
  },
  methods: {
    async handleDel(row) {
          var that = this
          that.$confirm('确定删除所选题目？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              that.$fetch({
                  url: 'system/api/paperDetail/delPaperDetail',
                  method: "post",
                  data: {
                      id: row.detailId
                  },
              }).catch(error => {
                  that.$message.error('system/api/paperDetail/delPaperDetail' + "接口出错！");
              }).then(({ data }) => {
                  if (data.code == 30000) {
                      that.$message.success('删除成功！')
                      that.getTestlan()
                      that.getPaper()
                  } else {
                      that.$message.warning(data.message)
                  }
              })
          });
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
    selsChange(sels) {
      this.sels = sels;
      this.sels.map((item)=>{
        item.paperId = this.$route.query.id
        item.questionsId = item.id
        item.answer = item.rightOption
        item.questionType = item.type
      })
      console.log(this.sels)
    },
    getType(){
      if(this.select==1){
        this.filters.questionNo = this.cont
      }
      if(this.select==2){
        this.filters.title = this.cont
      }
    },
    joinTest(){
     this.$http({
          url: 'system/api/paperDetail/addPaperDetailList',
          method: "post",
          data: this.sels
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        }).then(({ data }) => {
          if (data.code == 30000) {
            this.$message.success(data.message)
           this.getTestlan()
          }else {
              this.$message.warning(data.message)
          }
        })
    },
    getTestlan(){
     this.$fetch({
          url: 'system/api/paper/getTestBasket',
          method: "post",
          data: {
            paperId:this.$route.query.id
          }
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        }).then(({ data }) => {
          if (data.code == 30000) {
           this.lanList = data.result
          }else {
              this.$message.warning(data.message)
          }
        })
    },
    preview(){
      this.isShowEdit = true
      this.getPaper()
        
    },
    getPaper(){
      this.$fetch({
            url: 'system/api/paper/queryQuestionByPaperId',
            method: "post",
            data: {
              paperId:this.$route.query.id
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        }).then(({ data })=>{
            if (data.code == 30000) {
              console.log(data.result)
              this.paper = data.result.paper
              this.rootList = data.result.rootList
          }else {
              this.$message.warning(data.message)
          }
        })
    },
    editSubmit(){
      this.isShowEdit = false
      this.$fetch({
        url: 'system/api/paper/previewConfirmation',
        method: "post",
        data: {
          paperId:this.$route.query.id
        }
      }).catch(error => {
          this.$message.error(this.apiName + "接口出错！");
      }).then(({ data }) => {
        if (data.code == 30000) {
          this.$message.success('组卷成功！')
        }else {
            this.$message.warning(data.message)
        }
      })
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
        this.getList()
        this.getTime()
      }
    },
    
  },
  mounted() {
    this.getItem()
    this.getExamType()
    this.getTestlan()
    this.getMerge(this.filters.subjectId)
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
.bank{
  position: fixed;
  top: 20%;
  right: 10px;
  z-index: 99;
  .total{
    position: relative;
    right: -100%;
    margin-left: -55px;
    width: 20px;
    padding: 20px 15px 20px 20px;
    color: #fff;
    border-radius: 10px 0 0 10px;
    background: #426cb1;
    cursor: pointer;
  }
  .lan{
    width: 290px;
    min-height: 300px;
    padding: 10px 10px 20px;
    background: #fff;
    border: 1px #ccc solid;
    .title{
      position: relative;
      padding-bottom: 5px;
      text-align: center;
      border-bottom: 1px #ccc solid;
    }
    .seeBtn{
      margin-left: 50%;
      margin-top: 10px;
      transform: translateX(-50%);
    }
    .text{
      margin: 5px;
      span{
        color: #426cb1;
      }
    }
  }
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
    width: 90%;
    box-sizing: border-box;
    padding: 10px 20px;
    background: #edf0f4;
  }
}
.testContent{
  .title{
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }
  .rootlist{
    width: 100%;
    margin: 10px 0;
    .title{
      font-size: 14px;
      font-weight: 600;
      text-align: center;
    }
    .question{
      display:flex; 
      align-items: center;
      margin: 20px 0;
      .upBtn{
        width: 40px;
        height: 40px;
        margin-left: 3%;
      }
      .introduce{
        width: 90%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
      }
      .stem{
        width: 100%;
        margin: 15px 0;
      }
      .option{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin: 10px 0;
        .sel{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin-right: 40px;
        }
      }
      .analysis{
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
        background: #edf0f4;
      }
    }
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
