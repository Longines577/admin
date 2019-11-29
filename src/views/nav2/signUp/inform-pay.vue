<template>
  <div>
    <el-card>
      <div class="cont">
        <div class="text">姓名：{{data.studentName}}</div>
        <div class="text">手机：{{data.classPhone}}</div>
        <div class="text">欠费：{{data.raiseMoney}} 元</div>
        <!-- <div class="text">费用类型：<span style="color: blue ">报名费</span></div> -->
      </div>
      <el-form :model="editForm" label-width="100px" :rules="rules" ref="editForm" :inline="true">
        <el-form-item label="费用类型" prop="costType" :rules="[{ required: true, message: '请选择费用类型', trigger: 'blur' }]">
					<el-select v-model="editForm.costType" placeholder="请选择" clearable>
              <el-option v-for="(item,index) in costTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="支付方式" prop="paymentId" :rules="[{ required: true, message: '请选择支付方式', trigger: 'blur' }]">
					<el-select v-model="editForm.paymentId" placeholder="请选择" clearable @change="getType">
              <el-option v-for="(item,index) in paymentList" :key="index" :label="item.payName" :value="item.id"></el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="支付金额"  prop="totalMoney">
					<el-input v-model="editForm.totalMoney" placeholder="请输入支付金额" size="small" clearable>
          </el-input>
				</el-form-item>
				<el-form-item label="预补缴日期" prop="planMendDate" v-if="show" :rules="[{ required: true, message: '请填写补缴日期', trigger: 'blur' }]">
					 <el-date-picker
              v-model="editForm.planMendDate"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
            </el-date-picker>
				</el-form-item>
        <el-form-item label="收据号" prop="receiptNo">
					<el-input type="text"  v-model="editForm.receiptNo" placeholder="请输入收据号" size="small" clearable style="width:840px"></el-input>
				</el-form-item>
        <el-form-item label="确认码" prop="receiptNo">
					<el-input type="text"  v-model="editForm.confirmCode" placeholder="请输入确认码" size="small" clearable style="width:840px"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" :rows="2" v-model="editForm.remark" placeholder="请输入备注" size="small" clearable></el-input>
				</el-form-item>
			</el-form>
      <div class="launch">
        <el-button  type="primary" size='mini'  @click="playPay">发起支付</el-button>
      </div>
    </el-card>
    <el-dialog :visible.sync="isShowqrcode"  :title="editForm.paymentId==1?'微信支付':editForm.paymentId==2?'支付宝支付':'二维码'" center append-to-body width="240px" @close='colseQr' @opened='openQrCode'>
       <div id="qrcode" ref="qrcode"></div>   
    </el-dialog>
  </div>
</template>
<script>

import QRCode from 'qrcode2'
export default {
  components: {QRCode},
  data() {
    var checkMoney=(rule, value, callback) => {
        if (!value) {
          return callback(new Error('缴费金额不能为空'));
        }
        setTimeout(() => {
            if (value > this.data.raiseMoney) {
              callback(new Error('必须小于欠费金额'));
            } else {
              callback();
            }
        }, 100);
    };
    return {
      editForm: {},
      rules: {
        totalMoney:[
            {  validator: checkMoney,  trigger: 'blur' }
          ]
      },
      show: false,
      costTypeList: [],
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
    type:
     {
      type: Number
    },
  },
   mounted(){
    console.log(this.data,1111)
    this.getCostType()
    this.getPaymentList()
  },
  methods: {
    setTotal(){
      this.editForm.totalMoney = this.data.raiseMoney
      this.show = false
    },
    colseQr(){
      this.$emit('close-ok')
      clearInterval(this.timer)
    },
    
    getType(id){
      this.paymentList.forEach((item,index)=>{
        if(item.id == id){
          this.editForm.isOnline = item.isOnline
          this.editForm.isStages = item.isStages
        }
      })
    },
    playPay(){
      this.$refs.editForm.validate((valid) => {
          if(valid){
               this.getPayment()
          }
      })
     
      // var e = document.getElementById('qrcode')
      // e.innerHTML = ""
    },
    openQrCode(){
      
       let qrcode = new QRCode('qrcode', {  
          width: 200,  
          height: 200, // 高度  
          text: this.dataList.qrCode // 二维码内容  
        }) 
    },
    async getPaymentList() { 
        let { data } = await this.$fetch({
            url: 'system/api/payment/queryPayment',
            method: "post",
            data: {
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
                isStages: 0
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.paymentList = data.result
            this.paymentList.forEach((item,i)=>{
              if(item.payName=='小程序支付'){
                this.paymentList.splice(i, 1)
              }
            })
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
    async getPayment() { 
        const loading = this.$loading({
            lock: true,
            text: '发起中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        let { data } = await this.$http({
            url: 'system/api/pay/initPayment',
            method: "post",
            data: {
              busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
              orderId: this.data.id,
              studentId: this.data.studentId,
              createId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
              paymentId: this.editForm.paymentId,
              costType: this.editForm.costType,
              isOnline:this.editForm.isOnline,
              isStages:this.editForm.isStages,
              totalMoney:this.editForm.totalMoney,
              remark:this.editForm.remark,
              receiptNo:this.editForm.receiptNo,
              planMendDate:this.editForm.planMendDate,
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
            loading.close();
        });
        if (data.code == 30000) {
            this.dataList = data.result
            if(this.editForm.paymentId==1||this.editForm.paymentId==2){
               this.isShowqrcode = true
               this.timer = setInterval(() => {
                 this.getPayStatus(data.result.payId)
               }, 5000);
            }else{
              this.$emit('close-ok')
              this.$message.success(data.message)
            }
           
            loading.close();
        } else {
          loading.close();
          this.$message.warning(data.message)
         
        }
    },
    async getPayStatus(id) { 
        let { data } = await this.$fetch({
            url: 'system/api/pay/queryPayStatus',
            method: "post",
            data: {
                payId: id
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            if(data.result!=0){
              this.$message.success('支付成功')
              this.$emit('close-ok')
              clearInterval(this.timer)
            }
           
        } else {
          this.$message.warning(data.message)
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