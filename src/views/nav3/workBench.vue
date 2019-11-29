<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 教师工作台
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="topBox">
        <div class="selectData">
          <span>日期：</span>
          <el-date-picker
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="filter.dayTime"
            @change="setTime"
            :clearable="false"
          ></el-date-picker>
        </div>
        <el-button type="primary" @click="goToday">回到今天</el-button>
      </div>

      <div style="margin: 20px 0;border-top: 1px #ccc solid;"></div>
      <div class="swiper-container">
        <!-- <div class="prev" @click="prev(filters.birth)">
					<el-button icon="el-icon-d-arrow-left">上周</el-button>
        </div>-->

        <div class="swiper-wrapper">
          <div
            class="swiper-slide stop-swiping"
            @click="setDate(0)"
            :class="week==0?'selected':'select'"
          >星期日 {{filter.dayTime7||''+'&nbsp;&nbsp;'}}<br>{{ (filter.course7||'0') + '节'}}</div>
          <div
            class="swiper-slide stop-swiping"
            @click="setDate(1)"
            :class="week==1?'selected':'select'"
          >星期一 {{filter.dayTime1||'' +'&nbsp;&nbsp;'}}<br>{{ (filter.course1||'0') + '节'}}</div>
          <div
            class="swiper-slide stop-swiping"
            @click="setDate(2)"
            :class="week==2?'selected':'select'"
          >星期二 {{filter.dayTime2||''+'&nbsp;&nbsp;'}}<br>{{ (filter.course2||'0') + '节'}}</div>
          <div
            class="swiper-slide stop-swiping"
            @click="setDate(3)"
            :class="week==3?'selected':'select'"
          >星期三 {{filter.dayTime3||''+'&nbsp;&nbsp;'}}<br>{{ (filter.course3 ||'0') + '节'}}</div>
          <div
            class="swiper-slide stop-swiping"
            @click="setDate(4)"
            :class="week==4?'selected':'select'"
          >星期四 {{filter.dayTime4||''+'&nbsp;&nbsp;'}}<br>{{ (filter.course4||'0') + '节'}}</div>
          <div
            class="swiper-slide stop-swiping"
            @click="setDate(5)"
            :class="week==5?'selected':'select'"
          >星期五 {{filter.dayTime5||''+'&nbsp;&nbsp;'}}<br>{{ (filter.course5||'0') + '节'}}</div>
          <div
            class="swiper-slide stop-swiping"
            @click="setDate(6)"
            :class="week==6?'selected':'select'"
          >星期六 {{filter.dayTime6||''+'&nbsp;&nbsp;'}}<br>{{ (filter.course6||'0') + '节'}}</div>
          <!-- <div
            class="swiper-slide stop-swiping"
            @click="setDate(7)"
            :class="week==0?'selected':'select'"
          >星期日 {{filter.dayTime7+'&nbsp;&nbsp;'}}<br>{{ filter.course7 + '节'}}</div> -->
        </div>
        <!-- <div class="next" @click="next(filters.birth)">
					<el-button >下周<i class="el-icon-d-arrow-right"></i></el-button>
        </div>-->
      </div>
      <div class="statis" v-if="statistics">
        <div class="card">
          <div class="text1">直播课 {{statistics.thisDayCountCourse || 0}}节</div>
          <div class="text2">已结束 {{statistics.finishCourseNo || 0}}</div>
          <div class="text3">直播中 {{statistics.liveCourseNo || 0}}</div>
          <div class="text4">待直播 {{statistics.toLiveCourseNo||0}}</div>
          <div class="trend">
            <i
              class="el-icon-li-xiajiang down"
              v-if="(statistics.thisDayCountCourse - statistics.beforeDayCountCourse)<0"
            ></i>
            <i
              class="el-icon-li-shangsheng up"
              v-if="(statistics.thisDayCountCourse - statistics.beforeDayCountCourse)>0"
            ></i>
            <i
              class="el-icon-minus balance"
              v-if="statistics.thisDayCountCourse == statistics.beforeDayCountCourse "
            ></i>
          </div>
          <div class="bottom">昨日{{statistics.beforeDayCountCourse || 0}}节</div>
        </div>
        <div class="card">
          <div class="text">应出勤人员{{statistics.thisDayLiveNo || 0}}人</div>
          <div class="trend">
            <i
              class="el-icon-li-xiajiang down1"
              v-if="(statistics.thisDayLiveNo - statistics.beforeDayLiveNo)<0"
            ></i>
            <i
              class="el-icon-li-shangsheng up1"
              v-if="(statistics.thisDayLiveNo - statistics.beforeDayLiveNo)>0"
            ></i>
            <i
              class="el-icon-minus balance1"
              v-if="statistics.thisDayLiveNo == statistics.beforeDayLiveNo"
            ></i>
          </div>
          <div class="bottom1">昨日{{statistics.beforeDayLiveNo|| 0}}人</div>
        </div>
        <div class="card">
          <div class="text">学员出勤率 {{AttendanceToday}}%</div>
          <div class="trend">
            <i class="el-icon-li-xiajiang down2" v-if="(AttendanceToday - AttendanceYesterday)<0"></i>
            <i class="el-icon-li-shangsheng up2" v-if="(AttendanceToday - AttendanceYesterday)>0"></i>
            <i class="el-icon-minus balance2" v-if="AttendanceToday == AttendanceYesterday"></i>
          </div>
          <div class="bottom2">昨日{{AttendanceYesterday}}%</div>
        </div>
        <div class="card">
          <div class="text">学员满意度{{scoreToday}}%</div>
          <div class="trend">
            <i class="el-icon-li-xiajiang down3" v-if="(scoreToday - scoreYestday)<0"></i>
            <i class="el-icon-li-shangsheng up3" v-if="(scoreToday - scoreYestday)>0"></i>
            <i class="el-icon-minus balance3" v-if="(scoreToday - scoreYestday) == 0"></i>
          </div>
          <div class="bottom3">昨日{{scoreYestday}}%</div>
        </div>
      </div>
      <div class="screenBox">
        <div class="title">思教仁机构：</div>
        <div class="top-tools">
          <el-form :model="editForm" label-width="100px" :inline="true" ref="editForm">
            <el-form-item>
              <!-- <el-input v-model="editForm.chargeCollegeId" placeholder="请输入承接学院" size="small" clearable></el-input> -->
              <el-cascader
                placeholder="请选择承接学院"
                clearable
                size="small"
                v-model="editForm.chargeCollegeId"
                :props="props"
                change-on-select
                :options="departList1"
                @change="handleChange1"
              ></el-cascader>
            </el-form-item>
            <el-form-item>
              <!-- <el-input v-model="editForm.chargeFamilyId" placeholder="请输入承接家族" size="small" clearable></el-input> -->
              <el-cascader
                placeholder="请输入承接家族"
                clearable
                size="small"
                v-model="editForm.chargeFamilyId"
                :props="props"
                change-on-select
                :options="departList2"
                @change="handleChange2"
              ></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-select v-model="editForm.LiveBroadcastOperator" placeholder="请选择直播运营商" clearable>
                <el-option
                  v-for="item in option12"
                  :key="item.value"
                  :label="item.LiveBroadcastOperator"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="editForm.timeName" placeholder="请输入教学单元" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item :rules="[{ required: true, message: '请输入授课老师', trigger: 'blur' }]">
              <el-select placeholder="请选择授课老师" filterable v-model="editForm.teacherId" clearable>
                <el-option
                  v-for="item in option5"
                  :key="item.value"
                  :label="item.userName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-button type="primary" class="search" @click="getDatalist">查询</el-button>
            <!-- <el-button class="export">导出</el-button> -->
          </el-form>
        </div>
      </div>
      <div class="tablelist">
        <el-table
          :data="users"
          border
          highlight-current-row
          stripe
          v-loading="loading"
          style="width: 100%;"
        >
          <el-table-column align="center" label="直播时间">
            <template slot-scope="scope">
              <span class="playStatus" v-if="scope.row.liveStatus == 1" style="background:#3bb3ff">
                <i class="el-icon-li-zhengzaizhibo">&nbsp;</i>直播中
              </span>
              <span class="playStatus" v-if="scope.row.liveStatus === 0" style="background:#ff8888">
                <i class="el-icon-li-daizhibo"></i>&nbsp;待直播
              </span>
              <span class="playStatus" v-if="scope.row.liveStatus === 2" style="background:#CCCCCC">
                <i class="el-icon-li-zhibojieshu"></i>&nbsp;已结束
              </span>
              <div
                class="time"
              >{{scope.row.startDateStr}} {{scope.row.classWeek}} {{scope.row.hours}}小时</div>
              <h1 style="color:#426cb1">{{scope.row.startTimeStr}}-{{scope.row.endTimeStr}}</h1>
              <div class="countDown">开始倒计时 {{timeArr[scope.$index]}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="教学单元">
            <template slot-scope="scope">
              <div class="title">{{scope.row.timeName}}</div>
              <el-button
                size="small"
                @click="attendanceRateView(scope.row,scope.$index)"
                :attendanceRateInfo="attendanceRateInfo"
              >出勤率 {{scope.row.livePercent}}%</el-button>
              <el-button
                size="small"
                @click="satisfaction(scope.row,scope.$index)"
              >满意度 {{scope.row.surePercent ==null? 0:scope.row.surePercent}}%</el-button>
              <div class="character">
                <span>上课老师:{{scope.row.teacherName}}</span>
                <span>物理直播间:{{scope.row.roomName}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="教学配套">
            <template slot-scope="scope">
              <div class="text">
                <span>课件</span>
               
      
                   <span @click="editCourseUrl(scope.row)"
                  :class="scope.row.falg?'blue':'red'"
                >{{scope.row.falg?'已配置':'未配置'}}</span>
                
               
              </div>
              <div class="text">
                <span>随堂考</span>
                <el-button size="mini">统计</el-button>
              </div>
              <div class="text">
                <span>作业</span>
                <el-button size="mini" class="statistics">统计</el-button>
              </div>
              <!-- <div class="text">
                <span>优惠券</span>
                <span :class="scope.row.type2==0?'blue':'red'">{{scope.row.type2==0?'已配置':'未配置'}}</span>
              </div>-->
              <!-- <el-button
                style="width: 60%;"
                @click="editCourseUrl(scope.row,scope.$index)"
                class="config"
              >配 置</el-button> -->
              <el-button
                style="width: 60%;"
                @click="configuration(scope.row,scope.$index)"
                class="config"
              >配 置</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="直播间">
            <template slot-scope="scope">
              <div class="top">
                <span>欢拓科技</span>
                <el-button type="info" class="switch">切换运营商</el-button>
              </div>
              <div>
                <el-button type="primary" plain @click="StudentLivingRoom(scope.row)">学员直播间</el-button>
                <el-button type="primary" plain @click.native="assistant(scope.row)">助教直播间</el-button>
                <!-- <el-button type="primary" plain
                  size="medium"
                  v-clipboard:copy="copyText"
                  v-clipboard:success="onCopy"
                v-clipboard:error="onError">邀请试听</el-button>-->
              </div>
              <el-button
                type="info"
                class="teacher_live"
                style="width: 70%;margin: 15px;"
                @click="enterLiveRoom(scope.row)"
              >进入教师直播间</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 15, 20]"
            :current-page="editForm.curPage"
            :page-size="editForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      center
      :visible.sync="dialogFormVisible"
      :width="selectWidth"
    >
      <Configuration v-if="dialogStatus ==  'configuration'" :config="config" ref="children" />
      <AttendanceRateView v-if="dialogStatus =='AttendanceRateView'" :timeId="timeId" />
      <Satisfaction v-if="dialogStatus == 'satisfaction'" :timeIdInfo="timeIdInfo" />
      <EditUploadExcle v-if="dialogStatus == 'EditUploadExcle'" :edit ='edit' ref="children" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle" v-if="dialogStatus =='configuration'">取 消</el-button>
        <el-button @click="delExcle" v-if="dialogStatus =='EditUploadExcle'">删除</el-button>
        <el-button
          type="primary"
          @click="enSure(dialogStatus)"
          v-if="dialogStatus =='configuration'"
        >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal='false' title="课件明细" :visible.sync="isShowEdit" v-if="isShowEdit" :before-close='close' center width='680px'>
			<courseware :id="buzId"></courseware>
		</el-dialog>
  </div>
</template>
<script>
import Swiper from "swiper";
import Configuration from "./configuration";
import AttendanceRateView from "./attendanceRateView";
import Satisfaction from "./satisfaction";
import EditUploadExcle from './editUploadExcle';
import Courseware from './courseware'
import listMixin from "@/api/list";
import { workBeachByTeacherReport } from "../../api/api";
import {
  teacherByLaunch,
  assistantByAccess,
  teacherByPlayBack,
  assistantByPlayBack,
  studentByAccess,
  studentByPlayBack
} from "../../api/api";
export default {
  mixins: [listMixin],
  components: {
    Configuration,
    AttendanceRateView,
    Satisfaction,
    EditUploadExcle,
    Courseware
  },
  data() {
    return {
      // filters: {
      //   curPage: 1,
      //   pageSize: 5,
      //   busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      // },
      isShowEdit:false,
      buzId:'',
      editForm: {
        curPage: 1,
        pageSize: 5,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      textMap: {
        configuration: "配置",
        AttendanceRateView: "出勤率详情",
        satisfaction: "满意度详情",
        EditUploadExcle:'修改上传文件'
      },
      copyText: "欢迎访问 Dream_xu 的博客！",
      apiName: "system/api/courseTurnsTime/listCourseTurnsTime",
      dialogFormVisible: false,
      dialogStatus: null,
      statistics: {},
      week: new Date().getDay(),
      filter: {
        dayTime: new Date().toISOString().substring(0, 10)
      },
      props: {
        value: "id",
        label: "label",
        children: "children",
        expandTrigger: "hover"
      },
      loading: false,
      type1: null,
      config: null,
      users: [],
      option12: [],
      option13: [],
      departList1: [],
      departList2: [],
      departList3: [],
      option5: [],
      total: 0,
      page: 1,
      hr: 0,
      min: 0,
      sec: 0,
      mesc: "",
      timeArr: [],
      timer: {},
      AttendanceToday: null,
      AttendanceYesterday: null,
      scoreToday: null,
      scoreYestday: null,
      sta: null,
      attendanceRateInfo: null,
      selectWidth: null,
      timeId: null,
      timeIdInfo: null,
      msgFormSon: null,
      edit:null,
      arr:[],
    };
  },
  // filters: {
  // 	countDownChange(dataStr) {

  // 		// return value;
  // 	}
  // },
  watch: {
    mesc: {
      deep: true,
      // immediate: true,
      handler(newVal, oldVal) {
        if (oldVal == 0) {
          setTimeout(() => {
            // this.editForm.dayTime = this.filter.dayTime
            this.getLists();
          }, 10000);
        }
        // if(newVal<0){
        //   clearTimeout(this.timer)
        // }
      }
    },
    "filter.dayTime": {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        // console.log(newVal, oldVal, "时间出来了");
        this.getLists();
        let params = {
          dayTime: newVal,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        };
        workBeachByTeacherReport(params).then(res => {
          if (res.code === 30000) {
            //  console.log(res)
             this.arr = res.result;
            this.arr.forEach((item,i)=>{
              if(item.dayTime == newVal){
                 
                return this.statistics = item
              }
            })
            this.getData()
           console.log(this.statistics,newVal,1111)
            var AttendanceToday1 = (
              this.statistics.thisDayLiveNoIsAttend /
              this.statistics.thisDayLiveNo
            ).toFixed(1);
            var AttendanceYesterday1 = (
              this.statistics.beforeDayLiveNoIsAttend /
              this.statistics.beforeDayLiveNo
            ).toFixed(1);
            var scoreToday1 = (
              this.statistics.thisDayScore / this.statistics.thisDayTotalMark
            ).toFixed(1);
            var scoreYestday1 = (
              this.statistics.beforeDayScore /
              this.statistics.beforeDayTotalMark
            ).toFixed(1);

            this.scoreToday =
              window.isNaN(scoreToday1) == true ? 0 : scoreToday1 * 100;
            this.scoreYestday =
              window.isNaN(scoreYestday1) == true ? 0 : scoreYestday1 * 100;

            this.AttendanceToday =
              window.isNaN(AttendanceToday1) == true
                ? 0
                : AttendanceToday1 * 100;
            this.AttendanceYesterday =
              window.isNaN(AttendanceYesterday1) == true
                ? 0
                : AttendanceYesterday1 * 100;
          }
        });
      }
    }
  },

  methods: {
    // getMsgFormSon(data){
    //   console.log(data,'12313')
    //     this.msgFormSon = data
    //   //  alert(this.msgFormSon)
    // },
    close(){
      this.getLists()
      this.isShowEdit = false
    },
    delExcle(){
        this.dialogStatus = "";
        this.dialogFormVisible = false;
        this.$refs.children.del();
        setTimeout(() => {
          this.getLists();
        });
    },
    editCourseUrl(row){
      this.buzId = row.id
      this.isShowEdit = true
    },
    onCopy() {
      this.$message.success("复制成功");
    },
    onError() {
      this.$message.console.error("复制失败");
    },
    async getDepartList() {
      let { data } = await this.$fetch({
        url: "system/api/departTree",
        method: "post",
        data: {
          subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        this.departList1 = data.result;
      } else {
        this.$message.warning(data.message);
      }
    },
    handleChange1(val) {
      this.editForm.chargeCollegeId = val[val.length - 1]
        ? val[val.length - 1]
        : 0;
      this.editForm.chargeFamilyId = "";
      this.editForm.chargeOperateId = "";
      this.getDepartList2(this.editForm.chargeCollegeId, 1);
    },
    handleChange2(val) {
      this.editForm.chargeFamilyId = val[val.length - 1]
        ? val[val.length - 1]
        : 0;
    },
    async getDepartList2(id, index) {
      let { data } = await this.$fetch({
        url: "system/api/departTreeByDepartId",
        method: "post",
        data: {
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
          departId: id
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        if (index == 1) {
          this.departList2 = data.result;
        }
        if (index == 2) {
          this.departList3 = data.result;
        }
      } else {
        this.$message.warning(data.message);
      }
    },
    attendanceRateView(row, index) {
      this.dialogFormVisible = true;
      this.dialogStatus = "AttendanceRateView";
      this.selectWidth = 1000 + "px";
      this.timeId = {
        timeId: row.id
      };
    },
    satisfaction(row, index) {
      this.dialogFormVisible = true;
      this.dialogStatus = "satisfaction";
      this.selectWidth = 1000 + "px";
      this.timeIdInfo = {
        timeId: row.id
      };
      console.log(this.timeIdInfo, 456465);
    },
    cancle() {
      this.dialogStatus = "";
      this.dialogFormVisible = false;
    },
    enSure(dialogStatus) {
      if (dialogStatus == "configuration") {
        this.dialogStatus = "";
        this.dialogFormVisible = false;
        this.$refs.children.saveConfig();
        setTimeout(() => {
          this.getLists();
        },500);
      }
    },
    configuration(row, index) {
      this.dialogFormVisible = true;
      this.dialogStatus = "configuration";
      this.selectWidth = 550 + "px";
      this.config = {
        id: row.id,
        courseUrl: row.courseUrl
      };
    },
    countdown() {
      this.timeArr = [];
      for (let i = 0; i < this.users.length; i++) {
        var time = this.users[i].startTimeStr1;
        const end = Date.parse(new Date(time));
        const now = Date.parse(new Date());

        let msec = end - now;
        this.mesc = end - now;
        if (msec <= 0) {
          // this.getList()
          msec = 0;
        }
        let dd = parseInt(msec / 1000 / 60 / 60 / 24);
        let hr = parseInt((msec / 1000 / 60 / 60) % 24);
        let min = parseInt((msec / 1000 / 60) % 60);
        let sec = parseInt((msec / 1000) % 60);
        this.dd = dd > 0 ? dd + "天" : "";
        this.hr = (hr > 9 ? hr : "0" + hr) + ":";
        this.min = (min > 9 ? min : "0" + min) + ":";
        this.sec = sec > 9 ? sec : "0" + sec;
        const that = this;
        var timestart = that.dd + that.hr + that.min + that.sec;
        that.timeArr.push(timestart);
      }
      const that = this;

      this.timer = setTimeout(() => {
        that.countdown();
      }, 1000);
      // if (that.msec <= 0) {

      // }
    },
    setTime() {
      if (this.filter.dayTime == null) {
        this.week = new Date().getDay();
      } else {
        this.week = new Date(this.filter.dayTime).getDay();
      }
       
      // console.log(this.week);
    },
    setDate(index) {
      const date = new Date(this.filter.dayTime);
      this.week =  index;
      date.setTime(
        date.getTime() -
          3600 * 1000 * 24 * (new Date(this.filter.dayTime).getDay() - index)
      );
      console.log(date.getDay(),index);
      
      this.filter.dayTime = date.toISOString().substring(0, 10);
      // this.getData()
    },
    goToday() {
      const date = new Date();
      this.filter.dayTime = date.toISOString().substring(0, 10);
      this.week = new Date().getDay();
      // this.getData()
      
    },
    getData(){
      const date = new Date(this.filter.dayTime);
      var index = this.week
      var time1 = date.getTime() - 3600 * 1000 * 24*(index-1)
      time1 = this.msToDate(time1).withoutTime
      this.filter.dayTime1  = time1
      this.arr.forEach((item,i)=>{
        if(item.dayTime == this.filter.dayTime1){
          return this.filter.course1 = item.thisDayCountCourse
        }
      })
      var time2 = date.getTime() - 3600 * 1000 * 24*(index-2)
      time2 = this.msToDate(time2).withoutTime
      this.filter.dayTime2  = time2
      this.arr.forEach((item,i)=>{
        if(item.dayTime == this.filter.dayTime2){
          return this.filter.course2 = item.thisDayCountCourse
        }
      })
      var time3 = date.getTime() - 3600 * 1000 * 24*(index-3)
      time3 = this.msToDate(time3).withoutTime
      this.filter.dayTime3  = time3
      this.arr.forEach((item,i)=>{
        if(item.dayTime == this.filter.dayTime3){
          return this.filter.course3 = item.thisDayCountCourse
        }
      })
      var time4 = date.getTime() - 3600 * 1000 * 24*(index-4)
      time4 = this.msToDate(time4).withoutTime
      this.filter.dayTime4 = time4
      this.arr.forEach((item,i)=>{
        if(item.dayTime == this.filter.dayTime4){
          return this.filter.course4 = item.thisDayCountCourse
        }
      })
      var time5 = date.getTime() - 3600 * 1000 * 24*(index-5)
      time5 = this.msToDate(time5).withoutTime
      this.filter.dayTime5 = time5
      this.arr.forEach((item,i)=>{
        if(item.dayTime == this.filter.dayTime5){
          return this.filter.course5 = item.thisDayCountCourse
        }
      })
      var time6 = date.getTime() - 3600 * 1000 * 24*(index-6)
      time6 = this.msToDate(time6).withoutTime
      this.filter.dayTime6 = time6
      this.arr.forEach((item,i)=>{
        if(item.dayTime == this.filter.dayTime6){
          return this.filter.course6 = item.thisDayCountCourse
        }
      })
      
      var time7 = date.getTime() - 3600 * 1000 * 24*(index-0)
      time7 = this.msToDate(time7).withoutTime
      this.filter.dayTime7 = time7
      this.arr.forEach((item,i)=>{
        if(item.dayTime == this.filter.dayTime7){
          return this.filter.course7 = item.thisDayCountCourse
        }
      })
    },
    msToDate (msec) {
          let datetime = new Date(msec);
          let year = datetime.getFullYear();
          let month = datetime.getMonth();
          let date = datetime.getDate();
          let hour = datetime.getHours();
          let minute = datetime.getMinutes();
          let second = datetime.getSeconds();

          let result1 = year + 
                      '-' + 
                      ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + 
                      '-' + 
                      ((date) < 10 ? '0' + date : date) + 
                      ' ' + 
                      ((hour ) < 10 ? '0' + hour : hour) +
                      ':' + 
                      ((minute) < 10 ? '0' + minute : minute) + 
                      ':' + 
                      ((second) < 10 ? '0' + second : second);

          let result2 = year + 
                      '-' + 
                      ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + 
                      '-' + 
                      ((date) < 10 ? '0' + date : date);

          let result = {
              hasTime: result1,
              withoutTime: result2
          };

          return result;
      },

    // prev(time){
    // 	const date = new Date();
    // 	date.setTime(date.getTime() - 3600 * 1000 * 24*7);
    // 	console.log(date,111)
    // 	this.filters.birth = date
    // },
    // next(time){
    // 	const date = new Date();
    // 	date.setTime(date.getTime() + 3600 * 1000 * 24*7);
    // 	console.log(date,222)
    // 	this.filters.birth = date
    // },
    init() {
      var swiper = new Swiper(".swiper-container", {
        slidesPerView: 7,
        spaceBetween: 2,
        slidesPerGroup: 7,
        // loop : true,
        noSwiping: true,
        noSwipingClass: "stop-swiping",
        navigation: {
          nextEl: ".next",
          prevEl: ".prev"
        }
      });
    },
    clear() {
      this.editForm = {};
    },
    handleSizeChange(val) {
      this.editForm.pageSize = val;
      this.getLists();
    },
    handleCurrentChange(val) {
      this.editForm.curPage = val;
      this.getLists();
    },
    getDatalist(){
			this.editForm.curPage = 1
			this.getLists()
		},
    //获取用户列表
    async getLists() {
      this.loading = true;
      this.editForm.dayTime = this.filter.dayTime;
      let { data } = await this.$fetch({
        url: this.apiName,
        method: "post",
        data: this.editForm
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
        this.loading = false;
      });
      if (data.code == 30000) {
        this.users = data.result.content;
        this.users.map(v => {
          this.sta = v.liveStatus;
          return false;
        });
        this.countdown();
        this.list = data.result;
        this.total = data.result.total;
        this.loading = false;
      } else {
        this.$message.warning(data.message);
        this.loading = false;
      }
    },
    //讲师
    enterLiveRoom(row) {
      let loginId = JSON.parse(sessionStorage.getItem("userInfo")).uc.id;
      // if (row.teacherId !== loginId) {
      //   this.$message({
      //     message: "您的身份不是讲师，无法进入该直播间！",
      //     type: "warning"
      //   });
      //   return false;
      // }
      if (row.liveStatus === 1) {
        // if (row.teacherId === JSON.parse(sessionStorage.getItem("userInfo")).uc.id) {
        let params = {
          teacherId: row.teacherId,
          // assistantId: row.assistantId,
          id: row.id
        };
        teacherByLaunch(params).then(res => {
          if (res.code === 30000) {
            window.open(res.result.url);
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        });
      } else if (row.liveStatus === 0) {
        this.$message({
          message: "直播未开始，请耐心等候！",
          type: "success"
        });
      } else if (row.liveStatus === 2) {
        this.$message({
          message: "迟到了哟，直播已结束。可以看直播回访学习",
          type: "warning"
        });
        setTimeout(() => {
          let params = {
            teacherId: row.teacherId,
            // assistantId: row.assistantId,
            id: row.id
          };
          teacherByPlayBack(params).then(res => {
            if (res.code === 30000) {
              console.log("进入回放");
              window.open(res.result.url);
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        }, 1000);
      }
    },
    //助教
    assistant(row) {
      if (row.liveStatus === 1) {
        let params = {
          teacherId: row.teacherId,
          // teacherId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
          // assistantId: row.assistantId,
          id: row.id
        };
        assistantByAccess(params).then(res => {
          if (res.code === 30000) {
            window.open(res.result.liveUrl);
          }
        });
      } else if (row.liveStatus === 0) {
        this.$message({
          message: "直播未开始，请耐心等候！",
          type: "success"
        });
      } else {
        this.$message({
          message: "迟到了哟，直播已结束。可以看直播回访",
          type: "warning"
        });
        setTimeout(() => {
          let params = {
            teacherId: row.teacherId,
            // teacherId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
            // assistantId: row.assistantId,
            id: row.id
          };
          assistantByPlayBack(params).then(res => {
            if (res.code === 30000) {
              // console.log("进入回放");
              window.open(res.result.playbackUrl);
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        }, 1000);
      }
    },
    //学生
    StudentLivingRoom(row) {
      if (row.liveStatus === 1) {
        let params = {
          // teacherId: row.teacherId,
          // studentId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
          studentId: 1,
          // assistantId: row.assistantId,
          id: row.id,
          flag: 0
        };
        studentByAccess(params).then(res => {
          if (res.code === 30000) {
            window.open(res.result.url);
          }
        });
      } else if (row.liveStatus === 0) {
        this.$message({
          message: "直播未开始，请耐心等候！",
          type: "success"
        });
      } else {
        this.$message({
          message: "迟到了哟，直播已结束。可以看直播回访",
          type: "warning"
        });
        setTimeout(() => {
          let params = {
            // studentId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
            studentId: 1,
            id: row.id,
            flag: 0
          };
          studentByPlayBack(params).then(res => {
            if (res.code === 30000) {
              // console.log("进入回放");
              window.open(res.result.url);
            } else {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
        }, 1000);
      }
    }
  },
  mounted() {
    // this.getLists();
    // this.countdown()
    this.init();
    this.getDepartList();
    this.getCode();
    // this.getData()
    // this.getUser();
  }
};
</script>
<style lang="scss" scoped>
.el-button {
  border: 1px solid #426cb1 !important;
}
.trend {
  margin-left: 140px;
}
.down {
  font-size: 25px;
  color: pink;
  position: absolute;
  top: 70px;
  left: 145px;
}
.up {
  font-size: 25px;
  color: pink;
  position: absolute;
  left: 145px;
  top: 60px;
}
.balance {
  font-size: 25px;
  color: pink;
  position: absolute;
  left: 145px;
  top: 60px;
}
.down1 {
  font-size: 25px;
  color: #0099ff;
  position: absolute;
  top: 70px;
  left: 145px;
}
.up1 {
  font-size: 25px;
  color: #0099ff;
  position: absolute;
  left: 145px;
  top: 60px;
}
.balance1 {
  font-size: 25px;
  color: #0099ff;
  position: absolute;
  left: 145px;
  top: 60px;
}
.down2 {
  font-size: 25px;
  color: #ffcc00;
  position: absolute;
  top: 70px;
  left: 145px;
}
.up2 {
  font-size: 25px;
  color: #ffcc00;
  position: absolute;
  left: 145px;
  top: 60px;
}
.balance2 {
  font-size: 25px;
  color: #ffcc00;
  position: absolute;
  left: 145px;
  top: 60px;
}
.down3 {
  font-size: 25px;
  color: #ff99ff;
  position: absolute;
  top: 70px;
  left: 145px;
}
.up3 {
  font-size: 25px;
  color: #ff99ff;
  position: absolute;
  left: 145px;
  top: 60px;
}
.balance3 {
  font-size: 25px;
  color: #ff99ff;
  position: absolute;
  left: 145px;
  top: 60px;
}
.config {
  color: #eee;
  background: #426cb1;
}
.search {
  background: #426cb1;
}
.export {
  color: #426cb1;
}
.switch {
  color: #426cb1;
  background: #eee;
}
.playStatus {
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  position: absolute;
  top: 10px;
  left: 0px;
}
.teacher_live {
  // color: #426cb1;
  color: #eee;
  background: #426cb1;
}
.statistics {
  margin-left: 17px !important;
}
.el-button--small:hover {
  opacity: 0.8;
}
.bottom1 {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  opacity: 0.6;
  color: white;
  background: black;
}
.bottom2 {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  opacity: 0.6;
  color: white;
  background: black;
}
.bottom3 {
  position: absolute;
  bottom: 0;
  color: white;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  opacity: 0.6;
  background: black;
}
.swiper-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topBox {
  display: flex;
  justify-content: space-between;
}
.prev,
.next {
  position: relative;
  z-index: 2;
}
.swiper-wrapper {
   display: flex;
    justify-content: space-around;
  width: 100%;
  // left: 10%;
  .swiper-slide {
    position: relative;
    width: 13% !important;
    // height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
  }
  .selected {
    border: 1px solid rgb(93, 190, 255);
    color: rgb(93, 190, 255);
    line-height: 30px;
  }
  .select {
    border: 1px solid #ccc;
    line-height: 30px;
  }
}
.statis {
  display: flex;
  margin: 30px;
  justify-content: space-around;
  .card {
    position: relative;
    width: 22%;
    height: 150px;
    border: 1px #ccc solid;
    .bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      opacity: 0.6;
      color: white;
      background: black;
    }
    .text {
      margin: 20px 10px;
    }
    .text1,
    .text2,
    .text3 {
      width: 30%;
      float: left;
      margin: 20px 1.5%;
    }
    .text4 {
      margin: 0 1.5%;
    }
  }
}
.screenBox {
  width: 100%;
  margin: 10px 0;
  min-height: 50px;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  display: flex;
  .title {
    width: 120px;
  }
  .top-tools {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .el-input,
    .el-select {
      width: 220px;
      margin: 0 20px 10px;
    }
  }
}
.tablelist {
  margin-top: 20px;
  .time {
    margin: 10px;
    font-size: 16px;
    font-family: "微软雅黑";
  }
  .countDown {
    width: 70%;
    margin-left: 15%;
    margin-top: 15px;
    padding: 5px 0;
    font-size: 16px;
    text-align: center;
    border: 1px #ccc solid;
    background: #eee;
    font-family: "微软雅黑";
  }
  .title,
  .character,
  .text,
  .top {
    font-size: 16px;
    margin: 15px;
    span {
      margin-right: 15px;
    }
    .blue {
      font-size: 12px;
      color: blue;
      cursor: pointer;
    }
    .red {
      font-size: 12px;
      color: red;
      cursor: pointer;
    }
  }
  .text {
    font-size: 16px;
    margin: 10px;
  }
  .top {
    width: 70%;
    margin-left: 15%;
    padding: 10px 0;
    background: #eee;
  }
}
</style>
<style>
.el-dialog__title {
  color: #fff !important;
}
</style>
