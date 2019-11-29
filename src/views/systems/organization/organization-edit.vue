<template>
	<div class="table">
		<div class="container">
			<div class="heade">
				<span class="middle text">组织架构</span>
				<el-button type="primary" size="mini" v-if="HasPermission('add')" @click="showEdit(0)">新增部门</el-button>
			</div>
			<el-tree
			:data="list"
			node-key="id"
			default-expand-all
			:expand-on-click-node="false">
			<span class="custom-tree-node" slot-scope="{ node,data }">
				<span class="tit">{{ node.label }}</span>
				<span class="btn">
					<el-button
						v-if="HasPermission('update')"
						type="text"
						size="medium"
						@click="() => handleEdit(data,1)">
						编辑
					</el-button>
				</span>
			</span>
			</el-tree>
		</div>
		<el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" center>
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="部门名称" prop="label" :rules="[{ required: true, message: '请输入部门名称', trigger: 'blur' }]">
					<el-input v-model="editForm.label" placeholder="请输入部门名称" size="small" clearable></el-input>
				</el-form-item>
				<el-form-item label="部门" prop="parentId" :rules="[{ required: true, message: '请选择部门', trigger: 'blur' }]" >
					<el-cascader
						clearable
						size="small"
						v-model="editForm.parentId"
						:props="props"
						change-on-select
						:options="departList"
						@change="handleChange">
					</el-cascader>
				</el-form-item>
				<el-form-item label="部门领导" prop="leader" v-if="isEdit">
					<el-select v-model="editForm.leader" placeholder="请选择部门领导" clearable>
						<el-option v-for="(item,index) in roleList" :key="index" :label="item.userName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="部门描述" prop="description">
					<el-input type="textarea" :rows="2" v-model="editForm.description"  placeholder="请输入部门描述" clearable></el-input>
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
				subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			},
			apiName: 'system/api/departTree',
			addName: 'system/api/saveDepart',
			updateName: 'system/api/updateDepart',
			list:[],
			props: {
				value: 'id',
				label: 'label',
				children: 'children',
				expandTrigger: 'hover'
			},
			roleList: [],
			editForm: {},
			departList: [],
			isEdit: 0,
			isShowEdit: false
		}
	},
	methods: {
		handleChange(val) {
			this.editForm.parentId = val[val.length-1] ? val[val.length-1] : 0
		},
		showEdit(isEdit) {
			this.isEdit = isEdit
			this.getDepartList()
			this.isShowEdit = true
			this.editForm = {}
		},
		handleEdit(row,isEdit){
			this.isEdit = isEdit
			this.getDepartList()
			this.getDepart(row.id)
			this.isShowEdit = true
			this.editForm = {
				id: row.id,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
				label: row.label,
				parentId: row.parentId,
				leader: row.leader,
				description: row.description,
			}
		},
		editSubmit(){
			this.editForm.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			this.editForm.subId = JSON.parse(sessionStorage.getItem("userInfo")).uc.subId
			if(this.editForm.parentId==-1){
				this.editForm.parentId=0
			}
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
		async getDepartList() {
            let { data } = await this.$fetch({
                url: 'system/api/departTreeNo',
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
		async getDepart(id) {
            let { data } = await this.$fetch({
                url: 'system/api/queryUcByDepart',
                method: "post",
                data: {
					departId: id,
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
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
		this.getList()
		this.getDepartList()
	}
};

</script>

<style scoped>
.container {
    padding: 0 20px 20px 20px;
    background: #fff;
    border: 0;
    border-radius: 0;
}
.heade {
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	height: 68px;
	line-height: 68px;
}
.custom-tree-node{
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
}
.heade .text {
	font-size: 14px;
	color: #000000;
	font-family: "PingFangSC-Semibold","Microsoft YaHei", Arial, Helvetica, sans-serif, "SimSun";
}

.heade .el-date-editor {
	float: right;
}
</style>