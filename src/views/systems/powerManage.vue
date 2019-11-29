<template>
	<div class="table">
		<div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
                  <i class="el-icon-tickets"></i> 系统设置
                </el-breadcrumb-item>
                <el-breadcrumb-item> 权限管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
		<!--工具条-->
				<el-form :inline="true" :model="filters" >
					<el-form-item label="资源名称">
						<el-input v-model="filters.title" placeholder="请输入资源名称" size="small" clearable></el-input>
					</el-form-item>
					<el-form-item label="资源类型">
						<el-select v-model="filters.type" placeholder="请选择资源类型" clearable>
							<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
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
			<div style="margin: 20px 0;border-top: 1px #ccc solid;" ></div>
			<div style="margin: 10px 0;height: 40px;">
				<el-button type="primary" icon="el-icon-plus" v-if="HasPermission('add')" @click="showEdit(0)">新增</el-button>
			</div>
		<!--列表-->
			<el-table :data="users" border highlight-current-row stripe v-loading="loading" style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="60">
				</el-table-column>
				<el-table-column  align="center" prop="title" label="资源名称">
				</el-table-column>
				<el-table-column  align="center" prop="type" :formatter="formatType" label="资源类型">
				</el-table-column>
				<el-table-column  align="center" prop="url" label="路径" >
				</el-table-column>
        		<el-table-column  align="center" prop="createTime" label="创建时间" sortable >
				</el-table-column>
				<el-table-column align="center" label="操作"  width="220">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="修改" placement="left">
							<el-button circle type="primary" size='medium' v-if="HasPermission('update')" @click="handleEdit(scope.row,1)" icon="el-icon-li-xiugai1"></el-button>
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
		<el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" center  width="30%">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="资源名称" prop="title" :rules="[{ required: true, message: '请输入资源名称', trigger: 'blur' }]">
					<el-input v-model="editForm.title" placeholder="请输入资源名称" size="small" clearable></el-input>
				</el-form-item>
				<el-form-item label="资源类型" prop="type" :rules="[{ required: true, message: '请选择资源类型', trigger: 'blur' }]" >
					<el-select v-model="editForm.type" placeholder="请选择资源类型" clearable>
						<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						
					</el-select>
				</el-form-item>
				<el-form-item label="父节点" prop="parentId" :rules="[{ required: true, message: '请选择父节点', trigger: 'blur' }]" >
					<el-cascader
						clearable
						size="small"
						v-model="editForm.parentId"
						:props="props"
						change-on-select
						:options="pList"
						@change="handleChange">
					</el-cascader>
				</el-form-item>
				<el-form-item label="编码" prop="code">
					<el-input v-model="editForm.code" placeholder="请输入编码" size="small" clearable></el-input>
				</el-form-item>
				<el-form-item label="图标" prop="icon">
					<el-input v-model="editForm.icon" placeholder="请输入图标" size="small" clearable></el-input>
				</el-form-item>
				<el-form-item label="路由" prop="url">
					<el-input v-model="editForm.url" placeholder="请输入路由" size="small" clearable></el-input>
				</el-form-item>
				<!-- <el-form-item label="等级" prop="rank">
					<el-input-number v-model="editForm.rank" :min="0" size="small" clearable></el-input-number>
				</el-form-item> -->
				<el-form-item label="排序" prop="seq">
					<el-input-number v-model="editForm.seq" :min="0" size="small" clearable></el-input-number>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="editForm.description" placeholder="请输入描述" size="small" clearable></el-input>
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
	data() {
		return {
			filters: {
				curPage: 1,
				pageSize: 10,
			},
			props: {
				value: 'id',
				label: 'name',
				children: 'children'
			},
			typeList:[
				{
					value: 0,
					label: '菜单'
				},
				{
					value: 1,
					label: '碎片'
				}
			],
			apiName: 'system/api/listPermission',
			addName: 'system/api/addPermission',
			updateName: 'system/api/updatePermission',
			editForm: {},
			option1: [],
			option2: [],
			pList: JSON.parse(sessionStorage.getItem("userInfo")).menuList,
			loading: false,
			users: [],
			total: 0,
			page: 1,
			isShowEdit: false,
			isEdit: 0,
		}
	},

	methods: {
		getData(){
			this.filters.curPage = 1
			this.getList()
		},
		formatType(row, column){
			return row.type == 0 ? "菜单" : "碎片";
		},
		clear(){
			this.filters = {}
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
				id: row.id,
				parentId: row.parentId,
				type: row.type,
				code: row.code,
				seq: row.seq,
				url: row.url,
				src: row.src,
				icon: row.icon,
				title: row.title,
				description: row.description,
			}
		},
		editSubmit(){
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
		handleChange(val) {
			this.editForm.parentId = val[val.length-1] ? val[val.length-1] : 0
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