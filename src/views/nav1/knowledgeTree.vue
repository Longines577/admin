<template>
	<div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i> 产品包与排课
				</el-breadcrumb-item>
                <el-breadcrumb-item> 知识树</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<div class="box">
			<span class="subject">科目</span>
			<el-select v-model="filters.subjectId" placeholder="请选择"  @change="getMerge" class="subjectSelect" filterable  clearable>
				<el-option
				v-for="item in option3"
				:key="item.value"
				:label="item.subjectName"
				:value="item.id"
				></el-option>
			</el-select>
			<span class="province">省份</span>
			<el-select v-model="filters.mergeId" placeholder="请选择" class="subjectSelect" @change="getTree" clearable>
				<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.id"></el-option>
			</el-select>
			<div style="float: right">
				<el-button type="primary" @click="getList">搜索</el-button>
				<!-- <el-button type="primary">重置</el-button> -->
				<el-button type="primary" v-if="HasPermission('add')" @click="newTree">新增知识树</el-button>
				<el-button type="primary" v-if="HasPermission('download')" @click="download">下载知识树模版</el-button>
			</div>
    	</div>
		<div class="box">
			<div class="title">{{title}}
				<el-button type="text" v-if="region&&HasPermission('update')" @click="modify">修改</el-button>
			</div>
			<div class="city">
				<el-tag
				v-for="tag in region"
				:key="tag.name"
                size="medium"
				type="info">
				{{tag.name}}
				</el-tag>
			</div>
			<div class="tips" v-if="region&&title" >由 &nbsp;{{name}}&nbsp; 在 &nbsp;{{time}}&nbsp; 最后一次修改</div>
		</div>
		<div class="container">
			<div>
				<el-button type="primary" v-if="HasPermission('enable')" @click="enabling(1)">批量启用</el-button>
				<el-button type="primary" v-if="HasPermission('prohibit')" @click="enabling(0)">批量禁用</el-button>
				<el-button type="primary" v-if="HasPermission('del')" @click="del">批量删除</el-button>
				<!-- <el-button type="primary">一键复制</el-button> -->
			</div>
			<div style="margin: 20px 0;">
				<el-checkbox v-model="filters.status" true-label="1" @change="getList">只显示启用项目</el-checkbox>
			</div>
			<el-tree
			:data="list"
			show-checkbox
			node-key="id"
			ref="tree"
			check-strictly
			default-expand-all
			:expand-on-click-node="false"
			>
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span :class="data.status==1?'tit':'tit2'"><i class="el-icon-document"></i>&nbsp;&nbsp;{{ data.noteNo }}&nbsp;&nbsp;{{ data.name }}</span>
				<span class="btn">
				<el-button
					type="text"
					size="small"
					icon="el-icon-circle-plus-outline"
					v-if="HasPermission('append')"
					@click="() => append(data)">
				</el-button>
				<el-button
					type="text"
					size="small"
					icon="el-icon-edit"
					v-if="HasPermission('updateNode')"
					@click="() => upTree(data)">
				</el-button>
				<!-- <el-button
					type="text"
					size="small"
					icon="el-icon-delete"
					@click="() => remove(node, data)">
				</el-button> -->
				</span>
			</span>
			</el-tree>
		</div>
		<el-dialog :close-on-click-modal='false' title="添加下一级节点" :visible.sync="isShowNode" center width='580px'>
			<el-form :model="nodeData" label-width="80px" :inline="true">
				<el-form-item label="节点序号">
					<el-input v-model="nodeData.noteNo" placeholder="请输入节点名称"></el-input>
				</el-form-item>
				<el-form-item label="节点名称">
					<el-input v-model="nodeData.name" placeholder="请输入节点名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="isShowNode=false">取消</el-button>
				<el-button  type="primary" @click.native="setNode">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="修改节点" :visible.sync="isShowNode2" center width='580px'>
			<el-form :model="nodeData" label-width="80px" :inline="true">
				<el-form-item label="节点名称">
					<el-input v-model="nodeData.name" placeholder="请输入节点名称"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="isShowNode2=false">取消</el-button>
				<el-button  type="primary" @click.native="upNode">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="修改省份" :visible.sync="isShow" center width='580px'>
			<el-form :model="formData" label-width="80px" :inline="true" ref="editForm">
				<el-form-item label="省份">
					<el-select v-model="cityId" placeholder="请选择" class="subjectSelect" filterable  multiple>
						<el-option v-for="item in option1" :key="item.value" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="isShow=false">取消</el-button>
				<el-button  type="primary" @click.native="editSubmit">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :close-on-click-modal='false' title="新建知识树" :visible.sync="isShowTree" center width='580px'>
			<el-form :model="rowsData" label-width="80px"  ref="editForm">
				<el-form-item label="科目" prop="subjectId" :rules="[{ required: true, message: '请选择科目', trigger: 'blur' }]">
					<el-select v-model="rowsData.subjectId" placeholder="请选择" filterable clearable>
						<el-option v-for="item in option3" :key="item.value" :label="item.subjectName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="省份" prop="mergeId" :rules="[{ required: true, message: '请选择省份', trigger: 'blur' }]">
					<el-select v-model="rowsData.mergeId" placeholder="请选择" multiple filterable clearable>
						<el-option v-for="item in option1" :key="item.value" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="文件" prop="mergeId" :rules="[{ required: true, message: '请选择文件', trigger: 'blur' }]">
					<el-upload
						:style="{'display': 'inline-block', 'maxWidth': '80%'}"
						class="upload-demo"
						:multiple="false"
						ref="upload"
						action=""
						:file-list="fileList"
						accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
						:on-change="exportExcel"
						:auto-upload="false">
						<el-button slot="trigger" size="small" type="primary">{{tips}}</el-button>
						</el-upload>
				</el-form-item>
				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="isShowTree=false">取消</el-button>
				<el-button  type="primary" @click.native="addTree">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import listMixin from '@/api/list'
import axios from 'axios'
import { BASEURL } from '@/api/config';
export default {
 mixins: [listMixin],
	data() {
		return {
			filters: {
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
			},
			apiName: 'system/api/knowledgeTree/generateKnowledgeTree',
			list:[],
			tips: '导入',
			cityId: [],
			title: '',
			region: '',
			option1: [],
			option3: [],
			option: [],
			formData:{},
			isShow:false,
			rowsData:{},
			isShowTree:false,
			fileList:[],
			isShowNode: false,
			nodeData: {},
			nodeList: {},
			isShowNode2: false,
			name: '',
			time: ''
		}
	},
	methods: {
		download(){
			var url = 'https://admin.video.sijiaoedu.com/Teach/2019-07-24/2019072411255911知识树模板.xlsx'
			this.$confirm('确定下载模版？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
				window.open(url)
			})
		},
		append(row) {
			console.log(row)
			this.isShowNode = true
			this.nodeList = row
			this.nodeData = {
				noteNo: this.nodeList.noteNo +'.' + (this.nodeList.children.length+1)
			}
		},
		upTree(row){
			this.isShowNode2 = true
			this.nodeData = {
				id: row.id,
				name: row.name,
				updateId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
			}
			console.log(this.nodeData)
		},
		upNode(){
			this.$fetch({
				url: 'system/api/knowledgeTree/updateKnowledgeTree',
				method: "post",
				data:this.nodeData
			}).catch(error => {
				this.$message.error( 'region/queryAllProvince' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					this.$message.success('修改成功！')
					this.getList()
					this.isShowNode2 = false
				} else {
					this.$message.warning(data.message)
				}
			})
		},
		setNode(){
			this.$fetch({
				url: 'system/api/knowledgeTree/addKnowledgeTree',
				method: "post",
				data:{
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
					name: this.nodeData.name,
					parentId: this.nodeList.id,
					subjectId: this.nodeList.subjectId,
					noteNo: this.nodeList.noteNo +'.' + (this.nodeList.children.length+1),
					mergeId: this.nodeList.mergeId,
					updateId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
				}
			}).catch(error => {
				this.$message.error( 'region/queryAllProvince' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					this.$message.success('添加成功！')
					this.getList()
					this.isShowNode = false
				} else {
					this.$message.warning(data.message)
				}
			})
		},
		
		// remove(node, data) {
		// 	const parent = node.parent;
		// 	const children = parent.data.children || parent.data;
		// 	const index = children.findIndex(d => d.id === data.id);
		// 	children.splice(index, 1);
		// },
		async exportExcel(file, fileList) {
			this.$refs['upload'].clearFiles()
			if((file.raw.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (file.raw.type == 'application/vnd.ms-excel')){
				this.rowsData.file = file.raw
				console.log(this.rowsData.file,111)
				this.tips = '已导入'
			} else {
				this.$message({
					type:'warning',
					message:'附件格式错误，请上传xlsx / xls 文 件！'
				})
    		}
		},
		newTree(){
			this.isShowTree = true
			this.rowsData = {}
			this.tips = '导入'
		},
		addTree(){
			var arr = []
			this.option1.forEach((item1)=> {
				this.rowsData.mergeId.forEach((item2)=> {
					if(item1.id == item2){
						return arr.push({id:item1.id,name:item1.name})
					}
				})
			})
			
			this.rowsData.region =JSON.stringify(arr)
			this.rowsData.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			console.log(this.rowsData)
			this.$refs.editForm.validate((valid) => {
				if(valid){
					this.importTree()
				}
			})
		},
		async importTree(){
			const loading = this.$loading({
                lock: true,
                text: '上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
            });
			let param = new FormData()
			param.append('file', this.rowsData.file)
			param.append('subjectId', this.rowsData.subjectId)
			param.append('region', this.rowsData.region)
			param.append('busId', this.rowsData.busId)
			param.append('ucId', JSON.parse(sessionStorage.getItem("userInfo")).uc.id)
            let { data } = await axios({
                url: BASEURL+'system/api/knowledgeTree/importKnowledgeTree',
                method: "post",
                headers: { 'Content-Type': 'multipart/form-data' },
                data: param
            }).catch(error => {
				this.$message.error('上传接口出错！');
				loading.close();
            });

            if (data.code == 30000) {
				loading.close();
                this.$message.success('上传成功！')
                this.isShowTree = false
            }else{
				loading.close();
				this.$message.warning(data.message)
			}
		},
		modify(){
			this.isShow = true
			this.formData = {}
			var arr = []
			this.region.forEach((item)=>{
				return arr.push(item.id)
			})
			this.cityId = arr
		},
		editSubmit(){
			var arr = []
			this.option1.forEach((item1)=> {
				this.cityId.forEach((item2)=> {
					if(item1.id == item2){
						return arr.push({id:item1.id,name:item1.name})
					}
				})
			})
			this.formData.ucId = JSON.parse(sessionStorage.getItem("userInfo")).uc.id
			this.formData.mergeId = this.filters.mergeId
       		this.formData.provinceJr = arr
			this.$refs.editForm.validate((valid) => {
				if(valid){
					this.updateCity()
				}
			})
		},
		async updateCity() {
            let { data } = await this.$http({
                url: 'system/api/provinceMerge/modifyProvinceMergeArry',
                method: "post",
                data: this.formData,
            }).catch(error => {
                this.$message.error('modifyProvinceMergeArry' + "接口出错！");
            });
            if (data.code == 30000) {
                this.$message.success('修改成功！')
				this.isShow = false
				this.getMerge(this.filters.subjectId)
				this.region = this.formData.provinceJr 
            } else {
                this.$message.warning(data.message)
            }
        },
		async enabling(index) {
			var arr = this.$refs.tree.getCheckedNodes()
			if(arr.length<1){
				this.$message.error(`请选择要${index === 0 ? '禁用' : '启用'}的记录`)
				return false
			}
			var treeJr = []
			 arr.forEach((item,i)=> {
				return treeJr.push({id:item.id})
			})
			this.$confirm(`确定要${index === 0 ? '禁用' : '启用'}所选纪录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
				this.$http({
					url: 'system/api/knowledgeTree/modifyStatusByAttch',
					method: "post",
					data: {
						status: index,
						treeJr: treeJr,
						ucId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
					},
				}).catch(error => {
					this.$message.error(this.updateName + "接口出错！");
				}).then(({ data }) => {
					if (data.code == 30000) {
						this.$message.success('执行成功！')
						this.getList()
					} else {
						this.$message.warning(data.message)
					}
				})
			})
        },
		async del() {
			var that = this
			var arr = that.$refs.tree.getCheckedNodes()
			if(arr.length<1){
				this.$message.error(`请选择要删除的记录`)
				return false
			}
			var treeJr = []
			 arr.forEach((item,i)=> {
				return treeJr.push({id:item.id})
			})
			that.$confirm('确定删除所选纪录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
				that.$http({
					url: 'system/api/knowledgeTree/modifyDeletedByAttch',
					method: "post",
					data: {
						ucId: JSON.parse(sessionStorage.getItem("userInfo")).uc.id,
						treeJr: treeJr,
					},
				}).catch(error => {
					that.$message.error(that.updateName + "接口出错！");
				}).then(({ data }) => {
					if (data.code == 30000) {
						that.$message.success('删除成功！')
						that.getList()
					} else {
						that.$message.warning(data.message)
					}
				})
			})
		},
		async getItem() {
			let { data } = await this.$fetch({
				url: 'system/api/item/queryAllItem',
				method: "post",
				data: {
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
				},
			}).catch(error => {
				this.$message.error(this.apiName + "接口出错！");
			});
			if (data.code == 30000) {
				this.option3 = data.result
			}
		},
		getCity(){
			this.$http({
				url: 'system/api/region/queryAllProvince',
				method: "post",
			}).catch(error => {
				this.$message.error( 'region/queryAllProvince' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					this.option1 = data.result
				} else {
					this.$message.warning(data.message)
				}
			})
		},
		async getMerge(id) {
		   this.option3.forEach((item)=>{
				if(item.id==id){
					return  this.title = item.subjectName
				}
			})
			// this.filters.mergeId = ''
			this.region = ''
			this.list = []
            let { data } = await this.$fetch({
                url: 'system/api/provinceMerge/queryProvinceBySubjectId',
                method: "post",
                data: {
                    subjectId: id,
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
				this.option = data.result
				this.formData.mergeId = id
            }
		},
		getTree(id){
			this.option.forEach((item)=>{
				if(item.id==id){
					return  this.region = JSON.parse(item.provinceJson) 
				}
			})
			this.getList()
			this.getUpdate()
		},
		getUpdate(){
			this.$fetch({
				url: 'system/api/knowledgeTree/queryUpdateIdNewDate',
				method: "post",
				data:this.filters,
			}).catch(error => {
				this.$message.error( 'queryUpdateIdNewDate' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					
					this.name = data.result.updateBy
					this.time = data.result.updateTime
					if(data.result.updateBy==null){
						this.name =  JSON.parse(sessionStorage.getItem("userInfo")).user.userName,
						this.time = new Date().toISOString().substring(0, 10)
					}
				} else {
					this.$message.warning(data.message)
				}
			})
		},
		
	},
	created(){
		this.getCity()
		this.getItem()
	},
	mounted() {
		
	}
};

</script>

<style scoped>
.box {
  margin: 0 0 20px;
  width: 100%;
  min-height: 60px;
  box-sizing: border-box;
  padding: 10px;
  background: #fff;
}
.subject,.province{
  margin-left: 50px;
  font-size: 14px;
  color: black;
}
.subjectSelect{
  margin-left: 15px;
}
.title{
	margin: 10px;
	font-size: 24px;
	font-weight: 600;
}
.city{
	margin: 10px;
}
.tips{
	text-align: right;
}
.custom-tree-node{
	display: flex;
	width: 500px;
	justify-content: space-between;
	align-items: center;
}
.tit{
	color: #000;
}
.tit2{
	color: #ccc;
}
.el-tag {
    margin: 5px;
}
</style>