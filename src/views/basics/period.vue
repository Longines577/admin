<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 基础设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>考期管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!--工具条-->
      <el-form :inline="true" :model="filters">
        <el-form-item label="一级项目">
          <el-select v-model="filters.firstId" placeholder="请选择" filterable clearable @change="getoption2">
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.firstName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级项目">
          <el-select v-model="filters.secondId" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
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
        <el-button type="primary" class="btn" v-if="HasPermission('add')" @click="showEdit(0)">新增</el-button>
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
        <el-table-column align="center" prop="status" label="启用禁用">
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
        <el-table-column align="center" prop="examTime" label="考期"></el-table-column>
        <el-table-column align="center" prop="des" label="描述"></el-table-column>
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
      center
    >
      <el-form :model="editForm" label-width="80px" ref="editForm">
        <el-form-item
          label="一级项目"
          prop="firstId"
          :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]"
        >
          <el-select
            v-model="editForm.firstId"
            :disabled="isEdit==1?true:false"
            placeholder="请选择"
            clearable
            @change="getoption2"
          >
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.firstName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="二级项目"
          v-if="isEdit!=1"
          prop="secondId"
          :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]"
        >
          <el-select v-model="editForm.secondId" placeholder="请选择" clearable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="二级项目"
          v-if="isEdit==1"
          prop="secondName"
          :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]"
        >
          <el-select v-model="editForm.secondName" disabled placeholder="请选择" clearable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.secondName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="考期"
          prop="examTime"
          :rules="[{ required: true, message: '请填写考期', trigger: 'blur' }]"
        >
          <el-date-picker
            v-model="editForm.examTime"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择考期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input
            type="textarea"
            :rows="2"
            v-model="editForm.des"
            placeholder="请输入描述"
            size="small"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
        <el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import listMixin from "@/api/list";
import { ExamStatus } from "../../api/api";
export default {
  mixins: [listMixin],
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/exam/listExam",
      addName: "system/api/exam/addExam",
      updateName: "system/api/exam/updateExam",
      delName: "system/api/exam/delExam",
      editForm: {},
      option1: [],
      option2: [],
      loading: false,
      users: [],
      total: 0,
      isShowEdit: false,
      isEdit: 0,
      checked: false
    };
  },
  props: {
    type: {
      type: Number
    }
  },
  watch: {
    checked(oldVal, newVal) {
      console.log(oldVal);
      if (oldVal === true) {
        this.filters.status = 1;
        this.filters.curPage = 1
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
    start(row, index) {
      console.log(row.id);
      let params = {
        id: row.id,
        status: 1
      };
      ExamStatus(params).then(res => {
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
            message: "system/api/exam/updateStatus",
            type: "error"
          });
        }
      });
    },
    forbidden(row, index) {
      console.log(row.id);
      let params = {
        id: row.id,
        status: 0
      };
      ExamStatus(params).then(res => {
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
            message: "system/api/exam/updateStatus",
            type: "error"
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
      this.editForm = {
        id: row.id,
        firstId: row.firstId,
        secondId: row.secondId,
        secondName: row.secondName,
        examTime: row.examTime,
        des: row.des
      };
    },
    editSubmit() {
      this.editForm.busId = JSON.parse(
        sessionStorage.getItem("userInfo")
      ).user.busId;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.update();
          } else {
            this.add();
          }
        }
      });
    },
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