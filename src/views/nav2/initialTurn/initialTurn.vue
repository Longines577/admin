<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 轮次
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="filters" style="width:100%;" class="form">
      <el-form-item label="一级项目" class="box">
        <el-select v-model="filters.firstId" placeholder="请选择" clearable @change="getoption2">
          <el-option
            v-for="item in option1"
            :key="item.value"
            :label="item.firstName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级项目" class="box">
        <el-select v-model="filters.secondId" placeholder="请选择" clearable>
          <el-option
            v-for="item in option2"
            :key="item.value"
            :label="item.secondName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考期" class="box">
        <el-date-picker
          v-model="filters.examTime"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择考期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="轮次名称" class="box">
        <el-input v-model="filters.courseNoName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="开班时间" class="box">
        <el-date-picker
          v-model="filters.openDateStart1"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="开始日期"
        ></el-date-picker>~
        <el-date-picker
          v-model="filters.openDateEnd1"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style>
        <el-button type="primary" @click="getList">查询</el-button>
        <el-button type="primary" @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- </el-col> -->
    <!-- </div> -->

    <div class="container">
      <div style="margin: 0 0 20px 0;">
        <el-button
          type="primary"
          style="margin-top:10px;"
          v-if="HasPermission('add')"
          @click="newAdd"
        >新增</el-button>
      </div>
      <el-table :data="users" border style="width: 100%">
        <el-table-column
          fixed
          label="状态"
          prop="courseType"
          width="200"
          align="center"
          :formatter="formatType"
        >
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.status == '0'" style="color: red" >未发布</span> -->
            <el-button type="text" v-if="scope.row.status == '0'" @click="issue(scope.row)">未发布</el-button>
            <span v-else style="color:#37B328">已发布</span>
          </template>
        </el-table-column>
        <el-table-column prop="firstName" label="一级项目" align="center"></el-table-column>
        <el-table-column prop="secondName" label="二级项目" align="center"></el-table-column>
        <el-table-column prop="openDate" label="开课时间" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="editOpenDate(scope.row,scope.$index)">
              {{scope.row.openDate}}
              <i class="el-icon-edit"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="轮次名称" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editTurnName(scope.row,scope.$index)"
            >{{scope.row.courseNoName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="courseType" label="轮次类型" align="center" :formatter="formatType2"></el-table-column>
        <!-- <el-table-column prop="address" label="授课类型" align="center" ></el-table-column> -->
        <el-table-column prop="teachType" label="授课方式" align="center" :formatter="formatType1"></el-table-column>
        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">配置轮次</el-button> -->
            <!-- <el-button type="text" size="small" @click="update(scope.row,scope.index)">修改轮次</el-button> -->
            <el-button
              type="text"
              size="small"
              v-if="HasPermission('manage')"
              @click="mangen(scope.row,scope.$index)"
            >管理</el-button>
            <el-button
              type="text"
              size="small"
              v-if="HasPermission('push')"
              @click="propelling(scope.row,scope.$index)"
            >推送</el-button>
            <el-button
              type="text"
              size="small"
              v-if="HasPermission('pushDetails')"
              @click="pushDetails(scope.row,scope.$index)"
            >推送详情</el-button>
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
    <el-dialog
      :close-on-click-modal="false"
      title="修改开课时间"
      :visible.sync="isShowCost"
      center
      width="480px"
    >
      <el-form :model="formData" label-width="80px" :inline="true" ref="editForm">
        <el-form-item label="课号时间" prop="openDate" style="margin-left:80px;padding-top:30px;">
          <el-date-picker
            v-model="openDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="isShowCost=false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="修改轮次名称"
      :visible.sync="isShowTurn"
      center
      width="480px"
    >
      <el-form :model="formData" label-width="80px" :inline="true" ref="editForm">
        <el-form-item label="轮次名称" prop="turnName" style="margin-left:80px;padding-top:30px;">
          <el-input v-model="turnName" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="isShowTurn=false">取消</el-button>
        <el-button type="primary" @click.native="saveBtn">确定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog :close-on-click-modal='false' title="新增" :visible.sync="newAddDialog" center width='1200px'>


			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="newAddDialog=false">取消</el-button>
				<el-button  type="primary" @click.native="editSubmit1">确定</el-button>
			</div>
    </el-dialog>-->
    <el-dialog
      :close-on-click-modal="false"
      :title="textMap[dialogStatus]"
      center
      :visible.sync="dialogFormVisible"
      :width="selectWidth"
      :before-close="cancle"
    >
      <!-- <Dialog :data1="dataList" :type="dialogStatus" style="text-align:center;"></Dialog> -->
      <el-tabs v-model="activeName" @tab-click="handleClick1" v-if="dialogStatus == 'mangen'">
        <!-- <el-tab-pane label="排课" name="first"> -->
        <Mangen :clas="clas" :key="timer"></Mangen>
        <!-- </el-tab-pane> -->
        <!-- <el-tab-pane label="学员" name="second">
          <Students />
        </el-tab-pane>-->
      </el-tabs>
      <!-- <component :is="isComponent" :data1 ='dataList'></component> -->
      <Config :data1="dataList" v-if="dialogStatus == 'config'" ref="child2" />
      <Propelling :pushInfo="pushInfo" :key="timer" v-if="dialogStatus == 'Propelling'" />
      <PushDetails v-if="dialogStatus == 'PushDetails'" :key="timer" :pushDetail="pushDetail" />
      <!-- <EditOpenDate style="text-align:center;" v-if="dialogStatus == 'editOpenDate'" @get='getList'  ref="child1" /> -->
      <div slot="footer" class="dialog-footer" style="margin-top:30px;">
        <el-button @click="cancle" v-if="what">取 消</el-button>
        <el-button type="primary" @click="save(dialogStatus)" v-if="isView">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import Dialog from "../../components/dialog";
import Config from "./config";
import Mangen from "./mangen";
import Students from "./students";
import Propelling from "./propelling";
import PushDetails from "./pushDetails";
// import EditOpenDate from "../../components/DialogContent/editOpenDate.vue";
import listMixin from "@/api/list";
import {
  queryCourseTurnsAndDetail,
  modifyOpenDate,
  createSchedule,
  addCourseTurnsAndDetail,
  updateCourseTurns,
  modifyCourseTurnsStatus
} from "../../../api/api";
export default {
  mixins: [listMixin],
  methods: {
    issue(row) {
      this.$confirm("是否确定修改？", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        let params = {
          turnsId: row.id
        };
        modifyCourseTurnsStatus(params).then(res => {
          if (res.code === 30000) {
            this.getList();
          } else {
          }
        });
      });
    },
    editSubmit() {
      this.isShowCost = false;
      let params = {
        turnsId: this.turnsId,
        openDate: this.openDate
      };
      var that = this;
      modifyOpenDate(params).then(res => {
        if (res.code === 30000) {
          that.getList();
        }
      });
    },
    editTurnName(row, index) {
      this.idx = row.id;
      this.isShowTurn = true;
      this.turnName = row.courseNoName;
    },
    saveBtn() {
      let params = {
        id: this.idx,
        courseNoName: this.turnName
      };
      updateCourseTurns(params).then(res => {
        if (res.code === 30000) {
          this.isShowTurn = false;
          this.getList();
        }
      });
    },
    save(dialogStatus) {
      if (dialogStatus == "config") {
        this.dialogFormVisible = false;
        this.dialogStatus = "";
        this.$refs.child2.saveTurn();
        setTimeout(() => {
          this.getList();
        }, 500);
      }
    },
    cancle() {
      this.dialogFormVisible = false;
      this.isView = true;
      this.dialogStatus = "";
    },
    handleClick1(tab, event) {
      console.log(tab, event);
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    },
    handleClick(row) {
      console.log(row);
      //   this.dialogFormVisible = true
      //   this.dialogStatus = "config";
    },
    pushDetails(row, index) {
      (this.dialogStatus = "PushDetails"), (this.selectWidth = 1450 + "px");
      this.dialogFormVisible = true;
      this.what = false;
      this.isView = false;
      this.timer = new Date().getTime();
      this.pushDetail.turnsId = row.id;
    },
    propelling(row, index) {
      this.isComponent = 'Propelling'
      this.dialogStatus = "Propelling";
      this.selectWidth = 1450 + "px";
      this.dialogFormVisible = true;
      this.what = false;
      this.isView = false;
      this.timer = new Date().getTime();
      this.pushInfo.turnsId = row.id;
      // console.log(this.pushInfo.turnsId,546465)
      this.pushInfo.courseId = row.courseId;
    },
    mangen(row, index) {
      this.dialogFormVisible = true;
      this.selectWidth = 1200 + "px";
      this.isView = false;
      this.dialogStatus = "mangen";
      this.timer = new Date().getTime();
      console.log(row.courseNoName, row.id);
      this.clas = {
        courseNoName: "",
        turnsId: "",
        status: row.status
      };
      this.clas.courseNoName = row.courseNoName;
      this.clas.turnsId = row.id;
    },
    // update(index, row) {
    //   this.dialogFormVisible = true;
    //   console.log(1111);
    //   this.dialogStatus = "replace";
    // },
    newAdd() {
      // this.newAddDialog = true;
      this.dialogFormVisible = true;
      this.dialogStatus = "config";
      this.selectWidth = 1220 + "px";
    },
    editOpenDate(row, index) {
      this.isShowCost = true;
      this.openDate = row.openDate;
      this.turnsId = row.id;
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    formatType(row, column) {
      return row.status == 1 ? "已发布" : "未发布";
    },
    formatType1(row, column) {
      return row.teachType == 1 ? "直播" : "面授";
    },
    formatType2(row, column) {
      return row.courseType == 0 ? "临时课号" : "普通课号";
    }
  },
  components: {
    Config,
    Mangen,
    Students,
    Propelling,
    PushDetails
    // EditOpenDate
  },
  data() {
    return {
      courseNoName: "",
      isShowTurn: false,
      turnName: "",
      newAddDialog: false,
      isComponent:'',
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/courseTurns/listCourseTurnsHash",
      selectWidth: null,
      activeName: "second",
      dialogStatus: "",
      isShowCost: false,
      what: true,
      openDate: "",
      dataList: "",
      clas: {
        courseNoName: "",
        turnsId: ""
      },

      pushInfo: {
        turnsId: "",
        courseId: ""
      },
      pushDetail: {
        turnsId: ""
      },
      isView: true,
      turnsId: "",
      timer: "", //时间戳
      formData: {},
      options: [],
      option1: [],
      option2: [],
      options5: [
        {
          value: 0,
          label: "是"
        },
        {
          value: 1,
          label: "否"
        }
      ],
      value: "",
      total: 0,
      value1: "",
      value: "",
      total: 0,
      options: "",
      textMap: {
        config: "新增",
        replace: "修改轮次",
        log: "记录",
        mangen: "管理",
        editOpenDate: "修改开课时间",
        Propelling: "推送",
        PushDetails: "推送详情"
      },
      dialogFormVisible: false,
      users: [],
      idx: ""
    };
  },
  mounted() {
    this.getList();
    this.getoption1();
  }
};
</script>

<style  lang="scss" scoped>
.header {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
  background: white;
}
.model {
  text-align: center;
  line-height: 100px;
  color: black;
}
.newBtn {
  background: white;
  height: 50px;
  margin-top: 20px;
}
.btn {
  text-align: center;
  line-height: 100px;
}
.serach {
  margin-top: 40px;
  margin-left: 80px;
}
.el-select-dropdown {
  top: 204px;
}
.form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: white;
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 30px 40px 10px;
}
.newAdd {
  width: 100%;
}
</style>

