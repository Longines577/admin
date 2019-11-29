<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 基础设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>院校管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!--工具条-->
      <el-form :inline="true" :model="filters">
        <el-form-item label="专业">
          <el-input v-model="filters.major" placeholder="请输入专业"></el-input>
        </el-form-item>
        <el-form-item label="院校">
          <el-input v-model="filters.college" placeholder="请输入院校"></el-input>
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
        <!-- <el-checkbox v-model="checked">只显示启用项目</el-checkbox> -->
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
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="college" label="院校"></el-table-column>
        <el-table-column align="center" prop="major" label="专业"></el-table-column>
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
          <el-select v-model="editForm.secondId" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级项目" v-if="isEdit==1" prop="secondName">
          <el-select v-model="editForm.secondName" disabled placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.secondName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="专业"
          prop="major"
          :rules="[{ required: true, message: '请填写专业', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.major" placeholder="请输入专业" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="院校"
          prop="college"
          :rules="[{ required: true, message: '请填写院校', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.college" placeholder="请输入院校" size="small" clearable></el-input>
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
      apiName: "system/api/examCollege/listExamCollege",
      addName: "system/api/examCollege/addExamCollege",
      updateName: "system/api/examCollege/updateExamCollege",
      delName: "system/api/examCollege/delExamCollege",
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
        college: row.college,
        major: row.major,
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
    },
    async getItem() {
      let { data } = await this.$fetch({
        url: "system/api/item/queryAllItem",
        method: "post",
        data: {
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        this.option3 = data.result;
      }
    }
  },
  mounted() {
    this.getList();
    this.getoption1();
    this.getItem();
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