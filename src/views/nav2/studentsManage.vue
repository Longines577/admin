<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 学员信息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>学员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <div class="container"> -->
      <!--工具条-->
      <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
        <el-form :inline="true" :model="filters" class="form">
          <el-form-item label="学生姓名" style="margin-left:20px;">
             <el-input v-model="filters.userName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="上课手机号">
            
             <el-input v-model="filters.classMobile" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <div style="float: right">
            <el-button type="primary" @click="getData">查询</el-button>
             <el-button type="primary" @click="clear">重置</el-button>
          </div>
        </el-form>
      <!-- </el-col> -->

      <!--列表-->
    <div class="container">
      <el-table :data="users" border highlight-current-row stripe v-loading="loading" style="width: 100%;">
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="userName" label="姓名">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-if="HasPermission('student')" @click="seeDetails(scope.$index, scope.row)">{{scope.row.userName}}</el-button>
            <span v-else>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="certificateCode" label="身份证号码"></el-table-column> -->
        <el-table-column align="center" prop="classMobile" label="报名手机号" width="120"></el-table-column>
        <el-table-column align="center" prop="qq" label="QQ"></el-table-column>
        <el-table-column align="center" prop="wx" label="微信">
          <!-- <template slot-scope="scope">
        <span>{{ scope.row.subject }}</span>
        <i class="el-icon-more" style="margin-left: 40px"></i>
          </template>-->
        </el-table-column>
        <el-table-column align="center" prop="province" label="地区"></el-table-column>
         <el-table-column align="center" prop="subName" label="归属"></el-table-column>
        <!-- <el-table-column align="center" prop="subject" label="教材教辅">
          <template slot-scope="scope">
            <span>{{scope.row.subject}}</span>
            <el-button size="small" type="text" @click="viewLogistics(scope.row)">查看物流</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="item1" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="item2" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="subject" label="产品名称"></el-table-column> -->
        <!-- <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.$index, scope.row)">转班</el-button>
          </template>
        </el-table-column> -->
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
    <el-dialog :close-on-click-modal='false' :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="newAdd" :before-close="handleClose" width='75%'>
      <!-- <Dialog :type="dialogStatus"></Dialog> -->
      <ClassTransfer v-if="this.dialogStatus == 'classTransfer'" />
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false" style="width:200px;">下一步</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ClassTransfer from './classTransfer/classTransfer';
import listMixin from "@/api/list";
export default {
  mixins: [listMixin],
  components: {
    // Dialog
    ClassTransfer,
  },
  data() {
    return {
     filters: {
        curPage: 1,
        pageSize: 10,
        subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      //   isShow:true,
      apiName: "system/api/student/listStudentHash",
      dataList: "",
      textMap: {
        classTransfer: "转班"
      },
      dialogFormVisible: false,
      dialogStatus: "",
      loading: false,
      users: [],
      total: 0,
      page: 1
    };
  },
  methods: {
    getData(){
			this.filters.curPage = 1
			this.getList()
		},
    handleEdit: function(index, row) {
      this.dialogFormVisible = true;
      this.dialogStatus = "classTransfer";
    },
     handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            
            done();
          })
          .catch(_ => {});
      },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    getUser(){
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
    seeDetails(index, row) {
      this.$router.push({name:'studentNews',query: {id: row.id}}) 
    },
    viewLogistics(row) {
      this.$router.push({ name: "logistics", params: { id: "1" } });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
.newAdd .el-dialog__header {
  background: #426cb1 !important;
}
.newAdd .el-dialog__title {
  color: #fff;
}
.newAdd .el-dialog__header .el-dialog__headerbtn i {
  color: #fff;
}
.form{
  width: 100%;
  align-items: center;
  background: white;
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 30px 40px 10px;
}
</style>