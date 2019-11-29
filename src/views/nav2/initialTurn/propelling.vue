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
        <div v-for="(item,index) in formList" :key="index">
        <el-form-item
          label="一级项目"
          class="box"
          :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]"
        >
          <el-select v-model="formList[index].firstId" placeholder="请选择" clearable @change="getoption8(formList[index].firstId,index)">
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
        <el-select v-model="formList[index].secondId" placeholder="请选择" clearable @change="getGoods1(formList[index].secondId,index)" >
            <el-option
              v-for="item in formList[index].option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品" :rules="[{ required: true, message: '请选择商品', trigger: 'blur' }]">
          <el-select v-model="formList[index].goodsArr" placeholder="请选择" clearable filterable multiple @change="selectGoods">
            <el-option
              v-for="item in formList[index].option15"
              :key="item.value"
              :label="item.goodsName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="newAdd">+</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="remove(index)">-</el-button>
        </el-form-item>
</div>
        <el-form-item
          label="报名日期："
          :rules="[{ required: true, message: '请选择上课时间', trigger: 'blur' }]"
        >
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
          <el-button type="primary" @click="queryStudents">查询学员</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="push">推送</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <!-- </el-col> -->
    <div class="container">
      <el-table
        :data="user"
        border
        highlight-current-row
        stripe
        v-loading="loading"
        v-if="isTable"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column align="center" type="index" width="60"></el-table-column>
        <!-- <el-table-column align="center" label="推送状态" prop="status" :formatter="formatStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color:#FF3366">推送失败</span>
            <span v-if="scope.row.status == 1" style="color:#37B328">推送成功</span>
            <span v-if="scope.row.status == 2" style="color:#999999">取消</span>
          </template>
        </el-table-column>-->
        <!-- <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column> -->
        <!-- <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column> -->
        <el-table-column align="center" prop="studentName" label="学生名称"></el-table-column>
        <el-table-column align="center" prop="courseTime" label="排课时间"></el-table-column>
        <el-table-column align="center" prop="timeName" label="课次名称" width="120"></el-table-column>
        <el-table-column align="center" prop="turnsName" label="轮次名称" width="120"></el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名称" width="115"></el-table-column>
        <el-table-column align="center" prop="classPhone" label="手机号码" width="100"></el-table-column>
        <el-table-column align="center" prop="failReason" label="推送结果" width="120"></el-table-column>
      </el-table>

      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        height="250"
        v-loading="loading"
        v-if="tableView"
        style="width: 100%;margin-top:10px;"
      >
        <el-table-column align="center" type="index" width="60"></el-table-column>
        <el-table-column align="center" label="推送状态" prop="status" :formatter="formatStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0" style="color:#FF3366">推送失败</span>
            <span v-if="scope.row.status == 1" style="color:#37B328">推送成功</span>
            <span v-if="scope.row.status == 2" style="color:#999999">取消</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="studentName" label="学生名称"></el-table-column>
        <el-table-column align="center" prop="courseTime" label="排课时间"></el-table-column>
        <el-table-column align="center" prop="timeName" label="课次名称" width="120"></el-table-column>
        <el-table-column align="center" prop="turnsName" label="轮次名称" width="120"></el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名称" width="115"></el-table-column>
        <el-table-column align="center" prop="classPhone" label="手机号码" width="100"></el-table-column>
        <el-table-column align="center" prop="failReason" label="推送结果" width="120"></el-table-column>
      </el-table>
      
    </div>
  </div>
</template>
<script>
import listMixin from "@/api/list";
import {
  pushCourseTurnsTime,
  cancelPushTime,
  queryPushScheduleTime
} from "../../../api/api";
export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      filters: {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      //   apiName: "system/api/student/pushCourseTurnsTime",
      total: 20,
      option1: [],
      isTable: true,
      tableView: false,
      formList:[{
        goodsArr:[],
        firstIdArr:'',
        secondIdArr:'',
        option2:[],
        option15:[]
      }],
      value2: "",
      users: [],
      user: [],
      secondId:'',
      selectArr: [{
        value: ''
      }],
      formData:[],
      ids:null,
    };
  },
  props: {
    pushInfo: Object
  },
  methods: {
    async getoption8(id,index) { //获取一级项目下关联的二级项目下拉
    console.log(id,index)
              this.ids = id;
            let { data } = await this.$fetch({
                url: 'system/api/secondProject/findAllSecond',
                method: "post",
                data: {
                    firstId: this.ids,
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.formList[index].option2 = data.result
                this.ids = null;
                    // this.selectArr
            }
        },
         async getGoods1(id,index) { //获取二级项目下关联的商品下拉

            console.log(id,index)
                // this.idg = id
            let { data } = await this.$fetch({
                url: 'system/api/goods/queryGoods',
                method: "post",
                data: {
                    secondId: id,
                    subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.formList[index].option15 = data.result
                // this.idg = null
            }
        },
    selectGoods(value){
    //  let obj = {};
    //   obj = this.option15.find(item => {
    //     return item.id === parseInt(value.join(','));
    //   });
    //   if(this.idxk ==obj.secondId){
    //     this.goodsArr1.push(value)
    //   }
    },
    newAdd(){
     this.formList.push({
       goodsArr:[],
       firstIdArr:[],
       secondIdArr:[],
        option2:[],
        option15:[]
     })

    },
    remove(index){
      if(this.formList.length>1){
      this.formList.splice(index,1)
      }
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
     
    },
    formatStatus: function(row, column) {
      return row.status == 1 ? "成功" : row.status == 2 ? "取消" : "失败";
    },
    formatAttend: function(row, column) {
      return row.isAttend == 1 ? "已出勤" : "未出勤";
    },
    queryStudents() {
       this.formList.map((item,index)=>{
          item.goodsArr.map((v,i)=>{
            // console.log(v,'ni')
            this.formData.push(v)
          })
           
        })
      let params = {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        turnsId: this.pushInfo.turnsId,
        courseId: this.pushInfo.courseId,
        // firstId: this.filters.firstId,
        // secondId: this.filters.secondId,
        registDateStart:this.value2[0],
        registDateEnd:this.value2[1],
        goodsIds:this.formData,
      };
      queryPushScheduleTime(params).then(res => {
        if (res.code === 30000) {
          this.formData = []
          this.user = res.result;
        }else{
        this.$message.error(res.message);
        }
      });
    },
    push() {
        this.formList.map((item,index)=>{
          item.goodsArr.map((v,i)=>{
            // console.log(v,'ni')
            this.formData.push(v)
          })
           
        })
         console.log(this.formData)
      var that = this;
      that
        .$confirm("是否确定推送？", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          type: "warning"
        })
        .then(() => {
          let params = {
            busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
            // firstId: this.filters.firstId,
            // secondId: this.filters.secondId,
            turnsId: this.pushInfo.turnsId,
            courseId: this.pushInfo.courseId,
            goodsIds:that.formData,
            registDateStart: this.value2[0],
            registDateEnd: this.value2[1]
          };
          pushCourseTurnsTime(params).then(res => {
            if (res.code === 30000) {
              this.formData = []
              this.isTable = false;
              this.tableView = true;
              this.users = res.result;
            }else{
            this.$message.error(res.message);              
            }
          });
        });
    },
    cancelPush(index, row) {
      let params = {
        turnsId: row.id,
        studentId: row.studentId
      };
      cancelPushTime(params).then(res => {
        if (res.code === 30000) {
          // console.log(res.message);
        }else{
            this.$message.error(res.message);              

        }
      });
    },
    clear() {
      this.formList=[{
        goodsArr:[],
        firstIdArr:'',
        secondIdArr:'',
        option2:[],
        option15:[]
      }],
      this.value2 = ''
    },
    // handleSizeChange(val) {},
    // handleCurrentChange(val) {},
    pickerOptions() {}
  },
  mounted() {
    this.getoption1();
    // console.log(this.pushInfo, 565456);
  },
  updated() {
    // console.log(this.value2, 5888988);
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