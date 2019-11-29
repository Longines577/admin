<template>
  <div class="table">
    <div class="crumbs"></div>
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
          class="box"
          :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]"
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
          <el-select v-model="filters.secondId" placeholder="请选择" clearable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学生" :rules="[{ required: true, message: '请输入学生姓名', trigger: 'blur' }]">
          <el-input v-model="filters.studentName" placeholder="请输入学生姓名" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="手机号码"
          :rules="[{ required: true, message: '请输入手机号码', trigger: 'blur' }]"
        >
          <el-input v-model="filters.classPhone" placeholder="请输入手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="轮次名称"
          :rules="[{ required: true, message: '请输入轮次名称', trigger: 'blur' }]"
        >
          <el-input v-model="filters.turnsName" placeholder="请输入轮次名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="serach">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!-- </el-col> -->
    <div class="container">
      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        v-loading="loading"
        style="width: 100%;margin-top:10px;"
      >
        <!-- <el-table-column align="center" type="index" width="60"></el-table-column> -->
        <el-table-column align="center" label="推送状态" prop="status" :formatter="formatStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color:#FF3366">推送失败</span>
            <span v-if="scope.row.status == 1" style="color:#37B328">推送成功</span>
            <span v-if="scope.row.status == 2" style="color:#999999">取消</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="isAttend" label="是否出勤" :formatter="formatAttend">
          <template slot-scope="scope">
            <span v-if="scope.row.isAttend == 1" style="color:#37B328">已出勤</span>
            <span v-else style="color:red">未出勤</span>
          </template>
        </el-table-column>-->
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="studentName" label="学生名称"></el-table-column>
        <el-table-column align="center" prop="courseTime" label="排课时间"></el-table-column>
        <el-table-column align="center" prop="timeName" label="课次名称" width="120"></el-table-column>
        <el-table-column align="center" prop="turnsName" label="轮次名称" width="120"></el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名称" width="115"></el-table-column>
        <el-table-column align="center" prop="classPhone" label="手机号码" width="100"></el-table-column>
        <el-table-column align="center" prop="failReason" label="推送结果" width="120"></el-table-column>
        <!-- <el-table-column align="center" prop="assistantName" label="助教"></el-table-column>
        <el-table-column align="center" prop="time" label="课号人数"></el-table-column>
        <el-table-column align="center" prop="liveId" label="直播ID"></el-table-column>
        <el-table-column align="center" prop="subjectName" label="上课科目"></el-table-column>
        <el-table-column align="center" prop="teacherName" label="上课老师"></el-table-column>
        <el-table-column align="center" prop="className" label="物理直播间"></el-table-column>
        <el-table-column align="center" prop="subject" label="直播链接"></el-table-column>-->
        <el-table-column align="center" label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="cancelPush(scope.$index,scope.row)"
              v-if="scope.row.status == 1"
            >取消推送</el-button>
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
import listMixin from "@/api/list";
import { pushCourseTurnsTime, cancelPushTime } from "../../../api/api";
export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      filters: {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/scheduleTime/listScheduleTimeHash",
      total: "",
      option1: [],
      option2: [],
      value2: "",
      users: []
    };
  },
  props: {
    pushDetail: Object
  },
  methods: {
    getList1() {
      this.filters.turnsId = this.pushDetail.turnsId;
      this.loading = true;
      this.$fetch({
        url: this.apiName,
        method: "post",
        data: this.filters
      })
        .catch(error => {
          this.$message.error(this.apiName + "接口出错！");
          this.loading = false;
        })
        .then(({ data }) => {
          if (data.code == 30000) {
            this.users = data.result.content;
            this.total = data.result.total
            this.loading = false;
          } else {
            this.$message.warning(data.message);
            this.loading = false;
          }
        });
    },
    formatStatus: function(row, column) {
      return row.status == 1 ? "成功" : row.status == 2 ? "取消" : "失败";
    },
    formatAttend: function(row, column) {
      return row.isAttend == 1 ? "已出勤" : "未出勤";
    },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //     if(columnIndex === 0){
    //       const _row = this.spanArr[rowIndex]
    //       const _col = _row>0?1:0;
    //       return{
    //             rowspan:_row,
    //             colspan:_col
    //           }
    //   }
    //    if(columnIndex === 1){
    //       const _row = this.spanArr[rowIndex]
    //       const _col = _row>0?1:0;
    //       return{
    //             rowspan:_row,
    //             colspan:_col
    //           }
    //   }
    // },
    serach() {
      this.getList1();
    },
    cancelPush(index, row) {
      this.$confirm("是否确定取消推送？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        let params = {
          turnsId: row.turnsId,
          studentId: row.studentId
        };
        cancelPushTime(params).then(res => {
          if (res.code === 30000) {
            console.log(res.message);
            this.$message({
              message: "取消推送成功！",
              type: "success"
            });
            this.getList1();
          }
        });
      });
    },
    clear() {
      this.filters = {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList1();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList1();
    },
    pickerOptions() {}
  },
  mounted() {
    this.getoption1();
    this.getList1();
    // console.log(this.pushInfo, 565456);
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