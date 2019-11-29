<template>
	<div class="table">
		<div class="container"  v-if='show'>
			<div class="heade">
				<span class="middle text">组织架构</span>
				<el-button style="float:right;" type="primary" size="mini" @click="goBack">返回</el-button>
			</div>
			<el-table :data="users" border highlight-current-row stripe v-loading="loading" style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="60"></el-table-column>
				<el-table-column align="center" prop="userName" label="姓名"></el-table-column>
				<el-table-column align="center" prop="gender" :formatter="formatType" label="性别"></el-table-column>
				<el-table-column  align="center" prop="depart" label="部门" ></el-table-column>
				
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
					:total="total">
                </el-pagination>
            </div>
		</div>
		<OrgStructChart ref="org"  @get-data="getList" v-show='!show'></OrgStructChart>
	</div>
</template>
<script>
import OrgStructChart from './OrgStructChart'
	
export default {
  components: {
    OrgStructChart
  },
	data() {
		return {
			filters: {
				curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
				subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId
			},
			total: 0,
			users:[],
			show: false
		}
	},
	methods: {
		goBack(){
			this.$refs.org.queryOrgStructChart()
			this.show = false
		},
		formatType(row, column){
			return row.gender == 0 ? '男' : row.recordType == 1 ? '女' : '未知';
		},
		handleSizeChange(val) {
			this.filters.pageSize = val
			this.getList(this.filters.departId)
		},
		handleCurrentChange(val) {
			this.filters.curPage = val
			this.getList(this.filters.departId)
		},
		async getList(id) {
			this.filters.departId = id
			this.loading = true
            this.show = true
            let { data } = await this.$fetch({
                url: 'system/api/queryUcByDepartId',
                method: "post",
                data: this.filters,
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.users = data.result.content
                this.total = data.result.total
            }
            this.loading = false
        },
	},
	mounted() {
		
	}
};

</script>

<style scoped>
.container {
    padding: 0 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.heade {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 68px;
	line-height: 68px;
}

.heade .text {
	font-size: 14px;
	color: #000000;
	font-family: "PingFangSC-Semibold","Microsoft YaHei", Arial, Helvetica, sans-serif, "SimSun";
}

.heade .el-date-editor {
	float: right;
}
</style>