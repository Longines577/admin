<template>
  <div class="hello">
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
						<el-input v-model="filters.subject" placeholder="请输入资源名称" size="small" clearable></el-input>
					</el-form-item>
					<div style="float: right">
						<el-form-item>
							<el-button type="primary" @click="getData">查询</el-button>
						</el-form-item>
						<!-- <el-form-item>
							<el-button type="primary" @click="clear">重置</el-button>
						</el-form-item> -->
					</div>
					
				</el-form>
          <div style="margin: 20px 0;border-top: 1px #ccc solid;" ></div>
          <div style="margin: 10px 0;height: 40px;">
            <el-button type="primary" icon="el-icon-plus" @click="showEdit(0)">新增</el-button>
          </div>
        <tree-grid
          :loading="loading"
          :columns="columns"
          :tree-structure="true"
          :data-source="list"
          :defaultExpandAll="true"
          treeType="edit"
          @edit="showEdit">
        </tree-grid>
      
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
				<el-form-item label="等级" prop="rank">
					<el-input-number v-model="editForm.rank" :min="0" size="small" clearable></el-input-number>
				</el-form-item>
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
import TreeGrid from '@/components/TreeGrid'
import listMixin from '@/api/list'
	
export default {
  mixins: [listMixin],
  components: {
    TreeGrid
  },
  data() {
    return {
      columns: [
        {
          text: '菜单名',
          dataIndex: 'name'
        },
        {
          text: '菜单路径',
          dataIndex: 'url'
        },
        {
          text: '资源类型',
          dataIndex: 'type'
        },
        {
          text: '创建日期',
          dataIndex: 'createTime'
        }
      ],
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
      pList: JSON.parse(sessionStorage.getItem("userInfo")).menuList,
      apiName: 'system/api/listPermissonTreeAll',
      loading: false,
      list: [],
      editForm: [],
      filters:{},
      isShowEdit: false,
      isEdit: 0,
      editId: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
	getData(){
		this.filters.curPage = 1
		this.getList()
	},
    editOk() {
      this.isShowEdit = false
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
			this.editForm = row
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
