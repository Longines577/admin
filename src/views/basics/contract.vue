<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 基础设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>合同管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!--工具条-->
      <el-form :inline="true" :model="filters">
        <el-form-item label="合同名称">
          <el-input v-model="filters.agreeName" placeholder="合同名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否普通合同">
          <el-select v-model="filters.isNormal" placeholder="请选择" clearable>
            <el-option
              v-for="(item,index) in ['补充协议','普通协议']"
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
        <el-table-column align="center" prop="agreeName" label="合同名称"></el-table-column>
        <el-table-column
          align="center"
          prop="isNormal"
          label="合同类型"
          :formatter="row=>row.isNormal==0?'补充协议':'普通协议'"
        ></el-table-column>
        <el-table-column align="center" prop="des" label="合同类型模版">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="seeAgree(scope.row)">查看</el-button>
          </template>
        </el-table-column>
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
      width="750px"
    >
      <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
        <el-form-item
          label="合同名称"
          prop="agreeName"
          :rules="[{ required: true, message: '请填写合同名称', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.agreeName" placeholder="请输入合同名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="合同类型"
          prop="isNormal"
          :rules="[{ required: true, message: '请选择合同类型', trigger: 'blur' }]"
        >
          <el-select v-model="editForm.isNormal" placeholder="请选择合同类型" clearable>
            <el-option
              v-for="(item,index) in ['补充协议','普通协议']"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="文件"
          prop="url"
          :rules="[{ required: true, message: '请选择文件', trigger: 'blur' }]"
        >
          <el-upload
            :action="uploadUrl"
            :http-request="upload"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :multiple="false"
            :limit="1"
            :file-list="fileList"
          >
            <el-button size="small" type="success">
              <i class="el-icon-upload" style="font-size:24px;"></i>
              <div class="el-upload__text">点击上传</div>
            </el-button>
          </el-upload>
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
export default {
  mixins: [listMixin],
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/agree/listAgreeHash",
      addName: "system/api/agree/addAgree",
      updateName: "system/api/agree/updateAgree",
      statusName: "system/api/agree/updateStatus",
      editForm: {},
      loading: false,
      fileList: [],
      users: [],
      total: 0,
      checked: false,
      isShowEdit: false,
      isEdit: 0,
      uploadUrl: $UPLOAD
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
      } else{
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
      this.updateStatus(params);
    },
    start(row, index) {
      let params = {
        id: row.id,
        status: 1
      };
      this.updateStatus(params);
    },
    updateStatus(params) {
      var that = this;
      that
        .$confirm(
          `确定${params.status == 1 ? "启用" : "禁用"}该项目？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
        .then(() => {
          that
            .$fetch({
              url: this.statusName,
              method: "post",
              data: params
            })
            .catch(error => {
              that.$message.error(this.delName + "接口出错！");
            })
            .then(({ data }) => {
              if (data.code == 30000) {
                that.$message.success(data.message);
                that.getList();
              } else {
                that.$message.warning(data.message);
              }
            });
        });
    },
    handleAvatarSuccess(res, file) {
      this.editForm.url = this.files;
    },
    handleRemove(file, fileList) {
      this.editForm.url = "";
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
    seeAgree(row) {
      window.open(row.url);
    },
    showEdit(isEdit) {
      this.isEdit = isEdit;
      this.editForm = {};
      this.editForm.url = "";
      this.isShowEdit = true;
    },
    handleEdit(row, isEdit) {
      this.isEdit = isEdit;
      this.isShowEdit = true;
      this.editForm = {
        id: row.id,
        agreeName: row.agreeName,
        isNormal: row.isNormal,
        url: row.url,
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
.el-input {
  width: 215px;
}
.el-textarea {
  display: block;
  width: 550px !important;
}
</style>