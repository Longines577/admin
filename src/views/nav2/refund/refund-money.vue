<template>
  <div>
    <el-card>
      <div class="cont">
        <div class="text">姓名：{{data.studentName}}</div>
        <div class="text">申请退费金额：{{data.applyMoney}}</div>
        <div class="text">已打款金额：{{data.getMoney}} 元</div>
        <!-- <div class="text">费用类型：<span style="color: blue ">报名费</span></div> -->
      </div>
      <el-form :model="editForm" label-width="120px" :rules='rules' ref="editForm" :inline="true">
				<el-form-item label="本次打款金额"  prop="transferMoney" :rules="[{ required: true, message: '请填写打款金额', trigger: 'blur' }]">
					<el-input v-model="editForm.transferMoney" placeholder="请输入打款金额" size="small" clearable></el-input>
				</el-form-item>
        <el-form-item label="打款日期"  prop="transferDate" :rules="[{ required: true, message: '请填写打款金额', trigger: 'blur' }]">
					<el-date-picker
            v-model="editForm.transferDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
				</el-form-item>
        <el-form-item label="预计到账日期"  prop="arrivalDate" :rules="[{ required: true, message: '请填写到账时间', trigger: 'blur' }]">
					<el-date-picker
            v-model="editForm.arrivalDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
				</el-form-item>
			</el-form>
      <div class="launch">
        <el-button  type="primary" size='mini'  @click="playPay">确认打款</el-button>
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
      dataList:'',
    }
  },
  props:{
    data: {
      type: Object
    },
    // type:
    //  {
    //   type: Number
    // },
  },
   mounted(){
    console.log(this.data,1111)
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
            url: 'system/api/refund/createRefundDetail',
            method: "post",
            data: {
              busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
              orderId: this.data.orderId,
              studentId: this.data.studentId,
              refundId: this.data.id,
              orderDetailId:  this.data.orderDetailId,
              createId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
              createName: JSON.parse(sessionStorage.getItem("userInfo")).user.userName,
              transferMoney: this.editForm.transferMoney,
              transferDate: this.editForm.transferDate,
              arrivalDate:this.editForm.arrivalDate,
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
            loading.close();
        });
        if (data.code == 30000) {
            this.dataList = data.result
            this.$emit('close-ok')
            this.$message.success(data.message)
            loading.close();
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
  .text{
    font-weight: 600;
  }
}
.launch{
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>