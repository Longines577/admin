<template>
	<div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 学员信息</el-breadcrumb-item>
				<el-button style="float:right;" type="primary" size="mini" @click="$router.go(-1)">返回上一层</el-button>
            </el-breadcrumb>
        </div>
		<div class="container">
			<div class="header">
				<div class="userImg"><img src="@/assets/img/img.png" alt=""></div>
				<div class="cont">
					<div class="name"><span class="user">{{formData.userName}}</span> <span class="age">{{formData.years}}岁</span> </div>
					<div class="tel">{{formData.classMobile}}</div>
				</div>
				<div class="signUp">
					<el-button type="primary" @click="signUp">报名</el-button>
				</div>
			</div>
			<div style="margin: 10px;">
				<el-radio-group v-model="radio">
					<el-radio-button label="0">基本信息</el-radio-button>
					<el-radio-button label="1">课程信息</el-radio-button>
					<el-radio-button label="2">订单信息</el-radio-button>
					<el-radio-button label="3">沟通记录</el-radio-button>
					<el-radio-button label="4">题库</el-radio-button>
					<el-radio-button label="5">课程表</el-radio-button>
					<el-radio-button label="6">工单</el-radio-button>
				</el-radio-group>
			</div>
			<student-details v-if="radio==0" @close-ok="close"></student-details>
			<keceng  v-if="radio==1"></keceng>
			<dingdan  v-if="radio==2"></dingdan>
			<connect  v-if="radio==3"></connect>
			<tiku  v-if="radio==4"></tiku>
			<classcard  v-if="radio==5"></classcard>
			<workOrder  v-if="radio==6"></workOrder>
		</div>
		<el-dialog :close-on-click-modal='false' title="报名" :visible.sync="isShowEdit" v-if="isShowEdit" center width='1280px'>
			<sign-up :data='formData' :type='1' @close-ok="close"></sign-up>
		</el-dialog>
	</div>
</template>
<script>
import StudentDetails from './informationList/student-details'
import keceng from './informationList/keceng'
import dingdan from './informationList/dingdan'
import connect from './informationList/connect'
import tiku from './informationList/tiku'
import classcard from './informationList/classcard'
import WorkOrder  from './informationList/workOrder'
import signUp from './signUp/index'
export default {
	components: {
		StudentDetails,
		keceng,
		dingdan,
		connect,
		tiku,
		classcard,
		signUp,
		WorkOrder
	},
	data() {
		return {
			edit: false,
			formData: {},
			isShowEdit: this.$route.query.show||false,
			radio: 0,
			// dataList: [
			// 	{
			// 		addressEdit: false,
			// 		name: '小明',
			// 		tel: 18112345678,
			// 		zipCode: 246500,
			// 		adress: '某小区',	
			// 	},
			// 	{
			// 		addressEdit: false,
			// 		name: '小明',
			// 		tel: 18112345678,
			// 		zipCode: 246500,
			// 		adress: '某小区',	
			// 	}
			// ]
		}
	},
	methods: {
		signUp(){
			this.isShowEdit = true
		},
		close(){
			this.isShowEdit = false
			this.getData()
		},
		async getData() { 
            let { data } = await this.$fetch({
                url: 'system/api/student/detailStudent',
                method: "post",
                data: {
                    id: this.$route.query.id
                },
            }).catch(error => {
                this.$message.error('student/detailStudent' + "接口出错！");
            });
            if (data.code == 30000) {
				this.formData = data.result
				// if(this.$route.query.show){
				// 	this.isShowEdit = true
				// }
            }else {
				this.$message.warning(data.message)
			}
        },
	},
	mounted() {
		this.getData()
		
	}
};

</script>
<style>
.el-radio-button__inner {
  border: none !important;
  border-radius: 4px !important;
}
</style>

<style lang="scss" scoped>
.header{
	position: relative;
	display: flex;
	background-color: #fff;
	align-items: center;
	.userImg{
		width: 60px;
		height: 60px;
		img{
			width: 100%;
			border-radius: 50%;
		}
	}
	.cont{
		margin-left: 10px;
		line-height: 2;
		.user{
			margin-right: 10px;
		}
		.age{
			margin-left: 10px;
			font-size: 12px;
		}
	}
	.signUp{
		position: absolute;
		right: 30px;
	}
}
</style>
