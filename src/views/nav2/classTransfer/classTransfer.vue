<template>
  <div>
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="原班型"></el-step>
      <el-step title="转入新班"></el-step>
      <!-- <el-step title="支付信息"></el-step> -->
    </el-steps>
    <Class @save-ok='saveOk' :data='data' :balance='balance' :num='num' v-if="active==2"></Class>
    <!-- <Arrears v-show="isSee"></Arrears>     -->
    <!-- <Aply v-if="active==3" ref="child" @childByValue="childByValue"></Aply> -->
    <div class="miancontent" v-if="active==1">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>原班型信息</span>
        </div>
        <div class="infoBox">
          <span>班型:{{data.goodsName}}</span>
          <span>应缴费用:{{data.totalMoney}}</span>
          <span>实缴费用:{{data.realMoney}}</span>
          <span>欠费金额：{{data.raiseMoney}}</span>
        </div>
      </el-card>
    
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <div>
                <span>扣费明细</span>
            </div>
            <div>
                <el-button  type="primary" size='mini'  @click="addDetail">增加明细</el-button>
            </div>
        </div>
        <el-table :data="timesJr" border highlight-current-row stripe center>
            <el-table-column  align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="timeName" label="费用类型" align="center">
                 <template slot-scope="scope">
                    <el-select v-model="timesJr[scope.$index].deductType" placeholder="请选择" clearable>
                        <el-option v-for="(item,index) in costTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                 </template>
            </el-table-column>
            <el-table-column  align="center" prop="minPrice" label="扣费金额">
              <template slot-scope="scope">
                	<el-input v-model="timesJr[scope.$index].oweFee" placeholder="请输入" size="small" clearable @change="deductionTotal"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                <el-button size="mini" @click="del(scope.$index, scope.row)">
                    <i class="el-icon-delete"></i>
                </el-button>
                </template>
            </el-table-column>
        </el-table>
      </el-card>
   
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>发票信息</span>
        </div>
        <div class="infoBox">
          <template>暂无发票信息</template>
        </div>
      </el-card>
   
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>总计</span>
        </div>
        <div class="infoBox">
          <span>总扣费金额:{{num}}</span>
          <span>原班型结余:{{balance}}</span>
        </div>
      </el-card>
    </div>
    <div class="Box">
      <!-- <el-button
        round
        class="btnBox"
        style="margin-top:12px;background:#426CB1;color:white;"
        @click="back"
        v-if="active > 1"
      >上一步</el-button> -->
      <!-- <el-button round>圆角按钮</el-button> -->

      <el-button round @click="next" v-if="active == 1">下一步</el-button>
      <el-button round class="btnBox1" @click="submit" v-if="active >= 3">提交</el-button>
    </div>
  </div>
</template>
<script>
import Class from "./class";
import Aply from "./aply";
import Arrears from './arrears'
// import {queryTransFerByStudent} from '../../../api/api'
export default {
  components: {
    Class,
    Aply,
    Arrears,
  },
  data() {
    return {
      active: 1,
      num: 0,
      balance: this.data.realMoney,
      costTypeList:[],
      timesJr:[],
      dataSum: null
    };
  },
   props:{
    data: {
      type: Object
    },
    // id:
    //  {
    //   type: Number
    // },
  },
  methods: {
    addDetail() {
      this.timesJr.push(
        {
          orderId:this.data.orderId,
          orderDetailId: this.data.id,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
          costType: '',
          oweFee: '',
        }
      )
    },
    del(index){
       this.timesJr.splice(index,1)
       this.num = 0
       this.timesJr.forEach((item)=>{
        this.num += Number(item.oweFee)
      })
      this.balance = Number(this.data.realMoney-this.num).toFixed(2)
    },
    deductionTotal(val){
      if(val<0){
        this.$message.warning('金额不能小于0,请重新填写')
        return false
      }
      this.num = 0
      this.timesJr.forEach((item)=>{
        this.num += Number(item.oweFee)
      })
      this.balance = Number(this.data.realMoney-this.num).toFixed(2)
    },
    async getCostType() { 
        let { data } = await this.$fetch({
            url: 'system/api/queryDictionaryByCode',
            method: "post",
            data: {
                categoryCode: 'cost_type'
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.costTypeList = data.result
           
        } else {
          this.$message.warning(data.message)
        }
    },
    next() {
      if(this.active == 1){
        this.saveOweFee()
      }
      this.active = 2
      // if (this.active++ > 4) this.active = 0;
      // if (this.active == 2) {
      //   this.isShow = false;
      //   this.isStep = false;
      // } else if (this.active == 3) {
      //   this.isShow = true;
      //   this.isSee = true;
      //   this.isStep = false;
      // }
    },
    saveOweFee(){
      this.$http({
        url: 'system/api/oweFee/saveOweFeeList',
        method: "post",
        data: this.timesJr
      }).catch(error => {
        this.$message.error( 'queryBySignStatus' + "接口出错！");
      }).then(({ data }) => {
        if (data.code == 30000) {
          this.$message.success(data.message)
        } else {
          this.$message.warning(data.message)
        }
      })
    },
    back() {
      console.log(this.active);
      this.active--;
      if (this.active == 1) {
        this.isStep = true;
        this.isShow = true;
      } else if (this.active == 2) {
        this.isStep = false;
        this.isShow = false;
        this.isSee = false;
      }
    },
   saveOk(){
     this.$emit('emit-ok')
   }
  
  },
  mounted(){
    this.getCostType()
    console.log(this.data,11111)
  }
};
</script>
<style scoped>
.infoBox {
  display: flex;
  justify-content: space-around;
}
.infoBox1 {
  display: flex;
  justify-content: flex-end;
}
.box-card {
  margin-top: 10px;
}

.Box{
  margin-top: 20px;
}
.clearfix{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>


