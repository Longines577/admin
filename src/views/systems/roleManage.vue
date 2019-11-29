<template>
	<div class="table">
		<div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
                  <i class="el-icon-tickets"></i> 系统设置
                </el-breadcrumb-item>
                <el-breadcrumb-item> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
		<!--工具条-->
				<el-form :inline="true" :model="filters" >
					<el-form-item label="角色名称">
						<el-input v-model="filters.name" placeholder="请输入角色名称" size="small" clearable></el-input>
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
				<el-button type="primary" icon="el-icon-plus" @click="showEdit(0)" v-if="HasPermission('add')">新增</el-button>
			</div>
		<!--列表-->
			<el-table :data="users" border highlight-current-row stripe v-loading="loading" style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="60">
				</el-table-column>
				
				<el-table-column  align="center" prop="name" label="角色名称">
				</el-table-column>
				<el-table-column  align="center" prop="code" label="角色编码">
				</el-table-column>
        		<el-table-column  align="center" prop="createTime" label="创建时间" sortable>
				</el-table-column>
				<el-table-column align="center" label="操作"  width="220">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="修改" placement="left">
							<el-button circle type="primary" size='medium' v-if="HasPermission('update')" @click="handleEdit(scope.row,1)" icon="el-icon-li-xiugai1"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="top">
							<el-button circle type="danger" size='medium' v-if="HasPermission('del')"  @click="handleDel(scope.row)" icon="el-icon-delete"></el-button>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="配置" placement="right">
							<el-button circle type="success" size='medium' v-if="HasPermission('setting')"  @click="allocation(scope.row)" icon="el-icon-setting"></el-button>
						</el-tooltip>
							<!-- <el-button  @click="handleEdit(scope.row,1)">修改</el-button>
							<el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button> -->
							<!-- <el-button type="primary" size="small" @click="allocation(scope.row)">配置</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
                <el-pagination 
					background 
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:page-sizes="[5, 10, 20, 30]"
					:current-page="filters.curPage"
					:page-size="filters.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="total">
                </el-pagination>
            </div>
		</div>
		<el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" center width='500px'>
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="角色名称" prop="name" :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
					<el-input v-model="editForm.name" placeholder="请输入角色名称" size="small" clearable style="width:300px"></el-input>
				</el-form-item>
				<el-form-item label="角色编码" prop="code">
					<el-select v-model="editForm.code" placeholder="请输入编码" :disabled="isEdit==1?true:false" clearable style="width:300px">
						<el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!-- <el-button class="btn2" @click.native="isShowEdit=false">取消</el-button> -->
				<el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="编辑权限" :visible.sync="isShowMenut" center v-if="isShowMenut">
			<role-menu :id="editId" @editOk='editOk' ></role-menu>
		</el-dialog>
	</div>
</template>
<script>
import listMixin from '@/api/list'
import roleMenu from './role/role-menu'
export default {
	mixins: [listMixin],
	components:{
		roleMenu
	},
	data() {
		return {
			filters: {
				curPage: 1,
				pageSize: 10,
			},
			
			apiName: 'system/api/listRole',
			addName: 'system/api/addRole',
			updateName: 'system/api/updateRole',
			delName: 'system/api/delRole',
			editForm: {},
			roleList: [],
			loading: false,
			users: [],
			total: 0,
			isShowEdit: false,
			isShowMenut: false,
			editId: '',
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
		handleSizeChange(val) {
			this.filters.pageSize = val
			this.getList()
		},
		handleCurrentChange(val) {
			this.filters.curPage = val
			this.getList()
		},
		allocation(row){
			this.isShowMenut = true
			this.editId = row.id
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
				name: row.name,
				code: row.code,
				id: row.id
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
			this.isShowMenut = false
			this.isShowEdit = false
			this.getList()
		},
		async getRole() { //字典类别查询试题类型
            let { data } = await this.$fetch({
                url: 'system/api/queryDictionaryByCode',
                method: "post",
                data: {
                    categoryCode: 'role'
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.roleList = data.result
            }
        },
	},
	mounted() {
		this.getRole()
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