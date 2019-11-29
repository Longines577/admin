<template>
	<div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-tickets"></i> 系统设置
				</el-breadcrumb-item>
                <el-breadcrumb-item> 组织架构</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		<div class="box">
			<div style="float: right">
				<el-button :type="show==1?'primary':''" @click="show=1">组织架构</el-button>
				<el-button :type="show==0?'primary':''" v-if="HasPermission('view')" @click="show=0">组织架构编辑</el-button>
			</div>
		</div>
		<organization v-if="show==1"></organization>
		<organization-edit v-if="show==0"></organization-edit>
	</div>
</template>
<script>
import organization from './organization'
import organizationEdit from './organization-edit'	
import listMixin from '@/api/list'
export default {
	mixins: [listMixin],
  components: {
	organization,
	organizationEdit
  },
	data() {
		return {
			show: 1
		}
	},
	methods: {
		
	},
	mounted() {
		
	}
};

</script>

<style scoped>
.box {
    padding: 30px;
	margin: 20px 0;
	height: 40px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}

</style>