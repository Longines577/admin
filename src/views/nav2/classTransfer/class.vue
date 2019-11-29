<template>
  <div>
    <el-card class="box-card" style="width: 100%">
        <div slot="header" class="clearfix">
            <div>
                <span>目标班型：{{Money}}</span>
                <span class="text">原班型结余：{{balance}}</span>
                <span class="text" v-if="balance-Money>=0">应退费：{{balance-Money}}</span>
                <span class="text" v-if="balance-Money<0">应补缴费：{{Money-balance}}</span>
            </div>
            <div>
                <el-button  type="primary" size='mini'  @click="addLessons">选择班型</el-button>
            </div>
        </div>
        <el-table :data="timesJr" border highlight-current-row stripe center>
            <el-table-column  align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
				    <el-table-column  align="center" prop="secondName" label="二级项目" ></el-table-column>
            <el-table-column  align="center" prop="goodsName" label="班型" ></el-table-column>
            <el-table-column prop="timeName" label="报考院校" align="center" width="200">
                 <template slot-scope="scope">
                    <el-select v-model="timesJr[scope.$index].examCollegeId" placeholder="请选择" clearable  @focus="getCollege(scope.$index, scope.row)">
                        <el-option v-for="item in college" :key="item.value" :label="item.college" :value="item.id"></el-option>
                    </el-select>
                 </template>
            </el-table-column>
            <el-table-column prop="timeName" label="报考校区" align="center" width="200">
                 <template slot-scope="scope">
                    <el-select v-model="timesJr[scope.$index].campusId" placeholder="请选择" clearable  @focus="getCampus(scope.$index, scope.row)">
                        <el-option v-for="(item,index) in campus" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                 </template>
            </el-table-column>
            <el-table-column prop="timeName" label="考期" align="center">
                 <template slot-scope="scope">
                   <el-select v-model="timesJr[scope.$index].examDate" placeholder="请选择" clearable >
                        <el-option v-for="item in examTime" :key="item.value" :label="item.examTime" :value="item.examTime"></el-option>
                    </el-select>
                  <!-- <el-date-picker
                    v-model="timesJr[scope.$index].examDate"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择考期">
                  </el-date-picker> -->
                 </template>
            </el-table-column>
            <el-table-column  align="center" prop="price" label="商品价格"  width="80"></el-table-column>
            <el-table-column  align="center" prop="minPrice" label="最低限价"  width="80"></el-table-column>
            <el-table-column  align="center" prop="minPrice" label="应缴费用">
              <template slot-scope="scope">
                	<el-input v-model="timesJr[scope.$index].totalMoney" placeholder="请输入" size="small" @change="getMoney" clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="70">
                <template slot-scope="scope">
                <el-button size="mini" @click="del(scope.$index, scope.row)">
                    <i class="el-icon-delete"></i>
                </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <div class="launch">
      <el-button  type="primary" size='mini' v-if="show==1"  @click="launchSign">发起转班</el-button>
    </div>
    <el-dialog :close-on-click-modal='false' title="班型" :visible.sync="isShowEdit" center append-to-body width="900px">
			<el-form :model="filters" label-width="80px" :inline="true" ref="filters">
        <el-form-item   label="一级项目"  prop="firstId" :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]">
            <el-select v-model="filters.firstId" placeholder="请选择" clearable  @change="getoption2">
                <el-option v-for="item in option1" :key="item.value" :label="item.firstName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item  label="二级项目" prop="secondId" :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]" >
            <el-select v-model="filters.secondId" placeholder="请选择"  @change="getSubject" clearable>
                <el-option v-for="item in option2" :key="item.value" :label="item.secondName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="班型名称" prop="goodsName" :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]" >
            <el-input v-model="filters.goodsName" placeholder="请输入名称" size="small" clearable></el-input>
        </el-form-item>
        <div style="float: right">
            <el-form-item>
                <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
        </div>
      </el-form>
      <el-card class="box-card">
        <el-table class="courseTable" ref="multipleTable" :data="list" height="350" border highlight-current-row stripe  @select="selsChange">
          <el-table-column align="center" label="选择" type="selection" width="55"></el-table-column>
          <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
          <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
          <el-table-column align="center" prop="goodsName" label="班型名称"></el-table-column>
          <el-table-column align="center" prop="price" label="商品价格" ></el-table-column>
          <el-table-column align="center" prop="minPrice" label="最低限价" ></el-table-column>
        </el-table>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button class="btn2" type="primary" @click.native="editSubmit">保存并提交</el-button>
            <el-button class="btn2" @click="isShowEdit=false">取消</el-button>
        </div>
		</el-dialog>
    
  </div>
</template>
<script>
import listMixin from "@/api/list";
export default {
  mixins: [listMixin],
  data() {
    return {
      formData: {},
      apiName: "system/api/goods/queryGoods",
      option1:[],
      option2:[],
      college:[],
      campus:[],
      rules: {},
      timesJr: [],
      examTime:[],
      Money: 0,
      sels:[],
      orderData: '',
      filters:{
        status: 1,
        subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      show: 1,
      isShowEdit: false,
    }
  },
  props:{
    data: {
      type: Object
    },
    balance:
     {
      type: String
    },
    num:
     {
      type: Number
    },
  },
  mounted(){
   this.getoption1()
   this.data && (this.formData = this.data)
   console.log(this.data,1111)
  },
  methods: {
    addLessons(){
      this.isShowEdit = true
      this.getList()
    },
    del(index){
       this.timesJr.splice(index,1)
    },
    selsChange(selection, row){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row, true);
       console.log('点击', row);
      this.sels = row
    },
    getCollege(index,row){
      this.$fetch({
        url: 'system/api/examCollege/queryExamCollege',
        method: "post",
        data: {
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
          secondId: row.secondId
        }
      }).catch(error => {
        this.$message.error( 'region/queryAllProvince' + "接口出错！");
      }).then(({ data }) => {
        if (data.code == 30000) {
        this.college = data.result
        } else {
          this.$message.warning(data.message)
        }
      })
    },
    getCampus(index,row){
      this.$fetch({
        url: 'system/api/campus/queryCampusByBusId',
        method: "post",
        data: {
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        }
      }).catch(error => {
        this.$message.error( 'campus/queryCampusByBusId' + "接口出错！");
      }).then(({ data }) => {
        if (data.code == 30000) {
        this.campus = data.result
        } else {
          this.$message.warning(data.message)
        }
      })
    },
    editSubmit(){
      this.timesJr = []
      this.timesJr.push(this.sels)
      console.log(this.timesJr,1111)
      this.$message.success('保存成功！')
      this.isShowEdit = false
      this.getExam()
    },
    getExam(){
      this.$fetch({
        url: 'system/api/exam/queryExamByFirstAndSecond',
        method: "post",
        data: {
          firstId: this.sels.firstId,
          secondId: this.sels.secondId,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        }
      }).catch(error => {
        this.$message.error( 'queryBySignStatus' + "接口出错！");
      }).then(({ data }) => {
        if (data.code == 30000) {
          this.examTime = data.result
        } else {
          this.$message.warning(data.message)
        }
      })
    },
    getMoney(val){
      if(val<this.sels.minPrice){
        this.timesJr[0].totalMoney = this.sels.minPrice
      }
      if(val>this.sels.price){
        this.timesJr[0].totalMoney = this.sels.price
      }
      this.Money = this.timesJr[0].totalMoney
    },
    launchSign(){
      if(this.timesJr.length<1){
        this.$message.warning('请先选择班型')
        return false
      }
      if(this.timesJr[0].totalMoney<this.sels.minPrice){
        this.$message.warning('不能小于最低限价')
        return false
     }
     if(this.timesJr[0].totalMoney>this.sels.price){
        this.$message.warning('不能大于最高限价')
        return false
     }
      const loading = this.$loading({
          lock: true,
          text: '处理中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$http({
        url: 'system/api/orderDetail/transferClassType',
        method: "post",
        data: {
          busId: this.sels.busId,
          subId: this.sels.subId,
          studentId: this.data.studentId,
          ownerId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
          examDate: this.timesJr[0].examDate,
          totalMoney: this.timesJr[0].totalMoney,
          goodsId: this.timesJr[0].id,
          examCollegeId:this.timesJr[0].examCollegeId,
          campusId: this.timesJr[0].campusId,
          oldOrderDetail: this.data.id,
          oweFee: this.num
        }
      }).catch(error => {
        this.$message.error( 'transferClassType' + "接口出错！");
        loading.close();
      }).then(({ data }) => {
        if (data.code == 30000) {
          loading.close();
          this.$message.success(data.message)
          this.$emit('save-ok')
        } else {
          loading.close();
          this.$message.warning(data.message)
        }
      })
    }
  },

}
</script>
<style>
 .courseTable th .el-checkbox__inner {
  display:none;
}
</style>
<style lang="scss" scoped>
.clearfix{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.dialog-footer{
    margin-top: 20px;
}
.text{
    margin-left: 50px;
}
.launch{
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
<style scoped>
.el-card{
  margin-top: 20px;
}

.dialog-footer{
text-align: center;
}

</style>
