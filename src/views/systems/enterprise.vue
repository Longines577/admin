<template>
	<div class="table">
		<div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
                  <i class="el-icon-tickets"></i> 系统设置
                </el-breadcrumb-item>
                <el-breadcrumb-item> 企业管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
		<!--工具条-->
				<el-form :inline="true" :model="filters" >
					<el-form-item label="企业名称">
						<el-input v-model="filters.busName" placeholder="请输入企业名称" size="small" clearable></el-input>
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
				<el-table-column  align="center" prop="status" :formatter="formatType" label="状态">
				</el-table-column>
				<el-table-column  align="center" prop="busName"  label="企业名称">
				</el-table-column>
				 <el-table-column  align="center" label="企业logo"	width="180">
					<template slot-scope="scope">
						<img :src="scope.row.logo" alt="" style="width:150px;">
					</template>
					</el-table-column>
				<el-table-column  align="center" prop="legalName" label="法人代表" >
				</el-table-column>
				<el-table-column  align="center" prop="legalTel" label="联系电话" >
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
		<el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" v-if="isShowEdit" center  width="30%">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="企业名称" prop="busName" :rules="[{ required: true, message: '请输入企业名称', trigger: 'blur' }]">
					<el-input v-model="editForm.busName" placeholder="请输入企业名称" size="small" clearable></el-input>
				</el-form-item>
				
				<el-form-item label="企业logo" prop="logo">
					<el-upload
						:action="imgUrl"
						:http-request="upload" 
						:limit='1'
						list-type="picture-card"
						:multiple="false"
						:file-list="mianList"
						:on-success="handleAvatarSuccess"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleRemove">
						<i class="el-icon-plus"></i>
						</el-upload>
						<el-dialog :close-on-click-modal='false' title="企业logo" :visible.sync="dialogVisible" append-to-body>
							<img width="100%" :src="editForm.logo" alt="">
						</el-dialog>
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
					label: '功能'
				},
				{
					value: 2,
					label: '碎片'
				}
			],
			imgUrl: $UPLOAD,
			apiName: 'system/api/bus/listBus',
			addName: 'system/api/bus/addBus',
			updateName: 'system/api/bus/updateBus',
			editForm: {},
			option1: [],
			option2: [],
			mianList:[],
			pList: JSON.parse(sessionStorage.getItem("userInfo")).menuList,
			loading: false,
			users: [],
			total: 0,
			page: 1,
			isShowEdit: false,
			dialogVisible: false,
			isEdit: 0,
			files:''
		}
	},

	methods: {
		getData(){
			this.filters.curPage = 1
			this.getList()
		},
		 handleAvatarSuccess(res, file) {
			this.editForm.logo = this.files;
		},
		handleRemove(file, fileList) {
			this.editForm.logo = ''
		},
		handlePictureCardPreview(file) {
			this.editForm.logo = this.files;
			this.dialogVisible = true;
		},
		formatType(row, column){
			return row.status == 1 ? "启用" : row.status == 0 ? "停用" : "";
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
			this.mianList = []
			this.editForm = {}
			this.isShowEdit = true
			
		},
		handleEdit(row,isEdit){
			this.isEdit = isEdit
			this.isShowEdit = true
			this.mianList = [{url:row.logo}]
			this.editForm = {
				id: row.id,
				busName: row.busName,
				logo: row.logo
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    /* width: 178px; */
    height: 178px;
    display: block;
  }
</style>