<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 产品包与排课
        </el-breadcrumb-item>
        <el-breadcrumb-item>排课管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <div class="container"> -->
    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
    <el-form :inline="true" :model="filters" class="form">
      <div class="leftInput">
        <!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>-->
        <el-form-item
          label="一级项目"
          :rules="[{ required: true, message: '请选择一级项目', trigger: 'blur' }]"
        >
          <el-select v-model="filters.firstId" placeholder="请选择" clearable @change="getoption2">
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
          :rules="[{ required: true, message: '请选择二级项目', trigger: 'blur' }]"
        >
          <el-select v-model="filters.secondId" placeholder="请选择" clearable @change="getExam">
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考期：" :rules="[{ required: true, message: '请选择考期', trigger: 'blur' }]">
          <el-select v-model="filters.examTime" placeholder="请选择" clearable style="width:150px;">
            <el-option
              v-for="item in option9"
              :key="item.value"
              :label="item.examTime"
              :value="item.examTime"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="上课日期："
          :rules="[{ required: true, message: '请选择上课时间', trigger: 'blur' }]"
        >
          <!-- <el-date-picker
            v-model="filters.startDateStart"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期"
          ></el-date-picker>
          <el-date-picker
            v-model="filters.startDateEnd"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束日期"
          ></el-date-picker>-->
          <el-date-picker
            v-model="value2"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!-- </el-col> -->
    <div class="container">
      <!--列表-->
      <!-- <el-button type="primary" style="float:right;" @click="add">新增</el-button> -->
      <el-dialog
        :close-on-click-modal="false"
        :title="textMap[dialogStatus]"
        center
        :visible.sync="dialogFormVisible"
        width="950px"
      >
        <!-- <Dialog v-if="dialogStatus == 'add'" /> -->
        <ConfirmContent v-if="dialogStatus == 'confirm'" :paramsObj="paramsObj" ref="child" />
        <transaction v-if=" dialogStatus == 'transaction'" :paramsObj="paramsObj" ref="child" />
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancle">取 消</el-button>
          <el-button type="primary" @click="enSure(dialogStatus)">确 定</el-button>
        </div>
      </el-dialog>
      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        v-loading="loading"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column align="center" type="index" width="60"></el-table-column>
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column align="center" label="状态" :formatter="formatStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '1'" style="color:#FF6600">确认</span>
            <span v-if="scope.row.status == '0'">未确认</span>
            <span v-if="scope.row.status == '2'">异动</span>
            <span v-if="scope.row.status == '3'" style="color:green;">已结课</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="timeName" label="课时名称"></el-table-column>
        <!-- <el-table-column align="center" prop="time" label="授课方式"></el-table-column> -->
        <el-table-column align="center" prop="startDate" label="上课日期"></el-table-column>
        <el-table-column align="center" prop="startTime" label="上课时间" width="120"></el-table-column>
        <el-table-column align="center" prop="hours" label="课时"></el-table-column>
        <el-table-column align="center" prop="assistantName" label="助教"></el-table-column>
        <!-- <el-table-column align="center" prop="birth" label="考期" sortable></el-table-column> -->
        <el-table-column align="center" prop="time" label="课号人数"></el-table-column>
        <el-table-column align="center" prop="liveId" label="直播ID"></el-table-column>
        <el-table-column align="center" prop="subjectName" label="上课科目"></el-table-column>
        <el-table-column align="center" prop="teacherName" label="上课老师"></el-table-column>
        <!-- <el-table-column align="center" prop="subject" label="更班老师"></el-table-column> -->
        <el-table-column align="center" prop="className" label="物理直播间"></el-table-column>
        <el-table-column align="center" prop="subject" label="直播链接"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <!-- <el-button
              @click.native.prevent="edit(scope.$index, scope.row)"
              type="text"
              size="medium"
              icon="el-icon-edit-outline"-
            ></el-button>-->
            <el-button
              type="text"
              @click="confirm(scope.$index,scope.row)"
              v-if="HasPermission('confirm')&&scope.row.status =='0'"
            >确认</el-button>
            <el-button
              type="text"
              @click="finishClass(scope.$index,scope.row)"
              v-if="HasPermission('conclusion')&&scope.row.status == '1'"
            >结课</el-button>
            <el-button type="text" v-if="scope.row.status == '1'" @click="show(scope.$index,scope.row)">异动</el-button>
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
// import { getUserList,getUserListPage } from '@/api/api';
//import NProgress from 'nprogress'
// import Dialog from "../nav1/dialog/dialog.vue";
import ConfirmContent from "./confirmContent";
import transaction from "./transaction";
import listMixin from "@/api/list";
import { finishCourseTurnsTime } from "../../../api/api";
export default {
  mixins: [listMixin],
  components: {
    ConfirmContent,
    transaction
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      textMap: {
        add: "新增",
        confirm: "教学通知确认",
        transaction: "异动通知确认"
      },
      value2: "",
      apiName: "system/api/courseTurnsTime/listCourseTurnsTimeHash",
      apiExamName: "system/api/exam/queryExamByFirstAndSecond",
      dialogStatus: "",
      dialogFormVisible: false,
      option1: [],
      option2: [],
      loading: false,
      isView: true,
      users: [],
      option9: [],
      total: 0,
      index: null,
      paramsObj: {},
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
              console.log(start, 565656);
            }
          }
        ]
      }
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    formatStatus: function(row, column) {
      return row.status == 1 ? "确认" :row.status ==2?'异动':row.status == 0 ?'未确认': "已结课";
    },
    show(index, row) {
      this.dialogFormVisible = true;
      this.dialogStatus = "transaction";
      this.paramsObj = {
        firstName: row.firstName,
        timeName: row.timeName,
        subjectName: row.subjectName,
        liveId:row.liveId
      };
    },
    finishClass(index, row) {
      let params = {
        id: row.id,
        status: 3
      };
      finishCourseTurnsTime(params).then(res => {
        if (res.code === 30000) {
          this.getList();
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    confirm(index, row) {
      this.dialogFormVisible = true;
      this.dialogStatus = "confirm";
      this.paramsObj = {
        firstName: row.firstName,
        timeName: row.timeName,
        subjectName: row.subjectName,
        id: row.id
      };

      console.log(this.paramsObj, 111);
    },
    enSure(dialogStatus) {
      this.dialogStatus = "";
      this.dialogFormVisible = false;
      if (dialogStatus == "confirm") {
        this.$refs.child.saveConfirm();
        setTimeout(() => {
          this.getList();
          this.isView = false;
        }, 500);
      } else {
        this.$refs.child.saveTransaction();
        setTimeout(() => {
          this.getList();
          // console.log("我是异步");
        }, 500);
      }
    },

    filterList() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        firstId: this.filters.firstId,
        secondId: this.filters.secondId,
        examTime: this.filters.examTime,
        startDateStart: this.value2[0],
        startDateEnd: this.value2[1]
      };
      this.getList();
    },
    cancle() {
      this.dialogStatus = "";
      this.dialogFormVisible = false;
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

    // add() {
    //   this.dialogFormVisible = true;
    //   this.dialogStatus = "add";
    // },
    async getExam(id) {
      //获取一二级项目下关联的科目下拉
      var firstId = "";
      this.option2.map(item => {
        if (id == item.id) {
          return (firstId = item.firstId);
        }
      });
      //考期
      this.$fetch({
        url: "system/api/exam/queryExamByFirstAndSecond",
        method: "post",
        data: {
          firstId: firstId,
          secondId: id,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        }
      })
        .catch(error => {
          this.$message.error(this.apiExamName + "接口出错！");
        })
        .then(({ data }) => {
          if (data.code == 30000) {
            this.option9 = data.result;
            console.log(this.option9, 111);
          }
        });
    },
    async getList() {
      this.loading = true;
      let { data } = await this.$fetch({
        url: this.apiName,
        method: "post",
        data: this.filters
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        data.result.content.map(v => {
          v.startTime = v.startTime + "-" + v.endTime;
          return data.result.content;
        });
        this.users = data.result.content;
        this.list = data.result;
        this.total = data.result.total;
      } else {
        this.$message.warning(data.message);
      }
      this.loading = false;
    }
  },
  mounted() {
    this.getList();
    this.getoption1();
  },
  updated() {
    console.log(this.value2, 5888988);
  }
};
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  margin-bottom: 20px;
  padding-top: 20px;
}
.leftInput {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-left: 20px;
}
</style>