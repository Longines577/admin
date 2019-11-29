<template>
  <div class="cont">
    <el-card class="box-card">
      <div class="tips">课程表</div>
      <div style="margin:20px 0;">
        <el-date-picker
          v-model="month"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="selectMonth"
        ></el-date-picker>
      </div>
      <el-table :data="dataList" style="width: 100%" class="courseTable1" center>
        <el-table-column type="expand">
          <!-- <template slot-scope="props"> -->
          <!-- <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.subject1 }}</span>
              </el-form-item>
              <el-form-item label="所属店铺">
                <span>{{ props.row.subject2 }}</span>
              </el-form-item>
              <el-form-item label="商品 ID">
                <span>{{ props.row.subject4 }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.subject5 }}</span>
              </el-form-item>
          </el-form>-->
          <template slot-scope="props">
            <el-table :data='props.row.courseTurnsList' style="width: 100%">
              <el-table-column prop="timeName" label="课次" align="center"></el-table-column>
              <el-table-column prop="startDateStr" label="日期" align="center"></el-table-column>
              <el-table-column prop="classWeek" label="星期" align="center"></el-table-column>
              <el-table-column label="时间" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.startTimeStr}}-{{scope.row.endTimeStr}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="hours" label="课时" align="center"></el-table-column>
            </el-table>
          </template>

          <!-- </template> -->
        </el-table-column>
        <el-table-column label="开课时间" prop="openDate"></el-table-column>
        <el-table-column prop="courseNoName" label="课号名称" align="center"></el-table-column>
        <el-table-column prop="courseType" label="课号类型" align="center" :formatter="formatType2"></el-table-column>
        
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { queryMyCourseByMonth } from "../../../api/api";
export default {
  data() {
    return {
      month: new Date().toISOString().substring(0, 7),
      activeName: "1",
      fullscreen: false,
      dataList: [],
      turnList: []
    };
  },
  methods: {
    formatType2(row, column) {
      return row.courseType == 0 ? "临时课号" : "普通课号";
    },
    getList() {
      let params = {
        studentId: this.$route.query.id,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        month: this.month
      };
      queryMyCourseByMonth(params).then(res => {
        console.log(res.code);
        if (res.code === 30000) {
          this.dataList = res.result;
          // this.dataList.map(v => {
          //   this.turnList = v.courseTurnsList;
          //   console.log(this.turnList, 546456);
          //   return false;
          // });
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    selectMonth() {
      this.getList();
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.courseTable1 {
  .el-table__header th,
  .el-table__header tr {
    background-color: #ededed !important;
    color: black;
  }
  .el-pager li.active {
    color: #080909;
    cursor: default;
    background-color: #ededed !important;
    border-radius: 2px;
  }
}
</style>