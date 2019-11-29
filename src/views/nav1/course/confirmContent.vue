<template>
  <div class="content">
    <p class="confirm">课程确认:</p>
    <div class="flexBox" v-if="dataList">
      <span class="fristSubjet">一级项目:{{dataList.firstName}}</span>
      <span class="resources">课号名称:{{dataList.timeName}}</span>
      <span class="teach">授课方式:暂无数据</span>
      <span class="course">课程名称:{{dataList.subjectName}}</span>
    </div>
    <div>
      <p style="color:black;">直播设置:</p>
      <!-- <p class="living">
        直播平台:
        <el-radio v-model="radio" label="1">欢拓</el-radio>
      </p>
      <p class="living">
        直播模式:
        <el-radio v-model="radio" label="2">常规直播</el-radio>
        <el-radio v-model="radio" label="3">伪直播</el-radio>
      </p>-->
      <div>
        <span class="living">
          上课时间:
          <el-date-picker
            v-model="startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </span>
        <span style="width:150px;">
          <el-time-picker
            v-model="startTime"
            value-format="HH:mm:ss"
            :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
            placeholder="任意时间点"
          ></el-time-picker>
        </span>
        <span>
          <el-time-picker
            v-model="endTime"
            value-format="HH:mm:ss"
            :picker-options="{
      selectableRange: '00:00:00 - 23:59:59'
    }"
            placeholder="任意时间点"
          ></el-time-picker>
        </span>

        <span class="teach">
          教师:
          <el-select placeholder="请选择授课老师" v-model="teacherId" clearable>
            <el-option
              v-for="item in option5"
              :key="item.value"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </span>
      </div>
      <div style="padding-top:20px;">
        <span class="assistant">
          助教:
          <el-select placeholder="请选择助教/主播" v-model="assistantId" clearable>
            <el-option
              v-for="item in option6"
              :key="item.value"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </span>

        <span class="living" style="margin-left:20px;">
          直播间:
          <el-select placeholder="请选择直播间" v-model=" recordId" clearable>
            <el-option
              v-for="item in option7"
              :key="item.value"
              :label="item.className"
              :value="item.id"
            ></el-option>
          </el-select>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import listMixin from "@/api/list";
import {teachConfirm} from '../../../api/api'
export default {
  mixins: [listMixin],
  data() {
    return {
      dataList: null,
      // teach: "直播",
      recordId: "",
      assistantId: "",
      teacherId: "",
      startTime: "",
      startDate: "",
      endTime: "",
      apiCodeName: "system/api/queryUcByRoleCode",
      apiLiveRoomName: "system/api/liveRoom/queryLiveRoomByBusId",
      apiTeachConfirmName:'system/api/courseTurnsTime/teachConfirm',
      option5: [],
      option6: [],
      option7: []
    };
  },
  props: {
    paramsObj: Object
  },
  methods: {
    saveConfirm() {
      let params = {
        timeDate: this.startDate,
        startTime: this.startTime,
        endTime : this.endTime,
        teacherId: this.teacherId,
        id: this.dataList.id,
        assistantId: this.assistantId,
        recordId: this.recordId
      };
      teachConfirm(params).then(res => {
        if(res.code === 30000){
        console.log(res,2222)
        }
      }).catch(error=>{
         this.$message.error(this.apiTeachConfirmName + "接口出错！");
      })
    }
  },
  mounted() {
    this.getCode();
    this.getAssidtant();
    this.getLiveRoom();
    this.dataList = this.paramsObj;
    console.log(this.paramsObj);
  }
};
</script>
<style scoped>
.content {
  margin-top: 30px;
  margin-left: 30px;
}
.flexBox {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.fristSubjet {
  width: 50%;
  /* margin-top: 30px; */
  /* padding-left: 30px; */
  letter-spacing: 1px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bolder;
}
.resources {
  width: 40%;
  /* margin-top: 30px; */

  letter-spacing: 1px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bolder;
}
.teach {
  width: 50%;
  margin-top: 20px;
  letter-spacing: 1px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bolder;
}
.course {
  width: 40%;
  letter-spacing: 1px;
  margin-top: 20px;

  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bolder;
}
.living {
  margin-top: 20px;
  margin-left: 80px;
  letter-spacing: 1px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bolder;
}
.assistant {
  margin-top: 50px;
  margin-left: 110px;
  letter-spacing: 1px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bolder;
}
.teach {
  letter-spacing: 1px;
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bolder;
}
.el-date-editor.el-input {
  width: 130px !important;
}
</style>


