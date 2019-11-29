<template>
	<div class="cont">
		<div class="tips">订单详情：</div>
		<el-card class="box-card">
			<div class="order">
				<div class="sty">订单编号：{{orderList.orderNo}}</div>
				<div class="sty">姓名：{{orderList.studentName}}</div>
				<div class="sty">订单状态：{{orderList.orderStatus==0?'待支付':orderList.orderStatus==1?'已完成':orderList.orderStatus==2?'已转':orderList.orderStatus==3?'已作废':'已冻结'}}</div>
				<div class="sty">签约状态：{{orderList.signStatus==0?'未签约':'已签约'}}</div>
				<div class="sty">支付状态：{{orderList.payStatus==0?'未支付':'已支付'}}</div>
				<div class="sty">原价：{{orderList.totalMoney}}</div>
				<div class="sty">实际支付：{{orderList.realMoney}}</div>
				<div class="sty">实际欠费金额：{{orderList.raiseMoney}}</div>
				<div class="sty">已发起金额：{{orderList.advanceMoney}}</div>
				<!-- <div class="sty">欠费：{{orderList.waitPayMoney}}</div> -->
				<div class="sty" v-if="orderList.backMoney>0">应退费：{{orderList.backMoney}}</div>
				<div class="sty">备注：{{orderList.remark}}</div>
			</div>
			<div class="launch">
				<!-- <el-button  type="primary" size='mini' v-if="orderList.backMoney>0" @click="toRefund">去退费</el-button> -->
				<el-button  type="primary" size='mini' v-if="orderList.isOwe==0&&orderList.orderStatus==0" @click="toPay">去支付</el-button>
				<el-button  type="primary" size='mini' v-if="orderList.isOwe==0&&orderList.orderStatus==0" @click="toStages">去分期</el-button>
			</div>
		</el-card>
		<div class="tips">支付记录：</div>
		<el-card class="box-card">
			<el-table class="courseTable" :data="payDetails" border highlight-current-row stripe style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="55"></el-table-column>
				<el-table-column align="center" prop="payNo" label="支付编号"></el-table-column>
				<el-table-column align="center" prop="paymentId" label="支付方式" :formatter="payment"></el-table-column>
				<el-table-column align="center" prop="payStatus" label="支付状态" >
					<template slot-scope="scope">
						<el-button type="text" @click="playPay(scope.row)" v-if="scope.row.payStatus == 0&&scope.row.financeStatus != 2">待确认</el-button>
						<span v-if="scope.row.payStatus == 1&&scope.row.financeStatus != 2">已支付</span>
						<span v-if="scope.row.financeStatus == 2">已驳回</span>
					</template>
				</el-table-column>
				<el-table-column  align="center" prop="totalMoney" label="支付金额" ></el-table-column>
				<el-table-column  align="center" prop="payTime" label="支付时间" ></el-table-column>
				<el-table-column  align="center" prop="confirmCode" label="确认码" >
					<template slot-scope="scope">
						<el-button type="text" @click="addCode(scope.row)" v-if="(scope.row.confirmCode==''||scope.row.confirmCode==null)&&orderList.orderStatus!=3">添加确认码</el-button>
						<el-button type="text" @click="addCode(scope.row)" v-if="(scope.row.confirmCode!=''||scope.row.confirmCode!=null)&&orderList.orderStatus!=3">{{scope.row.confirmCode}}</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="remark" label="备注"></el-table-column>
				<el-table-column align="center" label="操作" >
					<template slot-scope="scope">
						<el-button type="text" v-if="scope.row.payStatus == 0&&scope.row.financeStatus != 2&&orderList.orderStatus!=3" @click="handleDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		 </el-card> 
		<div class="tips">订单明细：</div>
		<el-card class="box-card">
			<el-table class="courseTable" :data="orderDetails" border highlight-current-row stripe style="width: 100%;">
				<el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
				<el-table-column align="center" prop="isTransfer" label="转班状态" :formatter="row=>row.isTransfer==0?'未转班':row.isTransfer==1?'待确认':'已转班'"></el-table-column>
				<el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
				<el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
				<el-table-column align="center" prop="goodsName" label="班型名称"></el-table-column>
				<el-table-column align="center" prop="totalMoney" label="订单价格" ></el-table-column>
				<el-table-column align="center" prop="realMoney" label="实缴金额" ></el-table-column>
				<el-table-column align="center" prop="orderStatus" label="订单状态" :formatter="formatOrder" ></el-table-column>
				<el-table-column align="center" label="操作" width='200'>
					<template slot-scope="scope">
						<el-button type="text" v-if="scope.row.isTransfer==0&&scope.row.orderStatus!=3" @click="handleEdit(scope.row)">转班</el-button>
						<el-button type="text" v-if="scope.row.isTransfer==1&&scope.row.orderStatus!=3" @click="shiftDel(scope.row)">删除转班申请</el-button>
						<el-button type="text" size='mini' v-if="scope.row.orderStatus==3&&scope.row.backMoney>0&&(scope.row.isRefund==0||scope.row.isRefund==null)" @click="toRefund(scope.row,2)">转班退费</el-button>
						<el-button type="text" size='mini' v-if="scope.row.realMoney>0&&scope.row.orderStatus!=3&&scope.row.orderStatus!=2&&scope.row.isTransfer!=1&&scope.row.isRefund!=1" @click="toRefund(scope.row,1)">去退费</el-button>
						<el-button type="text" v-if="scope.row.orderStatus==1" @click="operation(scope.row,4)">冻结</el-button>
						<el-button type="text" v-if="scope.row.orderStatus==4" @click="operation(scope.row,1)">解冻</el-button>
						<el-button type="text" v-if="scope.row.orderStatus==1" @click="operation(scope.row,3)">作废</el-button>
					</template>
				</el-table-column>
			
			</el-table>
		 </el-card> 
	   <el-dialog :close-on-click-modal='false' title="支付" :visible.sync="isShowEdit" v-if="isShowEdit" append-to-body @close="close" center width='1280px'>
		    <inform-pay v-if="show==1" :data="orderList" @close-ok="close"></inform-pay>
      		<inform-stages v-if="show==2" :data="orderList" @close-ok="close"></inform-stages>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' :visible.sync="isShowqrcode"  :title="payName" center append-to-body width="240px" @close='colseQr' @opened='openQrCode'>
			<div id="qrcode" ref="qrcode"></div>   
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="转班" :visible.sync="isShowShift" v-if="isShowShift" append-to-body  center width='1280px'>
			<classTransfer :data='shiftData' @emit-ok='emitOk'></classTransfer>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="退费" :visible.sync="isShowRefund" v-if="isShowRefund" append-to-body  center width='1280px'>
			<inform-refund :data="orderList" :type='typeRefund' :orderDetailId="orderDetailId" @close-ok="close"></inform-refund>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="确认码" :visible.sync="isShowCode" center append-to-body width='580px'>
			<el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
				<el-form-item label="确认码" prop="confirmCode" :rules="[{ required: true, message: '请输入确认码', trigger: 'blur' }]">
					<el-input v-model="editForm.confirmCode" placeholder="请输入确认码" size="small" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="isShowCode=false">取消</el-button>
				<el-button  type="primary" @click.native="editSubmit">确定</el-button>
			</div>
		</el-dialog>
    </div>
</template>
<script>
import informPay from '../signUp/inform-pay';
import informStages from '../signUp/inform-stages'
import classTransfer from '../classTransfer/classTransfer';
import informRefund from './inform-refund';
import QRCode from 'qrcode2'
export default {
	components: {
		QRCode,
		informPay,
		informStages,
		classTransfer,
		informRefund
	},
	data() {
		return {
			value1: '',
			shiftData:{},
			orderList: {},
			orderDetails: [],
			payDetails:[],
			paymentType:[],
			show: 1,
			isShowEdit:false,
			isShowqrcode: false,
			payName: '微信支付',
			qrCode: '',
			isShowShift: false,
			isShowRefund: false,
			orderDetailId:'',
			typeRefund: '',
			editForm: {},
			isShowCode: false,
		}
	},
	props: {
      id:{
          type: Number
      	},
	  },
	methods: {
		addCode(row){
			this.editForm = {
				id:row.id,
				confirmCode: row.confirmCode
			}
			this.isShowCode = true
		},
		editSubmit(){
			this.$refs.editForm.validate((valid) => {
				if(valid){
					this.updateCode()
				}
			})
		},
		async updateCode(){
			let { data } = await this.$fetch({
                url: 'system/api/pay/updatePay',
                method: "post",
                data: this.editForm,
            }).catch(error => {
                this.$message.error(this.updateName + "接口出错！");
            });
            if (data.code == 30000) {
				this.$message.success(data.message)
				this.getDetail()
				this.isShowCode = false
            } else {
                this.$message.warning(data.message)
            }
		},
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
		operation(row,index){
			console.log(row,row.id,row.orderId,index,1111111)
			this.$confirm(`确定${index==1?'解冻':index==3?'作废':index==4?'冻结':''}该订单？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
				this.$fetch({
					url: 'system/api/orderDetail/modifyOrderDetailStatus',
					method: "post",
					data: {
						orderId: row.orderId,
						orderDetailId: row.id,
						orderStatus: index,
					},
				}).catch(error => {
					this.$message.error( 'order/queryOrderAndDetail' + "接口出错！");
				}).then(({ data }) => {
					if (data.code == 30000) {
						this.$message.success(data.message)
						this.getData()
					} else {
						this.$message.warning(data.message)
					}
				})
			})
		},
		emitOk(){
			this.isShowShift = false
			this.getData()
		},
		handleEdit(row) {
			this.isShowShift = true;
			this.shiftData = row
		},
		close(){
			this.isShowEdit = false
			this.isShowRefund = false
			this.getDetail()
			this.getData()
		},
		colseQr(){
			this.isShowqrcode = false
		},
		toPay(){
			this.isShowEdit = true
			this.show = 1
		},
		toStages(){
			this.isShowEdit = true
			this.show = 2
		},
		toRefund(row,index){
			this.orderDetailId = row.id
			this.typeRefund = index
			this.isShowRefund = true
		},
		payment(row,column){
			this.paymentType.forEach((item,index)=>{
				if(item.id == row.paymentId){
					row.paymentId = item.payName
				}
			})
			return row.paymentId
		},
		playPay(row){
			if(row.qrCode){
				this.isShowqrcode = true
				this.payName=row.paymentId
				this.qrCode = row.qrCode
			}
			
		},
		openQrCode(){
			var e = document.getElementById('qrcode')
			e.innerHTML = ""
			let qrcode = new QRCode('qrcode', {  
				width: 200,  
				height: 200, // 高度  
				text: this.qrCode // 二维码内容  
				}) 
		},
		async getPaymentType() { 
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
				this.paymentType = data.result
			} else {
			this.$message.warning(data.message)
			}
        },
		getData(){
			this.$fetch({
				url: 'system/api/order/queryOrderAndDetail',
				method: "post",
				data: {
					orderId: this.id
				},
			}).catch(error => {
				this.$message.error( 'order/queryOrderAndDetail' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					this.orderList = data.result
					this.orderDetails = data.result.orderDetails
				} else {
					this.$message.warning(data.message)
				}
			})
		},
		getDetail(){
			this.$fetch({
				url: 'system/api/pay/queryPayByOrder',
				method: "post",
				data: {
					orderId: this.id
				},
			}).catch(error => {
				this.$message.error( '/pay/queryPayByOrder' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					this.payDetails = data.result
				} else {
					this.$message.warning(data.message)
				}
			})
		},
		async shiftDel(row) {
            var that = this
            that.$confirm('确定删除所选纪录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$fetch({
                    url: 'system/api/transfer/deleteTranferByDetailId',
                    method: "post",
                    data: {
                        orderDetailId: row.id
                    },
                }).catch(error => {
                    that.$message.error('deleteTranferByDetailId' + "接口出错！");
                }).then(({ data }) => {
                    if (data.code == 30000) {
                        that.$message.success('删除成功！')
                        that.getData()
                    } else {
                        that.$message.warning(data.message)
                    }
                })
            });
        },
		async handleDel(row) {
            var that = this
            that.$confirm('确定删除所选纪录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$fetch({
                    url: 'system/api/pay/deletePay',
                    method: "post",
                    data: {
                        payId: row.id
                    },
                }).catch(error => {
                    that.$message.error('system/api/pay/deletePay' + "接口出错！");
                }).then(({ data }) => {
                    if (data.code == 30000) {
                        that.$message.success('删除成功！')
                        that.getDetail()
                    } else {
                        that.$message.warning(data.message)
                    }
                })
            });
        },
	},
	mounted() {
		this.getData()
		this.getDetail()
		this.getPaymentType()
	}
};

</script>

<style lang="scss" scoped>
.tips{
	margin: 20px 0;
}
.order{
	display: flex;
	flex-wrap: wrap;
	// justify-content: space-around;
	.sty{
		width: 25%;
		height: 30px;
	}
}
.launch{
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>