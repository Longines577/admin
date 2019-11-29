<template>
	<div class="table">
       	<div class="box">
			   <div class="title">
				   <span>客服前置：</span>
				   <el-radio-group v-model="radio1">
						<el-radio-button label="0">已前置</el-radio-button>
						<el-radio-button label="1">未前置</el-radio-button>
					</el-radio-group>
			   </div>
			   <div class="title">
				   <span>NPS回访：</span>
				   <el-radio-group v-model="radio2">
						<el-radio-button label="0">已回访</el-radio-button>
						<el-radio-button label="1">未回访</el-radio-button>
					</el-radio-group>
			   </div>
			   <div class="title">
				   <span>督学：</span>
				   <el-radio-group v-model="radio3">
						<el-radio-button label="0">出勤</el-radio-button>
						<el-radio-button label="1">做题</el-radio-button>
						<el-radio-button label="2">集训</el-radio-button>
					</el-radio-group>
			   </div>
			
		</div>
        <div class="container">
		<!--工具条-->
			

		<!--列表-->
			<el-table :data="users" border highlight-current-row stripe v-loading="loading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column  align="center" type="selection" width="55">
				</el-table-column>
				<el-table-column  align="center" prop="item1" label="客服前置">
				</el-table-column>
				<el-table-column  align="center" prop="item2" label="NPS回访">
				</el-table-column>
				<el-table-column  align="center" prop="item1" label="学员ID">
				</el-table-column>
				<el-table-column  align="center" prop="item2" label="姓名">
				</el-table-column>
				<el-table-column  align="center" prop="city" label="手机号">
				</el-table-column>
				<el-table-column  align="center" prop="birth" label="报名时间" sortable>
				</el-table-column>
				<el-table-column  align="center" prop="subject" label="班型">
				</el-table-column>
				<el-table-column  align="center" prop="item1" label="家族">
				</el-table-column>
				<el-table-column  align="center" prop="item2" label="班主任">
				</el-table-column>
				<el-table-column  align="center" prop="city" label="订单状态">
				</el-table-column>
				<el-table-column  align="center" prop="item2" label="开班电话">
				</el-table-column>
				<el-table-column  align="center" prop="city" label="联系人">
				</el-table-column>
				<el-table-column  align="center" prop="birth" label="联系时间" sortable>
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
	</div>
</template>
<script>
	// import { getUserList,getUserListPage } from '@/api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				radio1: '',
				radio2: '',
				radio3: '',
				filters: {
					item1: '',
					item2: '',
					city: '',
					birth: ''
				},
				loading: false,
				users: [],
				total: 0,
      			page: 1,
			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			clear(){
				this.filters = {
					item1: '',
					item2: '',
					city: '',
					birth: ''
				}
			},
			selsChange(){},
			// handleCurrentChange(val) {
			// 	this.page = val;
			// 	this.getUser();
			// },
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			//获取用户列表
			getUser: function () {
				let para = {
					page: this.page,
					item1: this.filters.item1
				};
				// this.loading = true;
				//NProgress.start();
				//getUserList(para)把用户输入的name传给mock中，
				//res是Mock通过筛选后传回来的数据
				// getUserListPage(para).then((res) => {
					this.users = [];
					this.total = 1;
					// this.loading = false;
					//NProgress.done();
				// });
				//getUserList(para){}.then(
//					function(res){
						//.....
//						}
//					)
			}
		},
		mounted() {
			this.getUser();
		}
	};

</script>
<style lang="scss" scoped>
.box{
  margin: 0 0 20px;
  width: 100%;
  min-height: 60px;
  box-sizing: border-box;
  padding: 10px;
  
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  .title{
	display: flex;
	align-items: center;
	margin:  20px;
	span{
		display: block;
		width: 100px;
	}
  }
  .el-radio-group{
	display: flex;
	align-items: center;
	text-align: center;
  }
}
.el-radio-button {
    position: relative;
    margin-left: 70px;
    border: 1px #DCDFE6 solid;
    border-radius: 4px !important;
    display: inline-block;
    outline: 0;
}
</style>
<style>
.el-radio-button__inner{
  border: none !important;
  border-radius: 4px !important;
}
</style>
