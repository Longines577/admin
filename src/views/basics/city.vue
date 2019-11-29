<template>
	<div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
                  <i class="el-icon-tickets"></i> 基础设置
                </el-breadcrumb-item>
                <el-breadcrumb-item> 省份管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
		<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<!-- <el-form-item>
						<el-input v-model="filters.name" placeholder="姓名"></el-input>
					</el-form-item> -->
					<el-form-item label="省份">
						<el-input v-model="filters.name" placeholder="请输入省份" size="small" clearable></el-input>
					</el-form-item>
					<div style="float: right">
						<el-form-item>
							<el-button type="primary" @click="getData">查询</el-button>
						</el-form-item>
						<!-- <el-form-item>
							<el-button type="primary" @click="showEdit(0)">新增</el-button>
						</el-form-item> -->
					</div>
				</el-form>
			</el-col>

		<!--列表-->
			<el-table :data="users" border highlight-current-row stripe v-loading="loading" style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="60">
				</el-table-column>
				<el-table-column  align="center" prop="name" label="省份">
				</el-table-column>
				<el-table-column  align="center" prop="code" label="省份编号">
				</el-table-column>
				<!-- <el-table-column align="center" label="操作"  width="220">
					<template slot-scope="scope">
							<el-button  @click="handleEdit(scope.row,1)">修改</el-button>
					</template>
				</el-table-column> -->
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
		<!-- <el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" center>
			<el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
				<el-form-item label="省份" prop="city" :rules="[{ required: true, message: '请填写省份', trigger: 'blur' }]">
					<el-input v-model="editForm.city" placeholder="请输入省份" size="small" clearable></el-input>
				</el-form-item>
				<el-form-item label="省份编号" prop="num" :rules="[{ required: true, message: '请填写省份编号', trigger: 'blur' }]">
					<el-input v-model="editForm.num" placeholder="请输入编号" size="small" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
				<el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
			</div>
		</el-dialog> -->
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
			},
			apiName: 'system/api/region/listRegion',
			loading: false,
			users: [],
			total: 0,
			editForm:{},
			isShowEdit: false,
			isEdit: 0,

		}
	},
	methods: {
		getData(){
			this.filters.curPage = 1
			this.getList()
		},
		clear(){
			this.filters = {}
		},
		// showEdit(isEdit) {
		// 	this.isEdit = isEdit
		// 	this.isShowEdit = true
		// 	this.editForm = {}
		// },
		// handleEdit(row,isEdit){
		// 	this.isEdit = isEdit
		// 	this.isShowEdit = true
		// 	this.editForm = row
		// },
		// editSubmit(){
		// 	this.$refs.editForm.validate((valid) => {
		// 		if(valid){
		// 			this.isShowEdit = false
		// 		}
		// 	})
		// },
		handleSizeChange(val) {
			this.filters.pageSize = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.filters.curPage = val
			this.getList()
		},
		//获取用户列表
	
	},
	mounted() {
		this.getList();
	}
};

</script>

<style scoped>

</style>