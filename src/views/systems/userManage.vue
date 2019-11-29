<template>
	<div class="table">
		<div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
                  <i class="el-icon-tickets"></i> 系统设置
                </el-breadcrumb-item>
                <el-breadcrumb-item> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
		<!--工具条-->
				<el-form :inline="true" :model="filters" >
					<el-form-item label="用户名称">
						<el-input v-model="filters.userName" placeholder="请输入用户名称" size="small" clearable></el-input>
					</el-form-item>
					<!-- <el-form-item label="公司">
						<el-select v-model="filters.busName" placeholder="请选择" clearable>
							<el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item> -->
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
				<el-button type="primary" icon="el-icon-plus" v-if="HasPermission('add')" @click="showEdit(0)">新增用户</el-button>
				<el-button type="primary"  v-if="HasPermission('batch')"  @click="batchEdit">批量修改部门</el-button>
				<el-button type="primary" v-if="HasPermission('initPwd')"  @click="initPwd">批量初始化密码</el-button>
			</div>
		<!--列表-->
		<div class="cont">
			<el-card :style="{width:myWidth}">
				<div class="left"  @mousedown.stop.prevent="mouseDownLeft" ref='box'>
					<el-tree
					:data="departList"
					node-key="id"
					default-expand-all
					@node-click="handleNodeClick"
					:expand-on-click-node="false">
					<span class="custom-tree-node" slot-scope="{ node,data }">
						<span class="tit">{{ data.label }}</span>
					</span>
					</el-tree>
				</div>
			</el-card>
			<el-card class="right">
				<el-table :data="users" border highlight-current-row stripe v-loading="loading"  @selection-change="selsChange" style="width: 100%;">
					<el-table-column align="center" type="selection" width="45"></el-table-column>
					<el-table-column  align="center" type="index" label="序号" width="60">
					</el-table-column>
					<el-table-column  align="center" prop="userName" label="用户名称">
					</el-table-column>
					<el-table-column  align="center" prop="busName" label="公司名称" width="180">
					</el-table-column>
					<el-table-column  align="center" prop="depart" label="部门"  width="220">
					</el-table-column>
					<el-table-column  align="center" prop="roleName" label="角色">
					</el-table-column>
					<el-table-column  align="center" prop="createTime" label="创建时间" sortable >
					</el-table-column>
					<el-table-column align="center" label="操作"  width="120">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" content="修改" placement="left">
								<el-button circle type="primary" size='medium' v-if="HasPermission('update')" @click="handleEdit(scope.row,1)" icon="el-icon-li-xiugai1"></el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</div>
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
		<el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" center width="880px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="用户名" prop="userName" :rules="[{ required: true, message: '请填写用户名', trigger: 'blur' }]">
					<el-input v-model="editForm.userName" placeholder="请输入用户名" size="small" clearable></el-input>
				</el-form-item>
				<el-form-item label="部门" prop="departId" :rules="[{ required: true, message: '请选择部门', trigger: 'blur' }]" >
					<el-cascader
						clearable
						size="small"
						v-model="editForm.departId"
						:props="props"
						change-on-select
						:options="departList"
						@change="handleChange">
					</el-cascader>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="editForm.mobile"  placeholder="请输入电话" maxlength='11' size="small" clearable></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="gender">
					<el-select v-model="editForm.gender" placeholder="请选择性别" clearable>
						<el-option v-for="(item,index) in option1" :key="index" :label="item.label" :value="item.value"></el-option>
						
					</el-select>
				</el-form-item>
				<el-form-item label="角色" prop="roleIds" :rules="[{ required: true, message: '请选择角色', trigger: 'blur' }]" >
					<el-select v-model="editForm.roleIds" placeholder="请选择角色" multiple  clearable>
						<el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
				<el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="修改" :visible.sync="isBatchEdit" center width="480px">
			<el-form :model="batchForm" label-width="80px" ref="batchForm">
				<el-form-item label="部门" prop="departId" :rules="[{ required: true, message: '请选择部门', trigger: 'blur' }]" >
					<el-cascader
						clearable
						size="small"
						v-model="batchForm.departId"
						:props="props"
						change-on-select
						:options="departList"
						@change="handleChange">
					</el-cascader>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button class="btn2" @click.native="isBatchEdit=false">取消</el-button>
				<el-button class="btn2" type="primary" @click.native="batchSubmit">确定</el-button>
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
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
				subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId
			},
			apiName: 'system/api/listUcByPge',
			addName: 'system/api/addUContact',
			updateName: 'system/api/updateUContact',
			editForm: {
				roleIds:[],
			},
			option1: [
				{
					value: 0,
					label: '男'
				},
				{
					value: 1,
					label: '女'
				}
			],
			option2: [],
			roleList:[],
			departList:[],
			props: {
				value: 'id',
				label: 'label',
				children: 'children'
			},
			loading: false,
			users: [],
			total: 0,
			page: 1,
			myWidth: '25%',
			isShowEdit: false,
			isEdit: 0,
			isBatchEdit: false,
			batchForm: {},
			idArr:[]

		}
	},
	
	methods: {
		getData(){
			this.filters.curPage = 1
			this.getList()
		},
		batchEdit(){
			if(this.idArr.length<1){
				this.$message.warning('请先选择要修改的用户！');
				return false
			}
			this.batchForm = {}
			this.isBatchEdit = true
		},
		initPwd(){
			if(this.idArr.length<1){
				this.$message.warning('请先选择要初始化的用户！');
				return false
			}
			this.init()
		},
		async init() {
			var that = this
			that.$confirm('确定初始化所选用户？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$http({
                    url: 'system/api/modifyUcPwdByAttch',
                    method: "post",
                    data: {
                        ucJr: this.idArr
                    },
                }).catch(error => {
                    that.$message.error(this.delName + "接口出错！");
                }).then(({ data }) => {
                    if (data.code == 30000) {
                        that.$message.success('执行成功，初始化密码为 111111(6个1)')
                        that.getList()
                    } else {
                        that.$message.warning(data.message)
                    }
                })
            });
		},
		selsChange: function(sels) {
			var arr = [];
			sels.map(v => {
				arr.push({id:v.id});
			});
			this.idArr = arr
			console.log(this.idArr, 11111);
		},
		batchSubmit(){
			this.batchForm.ucJr = this.idArr
			this.$refs.batchForm.validate((valid) => {
				if(valid){
					this.batch()
				}
			})
		},
		async batch() {
			let { data } = await this.$http({
				url: "system/api/modifyUcDepartByAttch",
				method: "post",
				data:this.batchForm 
			}).catch(error => {
				this.$message.error(this.apiName + "接口出错！");
			});
			if (data.code == 30000) {
				this.getList()
				this.isBatchEdit = false
				this.$message.success(data.message);
			} else {
				this.$message.warning(data.message);
			}
		},
		mouseDownLeft(){
			var that = this;
			that.$refs.box.onmousedown = function(e) {
				var disX = e.clientX;
				var width =  that.$refs.box.offsetWidth
				document.onmousemove = function(e) {
					var newWidth = e.clientX - disX + width;
					that.myWidth = newWidth+'px'
					if (newWidth <= 200) {
						that.myWidth = '200px';
					}
					console.log(that.myWidth,111111)
				};
				document.onmouseup = function() {
					document.onmousemove = document.onmouseup = null;
				};
				return false;
			}
		},
		handleChange(val) {
			this.batchForm.departId = val[val.length-1] ? val[val.length-1] : 0
			this.editForm.departId = val[val.length-1] ? val[val.length-1] : 0
		},
		clear(){
			this.filters = {
				curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
				subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId
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
			this.getRoleList()
			this.editForm = {}
		},
		handleEdit(row,isEdit){
			this.isEdit = isEdit
			this.isShowEdit = true
			this.getRoleList()
			this.getRoleList2(row.id)
			this.editForm = {
				id: row.id,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
				userName: row.userName,
				departId: row.departId,
				mobile: row.mobile,
				gender: row.gender,
				roleIds: row.roleIds
			}
		},
		editSubmit(){
			this.editForm.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			this.editForm.subId = JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
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
		async getRoleList() {
            let { data } = await this.$fetch({
                url: 'system/api/queryRoleByBusId',
                method: "post",
                data: {
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
				},
            }).catch(error => {
                this.$message.error('system/api/queryRoleByBusId' + "接口出错！");
            });
            if (data.code == 30000) {
                this.roleList = data.result
            }
		},
		handleNodeClick(node,data){
			this.filters.departId = node.id
			this.getData()
		},
		async getDepartList() {
            let { data } = await this.$fetch({
                url: 'system/api/departTree',
                method: "post",
                data: {
					subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
				},
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.departList = data.result
            }
		},
		async getRoleList2(id) {
            let { data } = await this.$fetch({
                url: 'system/api/queryURoleByUcId',
                method: "post",
                data: {
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
					ucId: id
				},
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
				
				var arr =data.result.map(item => {
					return item.roleId
				})
				this.editForm.roleIds = arr
				// this.roleList = data.result
            }
        },
	},
	mounted() {
		this.getList();
		this.getDepartList()
	}
};

</script>

<style lang="scss"scoped>
.btn{
	position: absolute;
	right: 70px;
}
.btn2{
	width: 30%;
}
.cont{
  width: 100%;
  display: flex;
  min-height: 300px;
  // justify-content: space-between;
  .left{
    // width: 20%;
    min-height: 100px;
    box-sizing: border-box;
    // padding: 10px;
    background: #fff;
   user-select:none;
  }
  .right{
    flex: 1;
    box-sizing: border-box;
    padding: 20px;
    margin-left: 10px;
    min-height: 100px;
    background: #fff;
    overflow: auto;
  }
}
</style>
<style lang="">
.el-tree-node.is-current > .el-tree-node__content {
      color:#409EFF !important;
      background-color: #ccc !important;
}
</style>