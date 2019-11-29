<template>
  <div class="table1">
    
    <div class="box" v-if="type==1">
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
      <!--工具条-->
      <div class="obox">
      <el-col :span="24" class="toolbar" style="width:90%;">
        <el-form :inline="true" :model="filters">
          
          <el-form-item label="题目类型">
            <el-select v-model="filters.category" placeholder="请选择" clearable>
              <el-option v-for="(item,index) in ['模拟题','真题']" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题型">
            <el-select v-model="filters.type" placeholder="请选择" clearable>
             <el-option v-for="item in examType" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="filters.checkStatus" placeholder="请选择" clearable>
              <el-option label="待审核" value="0"></el-option>
              <el-option label="合格" value="1"></el-option>
              <el-option label="不合格" value="2"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="修改人" >
            <el-input v-model="filters.updateBy" placeholder="请输入修改人" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
          
          
        </el-form>
      </el-col>
      <div class="sides"  v-if="type==1">
        <el-button type="primary" @click="upload(0)"  v-if="HasPermission('upload')" style="margin-bottom: 20px">试题上传</el-button>
      </div>
      <!--列表-->
      <div>
        <el-table
          :data="users"
          border
          highlight-current-row
          stripe
          style="width: 100%;"
        >
          <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
          <!-- <el-table-column align="center" type="index" label="编号" width="60"></el-table-column> -->
          <el-table-column align="center" prop="questionNo" label="试题编号"></el-table-column>
          <el-table-column align="center" prop="type" 
          :formatter="row => row.type == 1 ? '单选题' : row.type == 2 ? '多选题' :row.type == 3 ? '填空题(有序)' :row.type == 4 ? '填空题(无序)' :row.type == 5 ? '判断题' : row.type == 6 ? '判断论述题' :row.type == 7 ? '文字题' :row.type == 8? '完形填空题' :row.type == 9?'多选多':'综合题'"
           label="题型"></el-table-column>
          <el-table-column align="center" prop="title" label="题干" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div class="maxH" v-if="scope.row.title" v-html="scope.row.title"></div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="score" label="分数"></el-table-column>
          <el-table-column align="center" prop="category" :formatter="row => row.category == 1 ? '真题' : '模拟题'" label="题目类型"></el-table-column>
          <el-table-column align="center" prop="updateBy" label="最后修改人"></el-table-column>
          <el-table-column align="center" prop="updateTime" label="修改时间" ></el-table-column>
          <el-table-column align="center" prop="checkName" label="最后审核人"></el-table-column>
          <el-table-column align="center" prop="checkTime" label="审核时间" ></el-table-column>
          <el-table-column align="center" prop="checkStatus" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.checkStatus==0">待审核</span>
              <span v-if="scope.row.checkStatus==1" class="green">合格</span>
              <span v-if="scope.row.checkStatus==2" class="red">不合格</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="small"  v-if="type==1&&HasPermission('update')&&scope.row.checkStatus==2" @click="handleEdit(scope.row,1)">编辑</el-button>
              <el-button size="small"  v-if="type==2&&HasPermission('examine')&&scope.row.checkStatus==0" @click="examineEdit(scope.row,2)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>

      <!--工具条-->
        <div class="pagination">
          <el-pagination 
            background 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :current-page="filters.curPage"
            :page-size="filters.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
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
import slider from "@/components/slider";
import QuestionsEdit from './questions-edit'
import listMixin from '@/api/list'
export default {
  mixins: [listMixin],
  components: {
    slider,
    QuestionsEdit,
  },
  props: {
    type: {
      type: Number
    }
  },
  data() {
    return {
        filters: {
          curPage: 1,
          pageSize: 10,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        },
        apiName: 'system/api/question/listQuestion',
        total: 0,
        count: {},
        option:[],
        option3:[],
        examType: [],
        isShowEdit: false,
        isEdit: '',
    };
  },
  methods: {
    upload(isEdit){
      this.isShowEdit = true
      this.isEdit = isEdit
      this.editForm = {}
      this.$store.state.question = {}
    },
    editOk() {
      this.isShowEdit = false
      this.getList()
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    },
    reset(){
      this.filters = {
				curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			}
    },
   
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
        // id: row.id,
        // parentId: row.parentId,
        // mergeId: row.mergeId,
        // subjectId: row.subjectId,
        // category: row.category,
        // type: row.type.toString(),
        // difficult: row.difficult,
        // score: row.score,
        // rightRate:　row.rightRate,
        // title: row.title,
        // rightOption: JSON.parse(row.rightOption),
        // superId:row.superId,
        // optionsJson: JSON.parse(row.optionsJson),
        // analysisJson: JSON.parse(row.analysisJson),

    },
    examineEdit(row, isEdit) {
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
    
    //全选单选多选
    // selsChange(sels) {
    //   this.sels = sels;
    // },
    async getMerge(id) {
        this.filters.mergeId = ''
        this.list = []
        this.count = {}
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
    getTree(){
      this.getList()
      this.getCount()
    },
 
  },
  mounted() {
    // this.getItem()
    // this.getList();
    // this.getExamType()
  }
};
</script>

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
.red{
  color: red;
}
.green{
  font-weight: 600;
  color: green;
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
    width: 20%;
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
  }
}
.maxH{
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
<style>
/* .cont>.right>.el-input {
    width: 330px;
    margin-left: 200px;
  } */
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
.testTime {
  /* float: left; */
  /* margin-top: 30px; */
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
<style>
.el-tooltip__popper.is-dark {
    max-width: 500px !important;
    background: #303133;
    color: #FFF;
}
</style>