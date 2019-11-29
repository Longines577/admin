<template>
  <div class="table">
    <div class="container">
      <!--工具条-->
      <el-form :inline="true" :model="filters">
        <el-form-item label="支付方式">
          <el-input v-model="filters.payName" placeholder="请输入支付方式" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否分期">
          <el-select v-model="filters.isStages" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否线上">
		   <el-select v-model="filters.isOnline" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <div style="float: right">
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clear">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div style="margin: 20px 0;border-top: 1px #ccc solid;"></div>
      <div style="margin: 10px 0;height: 40px;">
        <el-checkbox v-model="filters.status" true-label="1" @change="getData">只显示启用项目</el-checkbox>
        <el-button type="primary" class="btn" v-if="HasPermission('add2')" @click="showEdit(0)">新增</el-button>
      </div>
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
        <el-table-column align="center" prop="status" :formatter="formatType" label="状态"></el-table-column>
        <el-table-column align="center" prop="payName" label="支付方式"></el-table-column>
        <el-table-column align="center" prop="code" label="支付编码"></el-table-column>
        <el-table-column align="center" prop="isStages" label="是否分期" :formatter="formatTypeStages"></el-table-column>
        <el-table-column align="center" prop="isOnline" label="是否线上" :formatter="formatTypeOnline"></el-table-column>
        <!-- <el-table-column align="center" prop="des" label="描述"></el-table-column> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="left">
							<el-button circle type="primary" size='medium' v-if="HasPermission('update2')" @click="handleEdit(scope.row,1)" icon="el-icon-li-xiugai1"></el-button>
						</el-tooltip>
            <!-- <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button> -->
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
    <el-dialog
      :close-on-click-modal="false"
      :title=" isEdit ? '编辑' : '添加'"
      :visible.sync="isShowEdit"
      center
    >
      <el-form :model="editForm" label-width="80px" ref="editForm">
        <el-form-item
          label="支付方式"
          prop="payName"
          :rules="[{ required: true, message: '请输入支付方式', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.payName" placeholder="请输入支付方式" size="small" clearable></el-input>
        </el-form-item>
		 <el-form-item label="是否分期">
          <el-select v-model="editForm.isStages" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
		 <el-form-item label="是否线上">
		   <el-select v-model="editForm.isOnline" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
		<el-form-item label="支付">
		   <el-select v-model="editForm.code" placeholder="请选择">
            <el-option
              v-for="item in payType"
              :key="item.value"
              :label="item.name"
              :value="item.dkey"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="描述" prop="des">
          <el-input
            type="textarea"
            :rows="2"
            v-model="editForm.des"
            placeholder="请输入描述"
            size="small"
            clearable
          ></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
        <el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import listMixin from "@/api/list";
export default {
  mixins: [listMixin],
  props: {
    type: {
      type: Number
    }
  },
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      apiName: "system/api/payment/listPaymentHash",
      addName: "system/api/payment/addPayment",
      updateName: "system/api/payment/updatePayment",
      delName: "system/api/payment/delPayment",
      editForm: {},
      loading: false,
	  users: [],
	  options:[
		  {
			label:'普通支付',
			value:0
		  },
		  {
			  label:'分期',
			  value:1
		  }
	  ],
	   options1:[
		  {
			label:'线下',
			value:0
		  },
		  {
			label:'线上',
			value:1
		  }
	  ],
	  payType:[],
      total: 0,
      isShowEdit: false,
      isEdit: 0
    };
  },

  methods: {
    getData(){
			this.filters.curPage = 1
			this.getList()
		},
    formatType(row, column) {
      return row.status == 0 ? "已停用" : row.status == 1 ? "已启用" : "";
    },
    formatTypeOnline(row, column) {
      return row.isOnline == 0 ? "线下" : "线上";
    },
    formatTypeStages(row, column) {
      return row.isStages == 0 ? "普通支付" : "分期";
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    },
    showEdit(isEdit) {
      this.isEdit = isEdit;
	  this.isShowEdit = true;
	  this.getPayType()
      this.editForm = {};
    },
    handleEdit(row, isEdit) {
		this.getPayType()
		this.isEdit = isEdit;
		this.isShowEdit = true;
		this.editForm = {
			id: row.id,
			payName: row.payName,
			code: row.code,
			isStages: row.isStages,
			isOnline: row.isOnline
		};
    },
    editSubmit() {
      this.editForm.busId = JSON.parse(
        sessionStorage.getItem("userInfo")
      ).user.busId;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.update();
          } else {
            this.add();
          }
        }
      });
	},
	async getPayType() { 
            let { data } = await this.$fetch({
                url: 'system/api/queryDictionaryByCode',
                method: "post",
                data: {
                    categoryCode: 'pay_type'
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.payType = data.result
            }
        },
    editOk() {
      this.isShowEdit = false;
      this.getList();
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
.btn {
  position: absolute;
  right: 70px;
}
.btn2 {
  width: 30%;
}
</style>