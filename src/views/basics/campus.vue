<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 基础设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>报考校区</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!--工具条-->
      <el-form :inline="true" :model="filters">
        <el-form-item label="校区名称">
          <el-input v-model="filters.name" placeholder="请输入校区名称" size="small" clearable></el-input>
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
        <!-- <el-checkbox v-model="filters.checked">只显示启用项目</el-checkbox> -->
        <el-button type="primary"  @click="showEdit(0)">新增</el-button>
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
        <el-table-column align="center" prop="name" label="校区名称"></el-table-column>
        <el-table-column align="center" prop="des" label="描述"></el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="left">
              <el-button
                circle
                type="primary"
                size="medium"
                @click="handleEdit(scope.row,1)"
                icon="el-icon-li-xiugai1"
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
          label="校区名称"
          prop="name"
          :rules="[{ required: true, message: '请填写校区名称', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.name" placeholder="请输入校区名称" size="small" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="科目代码" prop="code" :rules="[{ required: true, message: '请填写科目代码', trigger: 'blur' }]">
					<el-input v-model="editForm.code" placeholder="请输入科目代码" size="small" clearable></el-input>
        </el-form-item>-->
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
import { BaseStatus } from "../../api/api";
export default {
  mixins: [listMixin],
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/campus/listCampus",
      addName: "system/api/campus/addCampus",
      updateName: "system/api/campus/updateCampus",
      statusName: 'system/api/campus/updateStatus',
      editForm: {},
      option1: [],
      option2: [],
      loading: false,
      users: [],
      total: 0,
      page: 1,
      isShowEdit: false,
      isEdit: 0
    };
  },
  props: {
    type: {
      type: Number
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
      this.updateStatus(params)
    },
    start(row, index) {
      let params = {
        id: row.id,
        status: 1
      };
      this.updateStatus(params)
    },
    updateStatus(params){
      var that = this
      that.$confirm(`确定${params.status==1?'启用':'禁用'}该项目？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          that.$fetch({
              url: this.statusName,
              method: "post",
              data: params,
          }).catch(error => {
              that.$message.error(this.delName + "接口出错！");
          }).then(({ data }) => {
              if (data.code == 30000) {
                  that.$message.success(data.message)
                  that.getList()
              } else {
                  that.$message.warning(data.message)
              }
          })
      })
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
        name: row.name,
        // code:row.code,
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