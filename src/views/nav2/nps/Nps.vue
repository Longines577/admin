<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 学员信息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>学员NPS打分</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <div class="container"> -->
    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
    <el-form :inline="true" :model="filters" class="form">
      <el-form-item label="班主任">
        <el-input v-model="filters.teacherName" placeholder="请输入班主任" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="学生姓名">
        <el-input v-model="filters.studentName" placeholder="请输入学生姓名" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="学生手机号码">
        <el-input v-model="filters.phone" placeholder="请输入手机号码" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="生命周期">
        <el-select v-model="liveRand" placeholder="请选择" @change="getLiveRand" clearable>
          <el-option
            v-for="item in option20"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学院">
          <el-cascader
            placeholder="请选择承接学院"
            clearable
            size="small"
            v-model="filters.chargeCollegeId"
            :props="props"
            change-on-select
            :options="departList1"
            @change="handleChange1"
          ></el-cascader>
        </el-form-item>
          <el-form-item label="家族">
          <el-cascader
            placeholder="请输入承接家族"
            clearable
            size="small"
            v-model="filters.chargeFamilyId"
            :props="props"
            change-on-select
            :options="departList2"
            @change="handleChange2"
          ></el-cascader>
         </el-form-item>
           <el-form-item label="运营组">
            <el-cascader
              clearable
              size="small"
              v-model="filters.chargeOperateId"
              :props="props"
              change-on-select
              :options="departList3"
              placeholder="请输入运营组"
            ></el-cascader>
          </el-form-item>
      <div style="float: right;margin-right:35px;">
        <el-button type="primary" plain @click="getNps">查询</el-button>
        <el-button type="primary" plain @click="clear">重置</el-button>
        <el-button type="primary" icon="el-icon-download" @click="downExcel"></el-button>           
      </div>
    </el-form>
    <!-- </el-col> -->

    <!--列表-->
    <div class="container">
      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        v-loading="loading"
        style="width: 100%;"
      >
        <el-table-column align="center" type="index" label='序号' width="60"></el-table-column>
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="chargeCollege" label="承接学院"></el-table-column>
        <el-table-column align="center" prop="chargeFamily" label="承接家族"></el-table-column>
        <el-table-column align="center" prop="chargeOperate" label="运营组"></el-table-column>
        <el-table-column align="center" prop="score" label="印象分"></el-table-column>
        <el-table-column align="center" prop="comment" label="评价"></el-table-column>
        <el-table-column align="center" prop="createTime" label="评价时间" sortable></el-table-column>
        <el-table-column align="center" prop="studentId" label="学员ID"></el-table-column>
        <el-table-column align="center" prop="studentName" label="学员姓名"></el-table-column>
        <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
        <el-table-column align="center" prop="signTime" label="报名时间" sortable></el-table-column>
        <el-table-column align="center" prop="teacherName" label="班主任"></el-table-column>
        <el-table-column align="center" prop="period" label="生命周期(天)"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="view(scope.$index,scope.row)">查看</el-button>
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
      <el-dialog title="学生历史nps评价" :visible.sync="dialogVisible" width="500px">
        <ViewStudentNps :viewData="viewData" v-if="this.viewData" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
// import { getUserList,getUserListPage } from '@/api/api';
//import NProgress from 'nprogress'
import listMixin from "@/api/list";
import ViewStudentNps from "./viewStudentNps";
import { historyNpsByStudentId } from "../../../api/api";
import {BASEURL} from '../../../api/config'
export default {
  mixins: [listMixin],
  components: {
    ViewStudentNps
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
       props: {
        value: "id",
        label: "label",
        children: "children",
        expandTrigger: "hover"
      },
      departList1: [],
      departList2: [],
      departList3: [],
      option20: [
        {
          label: "0-7天",
          value: [0,7],
          id:0
        },
        {
          label: "7-14天",
          value: [7,14],
          id:7
        },
        {
          label: "14-30天",
          value: [14, 30],
          id:14
        },
        {
          label: "30-60天",
          value: [30,60],
          id:30
        },
         {
          label: "60-90天",
          value: [60,90],
          id:60
        },
         {
          label: "90-120天",
          value: [90,120],
          id:90
        },
         {
          label: "120-150天",
          value: [120,150],
          id:120
        },
         {
          label: "150-180天",
          value: [150,180],
          id:150
        },
         {
          label: "180-360天",
          value: [180,360],
          id:180
        },
         {
          label: "360-540天",
          value: [360,540],
          id:360
        },
         {
          label: "540天以上",
          value: [540],
          id:540
        },
      ],
      apiName: "system/api/nps/listPageNps",
      liveRand:'',
      option1: [],
      option2: [],
      dialogVisible: false,
      loading: false,
      users: [],
      studentID: null,
      viewData: null,
      total: 0,
      page: 1,
      departList1: [],
      departList2: [],
      departList3: [],
      props: {
          value: 'id',
          label: 'label',
          children: 'children',
          // expandTrigger: 'hover'
      },
    };
  },
  methods: {
    async getDepartList() {
      let { data } = await this.$fetch({
        url: "system/api/departTree",
        method: "post",
        data: {
          subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        this.departList1 = data.result;
      } else {
        this.$message.warning(data.message);
      }
    },
    
    async getDepartList2(id, index) {
      let { data } = await this.$fetch({
        url: "system/api/departTreeByDepartId",
        method: "post",
        data: {
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
          departId: id
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        if (index == 1) {
          this.departList2 = data.result;
        }
        if (index == 2) {
          this.departList3 = data.result;
        }
      } else {
        this.$message.warning(data.message);
      }
    },
    async getDepart(id) {
      let { data } = await this.$fetch({
        url: "system/api/queryUcByDepart",
        method: "post",
        data: {
          departId: id,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        this.roleList = data.result;
      }
    },
    downExcel() {
        let filters = {
         liveRand: this.liveRand,
         phone:this.filters.phone,
         studentName:this.filters.studentName,
         teacherName:this.filters.teacherName
       }
       let url = BASEURL+`system/api/nps/expNpsStatic?busId=${JSON.parse(sessionStorage.getItem("userInfo")).uc.busId}`
       for(var key in filters){
         if(filters[key]){
           url += '&'+key+'='+filters[key]
         }
       }
       window.location.href = url
      // console.log(url)
    },
    getNps(){
      this.filters.curPage = 1;
      this.getNps1()
    },
    async getNps1() {
            this.loading = true
            this.filters.startRand = this.liveRand[0]
            this.filters.endRand = this.liveRand[1]
            let { data } = await this.$fetch({
                url: this.apiName,
                method: "post",
                data: this.filters,
            }).catch(error => {
                
                this.$message.error(this.apiName + "接口出错！");
                this.loading = false
            });
            if (data.code == 30000) {
                this.users = data.result.content
                this.list = data.result
                this.total = data.result.total
                this.loading = false
            } else {
                this.$message.warning(data.message)
                this.loading = false
            }

        },
    getLiveRand(){
      console.log(value)
    },
    view(index, row) {
      this.dialogVisible = true;
      this.studentID = row.studentId;
      // console.log(this.studentID,888888)
      this.getHistoryNpsByStudentId();
      // this.viewData = row
    },
    getHistoryNpsByStudentId() {
      let params = {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        studentId: this.studentID
      };
      var that = this;
      historyNpsByStudentId(params).then(res => {
        if (res.code === 30000) {
          that.viewData = res.result;
          console.log(this.viewData, 5464646);
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getNps1();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getNps1();
    },
    handleChange1(val) {
      this.filters.chargeCollegeId = val[val.length - 1]
        ? val[val.length - 1]
        : null;
      this.filters.chargeFamilyId = "";
      this.filters.chargeOperateId = "";
      if(this.filters.chargeCollegeId){
         this.getDepartList2(this.filters.chargeCollegeId, 1);
      }
     
    },
    handleChange2(val) {
      this.filters.chargeFamilyId = val[val.length - 1]
        ? val[val.length - 1]
        : null;
        if(this.filters.chargeFamilyId){
        this.getDepartList2(this.filters.chargeFamilyId, 2);
        }
    },
    handleChange3(val) {
      this.filters.chargeOperateId = val[val.length - 1]
        ? val[val.length - 1]
        : null;
        if(this.filters.chargeOperateId){
          this.getDepart(this.filters.chargeOperateId);
        }
      
    },
    async getDepartList() {
      let { data } = await this.$fetch({
        url: "system/api/departTree",
        method: "post",
        data: {
          subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        this.departList1 = data.result;
      } else {
        this.$message.warning(data.message);
      }
    },
    async getDepartList2(id, index) {
      let { data } = await this.$fetch({
        url: "system/api/departTreeByDepartId",
        method: "post",
        data: {
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
          departId: id
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        if (index == 1) {
          this.departList2 = data.result;
        }
        if (index == 2) {
          this.departList3 = data.result;
        }
      } else {
        this.$message.warning(data.message);
      }
    },
  },
  mounted() {
    this.getDepartList();
    this.getNps1();
    // this.getoption1();
  }
};
</script>

<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  background: white;
  margin-bottom: 20px;
  padding: 20px;
}
</style>