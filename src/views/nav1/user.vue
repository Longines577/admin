<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 产品包与排课
        </el-breadcrumb-item>
        <el-breadcrumb-item>考试计划管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
      <!--工具条-->
      <div class="container">
        <el-form :inline="true" :model="filters" style="width:100%;" class="form">
         <el-form-item label="一级项目">
						<el-select v-model="filters.firstId" placeholder="请选择" clearable  @change="getoption2">
							<el-option v-for="item in option1" :key="item.value" :label="item.firstName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="二级项目">
						<el-select v-model="filters.secondId" placeholder="请选择" clearable>
							<el-option v-for="item in option2" :key="item.value" :label="item.secondName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
          <el-form-item label="考期">
            <el-date-picker v-model="filters.examTime" format="yyyy-MM"  value-format="yyyy-MM" type="month" placeholder="选择考期"></el-date-picker>
          </el-form-item>
        
         <div style="float: right">
						<el-form-item>
							<el-button type="primary" @click="getData">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="clear">重置</el-button>
						</el-form-item>
					</div>
        </el-form>
      

      <!--列表-->
      <div style="margin: 20px 0;border-top: 1px #ccc solid;" ></div>
      <div style="margin: 10px 0;padding-bottom:10px;">
        <el-button type="primary" v-if="HasPermission('add')" @click="handleAdd(0)">新增</el-button>
        <!-- <el-button type="primary" @click="outData">导出</el-button> -->
		<!-- <Export @click="parClick"  refs='out' /> -->
      </div>

      <el-table :data="users" border highlight-current-row stripe v-loading="loading"  style="width: 100%;">
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="examTime" label="考期" sortable></el-table-column>
        <!-- <el-table-column align="center" prop="jtrq" label="日期"></el-table-column> -->
        <el-table-column align="center" prop="subject" label="考试科目">
          <template slot-scope="scope">
            <span v-for="(item, index) in  JSON.parse(scope.row.subject)" :key="index" style="margin:0 10px">{{item.subjectName}}</span>
          </template>
        </el-table-column>
        <el-table-column  align="center" prop="des" label="描述"></el-table-column>
        <el-table-column align="center" label="操作"  width="120">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="修改" placement="top">
							<el-button circle type="primary" size='medium' @click="handleEdit(scope.row,1)" icon="el-icon-li-xiugai1"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
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
    <!--新增界面-->
    <el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="editFormVisible" center>
      <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
        <el-form-item label="一级项目" prop="firstId" :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]">
            <el-select v-model="editForm.firstId" placeholder="请选择" clearable  @change="getoption2">
                <el-option v-for="item in option1" :key="item.value" :label="item.firstName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="二级项目" prop="secondId" :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]" >
            <el-select v-model="editForm.secondId" placeholder="请选择"  @change="getSubject" clearable>
                <el-option v-for="item in option2" :key="item.value" :label="item.secondName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="科目" class="selectInt" prop="subjectId" >
            <el-select v-model="subjectId" multiple placeholder="请选择" @change="setSubject" clearable>
                <el-option v-for="item in option3" :key="item.value" :label="item.subjectName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="考期">
          <el-date-picker v-model="editForm.examTime" format="yyyy-MM"  value-format="yyyy-MM" type="month" placeholder="选择考期"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="日期">
          <el-select v-model="date" placeholder="请选择" clearable>
            <el-option
              v-for="(item,index) in ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
          <el-select v-model="week" placeholder="请选择" clearable>
            <el-option label="上午" value="上午"></el-option>
            <el-option label="下午" value="下午"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="描述" prop="des" >
					<el-input  type="textarea" :rows="2" v-model="editForm.des" placeholder="请输入描述" size="small" clearable></el-input>
				</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn" @click.native="editFormVisible=false">取消</el-button>
        <el-button class="btn" type="primary" :loading="loading" @click.native="editSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Export from '../../components/export/outData'
import listMixin from '@/api/list'
export default {
 mixins: [listMixin],
 components: {
    Export,
  },
  data() {
    return {
      spanArr: [],
      position: 0,
      option1: [],
      option2: [],
      option3: [],
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      date: '',
      week: '',
      subjectId: '',
      loading: false,
      users: [],
      total: 0,
      apiName: "system/api/examPlan/listExamPlan",
      addName: 'system/api/examPlan/saveExamPlan',
      updateName:'system/api/examPlan/modifyExamPlan',
      editForm: {
        subjectJr:[]
      },
      editFormVisible: false,
      isEdit: 1,
    };
  },
  methods: {
    getData(){
			this.filters.curPage = 1
			this.getList()
		},
    setSubject(val){
      var arr = []
      this.option3.forEach((item)=>{
        val.forEach((row)=>{
          if(row==item.id){
            arr.push({
              id: item.id,
              subjectName: item.subjectName,
              code: item.code,
            }) 
          }
        })
      })
      this.editForm.subjectJr = arr 
      console.log(this.editForm.subjectJr,111)
    },
    editSubmit(){ 
      this.loading = true
      this.editForm.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			this.$refs.editForm.validate((valid) => {
				if(valid){
          if(this.isEdit){
						this.update1()
					}else{
						this.add1()
					}
          this.editOk()
				}
			})
		},
		editOk() {
      this.editFormVisible = false
      setTimeout(() => {
        	this.getList()
      }, 200);
		
		},
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    handleAdd(isEdit) {
      this.editForm = {};
      this.subjectId = ''
      this.option3 = []
      this.isEdit = isEdit
      this.editFormVisible = true;
    },
    handleEdit(row,isEdit){
      this.isEdit = isEdit
      this.editForm = {
        id:row.id,
        examTime:row.examTime,
        des:row.des,
        firstId:row.firstId,
        secondId:row.secondId,
        subjectJr:JSON.parse(row.subject) 
      };
      console.log(this.editForm,111)
      this.subjectId = this.editForm.subjectJr.map(item=>item.id)
      this.getoption2(row.firstId)
      this.getSubject(row.secondId)
      this.editFormVisible = true;
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    },
    rowspan() {
      this.users.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (
            this.users[index].item1 === this.users[index - 1].item1 &&
            this.users[index].item2 === this.users[index - 1].item2 &&
            this.users[index].birth === this.users[index - 1].birth
          ) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // if(row.item1)
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
  },
  mounted() {
    this.getList()
    this.getoption1()
    // this.rowspan();
  }
};
</script>

<style scoped>
.selectInt {
  display: block;
  width: 520px;
}
.btn {
  width: 180px;
}
</style>