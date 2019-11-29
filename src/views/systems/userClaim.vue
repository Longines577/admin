<template>
	<div class="table">
		<div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
                  <i class="el-icon-tickets"></i> 系统设置
                </el-breadcrumb-item>
                <el-breadcrumb-item> 认领用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
		<!--工具条-->
				<el-form :inline="true" :model="filters" >
					<el-form-item label="用户名称">
						<el-input v-model="filters.userName" placeholder="请输入用户名称" size="small" clearable></el-input>
					</el-form-item>
					<el-form-item label="姓名">
						<el-input v-model="filters.name" placeholder="请输入姓名" size="small" clearable></el-input>
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
				<!-- <el-button type="primary" icon="el-icon-plus" v-if="HasPermission('add')" @click="showEdit(0)">新增</el-button> -->
				<el-button type="primary" v-if="HasPermission('batch')" @click="batchEdit">批量认领用户</el-button>
			</div>
		<!--列表-->
		<div class="cont">
			<el-table :data="users" border highlight-current-row stripe v-loading="loading"  @selection-change="selsChange" style="width: 100%;">
				<el-table-column align="center" type="selection" width="45"></el-table-column>
				<el-table-column  align="center" type="index" label="序号" width="60">
				</el-table-column>
				<el-table-column  align="center" prop="userName" label="用户名称">
				</el-table-column>
				<el-table-column  align="center" prop="name" label="姓名">
				</el-table-column>
				<!-- <el-table-column  align="center" prop="depart" label="部门"  width="220">
				</el-table-column>
				<el-table-column  align="center" prop="roleName" label="角色">
				</el-table-column> -->
				<el-table-column  align="center" prop="createTime" label="创建时间" sortable >
				</el-table-column>
				<!-- <el-table-column align="center" label="操作"  width="120">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="修改" placement="left">
							<el-button circle type="primary" size='medium'  @click="handleEdit(scope.row,1)" icon="el-icon-li-xiugai1"></el-button>
						</el-tooltip>
					</template>
				</el-table-column> -->
			</el-table>
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
		<el-dialog :close-on-click-modal='false' title="认领用户" :visible.sync="isBatchEdit" center width="480px">
			<el-form :model="batchForm" label-width="80px" ref="batchForm">
				<el-form-item label="公司" prop="subId" :rules="[{ required: true, message: '请选择公司', trigger: 'blur' }]" >
					<el-select v-model="batchForm.subId" placeholder="请选择" @change="getDepartList" clearable>
						<el-option v-for="(item,index) in option2" :key="index" :label="item.aliasName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
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
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			},
			apiName: 'system/api/listUContact',
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
			this.getBusList()
			this.isBatchEdit = true
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
		handleChange(val) {
			this.batchForm.departId = val[val.length-1] ? val[val.length-1] : 0
			this.editForm.departId = val[val.length-1] ? val[val.length-1] : 0
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
		editOk() {
			this.isShowEdit = false
			this.getList()
		},
		async getBusList() {
            let { data } = await this.$fetch({
                url: 'system/api/bus/queryAllBusMy',
                method: "post",
                data: {
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
				},
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option2 = data.result
            }
		},
		async getDepartList(id) {
            let { data } = await this.$fetch({
                url: 'system/api/departTree',
                method: "post",
                data: {
					subId: id,
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
				},
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.departList = data.result
            }
		},
	},
	mounted() {
		this.getList();
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
//   min-height: 300px;
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