<template>
	<div class="cont">
		<div class="tips">扣费记录：</div>
		<el-card class="box-card">
			<el-table class="courseTable" :data="refundList" border highlight-current-row stripe style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="55"></el-table-column>
				<el-table-column align="center" prop="oweFee" label="扣费金额"></el-table-column>
				<el-table-column align="center" prop="deductType" label="扣费类型" :formatter="payment" ></el-table-column>
				<el-table-column  align="center" prop="createTime" label="创建时间" ></el-table-column>
				<!-- <el-table-column align="center" label="操作" >
					<template slot-scope="scope">
						<el-button type="text" v-if="scope.row.isDeleted == 0" @click="handleDel(scope.row)">删除</el-button>
					</template>
				</el-table-column> -->
			</el-table>
		</el-card> 
    </div>
</template>
<script>
export default {
	data() {
		return {
			refundList:[],
			deductTypeList:[],
		}
	},
	props: {
      id:{
          type: Number
      	},
	  },
	methods: {

		payment(row,column){
			this.deductTypeList.forEach((item,index)=>{
				if(item.value == row.deductType){
					row.deductType = item.name
				}
			})
			return row.deductType
		},
		async getCostType() { //字典类别查询试题类型
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
                this.deductTypeList = data.result
            }
        },
		getData(){
			this.$fetch({
				url: 'system/api/oweFee/queryOweFeeByDetail',
				method: "post",
				data: {
					orderDetailId: this.id
				},
			}).catch(error => {
				this.$message.error( 'order/queryOrderAndDetail' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					this.refundList = data.result
				} else {
					this.$message.warning(data.message)
				}
			})
		},
		
	},
	mounted() {
		this.getData()
		this.getCostType()
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