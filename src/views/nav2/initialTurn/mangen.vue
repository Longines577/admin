<template>
  <div>
    <div class="address">
      <div>
        轮次名称:
        <span>{{courseNoName}}</span>
      </div>
    </div>
    <el-button type="primary" class="newAdd" @click="newAdd">新增</el-button>
    <div style="margin-top:20px;margin-left:30px;">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="status" label="课次状态" :formatter="formatType"></el-table-column>
        <el-table-column label="课次" prop="timeName" width="120" align="center">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.start =='1'">{{scope.row.timeName}}</span> -->
            <el-button type="text" v-if="scope.row.start =='1'">{{scope.row.timeName}}</el-button>
            <el-input
              v-model="tableData[scope.$index].timeName"
              size="small"
              clearable
              v-if="scope.row.start =='0'"
            ></el-input>
          </template>
          <!-- <template slot-scope="scope" v-if="scope.row.timeName">
            <span>11</span>
          </template>-->
        </el-table-column>
        <!-- <el-table-column prop="status" label="显示状态"  align="center" width="80" :formatter="formatType1"></el-table-column> -->
        <el-table-column label="日期" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.start =='1'">{{scope.row.startDate}}</span>
            <el-date-picker
              v-model="tableData[scope.$index].startDate"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="getDate(tableData[scope.$index].startDate)"
              v-if="scope.row.start =='0'"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="星期" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.classWeek}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" :width="columnWidth" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.start =='1'">{{scope.row.startTime}}-{{scope.row.endTime}}</span>

            <el-time-picker
              is-range
              v-model="tableData[scope.$index].startTime"
              value-format="HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              v-if="scope.row.start =='0'"
            ></el-time-picker>
          </template>
        </el-table-column>
        <el-table-column label="课时" width="120" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.start =='1'">{{scope.row.hours}}</span>
            <el-input
              v-model="tableData[scope.$index].hours"
              size="small"
              clearable
              v-if="scope.row.start =='0'"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="预约数" width="120" align="center">
          <!-- <template slot-scope="scope">
            <el-input v-model="tableData[scope.$index].rand" size="small" clearable></el-input>
          </template>-->
        </el-table-column>
        <el-table-column prop="wxUrl" label="小程序(120*120)" width="180" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.wxUrl" style="width:150px" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="moveUp(scope.$index,scope.row)">
              <i class="el-icon-top"></i>
            </el-button>
            <el-button type="text" size="mini" @click="moveDown(scope.$index,scope.row)">
              <i class="el-icon-bottom"></i>
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="editTimeName(scope.row,scope.$index)"
              v-if="scope.row.status ==0"
            >修改</el-button>
            <el-button
              type="text"
              size="mini"
              @click="removeCourseTurnsTime(scope.row,scope.$index)"
              v-if="scope.row.status ==0"
            >删除</el-button>
            <el-button
              type="text"
              size="mini"
              @click="submit(scope.$index,scope.row)"
              v-if="tableData[scope.$index].start == '0'"
            >保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="修改课次名称"
      :visible.sync="isShowCost"
      center
      width="1000px"
      append-to-body
    >
      <el-form :model="formData1" label-width="80px" :inline="true" ref="editForm">
        <el-form-item label="课次名称" prop="timeName1" style="margin-left:10px;padding-top:30px;">
          <el-input v-model="formData1.EditTimeName1" placeholder="请输入课次名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="日期" style="margin-left:236px;padding-top:30px;">
          <el-date-picker v-model="formData1.value2" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="时间" style="margin-left:10px;">
          <el-time-picker
            v-model="formData1.startTime1"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>-
          <el-time-picker
            v-model="formData1.endTime1"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="课时" style="margin-left:0px">
          <el-input v-model="formData1.hour" placeholder="请输入课时" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancle">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  queryCourseTurnsAndDetail,
  addCourseTurnsTime,
  updateCourseTurnsTime,
  delCourseTurnsTime
} from "../../../api/api";
export default {
  data() {
    return {
      dataList: [
        {
          addressEdit: false,
          name: "课号："
        }
      ],
      tableData: [],
      obj: {
        timeName: "",
        startDate: "",
        startTime: "",
        hours: ""
      },
      edit: false,
      isShowCost: false,
      formData: {},
      formData1: {
        EditTimeName1: "",
        hour: "",
        startTime1: "",
        endTime1: "",
        value2: ""
      },
      columnWidth: "120",
      IsOper: false,
      uploadUrl: $UPLOAD,
      index: "",
      iShow: false,
      courseNoId: "",
      firstId: "",
      secondId: "",
      subjectId: "",
      courseId: "",
      timeName: "",
      timeName1: "",
      hours: "",
      week: "",
      courseNoName: "",
      startDate1: "",
      startTime2: "",
      endTime2: "",
      id: ""
    };
  },
  props: {
    clas: Object
  },
  methods: {
    formatType(row, column) {
      return row.status == 1 ? "已确认" : row.status == 0 ? "未确认" : "未结课";
    },
    formatType1(row, column) {
      return row.status == 1 ? "显示" : "隐藏";
    },
    editSubmit() {
      //修改轮次明细保存
      this.isShowCost = false;
      let params = {
        id: this.id,
        timeName: this.formData1.EditTimeName1,
        startDate: this.formData1.value2,
        startTime1: this.formData1.startTime1,
        endTime1: this.formData1.endTime1,
        hours: this.formData1.hour
      };
      console.log("3213213");
      updateCourseTurnsTime(params).then(res => {
        if (res.code === 30000) {
          this.getList();
        }
      });
    },
    removeCourseTurnsTime(row, index) {
      console.log(row.id, "Helloween");
      this.$confirm("是否确定删除？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        let params = {
          id: row.id
        };
        delCourseTurnsTime(params).then(res => {
          if (res.code === 30000) {
            this.getList();
          } else {
            this.$message.error(res.message);
          }
        });
      });
    },
    editTimeName(row, index) {
      //修改
      this.isShowCost = true;
      this.formData1.EditTimeName1 = row.timeName;
      this.formData1.value2 = row.startDate;
      this.formData1.startTime1 = row.startTime;
      this.formData1.endTime1 = row.endTime;
      this.formData1.hour = row.hours;
      console.log(row.id, "233");
      this.id = row.id;
    },
    cancle() {
      this.isShowCost = false;
      // this.formData1 = {}
    },
    submit(index, row) {
      //保存
      // console.log(11111);
      let params = {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        courseNoId: this.courseNoId,
        firstId: this.firstId,
        secondId: this.secondId,
        subjectId: this.subjectId,
        courseId: this.courseId,
        classWeek: this.week,
        timeName: this.tableData[index].timeName,
        startDate1: this.tableData[index].startDate,
        startTime1: this.tableData[index].startTime[0],
        endTime1: this.tableData[index].startTime[1],
        hours: Number(this.tableData[index].hours)
      };
      addCourseTurnsTime(params).then(res => {
        if (res.code === 30000) {
          console.log(res);
          this.getList();
          this.columnWidth = "120";
        }
      });
    },
    getList() {
      let params = {
        turnsId: this.clas.turnsId
      };
      queryCourseTurnsAndDetail(params).then(res => {
        if (res.code === 30000) {
          this.courseNoName = res.result.courseNoName;
          var that = this;
          res.result.courseTurnsTimes.map((v, index) => {
            that.courseNoId = v.courseNoId;
            // that.courseNoId = 1;
            that.firstId = res.result.firstId;
            that.secondId = res.result.secondId;
            that.subjectId = res.result.subjectId;
            that.courseId = res.result.courseId;

            res.result.courseTurnsTimes[index].start = "1";
            console.log(res.result.courseTurnsTimes[index]);
            return res.result.courseTurnsTimes;
          });
          let result = Array.from(new Set(res.result.courseTurnsTimes));

          that.tableData = result;
        }
      });
    },
    getDate(value) {
      console.log("失去焦点", value);
      this.week =
        new Date(value).getDay() == 0
          ? "星期日"
          : new Date(value).getDay() == 1
          ? "星期一"
          : new Date(value).getDay() == 2
          ? "星期二"
          : new Date(value).getDay() == 3
          ? "星期三"
          : new Date(value).getDay() == 4
          ? "星期四"
          : new Date(value).getDay() == 5
          ? "星期五"
          : "星期六";
      // console.log(this.week)
    },
    moveUp(index, row) {
      console.log(row.status);
      var that = this;
      console.log("上移", index, row);
      console.log(that.tableData[index]);
      if (index > 0) {
        let upDate = that.tableData[index - 1];
        that.tableData.splice(index - 1, 1);
        that.tableData.splice(index, 0, upDate);
      } else {
        alert("已经是第一条，不可上移");
      }
    },
    moveDown(index, row) {
      var that = this;
      console.log("下移", index, row);
      if (index + 1 === that.tableData.length) {
        alert("已经是最后一条，不可下移");
      } else {
        console.log(index);
        let downDate = that.tableData[index + 1];
        that.tableData.splice(index + 1, 1);
        that.tableData.splice(index, 0, downDate);
      }
    },
    getIndex1(index) {
      this.indexs = index;
    },
    handleAvatarSuccess1(res, file) {
      this.tableData[this.indexs].url = file.response.result;
    },
    handleRemove(file, fileList) {
      this.tableData[this.index].url = "";
    },
    newAdd() {
      this.isShowAdd = false;
      this.IsOper = true;
      this.columnWidth = "320";
      this.obj = {
        timeName: "",
        startDate: "",
        startTime: "",
        hours: "",
        start: "0"
      };
      this.tableData.push(this.obj);
    },
    saveAddress(index) {
      this.dataList[index].addressEdit = false;
    },
    editAddress(index) {
      this.dataList[index].addressEdit = true;
    },
    handleClick(row) {
      console.log(row);
    }
  },
  mounted() {
    this.getList();
    console.log(this.clas.turnsId);
  },
  created() {
    console.log("重新加载");
  }
};
</script>
<style scoped>
.newAdd {
  margin-top: 40px;
  margin-left: 30px;
}
.address {
  margin-left: 30px;
}
</style>


