<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 资源设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>录播管理</el-breadcrumb-item>
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
        <el-form-item label="录播名称">
          <el-input v-model="filters.courseName" placeholder="请输入录播名称" size="small" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="录播分类">
						<el-select v-model="filters.item4" placeholder="请选择" clearable>
							<el-option v-for="item in ['免费课程','普通课程','精品课程']" :key="item" :label="item" :value="item"></el-option>
						</el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">重置</el-button>
        </el-form-item>
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
        <el-table-column align="center" prop="courseName" label="名称"></el-table-column>
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="remark" label="描述"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column align="center" prop="recordType" :formatter="formatType" label="分类"></el-table-column>
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
      <recording-edit @save-ok="editOk" :data="editForm" :isEdit="isEdit"></recording-edit>
    </el-dialog>
  </div>
</template>
<script>
import listMixin from "@/api/list";
import RecordingEdit from "./recording-edit";
import {modifyStatusRecordedCourse} from '../../../api/api'
export default {
  mixins: [listMixin],
  components: {
    RecordingEdit
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/recordedCourse/listRecordedCourse",
      delName: "system/api/recordedCourse/delRecordedCourse",
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
	  checked:false,
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
      modifyStatusRecordedCourse(params).then(res => {
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
          message:'system/api/recordedCourse/modifyStatus'+'出错',
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
      modifyStatusRecordedCourse(params).then(res => {
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
          message:'system/api/recordedCourse/modifyStatus'+'出错',
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
      return row.recordType == 0
        ? "免费课程"
        : row.recordType == 1
        ? "普通课程"
        : "精品课程";
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