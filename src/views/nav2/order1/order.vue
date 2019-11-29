<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 学员信息管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <div class="container"> -->
    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
    <el-form :inline="true" :model="filters" class="form">
      <div class="boxLeft">
        <el-form-item label="学生姓名" class="form-title">
          <el-input v-model="filters.studentName" placeholder="请输入学生姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" class="form-title">
          <el-input v-model="filters.classPhone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="订单编号" class="form-title">
          <el-input v-model="filters.orderNo" placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item label="签约状态" class="form-title">
          <el-select v-model="filters.signStatus" placeholder="请选择" clearable>
            <el-option label="未签约" value="0"></el-option>
            <el-option label="已签约" value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="订单状态" class="form-title" v-model="filters.payStatus">
          <el-select v-model="filters.orderStatus" placeholder="请选择" clearable>
            <el-option label="待支付" value="0"></el-option>
            <el-option label="已支付" value="1"></el-option>
            <el-option label="已转" value="2"></el-option>
            <el-option label="已作废" value="3"></el-option>
            <el-option label="已冻结" value="4"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="欠费状态" class="form-title">
          <el-select v-model="filters.isOwe" placeholder="请选择" clearable>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单金额范围" style="display:flex">
          <el-input v-model="filters.totalMoneyStart" placeholder="请输入订单最小金额" style="width:220px"></el-input> ~ 
          <el-input v-model="filters.totalMoneyEnd" placeholder="请输入订单最大金额" style="width:220px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="一级项目" class="form-title">
          <el-select v-model="filters.firstId" placeholder="请选择" clearable @change="getoption2">
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.firstName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级项目" class="form-title">
          <el-select v-model="filters.secondId" placeholder="请选择" clearable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" @click="getUser">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">重置</el-button>
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
        <el-table-column align="center" prop="orderStatus" label="订单状态" :formatter="formatOrder"></el-table-column>
        <el-table-column align="center" prop="signStatus" label="签约状态" :formatter="row=>row.signStatus==0?'未签约':'已签约'"></el-table-column>
        <el-table-column align="center" prop="orderType" label="订单类型" :formatter="row=>row.orderType==0?'订单':'定金'"></el-table-column>
        <el-table-column align="center" prop="studentName" label="姓名">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-if="HasPermission('student')" @click="details(scope.$index, scope.row)"><i class="el-icon-li-qianfei" v-if="scope.row.isOwe==0" style="color: #f00"></i>{{scope.row.studentName}}</el-button>
            <span v-else><i class="el-icon-li-qianfei" v-if="scope.row.isOwe==0" style="color: #f00"></i>{{scope.row.studentName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="mobile" label="手机号" width='120'></el-table-column>
        <!-- <el-table-column align="center" prop="city" label="证件号"></el-table-column> -->
        <el-table-column align="center" prop="orderNo" label="订单编号" width='120'></el-table-column>
        <!-- <el-table-column align="center" prop="subject" label="报名渠道"></el-table-column> -->
        <!-- <el-table-column align="center" prop="registDate" label="支付时间"></el-table-column> -->
        <el-table-column align="center" prop="totalMoney" label="原价"></el-table-column>
        <!-- <el-table-column align="center" prop="birth" label="优惠金额"></el-table-column> -->
        <el-table-column align="center" prop="realMoney" label="实际支付"></el-table-column>
        <el-table-column align="center" prop="raiseMoney" label="欠费金额"></el-table-column>
        <el-table-column align="center" prop="subName" label="归属"></el-table-column>
        <el-table-column align="center" prop="orgName" label="组别"></el-table-column>
        <el-table-column align="center" prop="ownerName" label="归属人"></el-table-column>
        <!-- <el-table-column align="center" prop="goodsName" label="产品名称"></el-table-column> -->
        <!-- <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column> -->
        <!-- <el-table-column align="center" prop="city" label="保单状态"></el-table-column>
        <el-table-column align="center" prop="birth" label="保费"></el-table-column> -->
        <!-- <el-table-column align="center" prop="subject" label="协议"> -->
         <el-table-column align="center" label="操作" fixed="right" width='120'>
             <template slot-scope="scope">
              <el-button type="text" v-if="HasPermission('seeDetails')" @click="seeDetails(scope.row)">查看详情</el-button>
              <el-button type="text" v-if="HasPermission('seeDetails')&&scope.row.orderStatus!=3" @click="toVoid(scope.row)">作废</el-button>
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
    <el-dialog :close-on-click-modal='false' title="查看订单详情" :visible.sync="isShowEdit" v-if="isShowEdit" @close="close" center width='1280px'>
			<order-detail :id="orderId"></order-detail>
		</el-dialog>
  </div>
</template>
<script>
import orderDetail from './order-detail';
import listMixin from "@/api/list";
export default {
  mixins: [listMixin],
  components: {
    orderDetail,
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        orderStatus: 1,
        departId: JSON.parse(sessionStorage.getItem("userInfo")).uc.departId,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
      },
      apiName: "system/api/order/listOrderHash",
      option1: [],
      option2: [],
      loading: false,
      users: [],
      total: 0,
      isShowEdit: false,
      orderId: '',
    };
  },
  methods: {
    formatOrder: function(row, column) {
      return row.orderStatus == 0
        ? "待支付"
        : row.orderStatus == 1
        ? "已完成"
        : row.orderStatus == 2
        ? "已转"
        : row.orderStatus == 3
        ? "已作废"
        : "已冻结";
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        orderStatus: 1,
        departId: JSON.parse(sessionStorage.getItem("userInfo")).uc.departId,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
      };
    },
    close(){
      this.isShowEdit = false
      this.getList()
    },
    seeDetails(row){
      this.isShowEdit = true
      this.orderId = row.id
    },
    getUser() {
      this.filters.curPage = 1;
      this.getList();
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
    toVoid(row){
       var that = this
        that.$confirm('确定作废所选订单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            that.$fetch({
                url: 'system/api/order/modifyOrderStatus',
                method: "post",
                data: {
                    orderId : row.id,
                    orderStatus: 3,
                    ucId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
                },
            }).catch(error => {
                that.$message.error('system/api/order/modifyOrderStatus' + "接口出错！");
            }).then(({ data }) => {
                if (data.code == 30000) {
                    that.$message.success(data.message)
                    that.getList()
                } else {
                    that.$message.warning(data.message)
                }
            })
        });
    },
  },
  mounted() {
    this.getList();
    // this.getoption1();
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
  display: flex;
  width: 22%;
}
</style>