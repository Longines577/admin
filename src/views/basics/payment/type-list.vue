<template>
	<div class="table">
        <div class="container">
		<!--工具条-->
				<el-form :inline="true" :model="filters" >
					<el-form-item label="名称" >
						<el-input v-model="filters.name" placeholder="请输入名称" size="small" clearable></el-input>
					</el-form-item>
					<div style="float: right">
						<el-form-item>
							<el-button type="primary" @click="getList">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="clear">重置</el-button>
						</el-form-item>
					</div>
					
				</el-form>
			<div style="margin: 20px 0;border-top: 1px #ccc solid;" ></div>
			<div style="margin: 10px 0;height: 40px;">
				<el-checkbox v-model="filters.checked">只显示启用项目</el-checkbox>
				<el-button type="primary" class="btn" v-if="HasPermission('add3')" @click="showEdit(0)">新增</el-button>
			</div>
		<!--列表-->
			<el-table :data="users" border highlight-current-row stripe v-loading="loading" style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="60">
				</el-table-column>
				<el-table-column  align="center" prop="status" :formatter="formatType" label="状态">
				</el-table-column>
				<el-table-column  align="center" prop="name" label="名称">
				</el-table-column>
				<el-table-column  align="center" prop="des" label="描述">
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="修改" placement="left">
							<el-button circle type="primary" size='medium' v-if="HasPermission('update3')" @click="handleEdit(scope.row,1)" icon="el-icon-li-xiugai1"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="right">
							<el-button circle type="danger" size='medium' v-if="HasPermission('del3')" @click="handleDel(scope.row)" icon="el-icon-delete"></el-button>
						</el-tooltip>
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
		<el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" center>
			<el-form :model="editForm" label-width="80px"  ref="editForm">
				<el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]">
					<el-input v-model="editForm.name" placeholder="请输入名称" size="small" clearable></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="des" >
					<el-input  type="textarea" :rows="2" v-model="editForm.des" placeholder="请输入描述" size="small" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
				<el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import listMixin from '@/api/list'
export default {
	mixins: [listMixin],
	props: {
		type: {
			type: Number
		}
	},
	data() {
		return {
			filters: {
				curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			},
			apiName: 'system/api/costType/listCostType',
			addName: 'system/api/costType/addCostType',
			updateName: 'system/api/costType/updateCostType',
			delName:'system/api/costType/delCostType',
			editForm: {},
			loading: false,
			users: [],
			total: 0,
			isShowEdit: false,
			isEdit: 0,
		}
	},
	
	methods: {
		formatType(row, column){
			return row.status == 0 ? "停用" : row.status == 1 ? "启用" : "片";
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
		showEdit(isEdit) {
			this.isEdit = isEdit
			this.isShowEdit = true
			this.editForm = {}
		},
		handleEdit(row,isEdit){
			this.isEdit = isEdit
			this.isShowEdit = true
			this.editForm = {
				id:row.id,
				name:row.name,
				des:row.des
			}
		},
		editSubmit(){
			this.editForm.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			this.$refs.editForm.validate((valid) => {
				if(valid){
					if(this.isEdit){
						this.update()
					}else{
						this.add()
					}
				}
			})
		},
		editOk() {
			this.isShowEdit = false
			this.getList()
		},
	
	},
	mounted() {
		this.getList();
	}
};

</script>

<style scoped>
.btn{
	position: absolute;
	right: 70px;
}
.btn2{
	width: 30%;
}
</style>