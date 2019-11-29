<template>
	<div class="table">
		<div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
                  <i class="el-icon-tickets"></i> 产品包与排课
                </el-breadcrumb-item>
                <el-breadcrumb-item> 班型管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
		<!--工具条-->
				<el-form :inline="true" :model="filters" >
					<el-form-item label="班型名称" prop="className">
						<el-input v-model="filters.className" placeholder="请输入班型名称" size="small" clearable></el-input>
					</el-form-item>
					<el-form-item label="一级项目">
						<el-select v-model="filters.firstId" placeholder="请选择" clearable  @change="getoption2">
							<el-option v-for="item in option1" :key="item.value" :label="item.firstName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="二级项目">
						<el-select v-model="filters.secondId" placeholder="请选择" clearable>
							<el-option v-for="item in option2" :key="item.value" :label="item.secondName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="分校">
						<el-select v-model="filters.subId" placeholder="请选择" clearable>
							<el-option v-for="(item,index) in option20" :key="index" :label="item.aliasName" :value="item.id"></el-option>
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
				<!-- <el-checkbox v-model="filters.checked">只显示启用项目</el-checkbox> -->
				<el-button type="primary" v-if="HasPermission('add')" @click="showEdit(0)">新增</el-button>
			</div>
		<!--列表-->
			<el-table :data="users" border highlight-current-row stripe v-loading="loading" style="width: 100%;">
				<el-table-column  align="center" type="index" label="序号" width="60">
				</el-table-column>
				<el-table-column align="center" prop="status" :formatter="formatStatus" label="状态"></el-table-column>
				 <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
				<el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
				<el-table-column align="center" prop="className" label="班型名称"></el-table-column>
				<!-- <el-table-column align="center" prop="courseImg" label="课程介绍图片"></el-table-column> -->
				<el-table-column align="center" prop="primeCost" label="成本价">
					<template slot-scope="scope">
						<el-button size="small"	type="text"	@click="modifyCost(scope.row)">{{scope.row.primeCost}}</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="subBusName" label="分校"></el-table-column>
				<el-table-column align="center" prop="des" label="班型描述"></el-table-column>
						<el-table-column align="center" label="操作"  width="220">
					<template slot-scope="scope">
							<el-button  v-if="HasPermission('update')" @click="handleEdit(scope.row,1)">修改</el-button>
							<el-button  size="small"  v-if="HasPermission('upShelf')" @click="handleShelf(scope.row)">上架</el-button>
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
		<el-dialog :close-on-click-modal='false' :title=" isEdit ? '修改班型' : '新增班型'" :show-close="false" :visible.sync="isShowEdit" v-if="isShowEdit" center width='980px'>
			<class-edit @save-ok="editOk" :data="editForm" :isEdit="isEdit" ></class-edit>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="上架" :show-close="false" :visible.sync="isShelfEdit" v-if="isShelfEdit" center width='980px'>
			<shelf-edit @save-ok="editOk" :data="editForm" ></shelf-edit>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="修改成本价" :visible.sync="isShowCost" center width='580px'>
			<el-form :model="formData" label-width="80px" :inline="true" ref="editForm">
				<el-form-item label="成本价" prop="primeCost" :rules="[{ required: true, message: '请填写成本价', trigger: 'blur' }]">
					<el-input v-model="formData.primeCost" placeholder="请输入成本价" size="small" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="isShowCost=false">取消</el-button>
				<el-button  type="primary" @click.native="editSubmit">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import listMixin from '@/api/list'
import ClassEdit from "./class-edit";
import ShelfEdit from "./shelf-edit";
export default {
	mixins: [listMixin],
	components:{
		ClassEdit,
		ShelfEdit
	},
	data() {
		return {
			filters: {
				curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			},
			apiName: 'system/api/classType/listClassTypeHash',
			delName:'system/api/course/delCourse',
			updateName: 'system/api/classType/modifyPrimeCost', // 修改成本价
			editForm: {},
			formData:{},
			option1: [],
			option2: [],
			option3: [],
			option20:[],
			loading: false,
			users: [{}],
			total: 0,
			page: 1,
			isShowEdit: false,
			isShowCost: false,
			isEdit: 0,
			isShelfEdit: false,
			departList:[],
		}
	},
	methods: {
		getData(){
			this.filters.curPage = 1
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
				this.option20 = data.result
            }
		},
	
		clear(){
			this.filters = {
				curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			}
		},
		formatStatus(row, column){
			return row.status == 1 ? "已发布" : row.status == 0 ? "未发布" : "";
		},
		formatType(row, column){
			return row.courseType == 0 ? "公开课" : row.courseType == 1 ? "精讲课" : row.courseType == 2 ? "串讲课":"模考课";
		},
		formatTyped(row, column){
			return row.teachType == 1 ? "直播" :"面授";
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
			this.$store.state.course = []
			this.$store.state.records = []
			this.$store.state.datum = []
			this.$store.state.textbook = []
			this.$store.state.services = []
			this.$store.state.merges = []
		},
		handleEdit(row,isEdit){
			this.isEdit = isEdit
			this.isShowEdit = true
			this.editForm = row
			if(row.course){
				this.editForm.course = JSON.parse(row.course)
			}else{
				this.editForm.course = []
			}
			if(row.records){
				this.editForm.records = JSON.parse(row.records)
			}else{
				this.editForm.records = []
			}
			if(row.datum){
				this.editForm.datum = JSON.parse(row.datum)
			}else{
				this.editForm.datum = []
			}
			if(row.textbook){
				this.editForm.textbook = JSON.parse(row.textbook)
			}else{
				this.editForm.textbook = []
			}
			if(row.services){
				this.editForm.services = JSON.parse(row.services)
			}else{
				this.editForm.services = []
			}
			if(row.merges){
				this.editForm.merges = JSON.parse(row.merges)
			}else{
				this.editForm.merges = []
			}
			
		},
		handleShelf(row){
			this.isShelfEdit = true
			this.editForm = row
		},
		modifyCost(row){
			console.log(row)
			this.isShowCost = true
			this.formData = {
				classId: row.id,
				primeCost: row.primeCost
			}
		},
		editSubmit(){
			this.$refs.editForm.validate((valid) => {
				if(valid){
					this.updateCost()
				}
			})
		},
		async updateCost(){
			let { data } = await this.$fetch({
                url: this.updateName,
                method: "post",
                data: this.formData,
            }).catch(error => {
                this.$message.error(this.updateName + "接口出错！");
            });
            if (data.code == 30000) {
                this.$message.success('保存成功！')
				this.editOk()
				this.isShowCost = false
            } else {
                this.$message.warning(data.msg)
            }
		},
		editOk() {
			this.isShelfEdit = false
			this.isShowEdit = false
			this.getList()
		},
	},
	mounted() {
		this.getList();
		this.getoption1()
		this.getBusList()
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