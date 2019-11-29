<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 学员信息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>学员直播出勤</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <div class="container"> -->
      <!--工具条-->
      <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
        <el-form :inline="true" :model="filters" class="form">
          <!-- <el-form-item>
						<el-input v-model="filters.name" placeholder="姓名"></el-input>
          </el-form-item>-->
          <el-form-item label="是否出勤">
            <el-select v-model="filters.isAttend" placeholder="请选择" clearable>
              <el-option label="未出勤" value="0"></el-option>
              <el-option label="已出勤" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="进入直播时间">
            <el-date-picker v-model="filters.joinTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"   placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="离开直播时间">
            <el-date-picker v-model="filters.leaveTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="累计留存时间">
            <el-input v-model="filters.duration" placeholder="请输入留存时间" size="small" clearable></el-input>
          </el-form-item>
          <el-form-item label="授课老师">
            <el-select placeholder="请选择授课老师" filterable  v-model="filters.teacherId" clearable>
                <el-option
                  v-for="item in option5"
                  :key="item.value"
                  :label="item.userName"
                  :value="item.id"
                ></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="学院">
             <div class="block" style="width:217px;margin-left:0px;">
            <!-- <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader> -->
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
          </div>
          </el-form-item>
           <el-form-item label="家族">
            <div style="margin-left:0px;">
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
          </div>
          </el-form-item>
           <el-form-item label="运营组">
             <div style="margin-left:0px;">
            <el-cascader
              clearable
              size="small"
              v-model="filters.chargeOperateId"
              :props="props"
              change-on-select
              :options="departList3"
              @change="handleChange3"
              placeholder="请输入运营组"
            ></el-cascader>
          </div>
          </el-form-item>
          <el-form-item label="承接人" prop="chargeId" >
            <el-select v-model="filters.chargeId" placeholder="请输入承接人" clearable filterable>
                <el-option v-for="(item,index) in roleList" :key="index" :label="item.userName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData">查询</el-button>
            <el-button type="primary" icon="el-icon-download" @click="downExcel"></el-button>           
          </el-form-item>
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
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="turnsName" label="轮次名称"></el-table-column>
        <el-table-column align="center" prop="timeName" label="课程名称"></el-table-column>
        <el-table-column align="center" prop="chargeCollegeName" label="学院"></el-table-column>
        <el-table-column align="center" prop="chargeFamilyName" label="家族"></el-table-column>
        <el-table-column align="center" prop="chargeOperateName" label="运营组"></el-table-column>
        <el-table-column align="center" prop="chargeName" label="班主任"></el-table-column>
        <el-table-column align="center" prop="teacherName" label="授课老师"></el-table-column>
        <!-- <el-table-column align="center" prop="timeName" label="课程名称"></el-table-column> -->
        <el-table-column align="center" prop="isAttend" label="出勤" :formatter="formatisAttend"></el-table-column>
        <el-table-column align="center" prop="joinTime" label="进入直播时间"></el-table-column>
        <el-table-column align="center" prop="leaveTime" label="离开直播时间"></el-table-column>
        <el-table-column align="center" prop="durationTime" label="累计留存时间" sortable></el-table-column>
        <el-table-column align="center" prop="studentName" label="姓名"></el-table-column>
        <el-table-column align="center" prop="classPhone" label="电话"></el-table-column>
        <el-table-column align="center" prop="studentId" label="学员ID"></el-table-column>


        
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
</template>
<script>
// import { getUserList,getUserListPage } from '@/api/api';
//import NProgress from 'nprogress'
// import Export from "../../../components/export/outData";
import listMixin from "@/api/list";
import{BASEURL} from '../../../api/config'
export default {
  mixins: [listMixin],
  components: {
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName:'system/api/scheduleTime/listScheduleTimeHash',
      loading: false,
      departList1: [],
      departList2: [],
      departList3: [],
        roleList:[],
      users: [],
      total: 0,
      option5:[],
      page: 1,
       props: {
            value: 'id',
            label: 'label',
            children: 'children',
            // expandTrigger: 'hover'
        },
    };
  },
  methods: {
     downExcel() {
       var that = this
       let filters = {
         isAttend: this.filters.isAttend,
         joinTime:this.filters.joinTime,
         leaveTime:this.filters.leaveTime,
         duration:this.filters.duration,
         teacherId:this.filters.teacherId,
         chargeCollegeId:this.filters.chargeCollegeId,
         chargeFamilyId:this.filters.chargeFamilyId,
         chargeOperateId:this.filters.chargeOperateId,
         chargeId:this.filters.chargeId,

       }
       let url = BASEURL+`system/api/scheduleTime/exportScheduleTime?busId=${JSON.parse(sessionStorage.getItem("userInfo")).uc.busId}`
       for(var key in filters){
         if(filters[key]){
           url += '&'+key+'='+filters[key]
         }
       }
      //  console.log(url)
       window.location.href = url
      //  that.$fetch({
      //         url: 'system/api/scheduleTime/exportScheduleTime',
      //         method: "get",
      //         params:filters,
      //     }).then(({ data }) => {
      //        window.location.href = data 
      //     })
        //  window.location.href = "http://192.168.1.86:9527/system/api/scheduleTime/exportScheduleTime?busId="+JSON.parse(sessionStorage.getItem("userInfo")).uc.busId+"&isAttend="+this.filters.isAttend ==null?null:parseInt(this.filters.isAttend)
        //  +"&chargeId="+this.filters.chargeId ==null?null:parseInt(this.filters.chargeId)+"&chargeOperateId="+this.filters.chargeOperateId ==null?null:parseInt(this.filters.chargeOperateId)+"&chargeFamilyId="+this.filters.chargeFamilyId ==null?null:parseInt(this.filters.chargeFamilyId)+"&teacherId="+this.filters.teacherId ==null?null:parseInt(this.filters.teacherId)+"&duration="+parseInt(this.filters.duration)
        //  +"&leaveTime="+this.filters.leaveTime ==null?null:parseInt(this.filters.leaveTime)+"&joinTime="+this.filters.joinTime ==null?null:parseInt(this.filters.joinTime)
        // window.location.href = "http://192.168.1.86:9527/system/api/scheduleTime/exportScheduleTime?busId="+JSON.parse(sessionStorage.getItem("userInfo")).uc.busId+"&isAttend="+parseInt(this.filters.isAttend)
        //  +"&chargeId="+parseInt(this.filters.chargeId)+"&chargeOperateId="+parseInt(this.filters.chargeOperateId)+"&chargeFamilyId="+parseInt(this.filters.chargeFamilyId)+"&teacherId="+parseInt(this.filters.teacherId)+"&duration="+parseInt(this.filters.duration)
        //  +"&leaveTime="+parseInt(this.filters.leaveTime)+"&joinTime="+parseInt(this.filters.joinTime)
    },
    //性别显示转换
    formatisAttend: function(row, column) {
      return row.isAttend == 1 ? '已出勤' : '未出勤';
    },
    clear() {
      this.filters = {
        item1: "",
        item2: "",
        city: "",
        birth: ""
      };
    },
    getData(){
			this.filters.curPage = 1
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
  },
  mounted() {
    this.getList();
    this.getCode()
    this.getDepartList();
  }
};
</script>

<style scoped>
.form{
  background: white;
  margin-bottom: 20px;
  padding-top: 20px;
}
</style>