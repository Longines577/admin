<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 系统设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据字典类型</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="filters" class="form">
      <!-- <el-form-item>
						<el-input v-model="filters.name" placeholder="姓名"></el-input>
      </el-form-item>-->
      <el-form-item label="名称" style="margin-left:30px;" :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]">
        <el-input placeholder="请输入内容" v-model="filters.name" clearable></el-input>
      </el-form-item>
      <div style="float: right">
        <el-button type="primary" @click="getUser">查询</el-button>
        <el-button type="primary" @click="clear">重置</el-button>
      </div>
    </el-form>
    <div class="container">
      <el-button ton type="primary" v-if="HasPermission('add')" @click="show">新增</el-button>
      <el-dialog :close-on-click-modal='false'
        :title="textMap[dialogStatus]"
        center
        :visible.sync="dialogFormVisible"
        class="newAdd"
      >
        <AddDataDictionaryType v-if="dialogStatus == 'AddDataDictionaryType'" @save-ok="editOk"></AddDataDictionaryType>
        <editDictioncryType
          :data1="editData"
          v-if="dialogStatus == 'editDictioncry'"
          @save-ok="editOk"
        ></editDictioncryType>
      </el-dialog>
      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        v-loading="loading"
        style="width: 100%;margin-top:15px;"
      >
        <!-- <el-table-column align="center" type="index" width="60"></el-table-column> -->
        <el-table-column align="center" prop="name" label="名字"></el-table-column>
        <el-table-column align="center" prop="code" label="类别编码"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column align="center" prop="city" label="操作" width="200">
          <template slot-scope="scope">
            <!-- <i class="el-icon-edit" @click="edit(scope.$index,scope.row)" style="padding:10px"></i> -->
            <!-- <el-button size="mini" @click="edit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="remove(scope.$index, scope.row)">删除</el-button> -->
            <el-tooltip class="item" effect="dark" content="修改" placement="left">
							<el-button circle type="primary" size='medium' v-if="HasPermission('update')" @click="edit(scope.$index,scope.row)" icon="el-icon-li-xiugai1"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="right">
							<el-button circle type="danger" size='medium' v-if="HasPermission('del')" @click="remove(scope.$index,scope.row)" icon="el-icon-delete"></el-button>
						</el-tooltip>
            <!-- <i class="el-icon-delete" @click="handleEdit(scope.$index,scope.row)"></i> -->
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">记录</el-button> -->
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
  </div>
</template>
<script>
import { listDictionary, delDictionaryCategory } from "../../../api/api";
import AddDataDictionaryType from "./addDataDictionaryType";
import editDictioncryType from "./editDictiontryType";
import listMixin from '@/api/list'
export default {
	mixins: [listMixin],
  components: {
    AddDataDictionaryType,
    editDictioncryType
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10
      },
      dataList: "",
      dialogStatus: "",
      editData: null,
      textMap: {
        AddDataDictionaryType: "增加数据字典类别",
        editDictioncry: "编辑数据字典类别"
      },
      dialogFormVisible: false,
      loading: false,
      users: [],
      total: 0,
      page: 1
    };
  },
  methods: {
    editOk() {
      this.getUser();
      this.dialogFormVisible = false;
    },
    getUser() {
      listDictionary(this.filters)
        .then(res => {
          this.total = res.result.total;
          if (res.code === 30000) {
            this.total = res.result.total;
            this.users = res.result.content;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(error => {});
    },
    clear() {
       this.filters = {
        curPage: 1,
        pageSize: 10
      }
    },
    remove(index, rows) {
      var that = this;
      that
        .$confirm("确定删除所选纪录？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let parmas = {
            id: that.users[index].id
          };
          delDictionaryCategory(parmas).then(res => {
            if (res.code === 30000) {
              console.log("删除成功");
              that.users.splice(index, 1);
            }
          });
          that.getUser();
        });
    },
    edit(index, rows) {
      this.dialogFormVisible = true;
      this.dialogStatus = "editDictioncry";
      this.editData = this.users[index];
      // console.log(this.editData)
    },
    show() {
      this.dialogFormVisible = true;
      this.dataList = {};
      this.dialogStatus = "AddDataDictionaryType";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUser();
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getUser();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getUser();
    }
  },
  mounted() {
    this.getUser();
  }
};
</script>
<style scoped>
.form {
  width: 100%;
  align-items: center;
  background: white;
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 20px 20px 0;
}
</style>



