<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 资源设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!--工具条-->
      <el-form :inline="true" :model="filters">
        <el-form-item label="一级项目">
          <el-select v-model="filters.firstId" placeholder="请选择" clearable @change="getoption2">
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.firstName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级项目">
          <el-select v-model="filters.secondId" placeholder="请选择" @change="getSubject" clearable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="filters.subjectId" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in option3"
              :key="item.value"
              :label="item.subjectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input v-model="filters.courseName" placeholder="课程名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="授课方式">
          <el-select v-model="filters.teachType" placeholder="请选择" clearable>
            <el-option
              v-for="(item,index) in ['面授','直播']"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="filters.courseType" placeholder="请选择" clearable filterable>
            <el-option
              v-for="(item,index) in ['公开课','精讲课','串讲课','模考课']"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
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
      <div style="margin: 20px 0;border-top: 1px #ccc solid;"></div>
      <div style="margin: 10px 0;height: 40px;">
        <el-checkbox v-model="checked">只显示启用项目</el-checkbox>
        <el-button type="primary" v-if="HasPermission('add')" @click="showEdit(0)">新增</el-button>
      </div>
      <!--列表-->
      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        v-loading="loading"
        style="width: 100%;"
      >
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="start(scope.row,scope.$index)"
              v-if="scope.row.status ==0"
            >已禁用</el-button>
            <el-button
              type="text"
              @click="forbidden(scope.row,scope.$index)"
              v-if="scope.row.status ==1"
            >已启用</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="courseName" label="课程名称"></el-table-column>
        <el-table-column align="center" prop="teachType" :formatter="formatType" label="授课方式"></el-table-column>
        <el-table-column align="center" prop="courseType" :formatter="formatTyped" label="课程分类"></el-table-column>
        <el-table-column align="center" prop="totalHour" label="课时"></el-table-column>
        <el-table-column align="center" prop="totalNo" label="课次"></el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="left">
              <el-button
                circle
                type="primary"
                size="medium"
                v-if="HasPermission('update')"
                @click="handleEdit(scope.row,1)"
                icon="el-icon-li-xiugai1"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="right">
              <el-button
                circle
                type="danger"
                size="medium"
                v-if="HasPermission('del')"
                @click="handleDel(scope.row)"
                icon="el-icon-delete"
              ></el-button>
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
    <el-dialog
      :close-on-click-modal="false"
      :title=" isEdit ? '编辑' : '添加'"
      :visible.sync="isShowEdit"
      v-if="isShowEdit"
      center
      width="70%"
    >
      <curriculum-edit @save-ok="editOk" :data="editForm" :isEdit="isEdit"></curriculum-edit>
    </el-dialog>
  </div>
</template>
<script>
import listMixin from "@/api/list";
import CurriculumEdit from "./curriculum-edit";
import { modifyStatusCourse } from "../../../api/api";
export default {
  mixins: [listMixin],
  components: {
    CurriculumEdit
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/course/listCourseHash",
      // addName: 'system/api/recordedCourse/addRecordedCourse',
      // updateName: 'system/api/recordedCourse/updateRecordedCourse',
      delName: "system/api/course/delCourse",
      editForm: {},
      option1: [],
      option2: [],
      option3: [],
      loading: false,
      users: [],
      total: 0,
      page: 1,
      isShowEdit: false,
      isEdit: 0,
      checked: false
    };
  },
  watch: {
    checked(oldVal, newVal) {
      console.log(oldVal);
      if (oldVal === true) {
        this.filters.status = 1;
        this.getList();
      } else {
        this.filters = {
          curPage: 1,
          pageSize: 10,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        };
        this.getList();
      }
    }
  },
  methods: {
    getData(){
			this.filters.curPage = 1
			this.getList()
		},
    forbidden(row, index) {
      let params = {
        id: row.id,
        status: 0
      };
      modifyStatusCourse(params).then(res => {
        if (res.code === 30000) {
          this.$message({
            showClose: true,
            message: "已禁用",
            type: "success"
          });
          this.getList();
        } else {
          this.$message({
            showClose: true,
            message: "system/api/course/modifyStatus" + "出错",
            type: "warning"
          });
        }
      });
    },
    start(row, index) {
      let params = {
        id: row.id,
        status: 1
      };
      modifyStatusCourse(params).then(res => {
        if (res.code === 30000) {
          this.$message({
            showClose: true,
            message: "已启用",
            type: "success"
          });
          this.getList();
        } else {
          this.$message({
            showClose: true,
            message: "system/api/course/modifyStatus" + "出错",
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
    formatStatus(row, column) {
      return row.status == 1 ? "已发布" : row.status == 0 ? "未发布" : "";
    },
    formatType(row, column) {
      return row.courseType == 0
        ? "公开课"
        : row.courseType == 1
        ? "精讲课"
        : row.courseType == 2
        ? "串讲课"
        : "模考课";
    },
    formatTyped(row, column) {
      return row.teachType == 1 ? "直播" : "面授";
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    },
    showEdit(isEdit) {
      this.isEdit = isEdit;
      this.isShowEdit = true;
      this.editForm = {};
    },
    handleEdit(row, isEdit) {
      this.isEdit = isEdit;
      this.isShowEdit = true;
      this.editForm = row;
    },
    // editSubmit(){
    // 	this.editForm.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
    // 	this.$refs.editForm.validate((valid) => {
    // 		if(valid){
    // 			if(this.isEdit){
    // 				this.update()
    // 			}else{
    // 				this.add()
    // 			}
    // 		}
    // 	})
    // },
    editOk() {
      this.isShowEdit = false;
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
.btn {
  position: absolute;
  right: 70px;
}
.btn2 {
  width: 30%;
}
</style>