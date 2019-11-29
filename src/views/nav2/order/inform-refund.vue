<template>
  <div>
    <el-card>
      <div class="cont">
        <div class="text">姓名：{{data.studentName}}</div>
        <div class="text">手机：{{data.classPhone}}</div>
        <div class="text" v-if="type==1">可退费：{{data.realMoney}} 元</div>
        <div class="text" v-if="type==2">应退费：{{data.backMoney}} 元</div>
        <!-- <div class="text">费用类型：<span style="color: blue ">报名费</span></div> -->
      </div>
      <el-form :model="editForm" label-width="120px" ref="editForm" :inline="true">
        <el-form-item label="收款人" prop="receiveName" :rules="[{ required: true, message: '请填写收款人', trigger: 'blur' }]">
						<el-input v-model="editForm.receiveName" placeholder="请输入收款人" size="small" clearable></el-input>
				</el-form-item>
        <el-form-item label="退费类型" prop="reType" :rules="[{ required: true, message: '请选择费用类型', trigger: 'blur' }]">
					<el-select v-model="editForm.reType" placeholder="请选择" clearable>
              <el-option v-for="(item,index) in ['订单']" :key="index" :label="item" :value="index+1"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="收款方式" prop="receiveType" :rules="[{ required: true, message: '请填写收款方式', trigger: 'blur' }]">
          <el-select v-model="editForm.receiveType" placeholder="请选择" clearable>
              <el-option v-for="(item,index) in ['现金']" :key="index" :label="item" :value="index+1"></el-option>
          </el-select>
						<!-- <el-input v-model="editForm.receiveType" placeholder="请输入收款方式" size="small" clearable></el-input> -->
				</el-form-item>
				<el-form-item label="申请退费金额"  prop="applyMoney" :rules="[{ required: true, message: '请填写退费金额', trigger: 'blur' }]">
					<el-input v-model="editForm.applyMoney" placeholder="请输入退费金额" size="small" clearable></el-input>
				</el-form-item>
        <el-form-item label="退款账户" prop="receiveNo" :rules="[{ required: true, message: '请填写退款账户', trigger: 'blur' }]">
					<el-input type="text"  v-model="editForm.receiveNo" placeholder="请输入退款账户" size="small" clearable style="width:840px"></el-input>
				</el-form-item>
				<el-form-item label="退款理由" prop="reReason">
					<el-input type="textarea" :rows="2" v-model="editForm.reReason" placeholder="请输入退款理由" size="small" clearable></el-input>
				</el-form-item>
			</el-form>
      <div class="launch">
        <el-button  type="primary" size='mini'  @click="playPay">发起退费申请</el-button>
      </div>
    </el-card>
   
  </div>
</template>
<script>

export default {
  data() {
    return {
      editForm: {},
      rules: {},
      show: false,
      paymentList: [],
      isShowqrcode: false,
      dataList:'',
      timer: ''
    }
  },
  props:{
    data: {
      type: Object
    },
    orderDetailId:
     {
      type: Number
    },
    type:
     {
      type: Number
    },
  },
   mounted(){
   
  },
  methods: {
  
    playPay(){
      this.$refs.editForm.validate((valid) => {
          if(valid){
               this.getPayment()
          }
      })
    },
    async getPayment() { 
        const loading = this.$loading({
            lock: true,
            text: '发起中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        let { data } = await this.$http({
            url: 'system/api/refund/createRefund',
            method: "post",
            data: {
              busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
              orderDetailId: this.orderDetailId,
              orderId: this.data.id,
              receiveName: this.editForm.receiveName,
              applyId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
              applyName: JSON.parse(sessionStorage.getItem("userInfo")).user.userName,
              receiveNo: this.editForm.receiveNo,
              reReason: this.editForm.reReason,
              reType:this.editForm.reType,
              receiveType:this.editForm.receiveType,
              applyMoney:this.editForm.applyMoney,
              // remark:this.editForm.remark,
              // receiptNo:this.editForm.receiptNo,
              // planMendDate:this.editForm.planMendDate,
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
            loading.close();
        });
        if (data.code == 30000) {
            this.dataList = data.result
            this.$emit('close-ok')
            loading.close();
             this.$message.success(data.message)
        } else {
          this.$message.warning(data.message)
          loading.close();
        }
    },
   
  }

}
</script>
<style lang="scss" scoped>
.el-card{
  margin-top: 20px;
}
.el-textarea{
    display: block;
    width: 840px !important;
}
.cont{
   display: flex;
  justify-content: space-around;
  width: 60%;
  padding: 10px 20px 20px;
  
}
.launch{
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>