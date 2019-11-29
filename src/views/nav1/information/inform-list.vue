<template>
  <div class="table1">
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
      <el-col :span="24" class="toolbar" style="width:100%;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="试卷类型">
            <el-select v-model="filters.type" placeholder="请选择" clearable>
              <el-option label="真题" value="1"></el-option>
              <el-option label="模拟题" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考期">
						<el-date-picker
							v-model="filters.examTime"
							type="month"
              value-format="yyyy-MM"
							placeholder="选择考期">
						</el-date-picker>
					</el-form-item>
          <!-- <el-form-item label="题型">
            <el-select v-model="filters.type" placeholder="请选择" clearable>
             <el-option v-for="item in examType" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="难度" >
            <el-select v-model="filters.difficult" placeholder="请选择" clearable>
              <el-option label="容易" value="1"></el-option>
              <el-option label="中偏易" value="2"></el-option>
              <el-option label="中" value="3"></el-option>
              <el-option label="中偏难" value="4"></el-option>
              <el-option label="难" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" class="active">
            <el-select v-model="filters.status" placeholder="请选择" clearable>
              <el-option label="已上线" value="1"></el-option>
              <el-option label="已下线" value="0"></el-option>
              <!-- <el-option label="合格" value="2"></el-option>
              <el-option label="不合格" value="3"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="getList">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <div style="margin: 10px 0;">
          <el-button type="primary" v-if="HasPermission('add')" @click="paperAdd(0)">新建试卷</el-button>
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
          <el-table-column align="center" type="index" label="编号" width="60"></el-table-column>
          <el-table-column align="center" prop="status" :formatter="row => row.status == 1 ? '已上线' : '已下线'" label="试卷状态"></el-table-column>
          <el-table-column align="center" prop="name" label="试卷名称"></el-table-column>
          <el-table-column align="center" prop="type" :formatter="row => row.type == 1 ? '真题' : '模拟题'" label="试卷类型"></el-table-column>
          <!-- <el-table-column align="center" prop="city" label="题型"></el-table-column> -->
          <el-table-column align="center" prop="totalScore" label="总分"></el-table-column>
          <el-table-column align="center" prop="answerTime" label="答题时间"></el-table-column>
          <el-table-column align="center" prop="diffcult" label="难度" :formatter="row => row.diffcult == 1 ? '容易' :row.diffcult == 2 ? '中偏易' :row.diffcult == 3 ? '中' :row.diffcult == 4 ? '中偏难' : '难'"></el-table-column>
          <el-table-column align="center" prop="createBy" label="最后修改人"></el-table-column>
          <el-table-column align="center" prop="updateTime" label="修改时间" width="150" ></el-table-column>
          <el-table-column align="center" label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.row,1)">修改</el-button>
              <el-button size="small" v-if="HasPermission('configure')" @click="collocation(scope.$index, scope.row)">配置</el-button>
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
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    </div>
  
    <el-dialog :close-on-click-modal='false' :title="isEdit==1 ? '修改试卷' : '添加试卷'" center :visible.sync="isShowPaper" v-if="isShowPaper" width="380px">
      <paper-edit @save-ok="paperOk" :type='isEdit' :data='editForm'></paper-edit>
    </el-dialog>
  </div>
</template>

<script>
import slider from "@/components/slider";
import PaperEdit from './paper-edit'
import listMixin from '@/api/list'
export default {
  mixins: [listMixin],
  components: {
    slider,
    PaperEdit
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
        apiName: 'system/api/paper/listPaper',
        isShowPaper: false,
        option: [],
        option3: [],
        users: [],
        total: 0,
        examType:[],
        isEdit:0,
    };
  },
  methods: {
    paperAdd(isEdit){
      this.isEdit = isEdit
      this.editForm = {}
      this.isShowPaper = true
    },
    handleEdit(row,isEdit){
      this.isEdit = isEdit
      this.editForm = {
        id:row.id,
        name:row.name,
        type:row.type,
        subjectId:row.subjectId,
        regionId:row.regionId,
        examTime:row.examTime,
        answerTime:row.answerTime,
        diffcult:row.diffcult.toString(),
        status:row.status
      }
      this.isShowPaper = true
    },
    paperOk() {
      this.isShowPaper = false
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
    collocation(index,row){
      this.$router.push({path:'itemBank',query:{id:row.id,mergeId:row.regionId,subjectId:row.subjectId}});
    },
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
    getTree(){
      this.getList()
    },
   
  },
  mounted() {
    // this.getList()
    // this.getItem()
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

</style>
<style>

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
