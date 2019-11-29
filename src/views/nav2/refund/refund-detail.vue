<template>
	<div class="cont">
		<div class="tips">打款明细：</div>
		<el-card class="box-card">
			<el-table class="courseTable" :data="refundList" border highlight-current-row stripe style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="55"></el-table-column>
				<el-table-column align="center" prop="transferMoney" label="打款金额"></el-table-column>
				<el-table-column align="center" prop="transferDate" label="打款时间" ></el-table-column>
				<el-table-column align="center" prop="arrivalDate" label="到款时间" ></el-table-column>
				<el-table-column align="center" prop="createName" label="操作者" ></el-table-column>
				<el-table-column  align="center" prop="createTime" label="创建时间" ></el-table-column>
				<el-table-column align="center" label="操作" >
					<template slot-scope="scope">
						<el-button type="text" v-if="scope.row.isDeleted == 0" @click="handleDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card> 
    </div>
</template>
<script>
export default {
	data() {
		return {
			refundList:[]
		}
	},
	props: {
      id:{
          type: Number
      	},
	  },
	methods: {
		
		getData(){
			this.$fetch({
				url: 'system/api/refund/queryRefundAndDetail',
				method: "post",
				data: {
					refundId: this.id
				},
			}).catch(error => {
				this.$message.error( 'order/queryOrderAndDetail' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					this.refundList = data.result.refundDetails
				} else {
					this.$message.warning(data.message)
				}
			})
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