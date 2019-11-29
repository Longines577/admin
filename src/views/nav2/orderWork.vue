<template>
	<div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
                  <i class="el-icon-tickets"></i> 学员信息管理
                </el-breadcrumb-item>
                <el-breadcrumb-item> 工单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
		<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item label="内容">
						<el-input v-model="filters.title" placeholder="请输入内容" size="small" clearable></el-input>
					</el-form-item>
					<div style="float: right">
						<el-form-item>
							<el-button type="primary" @click="getData">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="clear">重置</el-button>
						</el-form-item>
					</div>
				</el-form>
			</el-col>

		<!--列表-->
			<el-table :data="users" border highlight-current-row stripe v-loading="loading" style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="60">
				</el-table-column>
				<el-table-column  align="center" prop="createBy" label="操作人">
				</el-table-column>
				<el-table-column  align="center" prop="updateTime" label="操作时间">
				</el-table-column>
				<el-table-column  align="center" prop="title" label="工单内容">
				</el-table-column>
				<el-table-column  align="center" prop="remark" label="备注">
				</el-table-column>
				<el-table-column align="center" label="操作" width="150">
					<template slot-scope="scope">
						<el-button size="small" type="text" @click="handleDel(scope.row)">删除</el-button>
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
					:total="total">
                </el-pagination>
            </div>
		</div>
	</div>
</template>
<script>
import listMixin from '@/api/list'
export default {
	mixins: [listMixin],
	data() {
		return {
			filters: {
				curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			},
			apiName: 'system/api/workOrder/listWorkOrder',
			delName: 'system/api/workOrder/delWorkOrder',
			loading: false,
			users: [],
			total: 0,
			editForm:{},

		}
	},
	methods: {
		getData(){
			this.filters.curPage = 1
			this.getList()
		},
		clear(){
			this.filters = {
				curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			}
		},
		handleSizeChange(val) {
			this.filters.pageSize = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.filters.curPage = val
			this.getList()
		},
	
	},
	mounted() {
		this.getList();
	}
};

</script>

<style scoped>

</style>