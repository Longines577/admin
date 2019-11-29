<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 系统设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据字典</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="filters" class="form">
      <!-- <el-form-item>
						<el-input v-model="filters.name" placeholder="姓名"></el-input>
      </el-form-item>-->
      <el-form-item
        label="名称"
        style="margin-left:30px;"
        :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]"
      >
        <el-input placeholder="请输入内容" v-model="filters.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="类别编码" style="margin-left:30px;">
        <el-input placeholder="请输入类别编码" v-model="filters.categoryCode" clearable></el-input>
      </el-form-item>
      <div style="float: right">
        <el-button type="primary" @click="getUser">查询</el-button>
        <el-button type="primary" @click="clear">重置</el-button>
      </div>
    </el-form>
    <div class="container">
      <el-button ton type="primary" v-if="HasPermission('add')" @click="show">新增</el-button>
      <el-dialog
        :close-on-click-modal="false"
        :title="textMap[dialogStatus]"
        center
        :visible.sync="dialogFormVisible"
        class="newAdd"
      >
        <!-- <Dialog :data1="dataList" :type="dialogStatus"></Dialog> -->
        <AddDataDictionary v-if="dialogStatus == 'addDataDictionary'" @save-ok="editOk" />
        <EditDictioncry :data1="editData" v-if="dialogStatus == 'editDictioncry'" @save-ok="editOk"></EditDictioncry>
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
        <el-table-column align="center" prop="categoryCode" label="类别编码"></el-table-column>
        <el-table-column align="center" prop="dkey" label="编码"></el-table-column>
        <el-table-column align="center" prop="value" label="值" sortable></el-table-column>
        <el-table-column align="center" prop="description" label="描述"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <!-- <span
              class="el-icon-edit"
              @click="edit(scope.$index,scope.row)"
              style="padding:10px 10px"
            ></span>
            <span class="el-icon-delete" @click="remove(scope.$index,scope.row)"></span>-->
            <el-tooltip class="item" effect="dark" content="修改" placement="left">
              <el-button
                circle
                type="primary"
                size="medium"
                v-if="HasPermission('update')"
                @click="edit(scope.$index,scope.row)"
                icon="el-icon-li-xiugai1"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="right">
              <el-button
                circle
                type="danger"
                size="medium"
                v-if="HasPermission('del')"
                @click="remove(scope.$index,scope.row)"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">记录</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="this.pageArr"
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
// import Dialog from "../../components/dialog";
import { Dictionary, delDictionary } from "../../../api/api";
import AddDataDictionary from "./addDataDictionary";
import EditDictioncry from "./editDictioncry";
import listMixin from "@/api/list";
export default {
  mixins: [listMixin],
  components: {
    AddDataDictionary,
    EditDictioncry
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10
      },
      pageArr: [10, 20, 30, 40],
      option1: [],
      dataList: "",
      editData: null,
      dialogStatus: "",
      textMap: {
        addDataDictionary: "增加数据字典",
        editDictioncry: "修改数据字典"
      },
      dialogFormVisible: false,
      loading: false,
      users: [],
      total: 0,
      page: 1,
      id: ""
    };
  },
  watch: {
    edit(val, oldVal) {
      console.log(val, oldVal);
    }
  },
  methods: {
    getUser() {
      Dictionary(this.filters).then(res => {
        this.total = res.result.total;
        if (res.code === 30000) {
          this.users = res.result.content;
          // console.log(this.users)
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
        // console.log(res)
      });
    },
    editOk() {
      this.getUser();
      this.dialogFormVisible = false;
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10
      };
    },

    edit(index, rows) {
      this.dialogFormVisible = true;
      this.dialogStatus = "editDictioncry";
      this.editData = this.users[index];
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
          delDictionary(parmas).then(res => {
            if (res.code === 30000) {
              console.log("删除成功");
              that.users.splice(index, 1);
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
          that.getUser();
        });
    },
    show() {
      this.dialogFormVisible = true;
      this.dataList = {};
      this.dialogStatus = "addDataDictionary";
      //   console.log(this.dialogStatus)
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


