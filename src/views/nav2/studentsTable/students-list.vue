<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 学员大表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cont">
      <div class="box">
        <div class="title">学员归属：</div>
        <div class="top-tools">
          <!-- <el-select v-model="filters.item1" placeholder="请选择学院" clearable>
            <el-option label="1" value="0"></el-option>
            <el-option label="2" value="1"></el-option>
          </el-select>-->
          <div class="block" style="width:217px;margin-left:20px;">
            <!-- <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader> -->
            <el-cascader
              placeholder="请选择承接学院"
              clearable
              size="small"
              v-model="filters.chargeCollegeId"
              :props="props"
              change-on-select
              :options="departList1"
              @change="handleChange1"
            ></el-cascader>
          </div>
          <div style="margin-left:42px;">
            <el-cascader
              placeholder="请输入承接家族"
              clearable
              size="small"
              v-model="filters.chargeFamilyId"
              :props="props"
              change-on-select
              :options="departList2"
              @change="handleChange2"
            ></el-cascader>
          </div>
          <!-- <el-input v-model="filters.name1" placeholder="请输入班主任" size="small" clearable></el-input> -->
          <div style="margin-left:42px;">
            <el-cascader
              clearable
              size="small"
              v-model="filters.chargeOperateId"
              :props="props"
              change-on-select
              :options="departList3"
              @change="handleChange3"
              placeholder="请输入运营组"
            ></el-cascader>
          </div>
          <!-- <div>
            <el-select v-model="filters.userName" placeholder="请输入承接人" clearable filterable>
              <el-option
                v-for="(item,index) in roleList"
                :key="index"
                :label="item.userName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div> -->
          <div style="margin-left:25px;">
            <el-select
              v-model="filters.firstId"
              placeholder="请选择一级项目"
              clearable
              @change="getoption2"
            >
              <el-option
                v-for="item in option1"
                :key="item.value"
                :label="item.firstName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>

          <el-select v-model="filters.secondId" placeholder="请选择二级项目" clearable @change="getGoods">
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="filters.goodsId" placeholder="请选择班型商品" clearable>
            <el-option
              v-for="item in option15"
              :key="item.value"
              :label="item.goodsName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="filters.campusId" placeholder="请选择项目地区" clearable>
            <el-option
              v-for="item in option3"
              :key="item.value"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-select v-model="filters.item2" placeholder="考试计划" clearable>
            <el-option label="专科" value="0"></el-option>
            <el-option label="本科" value="1"></el-option>
          </el-select>-->

          <el-input v-model="filters.studentName" placeholder="请输入姓名" size="small" clearable></el-input>
          <el-input v-model="filters.classPhone" placeholder="请输入手机号码" size="small" clearable></el-input>
          <el-input v-model="filters.certificateCode" placeholder="请输入身份证号" size="small" clearable></el-input>
        </div>
      </div>
      <!-- <div class="box">
        <div class="title">业务指标：</div>
        <div class="top-tools">
          <el-select v-model="filters.item1" placeholder="是否完成客服前置" clearable>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
          <el-input v-model="filters.name" placeholder="NPS打分" size="small" clearable></el-input>
          <el-input v-model="filters.text1" placeholder="直播时长" size="small" clearable></el-input>
          <el-input v-model="filters.text2" placeholder="录播时长" size="small" clearable></el-input>
          <el-input v-model="filters.text3" placeholder="直播出勤率" size="small" clearable></el-input>
          <el-input v-model="filters.text4" placeholder="做题数量" size="small" clearable></el-input>
          <el-input v-model="filters.text5" placeholder="做题正确率" size="small" clearable></el-input>
          <el-input v-model="filters.text6" placeholder="持续休眠天数" size="small" clearable></el-input>
        </div>
      </div>-->
      <div class="box">
        <div class="title">订单完成时间：</div>
        <div class="top-tools" style="padding-left:20px;">
          <!-- <el-select  placeholder="是否完成客服前置" clearable>
          </el-select>-->
          <!-- <el-date-picker
            v-model="filters.registDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="报名时间"
          ></el-date-picker>-->
          <el-date-picker
            v-model="value1"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <div style="width: 300px">
          <el-button type="primary" @click="filterList">搜索</el-button>
          <el-button type="primary" @click="clear">重置</el-button>
          <el-button type="primary" icon="el-icon-download" @click="downExcel"></el-button>
        </div>
      </div>
    </div>
    <!--列表-->
    <div class="container">
      <div style="margin: 10px 0;height: 40px;">
        <el-button type="primary" @click="showEdit()">转花名</el-button>
        <el-button type="primary" @click="giftService(1)">导入赠品</el-button>
        <el-button type="primary" @click="download">下载赠品模版</el-button>
        <el-button type="primary" @click="giftService(2)">导入轮次</el-button>
        <el-button type="primary" @click="download2">下载轮次模版</el-button>
      </div>
      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        @selection-change="selsChange"
        style="width: 100%;"
      >
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="studentId" label="学员ID"></el-table-column>
        <!-- <el-table-column align="center" prop="studentName" label="姓名"></el-table-column> -->
        <el-table-column align="center" prop="studentName" label="姓名">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="seeDetails(scope.$index, scope.row)"
            >{{scope.row.studentName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="classPhone" label="手机号"></el-table-column>
        <el-table-column align="center" prop="registDate" label="报名时间" sortable></el-table-column>
        <!-- <el-table-column align="center" prop="subject" label="班型"></el-table-column> -->
        <el-table-column align="center" prop="chargeCollegeName" label="学院"></el-table-column>
        <el-table-column align="center" prop="chargeFamilyName" label="家族"></el-table-column>
        <el-table-column align="center" prop="chargeOperateName" label="运营组"></el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品" width='150'></el-table-column>
        <!-- <el-table-column align="center" prop="isContact" label="是否通知" :formatter='formatType'></el-table-column> -->
        <el-table-column align="center" prop="label" label="标签" width='150'>
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="editLabel(scope.$index, scope.row)"
              v-if="scope.row.label==''||scope.row.label==null"
            >添加标签</el-button>
            <el-button
              size="small"
              type="text"
              v-else
              @click="editLabel(scope.$index, scope.row)"
              class="tips"
            >{{scope.row.label}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="province" label="项目地区">
          <template slot-scope="scope">
            <el-button type="text" @click="editProvince(scope.row,scope.$index)" v-if="scope.row.campusName==''||scope.row.campusName==null">修改地区</el-button>
            <el-button type="text" @click="editProvince(scope.row,scope.$index)" v-else>{{scope.row.campusName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="teacherName" label="班主任"></el-table-column>
        <el-table-column align="center" prop="examDate" label="考期">
          <template slot-scope="scope">
            <el-button type="text" @click="editExamDate(scope.row,scope.$index)"  v-if="scope.row.examDate==''||scope.row.examDate==null">修改考期</el-button>
            <el-button type="text" @click="editExamDate(scope.row,scope.$index)" v-else>{{scope.row.examDate}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="npsSize" label="最新NPS分值"></el-table-column>
        <el-table-column align="center" prop="timeDays" label="连续缺勤直播天数"></el-table-column>
        <el-table-column align="center" label="直播时长(h)">
          <template slot-scope="scope">
            <span>{{(scope.row.liveTime/60/60).toFixed(1)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="直播出勤率">
          <template slot-scope="scope">
            <span v-if="scope.row.liveAttend">{{scope.row.liveAttend*100}}%</span>
            <span v-if="scope.row.liveAttend ==null">0</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="liveAttend" label="录播时长" ></el-table-column> -->
        <el-table-column align="center" prop="questionSize" label="做题数量"></el-table-column>
        <el-table-column align="center" label="做题正确率">
          <template slot-scope="scope">
            <span v-if="scope.row.questionCorrectRate">{{scope.row.questionCorrectRate*100}}%</span>
            <span v-if="scope.row.questionCorrectRate==null">0</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否已联系学员">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-if="scope.row.isContact != 1"
              @click="changeIsContact(scope.row,scope.$index)"
            >未联系</el-button>
            <span v-if="scope.row.isContact == 1">已联系</span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="lackDutyDays" label="连续休眠天数"></el-table-column> -->
        <el-table-column align="center" prop="certificateCode" label="身份证号码"></el-table-column>
        <!-- <el-table-column align="center" prop="item2" label="售后工单"></el-table-column>
        <el-table-column align="center" prop="city" label="订单状态"></el-table-column>
        <el-table-column align="center" prop="item2" label="标签"></el-table-column>
        <el-table-column align="center" prop="city" label="开班电话"></el-table-column>-->
        <!-- <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>-->
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
    <el-dialog
      :close-on-click-modal="false"
      title="班主任调整"
      :visible.sync="isShowEdit"
      center
      width="450px"
    >
      <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
        <el-form-item
          label="班主任"
          prop="userId"
          :rules="[{ required: true, message: '请选择班主任', trigger: 'blur' }]"
        >
          <el-select
            v-model="userId"
            placeholder="请选择班主任"
            filterable
            clearable
            @change="selectUser"
          >
            <el-option
              v-for="item in option5"
              :key="item.value"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
        <el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
      </div>
    </el-dialog>
     <el-dialog
      :close-on-click-modal="false"
      title="项目地区修改"
      :visible.sync="isEditPro"
      center
      width="450px"
    >
      <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
        <el-form-item
          label="项目地区"
          prop="campusName"
          :rules="[{ required: true, message: '请选择项目地区', trigger: 'blur' }]"
        >
          <el-select
            v-model="campusName"
            placeholder="请选择项目地区"
            filterable
            clearable
            @change="selectPro"
          >
            <el-option
              v-for="item in option3"
              :key="item.value"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn2" @click.native="isEditPro=false">取消</el-button>
        <el-button class="btn2" type="primary" @click.native="isEditProice">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="考期修改"
      :visible.sync="isEditExam"
      center
      width="450px"
    >
      <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
        <el-form-item
          label="考期"
          prop="userId"
          :rules="[{ required: true, message: '请选择考期', trigger: 'blur' }]"
        >
          <el-select
            v-model="examTime"
            placeholder="请选择考期"
            filterable
            clearable
            @change="selectExam"
          >
            <el-option
              v-for="item in option30"
              :key="item.value"
              :label="item.examTime"
              :value="item.examTime"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn2" @click.native="isEditExam=false">取消</el-button>
        <el-button class="btn2" type="primary" @click.native="isEditExam1">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :title="keys==1?'导入赠品':'导入课次'"
      :visible.sync="isShowGife"
      center
      width="580px"
    >
      <el-form :model="rowsData" label-width="80px" ref="editForm">
        <el-form-item
          label="文件"
          prop="mergeId"
          :rules="[{ required: true, message: '请选择文件', trigger: 'blur' }]"
        >
          <el-upload
            :style="{'display': 'inline-block', 'maxWidth': '80%'}"
            class="upload-demo"
            :multiple="false"
            ref="upload"
            action
            :file-list="fileList"
            :on-change="exportExcel"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">{{tips}}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="isShowGife=false">取消</el-button>
        <el-button type="primary" @click.native="handleAdd">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="修改标签"
      :visible.sync="isShowCost"
      center
      width="480px"
    >
      <el-form label-width="80px" :inline="true" ref="editForm">
        <el-form-item style="margin-left:80px;padding-top:30px;">
          <!-- <el-input placeholder="请输入标签" v-model="label" clearable></el-input> -->
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{tag}}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" icon="el-icon-plus" @click="showInput"></el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="isShowCost=false">取消</el-button>
        <el-button type="primary" @click.native="saveSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { getUserList,getUserListPage } from '@/api/api';
//import NProgress from 'nprogress'
import listMixin from "@/api/list";
import {
  modifyIsContact,
  updateOrderDetail,
  modifyTeacher,
  exportStudentExcel,
  updateOrderDetail1
} from "../../../api/api";
// import Export from "../../../components/export/outData";
import { BASEURL } from "@/api/config";
import axios from "axios";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  mixins: [listMixin],
  components: {
  },
  data() {
    return {
      checked: true,
      examTime:'',
      dynamicTags: [],
      roleList: [],
      inputVisible: false,
      isEditPro:false,
      inputValue: "",
      filters: {
        curPage: 1,
        pageSize: 10,
        subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId
      },
      filter: {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      props: {
        value: "id",
        label: "label",
        children: "children",
        expandTrigger: "hover"
      },
      isShowCost: false,
      label: "",
      editForm: {},
      apiName: "system/api/region/queryAllProvince",
      apiStudentName: "system/api/orderDetail/listStudentExcel",
      apimodifyTeacherName: "system/api/orderDetail/modifyTeacher",
      apiexportStudentExcelName: "system/api/orderDetail/exportStudentExcel",
      departList1: [],
      departList2: [],
      departList3: [],
      option1: [],
      option2: [],
      option3: [],
      option5: [],
      option7:[],
      option15: [],
      userId: "",
      isShowEdit: false,
      loading: false,
      users: [],
      total: 0,
      page: 1,
      tips: "",
      rowsData: {},
      fileList: [],
      keys: 1,
      isShowGife: false,
      id: "",
      apiTeacherName: "system/api/queryAllUContact",
      userName: "",
      idArr: [],
      value1: "",
      option20:[],
      option30:[],
      isEditExam:false,
      edId:'',
      campusId:'',
      campusName: '',
      provinceData:{}
    };
  },
  methods: {
    selectExam(){},
    editExamDate(row,index){
        this.isEditExam = true
        this.edId =row.orderDetailId
        this.getExam1(row.firstId,row.secondId)
    },
    isEditExam1(){
      let params = {
        id:this.edId,
        examDate:this.examTime
      }
      updateOrderDetail1(params).then(res=>{
          if(res.code === 30000){
            this.getListStudent()
            this.isEditExam = false
          }else{

          }
      })
    }, 
     async getExam1(firstId,secondId) { 
            let { data } = await this.$fetch({
                url: 'system/api/exam/queryExamByFirstAndSecond',
                method: "post",
                data:{
                  firstId: firstId,
                  secondId: secondId,
                  busId:JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                }
            }).catch(error => {
                this.$message.error('system/api/exam/queryExamByFirstAndSecond' + "接口出错！");
            });
            if (data.code == 30000) {
                this.option30 = data.result
            }
        },
    async isEditProice() { 
            let { data } = await this.$fetch({
                url: 'system/api/orderDetail/updateOrderDetail',
                method: "post",
                data: {
                  id: this.provinceData.id,
                  campusId: this.campusId,
                  campusName: this.campusName
                }
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
              this.$message.success(data.message)
              this.getListStudent()
              this.isEditPro = false
            }
        },
    editProvince(row,index){
      this.campusName = row.campusName
      this.provinceData={
        id: row.orderDetailId,
        
      }
      this.isEditPro = true;
    },
    selectPro(){
      this.option3.forEach(item=>{
        if(this.campusName ==item.name){
          this.campusId = item.id
        }
      })
    },
    downExcel() {       
     let filters = {
        firstId: this.filters.firstId,
        secondId: this.filters.secondId,
        classPhone: this.filters.classPhone,
        studentName: this.filters.studentName,
        certificateCode: this.filters.certificateCode,
        campusId: this.filters.campusId,
        goodsId: this.filters.goodsId,
        chargeOperateId: this.filters.chargeOperateId,
        chargeFamilyId: this.filters.chargeFamilyId,
        chargeCollegeId: this.filters.chargeCollegeId,
        registDateStart: this.value1[0],
        registDateEnd: this.value1[1]
       }
       let url = BASEURL+`system/api/orderDetail/exportStudentExcel?busId=${JSON.parse(sessionStorage.getItem("userInfo")).uc.busId}`
       for(var key in filters){
         if(filters[key]){
           url += '&'+key+'='+filters[key]
         }
       }
       console.log(url)
       window.location.href = url 
    },
    filterList() {
      this.filters = {
        curPage:  this.filters.curPage,
        pageSize: this.filters.pageSize,
        subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
        firstId: this.filters.firstId,
        secondId: this.filters.secondId,
        classPhone: this.filters.classPhone,
        studentName: this.filters.studentName,
        certificateCode: this.filters.certificateCode,
        campusId: this.filters.campusId,
        goodsId: this.filters.goodsId,
        chargeOperateId: this.filters.chargeOperateId,
        chargeFamilyId: this.filters.chargeFamilyId,
        chargeCollegeId: this.filters.chargeCollegeId,
        registDateStart: this.value1[0],
        registDateEnd: this.value1[1]
      };
      this.getListStudent();
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      if (this.dynamicTags.length <5) {
        this.inputVisible = true;
        this.inputValue = "";
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      } else {
        this.$message({
          showClose: true,
          message: "最多只能添加五个标签",
          type: "warning"
        });
      }
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
        // this.dynamicTags = this.dynamicTags.join(',')
        // console.log(this.dynamicTags.join(','),'3413132')
      }
      this.inputVisible = false;
    },
    selectUser(value) {
      let obj = {};
      obj = this.option5.find(item => {
        return item.userId === value;
      });
      // let getName = "";
      this.userName = obj.userName;

      this.id = obj.id;
      // console.log(this.id,'Helloween');
    },
    download() {
      var url =
        "https://admin.video.sijiaoedu.com/transition/2019-08-30/2019083016383985赠品表.xlsx";
      this.$confirm("确定下载模版？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        window.open(url);
      });
    },
    async getTeacher() {
      this.loading = true;
      let { data } = await this.$fetch({
        url: this.apiTeacherName,
        method: "post",
        data: this.filter
      }).catch(error => {
        this.$message.error(this.apiTeacherName + "接口出错！");
        this.loading = false;
      });
      if (data.code == 30000) {
        this.option5 = data.result;
        this.loading = false;
      } else {
        this.$message.warning(data.message);
        this.loading = false;
      }
    },
    download2() {
      var url =
        "https://admin.video.sijiaoedu.com/transition/2019-09-04/201909041812027turns.xlsx";
      this.$confirm("确定下载模版？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        window.open(url);
      });
    },
    giftService(index) {
      this.isShowGife = true;
      this.rowsData = {};
      this.tips = "请导入";
      this.keys = index;
    },
    handleAdd() {
      if (this.keys == 1) {
        this.addGife();
      }
      if (this.keys == 2) {
        this.addLessons();
      }
    },
    async addGife() {
      const loading = this.$loading({
        lock: true,
        text: "上传中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      let param = new FormData();
      param.append("file", this.rowsData.file);
      let { data } = await axios({
        timeout: 1000 * 60,
        url: BASEURL + "system/api/giftResource/importGiftResource",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data: param
      }).catch(error => {
        this.$message.error("上传接口出错！");
        loading.close();
      });

      if (data.code == 30000) {
        loading.close();
        this.$message.success("上传成功！");
        this.isShowGife = false;
      } else {
        loading.close();
        this.$message.warning(data.message);
      }
    },
    async addLessons() {
      const loading = this.$loading({
        lock: true,
        text: "上传中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      let param = new FormData();
      param.append("file", this.rowsData.file);
      let { data } = await axios({
        timeout: 1000 * 60,
        url: BASEURL + "system/api/scheduleTime/introducingLessons",
        method: "post",
        headers: { "Content-Type": "multipart/form-data" },
        data: param
      }).catch(error => {
        this.$message.error("上传接口出错！");
        loading.close();
      });

      if (data.code == 30000) {
        loading.close();
        this.$message.success("上传成功！");
        this.isShowGife = false;
      } else {
        loading.close();
        this.$message.warning(data.message);
      }
    },
    async exportExcel(file, fileList) {
      this.$refs["upload"].clearFiles();
      this.rowsData.file = file.raw;
      console.log(this.rowsData.file, 111);
      this.tips = "已导入";
    },
    parClick() {
      this.$refs.out.outData();
    },
    editLabel(index, row) {
      this.id = row.orderDetailId;
      if(row.label == null){
        this.label = ''
        this.dynamicTags = []
      }else{
        this.label = row.label;
        this.dynamicTags = row.label.split(",");
      }
      this.isShowCost = true;
    },
    saveSubmit() {
      let params = {
        id: this.id,
        label: this.dynamicTags.join(",")
      };
      updateOrderDetail(params).then(res => {
        if (res.code === 30000) {
          this.getListStudent();
          this.isShowCost = false;
          this.dynamicTags = [];
        } else {
          this.$message(res.message);
        }
      });
    },
    // formatType(row, column) {
    //   return row.isContact == 1 ? "已通知" : "未通知";
    // },
    formatconntent(row, column) {
      return row.questionCorrectRate == 0 ? "未联系" : "已联系";
    },
    changeIsContact(row, index) {
      this.$confirm("是否确定修改？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        let params = {
          orderDetailId: row.orderDetailId,
          isContact: 1
        };
        modifyIsContact(params).then(res => {
          if (res.code === 30000) {
            console.log(res.message);
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.getListStudent();
          }
        });
      });
    },
    async getListStudent() {
      this.loading = true;
      // this.filters.orderStatus = 1
      let { data } = await this.$fetch({
        url: this.apiStudentName,
        method: "post",
        data: this.filters
      }).catch(error => {
        this.$message.error(this.apiStudentName + "接口出错！");
        this.loading = false;
      });
      if (data.code == 30000) {
        this.users = data.result.content;
        this.list = data.result;
        this.total = data.result.total;
        this.loading = false;
      } else {
        this.$message.warning(data.message);
        this.loading = false;
      }
    },
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    selsChange: function(sels) {
      // this.sels = sels;
      console.log(sels, "4545646556464");
      var arr = [];
      sels.map(v => {
        arr.push(v.orderDetailId);
      });
      this.idArr = Array.from(new Set(arr));
    },
    showEdit() {
      if (this.idArr.length != 0) {
        this.userId = "";
        this.isShowEdit = true;
        this.getTeacher();
      } else {
        this.$message({
          showClose: true,
          message: "请先选择要转的学员",
          type: "warning"
        });
      }
    },
    editSubmit() {
      let params = {
        orderDetailIds: this.idArr,
        teacherId: this.userId,
        teacherName: this.userName,
        ucId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
      };
      modifyTeacher(params).then(res => {
        if (res.code === 30000) {
          this.getListStudent();
          this.isShowEdit = false;
          this.$message({
            message: "班主任已调整成功",
            type: "success"
          });
        } else {
          this.$message(res.message);
        }
      });
      // this.$refs.editForm.validate(valid => {
      //   if (valid) {
      //     this.isShowEdit = false;
      //     this.$alert("已完成班主任调整", "提示", {
      //       confirmButtonText: "我知道了",
      //       center: true,
      //       callback: action => {}
      //     });
      //   }
      // });
    },
    // handleCurrentChange(val) {
    // 	this.page = val;
    // 	this.getUser();
    // },
    handleEdit() {},
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getListStudent();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getListStudent();
      console.log(`每页 ${val} 条`);
      console.log(`当前页: ${val}`);
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
      this.filters.chargeCollegeId = val[val.length - 1]
        ? val[val.length - 1]
        : null;
      this.filters.chargeFamilyId = "";
      this.filters.chargeOperateId = "";
      if(this.filters.chargeCollegeId){
         this.getDepartList2(this.filters.chargeCollegeId, 1);
      }
     
    },
    handleChange2(val) {
      this.filters.chargeFamilyId = val[val.length - 1]
        ? val[val.length - 1]
        : null;
        if(this.filters.chargeFamilyId){
        this.getDepartList2(this.filters.chargeFamilyId, 2);
        }
    },
    handleChange3(val) {
      this.filters.chargeOperateId = val[val.length - 1]
        ? val[val.length - 1]
        : null;
        if(this.filters.chargeOperateId){
          this.getDepart(this.filters.chargeOperateId);
        }
      
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
    async getDepart(id) {
      let { data } = await this.$fetch({
        url: "system/api/queryUcByDepart",
        method: "post",
        data: {
          departId: id,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
        this.roleList = data.result;
      }
    },
    seeDetails(index, row) {
      this.$router.push({ name: "studentNews", query: { id: row.studentId } });
    },
    async getCampus() {
      let { data } = await this.$fetch({
        url: "system/api/campus/queryCampusByBusId",
        method: "post",
        data: {
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        }
      }).catch(error => {
        this.$message.error(this.apiName + "接口出错！");
      });
      if (data.code == 30000) {
          this.option3 = data.result;
      } else {
        this.$message.warning(data.message);
      }
    },
  },
  mounted() {
    this.getListStudent();
    this.getDepartList();
    this.getoption1();
    this.getCampus();
  }
};
</script>


<style  lang="scss" scoped>
.cont {
  margin: 0 0 20px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.box {
  width: 100%;
  min-height: 60px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  //   background: #fff;
  //   border: 1px solid #ddd;
  //   border-radius: 5px;
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
.tips{
  width: 120px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

</style>