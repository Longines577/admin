<template>
  <div class="table">
    <div class="container">
      <!--工具条-->
      <el-form :inline="true" :model="filters" v-if="type==1">
        <el-form-item label="一级项目">
          <el-select v-model="filters.firstId" placeholder="请选择"  @change="getoption2" filterable clearable>
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.firstName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级项目" v-if="type==1">
         <el-select v-model="filters.id" placeholder="请选择" filterable clearable>
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
      <div style="margin: 20px 0;border-top: 1px #ccc solid;" v-if="type==1"></div>
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
        <el-table-column align="center" prop="secondName" label="二级项目" v-if="type==1"></el-table-column>
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
            <!-- <el-tooltip class="item" effect="dark" content="删除" placement="right">
							<el-button circle type="danger" size='medium' v-if="HasPermission('del')" @click="handleDel(scope.row)" icon="el-icon-delete"></el-button>
            </el-tooltip>-->
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
          v-if="type==1"
          prop="firstId"
          :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]"
        >
          <el-select v-model="editForm.firstId" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.firstName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="一级项目"
          v-if="type==0"
          prop="firstName"
          :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.firstName" placeholder="请输入一级项目" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="二级项目"
          v-if="type==1"
          prop="secondName"
          :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.secondName" placeholder="请输入二级项目" size="small" clearable></el-input>
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
import { updateStatus } from "../../../api/api";
export default {
  mixins: [listMixin],
  props: {
    type: {
      type: Number
    }
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName:
        this.type == 0
          ? "system/api/firstProject/listFirstProject"
          : "system/api/secondProject/listSecondProject",
      addName:
        this.type == 0
          ? "system/api/firstProject/addFirstProject"
          : "system/api/secondProject/addSecondProject",
      updateName:
        this.type == 0
          ? "system/api/firstProject/updateFirstProject"
          : "system/api/secondProject/updateSecondProject",
      delName:
        this.type == 0
          ? "system/api/firstProject/delFirstProject"
          : "system/api/secondProject/delSecondProject",
      statusName:
        this.type == 0
          ? "system/api/firstProject/updateStatus"
          : "system/api/secondProject/updateStatus",
      editForm: {},
      option1: [],
      option2: [],
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
    start(row, index) {
      console.log(row.id);
      let params = {
        id: row.id,
        status: 1
      };
      this.updateStatus(params);
    },
    forbidden(row, index) {
      console.log(row.id);
      let params = {
        id: row.id,
        status: 0
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
      this.editForm = this.editForm = {
        id: row.id,
        firstName: row.firstName,
        firstId: row.firstId,
        secondName: row.secondName,
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