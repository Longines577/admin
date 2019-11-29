<template>
	<div class="cont">
		<el-card class="box-card">
			<el-timeline class="cont" >
            <el-timeline-item 
            v-for="(item, index) in dataDetails" :key="index" 
			type='success'
            :timestamp="item.createTime" 
            placement="top">
              <el-card>
                <div class="sty">订单编号：{{item.orderNo}}</div>
				<div class="sty">子订单ID：{{item.id}}</div>
				<div class="sty">商品名称：{{item.goodsName}}</div>
				<div class="sty">应缴金额：{{item.totalMoney}}</div>
				<div class="sty">实际支付：{{item.realMoney}}</div>
				<div class="sty">欠费金额：<span style="color:red">{{item.raiseMoney}}</span></div>
				<div class="sty" v-if="item.normalAgree">普通协议：<el-button  type="text" @click="seeAgree(item.normalAgree)">查看详情</el-button></div>
				<div class="sty" v-if="item.supplyAgree">补充协议：<el-button  type="text" @click="seeAgree(item.supplyAgree)">查看详情</el-button></div>
              </el-card>
            </el-timeline-item>
        </el-timeline>
			
		</el-card>
    </div>
</template>
<script>
export default {
	data() {
		return {
			dataDetails:{
				number: '4545454415212',
				price: '8888.00',
				money: '2222.00',
				payment: '6666.00',
				time: '2019-06-01  18:35',
				stagesType: '百度分期',
				num1: 10,
				num2: 11,
			},
		}
	},
	methods: {
		seeAgree(url){
			window.open(url)
		},
		async getData() { 
            let { data } = await this.$fetch({
                url: 'system/api/order/queryOrderByStudent',
                method: "post",
                data: {
                    studentId: this.$route.query.id
                },
            }).catch(error => {
                this.$message.error('student/detailStudent' + "接口出错！");
            });
            if (data.code == 30000) {
				this.dataDetails = data.result
            }else {
				this.$message.warning(data.message)
			}
        },
	},
	mounted() {
		this.getData()
	}
};

</script>

<style scoped>

.sty{
	font-size: 14px;
	font-family: '微软雅黑';
	letter-spacing: 1px;
	line-height: 2;
}
</style>