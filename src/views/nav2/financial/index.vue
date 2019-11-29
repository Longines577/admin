<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 学员信息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务确认</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <div class="container"> -->
    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
    <el-form :inline="true" :model="filters" class="form">
      <div class="boxLeft">
        <el-form-item label="学生姓名" class="form-title">
          <el-input v-model="filters.studentName" placeholder="请输入学生姓名" style="width:215px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" class="form-title">
          <el-input v-model="filters.classPhone" placeholder="请输入手机号码" style="width:215px"></el-input>
        </el-form-item>
        <el-form-item label="支付编号" class="form-title">
          <el-input v-model="filters.payNo" placeholder="请输入支付编号" style="width:215px"></el-input>
        </el-form-item>
        <el-form-item label="支付状态" class="form-title">
          <el-select v-model="filters.payStatus" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in ['待支付','已支付']" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="确认状态" class="form-title">
          <el-select v-model="filters.financeStatus" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in ['待确认','已确认','已驳回','已作废']" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费方式" class="form-title">
          <el-select v-model="filters.categoryType" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in ['全付','预付','分期','补缴']" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" class="form-title">
					<el-select v-model="filters.paymentId" placeholder="请选择" clearable>
              <el-option v-for="(item,index) in paymentList" :key="index" :label="item.payName" :value="item.id"></el-option>
          </el-select>
				</el-form-item>
        <el-form-item label="费用类型" class="form-title">
					<el-select v-model="filters.costType" placeholder="请选择" clearable>
              <el-option v-for="(item,index) in costTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
				</el-form-item>
         <el-form-item label="支付时间" >
						<el-date-picker type="date" placeholder="选择开始日期" v-model="filters.startDate" value-format="yyyy-MM-dd"></el-date-picker> —
            <el-date-picker type="date" placeholder="选择结束日期" v-model="filters.endDate" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-download" @click="downExcel">导出</el-button> 
        </el-form-item>
      </div>
    </el-form>
    <!-- </el-col> -->

    <!--列表-->
    <div class="container">
      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        v-loading="loading"
        style="width: 100%;"
      >
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="payStatus" label="支付状态" :formatter="row=>row.payStatus==0?'待支付':'已支付'"></el-table-column>
        <el-table-column align="center" prop="financeStatus" label="确认状态" :formatter="row=>row.financeStatus==0?'待确认':row.financeStatus==1?'已确认':row.financeStatus==2?'已驳回':'已作废'"></el-table-column>
         <el-table-column align="center" prop="studentName" label="姓名">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="seeDetails(scope.$index, scope.row)">{{scope.row.studentName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="classPhone" label="手机号码"  width='120'></el-table-column>
        <el-table-column align="center" prop="payNo" label="支付编号" width='200'></el-table-column>
        <el-table-column align="center" prop="xqPayNo" label="享钱订单号" width='200'></el-table-column>
          <el-table-column align="center" prop="confirmCode" label="确认码" ></el-table-column>
         <el-table-column align="center" prop="firstName" label="一级项目" ></el-table-column>
          <el-table-column align="center" prop="secondName" label="二级项目"  width='120'></el-table-column>
           <el-table-column align="center" prop="goodsName" label="商品名" width='220'></el-table-column>
        <el-table-column align="center" prop="totalMoney" label="应付金额"></el-table-column>
        <el-table-column align="center" prop="realMoney" label="实付金额"></el-table-column>
        <el-table-column align="center" prop="costType" :formatter="cost" label="费用类型"></el-table-column>
        <el-table-column align="center" prop="paymentId" :formatter="payment" label="支付方式"></el-table-column>
        <el-table-column align="center" prop="payTime" label="支付时间" width='150'></el-table-column>
        <el-table-column align="center" prop="subName" label="归属机构"></el-table-column>
        <el-table-column align="center" prop="orgName" label="组别"></el-table-column>
        <el-table-column align="center" prop="ownerName" label="归属人"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width='120'>
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.financeStatus==0&&scope.row.isOnline!=1" @click="confirm(scope.row,1)">确认</el-button>
            <el-button type="text" v-if="scope.row.financeStatus==0&&scope.row.isOnline!=1" @click="confirm(scope.row,2)">驳回</el-button>
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
  </div>
</template>
<script>
import {BASEURL} from '@/api/config'
import listMixin from "@/api/list";
export default {
  mixins: [listMixin],
  // components: {
  //   refundDetail,
  //   refundMoney
  // },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/pay/listPayHash",
      loading: false,
      users: [],
      total: 0,
      paymentList:[],
      costTypeList:[]
    };
  },
  methods: {
    getData(){
			this.filters.curPage = 1
			this.getList()
    },
    seeDetails(index, row) {
      this.$router.push({ name: "studentNews", query: { id: row.studentId } });
    },
    downExcel() {
        let filters = {
         subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
         payNo: this.filters.payNo,
         payStatus:this.filters.payStatus,
         financeStatus:this.filters.financeStatus,
         categoryType:this.filters.categoryType,
         paymentId: this.filters.paymentId,
         costType:this.filters.costType,
         startDate:this.filters.startDate,
         endDate:this.filters.endDate
       }
       let url = BASEURL+`system/api/pay/exportPay?busId=${JSON.parse(sessionStorage.getItem("userInfo")).uc.busId}`
       for(var key in filters){
         if(filters[key]){
           url += '&'+key+'='+filters[key]
         }
       }
       let tempwindow = window.open('about:blank')
        tempwindow.location = url
    },
    payment(row,column){
			this.paymentList.forEach((item,index)=>{
				if(item.id == row.paymentId){
					row.paymentId = item.payName
				}
			})
			return row.paymentId
    },
    cost(row,column){
			this.costTypeList.forEach((item,index)=>{
				if(item.value == row.costType){
					row.costType = item.name
				}
			})
			return row.costType
		},
   
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    },
    confirm(row,index){
      var that = this
      that.$confirm(`确定${index==1?'确认':'驳回'}所选纪录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               that.$fetch({
                    url: 'system/api/pay/modifyFinanceStatus',
                    method: "post",
                    data: {
                        id: row.id,
                        confirmId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
                        financeStatus: index
                    },
                }).catch(error => {
                    that.$message.error('modifyFinanceStatus' + "接口出错！");
                }).then(({ data }) => {
                    if (data.code == 30000) {
                        that.$message.success(data.message)
                        that.getList()
                    } else {
                        that.$message.warning(data.message)
                    }
                })
            })
    },
    async getPaymentList() { 
        let { data } = await this.$fetch({
            url: 'system/api/payment/queryPayment',
            method: "post",
            data: {
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.paymentList = data.result
        } else {
          this.$message.warning(data.message)
        }
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
  },
  mounted() {
    this.getList()
    this.getPaymentList()
    this.getCostType()
  }
};
</script>

<style scoped>
.form {
  background: white;
  margin-bottom: 20px;
  padding-top: 20px;
}
.boxLeft {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding-left: 20px;
}
.form-title {
  width: 23%;
}
</style>