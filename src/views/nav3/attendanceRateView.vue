<template>
  <div>
    <el-button type="primary" icon="el-icon-download" @click="downExcel" style="margin-bottom:10px;"></el-button>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="isAttend" label="是否出勤" :formatter="formatType"></el-table-column>
      <el-table-column prop="studentName" label="学生姓名"></el-table-column>
      <el-table-column prop="enterTimes" label="进入次数"></el-table-column>
      <el-table-column prop="durationTime" label="留存时间"></el-table-column>
      <!-- <el-table-column prop="address" label="出勤率"></el-table-column> -->
      <el-table-column prop="joinTime" label="进入时间"></el-table-column>
      <el-table-column prop="leaveTime" label="离开时间"></el-table-column>
      <el-table-column prop="timeName" label="课次"></el-table-column>
      <el-table-column prop="classPhone" label="电话"></el-table-column>
    </el-table>
  </div>
</template>
<script>
// import listMixin from "@/api/list";
// import {expLiveCourseByStudent} from '../../api/api'\
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {BASEURL} from '../../api/config'
export default {
  // mixins: [listMixin],
  data() {
    return {
      users: [],

      filters: {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      option7:[],
      apiName: "system/api/courseTurnsTime/queryLivePerByStudent",
      apiexportName: "system/api/courseTurnsTime/expLiveCourseByStudent",
    };
  },
  props: {
    timeId: Object
  },
  methods: {
    formatType(row, column) {
      return row.isAttend == 1 ? "已出勤" : "未出勤";
    },
    downExcel() {
         window.location.href = BASEURL+"system/api/courseTurnsTime/expLiveCourseByStudent?busId="+JSON.parse(sessionStorage.getItem("userInfo")).uc.busId+"&timeId="+this.timeId.timeId
    },
    async getList() {
      this.loading = true;
      let { data } = await this.$fetch({
        url: this.apiName,
        method: "post",
        data: this.filters
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
        this.loading = false;
      });
      if (data.code == 30000) {
        this.users = data.result.liveStudent;
        this.list = data.result;
        this.total = data.result.total;
        this.loading = false;
      } else {
        this.$message.warning(data.message);
        this.loading = false;
      }
    }
  },
  mounted() {
    this.filters.timeId = this.timeId.timeId;
    this.getList();
  }
};
</script>