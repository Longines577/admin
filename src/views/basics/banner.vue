<template>
	<div class="table">
		<div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
                  <i class="el-icon-tickets"></i> 基础设置
                </el-breadcrumb-item>
                <el-breadcrumb-item> banner管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
		<!--工具条-->
				<el-form :inline="true" :model="filters" >
					<!-- <el-form-item label="企业名称">
						<el-input v-model="filters.busName" placeholder="请输入企业名称" size="small" clearable></el-input>
					</el-form-item> -->
					<!-- <div style="float: right">
						<el-form-item>
							<el-button type="primary" @click="getList">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="clear">重置</el-button>
						</el-form-item>
					</div> -->
					
				</el-form>
			<!-- <div style="margin: 20px 0;border-top: 1px #ccc solid;" ></div> -->
			<div style="margin: 10px 0;height: 40px;">
				<el-button type="primary" icon="el-icon-plus" v-if="HasPermission('add')" @click="showEdit(0)">新增</el-button>
				<div style="float: right">
					<el-button type="primary" @click="getData">查询</el-button>
				</div>
			</div>
		<!--列表-->
			<el-table :data="users" border highlight-current-row stripe v-loading="loading" style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="60">
				</el-table-column>
				<el-table-column  align="center" prop="name"  label="banner名称">
				</el-table-column>
				 <el-table-column  align="center" label="banner图片"	width="180">
					<template slot-scope="scope">
						<img :src="scope.row.img" alt="" style="width:150px;">
					</template>
					</el-table-column>
				<el-table-column  align="center" prop="description" label="描述" >
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
		<el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" v-if="isShowEdit" center  width="580px">
			<el-form :model="editForm" label-width="120px" ref="editForm">
				<el-form-item label="banner名称" prop="name" :rules="[{ required: true, message: '请输入banner名称', trigger: 'blur' }]">
					<el-input v-model="editForm.name" placeholder="请输入banner名称" size="small" clearable></el-input>
				</el-form-item>
				
				<el-form-item label="banner图片" prop="img">
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
						<el-dialog :close-on-click-modal='false' title="banner图片" :visible.sync="dialogVisible" append-to-body>
							<img width="100%" :src="editForm.img" alt="">
						</el-dialog>
				</el-form-item>
				<el-form-item label="描述" prop="description" >
					<el-input  type="textarea" :rows="2" v-model="editForm.description" placeholder="请输入描述" size="small" clearable></el-input>
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
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			},
			imgUrl: $UPLOAD,
			apiName: 'system/api/banner/listBanner',
			addName: 'system/api/banner/addBanner',
			updateName: 'system/api/banner/updateBanner',
			editForm: {},
			mianList:[],
			loading: false,
			users: [],
			total: 0,
			isShowEdit: false,
			dialogVisible: false,
			isEdit: 0,
			files: ''
		}
	},

	methods: {
		getData(){
			this.filters.curPage = 1
			this.getList()
		},
		 handleAvatarSuccess(res, file) {
			this.editForm.img =  this.files;
		},
		handleRemove(file, fileList) {
			this.editForm.img = ''
		},
		handlePictureCardPreview(file) {
			this.editForm.img =  this.files;
			this.dialogVisible = true;
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
			this.editForm = {}
			this.mianList = []
			this.isShowEdit = true
			this.editForm.img = ''
			
		},
		handleEdit(row,isEdit){
			this.isEdit = isEdit
			this.isShowEdit = true
			this.mianList = [{url:row.img}]
			this.editForm = {
				id: row.id,
				name: row.name,
				img: row.img,
				description: row.description
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