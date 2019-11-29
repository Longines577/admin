<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 学员信息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>评分管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
    <el-form :inline="true" :model="filters" class="form">
      <!-- <el-form-item>
						<el-input v-model="filters.name" placeholder="姓名"></el-input>
      </el-form-item>-->
      <el-form-item label="一级项目" class="box">
        <el-select v-model="filters.firstId" placeholder="请选择" clearable @change="getoption2">
          <el-option
            v-for="item in option1"
            :key="item.value"
            :label="item.firstName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级项目" class="box">
        <el-select v-model="filters.secondId" placeholder="请选择" clearable>
          <el-option
            v-for="item in option2"
            :key="item.value"
            :label="item.secondName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上课老师打分(0-5分)">
        <el-input v-model="filters.score" placeholder="请输入分值" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="filters.labels" placeholder="请输入标签" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="评论">
        <el-input v-model="filters.comment" placeholder="请输入评论" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="评论时间">
        <el-date-picker v-model="filters.markTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">搜索</el-button>
        <el-button type="primary" @click="clear">重置</el-button>
      </el-form-item>
      <el-form-item>
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
        <el-table-column align="center" prop="timeName" label="课次名称"></el-table-column>
        <el-table-column align="center" prop="score" label="老师上课打分情况"></el-table-column>
        <el-table-column align="center" prop="labels" label="标签"></el-table-column>
        <el-table-column align="center" prop="comment" label="评论"></el-table-column>
        <el-table-column align="center" prop="markTime" label="评论时间" sortable></el-table-column>
        <!-- <el-table-column align="center" prop="studentId" label="学员ID"></el-table-column> -->
        <el-table-column align="center" prop="studentName" label="学员姓名"></el-table-column>
        <el-table-column align="center" prop="mobile" label="联系方式"></el-table-column>
        <el-table-column align="center" prop="teacherName" label="老师"></el-table-column>
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
import Export from "../../../components/export/outData";
import listMixin from "@/api/list";
import {BASEURL} from '../../../api/config'
export default {
  mixins: [listMixin],
  components: {
    Export
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },

      apiName: "system/api/mark/listMark",
      value: "",
      option1: [],
      option2: [],
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
    downExcel() {
      let filters = {
        firstId: this.filters.firstId,
        secondId: this.filterssecondId,
        markTime: this.filters.markTime,
        comment: this.filters.comment,
        labels: this.filters.labels,
        score: this.filters.score
      };
      let url = BASEURL+`system/api/mark/queryExportByMark?busId=${
        JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      }`;
      for (var key in filters) {
        if (filters[key]) {
          url += "&" + key + "=" + filters[key];
        }
      }
      window.location.href = url;
      console.log(url);
    },
    //性别显示转换
    // formatSex: function(row, column) {
    //   return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    // },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    }
  },
  mounted() {
    this.getList();
    this.getoption1();
  }
};
</script>

<style scoped>
.form {
  /* display: flex;
  justify-content: space-around;
  align-items: center; */
  background: white;
  margin-bottom: 20px;
  padding-top: 20px;
}
/* .el-button{
  background: #426cb1;
  color: white;
} */
</style>