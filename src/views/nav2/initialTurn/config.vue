<template>
  <div class="obox">
    <el-form :inline="true" :model="filters" style="width:100%;">
      <el-form-item
        label="一级项目:"
        :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]"
      >
        <el-select
          v-model="filters.firstId"
          placeholder="请选择"
          clearable
          @change="getoption2"
          style="width:120px;"
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
        label="二级项目："
        :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]"
      >
        <el-select
          v-model="filters.secondId"
          placeholder="请选择"
          @change="getExam"
          clearable
          style="width:180px;"
        >
          <el-option
            v-for="item in option2"
            :key="item.value"
            :label="item.secondName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科目：" :rules="[{ required: true, message: '请填写科目', trigger: 'blur' }]">
        <el-select
          v-model="filters.subjectId"
          placeholder="请选择"
          @change="getCourse"
          clearable
          style="width:150px;"
        >
          <el-option
            v-for="item in option3"
            :key="item.value"
            :label="item.subjectName"
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
      <el-form-item label="课程:" :rules="[{ required: true, message: '请选择课程', trigger: 'blur' }]">
        <el-select
          placeholder="请选择课程"
          v-model="filters.courseId"
          @change="getData"
          clearable
          style="width:120px;"
        >
          <el-option
            v-for="item in option4"
            :key="item.value"
            :label="item.courseName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="授课方式：" class="testTime3">
        <el-select v-model="filters.teachType" clearable style="width:120px;">
          <el-option v-for="(item,index) in ['面授','直播']" :key="index" :label="item" :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课次总数：">
        <el-select placeholder="请选择课次总数" v-model="filters.totalNo" clearable style="width:140px;">
          <!-- <el-option
            v-for="item in option4"
            :key="item.value"
            :label="item.totalNo"
            :value="item.id"
          ></el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item label="课程分类：">
        <el-select
          placeholder="请选择课程分类"
          v-model="filters.courseType"
          clearable
          style="width:140px;"
        >
          <el-option
            v-for="(item,index) in ['公开课','精讲课','串讲课','模考课']"
            :key="index"
            :label="item"
            :value="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="开班点："
        class="testTime3"
        :rules="[{ required: true, message: '请填写开班点', trigger: 'blur' }]"
      >
        <el-date-picker
          v-model="openDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          style="width:140px;"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="课次开始时间："
        :rules="[{ required: true, message: '请填写课次开始时间', trigger: 'blur' }]"
      >
        <el-time-picker
          placeholder="起始时间"
          v-model="startTime"
          style="width:120px;"
          value-format="HH:mm:ss"
          :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
        ></el-time-picker>
        <!-- <el-time-picker
          placeholder="结束时间"
          v-model="endTime"
          value-format="HH:mm:ss"
          style="width:120px;"
         :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
        ></el-time-picker>-->
      </el-form-item>
      <el-form-item label="课号：" class="checkBox" style="margin-left:30px;">
        <el-input v-model="courseNoName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="排课：" class="checkBox" style="width:70%;">
        <template>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(city,index) in cities" :label="city.id" :key="index">{{city.name}}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form-item>
      <!-- <el-form-item style="width:10%"></el-form-item> -->
      <el-form-item label="授课老师：" class="testTime3" style="width:30%">
        <el-select placeholder="请选择授课老师" v-model="teacherId" clearable>
          <el-option
            v-for="item in option5"
            :key="item.value"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="助教/主播：" class="testTime3" style="width:30%">
        <el-select placeholder="请选择助教/主播" v-model="assistantId" clearable>
          <el-option
            v-for="item in option6"
            :key="item.value"
            :label="item.userName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="招生上限：" class="testTime3" style="width:40%">
        <el-input placeholder="请输入内容" v-model="recordId" clearable></el-input>
      </el-form-item>-->
      <el-form-item label="直播间：" class="testTime3" style="width:30%">
        <el-select placeholder="请选择直播间" v-model="recordId" clearable>
          <el-option
            v-for="item in option7"
            :key="item.value"
            :label="item.className"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="planClass" style="padding:20px;text-align:center;">
      <el-button type="primary" class="middle" @click="arrangement">预排课</el-button>
    </div>
    <el-table :data="timesJr" border style="width: 100%">
      <el-table-column prop="timeName" label="课次"></el-table-column>
      <el-table-column prop="classWeek" label="星期" width="180"></el-table-column>
      <el-table-column prop="hours" label="课时" width="180"></el-table-column>
      <el-table-column prop="startDate" label="日期" width="180"></el-table-column>
      <el-table-column prop="createTime" label="时间" width="180"></el-table-column>
      <el-table-column prop="rand" label="预约数"></el-table-column>
    </el-table>
  </div>
</template>
<script>
const cityOptions = [
  {
    id: 0,
    name: "星期天"
  },
  {
    id: 1,
    name: "星期一"
  },
  {
    id: 2,
    name: "星期二"
  },
  {
    id: 3,
    name: "星期三"
  },
  {
    id: 4,
    name: "星期四"
  },
  {
    id: 5,
    name: "星期五"
  },
  {
    id: 6,
    name: "星期六"
  }
];
import listMixin from "@/api/list";
import { createSchedule } from "../../../api/api";
import { addCourseTurnsAndDetail } from "../../../api/api";
export default {
  mixins: [listMixin],
  data() {
    return {
      num: 1,
      recordId: "",
      assistantId: "",
      recordId: "",
      teacherId: "",
      text1: "",
      openDate: "",
      startTime: "",
      endTime: "",

      examDate: "",
      courseName: "",
      filters: {},
      option1: [],
      option2: [],
      option3: [],
      option4: [],
      option5: [],
      option6: [],
      option7: [],
      option9: [],
      courseNoName: "",
      checkAll: false,
      checkedCities: [],
      cities: cityOptions,
      isIndeterminate: true,
      timesJr: [],
      pcImg: "",
      indexs: "",
      timeImg: "",
      imgUrl: $UPLOAD,
      dataArr: [],
      apiName: "system/api/courseTurns/createSchedule",
      apiCodeName: "system/api/queryUcByRoleCode",
      apiLiveRoomName: "system/api/liveRoom/queryLiveRoomByBusId",
      apiExamName: "system/api/exam/queryExamByFirstAndSecond"
    };
  },
  watch: {
    handleCheckedCitiesChange(newVal, oldVal) {
      console.log(newVal, oldVal, 11111);
    }
  },
  methods: {
    saveTurn() {
      let params = {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        firstId: this.filters.firstId,
        secondId: String(this.filters.secondId),
        subjectId: this.filters.subjectId,
        recordId: this.recordId,
        // totalNo: 11,
        startTime: this.startTime,
        examTime: this.filters.examTime,
        // endTime: this.endTime,
        teacherId: this.teacherId,
        assistantId: this.assistantId,
        courseId: this.filters.courseId,
        courseType: this.filters.courseType,
        teachType: this.filters.teachType,
        openDate: this.openDate,
        courseName: this.courseName,
        courseNoName: this.courseNoName,
        courseTurnsTimes: this.timesJr
      };
      addCourseTurnsAndDetail(params).then(res => {
        // console.log();
        if (res.code === 30000) {
          //  this.getList()
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
      console.log("hello");
    },
    getData(id) {
      console.log(id);
      this.option4.forEach(item => {
        if (item.id == id) {
          this.filters.teachType = item.teachType;
          this.filters.courseType = item.courseType;
          this.filters.totalNo = item.totalNo;
        }
        this.courseName = item.courseName;
      });
      // console.log(this.filters.courseType, 111);
    },
    formatType1(filters, column) {
      return filters.teachType == 1 ? "直播" : "面授";
    },
    handleChange(value) {},
    handleCheckedCitiesChange(value) {
      console.log(value);
      this.dataArr = value;
    },
    arrangement() {
      const params = {
        classWeeks: this.dataArr,
        courseId: this.filters.courseId,
        openDate: this.openDate
      };
      createSchedule(params).then(res => {
        if (res.code === 30000) {
          res.result.map((v, index, arr) => {
            var hourTime = this.startTime.substr(0, 2);
            var endTime =
              Number(hourTime) + Number(v.hours) > 24
                ? Number(hourTime) + Number(v.hours) - 24
                : Number(hourTime) + Number(v.hours);
            console.log(Number(hourTime) + Number(v.hours));
            v.startTime = this.startTime;
            v.endTime = String(endTime) + ":" + this.startTime.substr(3, 5);
            v.createTime =
              this.startTime +
              "-" +
              String(endTime) +
              ":" +
              this.startTime.substr(3, 5);

            res.result.push(v);
            return res.result;
          });
          // console.log(res.result);
          // let result = new Set(res.result);
          let result = Array.from(new Set(res.result));
          // console.log(result)
          this.timesJr = result;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    async getExam(id) {
      //获取一二级项目下关联的科目下拉
      var firstId = "";
      this.option2.map(item => {
        if (id == item.id) {
          return (firstId = item.firstId);
        }
      });
      let { data } = await this.$fetch({
        url: "system/api/subject/querySubByFirstAndSecond",
        method: "post",
        data: {
          firstId: firstId,
          secondId: id,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        }
      }).catch(error => {
        this.$message.error(this.apiExamName + "接口出错！");
      });
      if (data.code == 30000) {
        this.option3 = data.result;
      }
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
          this.$message.error(this.apiName + "接口出错！");
        })
        .then(({ data }) => {
          if (data.code == 30000) {
            this.option9 = data.result;
            console.log(this.option9, 111);
          }
        });
    }
  },
  mounted() {
    this.getoption1();
    this.getCode();
    this.getAssidtant();
    this.getLiveRoom();
  }
};
</script>
<style scoped>
.middle span {
  color: white;
  font-size: 16px;
  font-family: "微软雅黑";
  font-weight: bolder;
  background: #426cb1 !important;
}
.el-input--small .el-input__inner {
  width: 120px !important;
}
/* .form {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  margin-bottom: 20px;
  padding-top: 20px;
  border-radius: 5px;
} */
</style>


