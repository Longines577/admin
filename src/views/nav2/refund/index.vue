<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 学员信息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>退费管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <div class="container"> -->
    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
    <el-form :inline="true" :model="filters" class="form">
      <div class="boxLeft">
        <!-- <el-form-item label="手机号码" class="form-title">
          <el-input v-model="filters.classPhone" placeholder="请输入手机号码"></el-input>
        </el-form-item> -->
        <el-form-item label="退费类型" class="form-title">
          <el-select v-model="filters.reType" placeholder="请选择" clearable>
            <el-option label="定金" value="0"></el-option>
            <el-option label="订单" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" class="form-title">
          <el-select v-model="filters.status" placeholder="请选择" clearable>
            <el-option label="申请中" value="0"></el-option>
            <el-option label="已打款" value="1"></el-option>
            <el-option label="部分打款" value="2"></el-option>
            <el-option label="已作废" value="3"></el-option>
          </el-select>
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
        <el-table-column align="center" type="index" label="编号" width="60"></el-table-column>
        <el-table-column align="center" prop="status" label="状态" :formatter="formatOrder"></el-table-column>
        <el-table-column align="center" prop="reType" label="退费类型" :formatter="row=>row.reType==0?'定金':'订单'"></el-table-column>
        <el-table-column align="center" prop="studentName" label="姓名">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-if="HasPermission('student')" @click="details(scope.$index, scope.row)">{{scope.row.studentName}}</el-button>
            <span v-else>{{scope.row.studentName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="applyMoney" label="申请退费金额" ></el-table-column>
        <!-- <el-table-column align="center" prop="mayMoney" label="可退费金额"></el-table-column> -->
        <el-table-column align="center" prop="getMoney" label="已打款金额"></el-table-column>
        <el-table-column align="center" prop="applyName" label="申请人"></el-table-column>
        <el-table-column align="center" prop="receiveName" label="收款人"></el-table-column>
        <el-table-column align="center" prop="receiveNo" label="收款账号"></el-table-column>
        <!-- <el-table-column align="center" prop="city" label="保单状态"></el-table-column>
        <el-table-column align="center" prop="birth" label="保费"></el-table-column> -->
         <el-table-column align="center" label="操作" fixed="right" width='180'>
            <template slot-scope="scope">
              <el-button type="text" v-if="(scope.row.status==0||scope.row.status==2)&&HasPermission('makeMoney')" @click="makeMoney(scope.row)">打款</el-button>
              <el-button type="text" v-if="HasPermission('seeDetails')" @click="seeDetails(scope.row)">打款明细</el-button>
              <el-button type="text"  @click="feesDetails(scope.row)">扣费明细</el-button>
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
    <el-dialog :close-on-click-modal='false' title="打款明细" :visible.sync="isShowEdit" v-if="isShowEdit" center width='1280px'>
			<refund-detail :id="refundId"></refund-detail>
		</el-dialog>
    <el-dialog :close-on-click-modal='false' title="扣费记录" :visible.sync="isShowFee" v-if="isShowFee" center width='1280px'>
			<refund-deduction :id="orderDetailId"></refund-deduction>
		</el-dialog>
    <el-dialog :close-on-click-modal='false' title="打款确认" :visible.sync="isShow" v-if="isShow" center width='1280px'>
			<refund-money :data="formData" @close-ok="closeOk"></refund-money>
		</el-dialog>
  </div>
</template>
<script>
import {BASEURL} from '@/api/config'
import refundDetail from './refund-detail';
import refundMoney from './refund-money';
import refundDeduction from './refund-deduction';
import listMixin from "@/api/list";
export default {
  mixins: [listMixin],
  components: {
    refundDetail,
    refundMoney,
    refundDeduction
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/refund/listRefundHash",
      loading: false,
      users: [],
      total: 0,
      isShowEdit: false,
      refundId: '',
      orderDetailId: '',
      isShowFee: false,
      isShow: false,
      formData:{},
    };
  },
  methods: {
    downExcel() {
        let filters = {
        //  subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
         reType: this.filters.reType,
         status:this.filters.status,
       }
       let url = BASEURL+`system/api/refund/exportRefund?busId=${JSON.parse(sessionStorage.getItem("userInfo")).uc.busId}`
       for(var key in filters){
         if(filters[key]){
           url += '&'+key+'='+filters[key]
         }
       }
       let tempwindow = window.open('about:blank')
        tempwindow.location = url
    },
    getData(){
			this.filters.curPage = 1
			this.getList()
		},
    closeOk(){
      this.isShow = false
      this.getList()
    },
    formatOrder: function(row, column) {
      return row.status == 0
        ? "申请中"
        : row.status == 1
        ? "已打款"
        : row.status == 2
        ? "部分打款"
        : "已作废";
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    seeDetails(row){
      this.isShowEdit = true
      this.refundId = row.id
    },
    feesDetails(row){
      this.isShowFee = true
      this.orderDetailId = row.orderDetailId
    },
    makeMoney(row){
      this.isShow = true
      this.formData = row
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    },
    details(index, row) {
      this.$router.push({name:'studentNews',query: {id: row.studentId}}) 
    },
  },
  mounted() {
    this.getList();
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
  width: 28%;
}
</style>