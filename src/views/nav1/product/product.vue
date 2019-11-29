<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 产品包与排课
        </el-breadcrumb-item>
        <el-breadcrumb-item>产品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--工具条-->
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;"> -->
      <el-form :inline="true" :model="filters" class="form">
        <!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>-->
		<div class="boxLeft">
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
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="请选择" clearable>
            <el-option v-for="(item,index) in ['在售','下架']" :key="index" :label="item" :value="index+1"></el-option>
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
		</div>

      </el-form>
    <!-- </el-col> -->
    <div class="container">
      <!-- <div style="margin: 10px 0;">
        <el-button type="primary" @click="showEdit(0)">新增</el-button>
      </div> -->
      <!--列表-->
      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        v-loading="loading"
        style="width: 100%;"
      >
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="status" :formatter="row => row.status == 1 ? '在售' :row.status == 2? '下架' : ''" label="状态" ></el-table-column>
        <el-table-column align="center" prop="className" label="班型名称" ></el-table-column>
        <el-table-column align="center" prop="goodsName" label="产品名称" ></el-table-column>
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
         <el-table-column align="center" prop="price" label="价格" width='60'></el-table-column>
        <el-table-column align="center" prop="minPrice" label="最低价格" width='80'></el-table-column>
        <el-table-column align="center" prop="seviceDate" label="服务期" width='100' ></el-table-column>
        <!-- <el-table-column align="center" prop="birth" label="协议配置" sortable width="100"></el-table-column>
        <el-table-column align="center" prop="subject" label="课程类型"></el-table-column>
        <el-table-column align="center" prop="birth" label="教铺材料"></el-table-column>
        <el-table-column align="center" prop="item1" label="保险"></el-table-column>
        <el-table-column align="center" prop="item2" label="分期"></el-table-column>
        <el-table-column align="center" prop="city" label="状态"></el-table-column> -->
        <el-table-column align="center" prop="chargeCollege" label="承接学院"></el-table-column>
        <el-table-column align="center" prop="chargeFamily" label="承接家族"></el-table-column>
        <el-table-column align="center" prop="chargeOperate" label="承接运营组" width='100'></el-table-column>
        <el-table-column align="center" prop="chargeName" label="运营长"></el-table-column>
        <el-table-column align="center" prop="subBusName" label="分校"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="HasPermission('update')" @click="handleEdit(scope.row,1)">修改</el-button>
            <el-button type="danger" @click="lowerShelf(scope.row)" v-if="scope.row.status==1&&HasPermission('lowerShelf')">下架</el-button>
            <el-button type="success" @click="upShelf(scope.row)" v-if="scope.row.status!=1&&HasPermission('upShelf')">上架</el-button>
            <!-- <el-button type="danger" @click="handleRecord(scope.row,2)">记录</el-button> -->
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
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :close-on-click-modal='false'
      :title=" isEdit==0 ? '编辑' :isEdit==1 ? '添加' : '记录'"
      :visible.sync="isShowEdit"
      v-if="isShowEdit"
      center
      width='980px'
    >
      <product-edit @save-ok="editOk" :data="formData" :type="isEdit" v-if="isEdit!=2"></product-edit>
      <log :data="formData" v-if="isEdit==2"></log>
    </el-dialog>
  </div>
</template>
<script>
import listMixin from '@/api/list'
import ProductEdit from "./product-edit";
import Log from "./log";
export default {
  mixins: [listMixin],
  components: {
    ProductEdit,
    Log
  },
  data() {
    return {
     filters: {
				curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
			},
      apiName: 'system/api/goods/listGoodsHash',
      loading: false,
      users: [],
      option1: [],
      option2:[],
      option20:[],
      formData: {},
      editForm:{},
      total: 0,
      page: 1,
      isShowEdit: false,
      isEdit: 0
    };
  },
  methods: {
    getData(){
			this.filters.curPage = 1
			this.getList()
		},
    clear() {
      this.filters = {
        curPage: 1,
				pageSize: 10,
				busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
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
    handleRecord(row, isEdit) {
      this.isEdit = isEdit;
      this.isShowEdit = true;
    },
    editOk() {
      this.isShowEdit = false;
      this.getList()
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
      this.isEdit = isEdit;
      this.isShowEdit = true;
      this.formData = {};
    },
    handleEdit(row, isEdit) {
      this.formData = row;
      this.isEdit = isEdit;
      this.isShowEdit = true;
    },
    lowerShelf(row){
      this.editForm = {
        id:row.id,
        status:2
      }
       this.$confirm('确定下架该产品？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          this.updateStatus()
        })
    },
    upShelf(row){
      this.editForm = {
        id:row.id,
        status:1
      }
       this.$confirm('确定上架该产品？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
          this.updateStatus()
        })
      
    },
    async updateStatus() {
        let { data } = await this.$fetch({
            url: 'system/api/goods/updateGoodsStatus',
            method: "post",
            data: this.editForm,
        }).catch(error => {
            this.$message.error(this.addName + "接口出错！");
        });
        if (data.code == 30000) {
          if(this.editForm.status==1){
            this.$message.success('上架成功！')
          }
          if(this.editForm.status==2){
            this.$message.success('下架成功！')
          }
          this.getList()
        } else {
            this.$message.warning(data.message)
        }
    },
  },
  mounted() {
    this.getList();
    this.getBusList()
    this.getoption1()
  }
};
</script>

<style scoped>
.form {
  background: white;
  margin-bottom: 20px;
  padding-top: 20px;
}
.boxLeft{
	width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
	
}
.form-title{
	width:28%;
}
</style>