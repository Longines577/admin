<template>
	<div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 学员详情</el-breadcrumb-item>
				<el-button style="float:right;" type="primary" size="mini" @click="$router.go(-1)">返回上一层</el-button>
            </el-breadcrumb>
        </div>
		
		<div class="details">
			<div class="box">
				<div class="title">学员信息</div>
				<div class="cont">
					<div class="stySum">姓名：{{dataDetails.name}}</div>
					<div class="stySum">手机号：{{dataDetails.tel}}</div>
					<div  class="stySum">证件类型：{{dataDetails.cardType}}</div>
					<div  class="stySum">证件号码：{{dataDetails.cardsId}}</div>
					<el-button class="seeBtn" type="primary" plain @click="seeDetails">查看详情</el-button>
				</div>
			</div>
			<div class="box">
				<div class="title">课程信息</div>
				<div class="cont">
					<div class="stySum">一级项目：{{dataDetails.item1}}</div>
					<div class="stySum">二级项目：{{dataDetails.item2}}</div>
					<div class="stySum">班型：{{dataDetails.banType}}</div>
				</div>
			</div>
			<div class="box">
				<div class="title">订单信息</div>
				<div class="cont">
					<div class="sty">订单编号：{{dataDetails.number}}</div>
					<div class="sty">原价：{{dataDetails.price}}</div>
					<div class="sty">优惠金额：{{dataDetails.money}}</div>
					<div class="sty">实际支付：{{dataDetails.payment}}</div>
					<div class="sty">支付时间：{{dataDetails.time}}</div>
					<div class="sty">分期：{{dataDetails.stagesType}}</div>
					<div class="sty">协议：
						<el-button size="medium" type="text" @click="seeEdit()">查看</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="button">
			<div class="btn" @click="goLunci">轮次({{dataDetails.num1}})</div>
			<div class="btn" @click="goDetails">沟通记录({{dataDetails.num2}})</div>
		</div>
		<div class="tips">课程表</div>
		
		<div class="container">
			<div style="margin:20px 0;">
			 	<el-date-picker
					v-model="value1"
					type="week"
					:picker-options="{'firstDayOfWeek': 1}"
					format="yyyy 第 WW 周"
					placeholder="选择周">
				</el-date-picker>
			</div>
			<el-table
			class="courseTable"
			:data="dataList"
			border
			highlight-current-row
			stripe
			style="width: 100%;"
		>
			<el-table-column align="center" prop="subject1" label="星期一"></el-table-column>
			<el-table-column align="center" prop="subject2" label="星期二"></el-table-column>
			<el-table-column align="center" prop="subject3" label="星期三"></el-table-column>
			<el-table-column align="center" prop="subject4" label="星期四"></el-table-column>
			<el-table-column align="center" prop="subject5" label="星期五"></el-table-column>
			<el-table-column align="center" prop="subject6" label="星期六"></el-table-column>
			<el-table-column align="center" prop="subject7" label="星期日"></el-table-column>
		</el-table>
	  </div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			dataDetails:{
				name: '小明',
				tel: 18744145642,
				cardType: '身份证',
				cardsId: 340222199601011514,
				item1: '安徽自考',
				item2: '安徽本科',
				banType: '人力资源管理精品班',
				number: '4545454415212',
				price: '8888.00',
				money: '2222.00',
				payment: '6666.00',
				time: '2019-06-01  18:35',
				stagesType: '百度分期',
				num1: 10,
				num2: 11,
			},
			value1: '',
			dataList: '',
			dataList: [
				{
					subject1: '18:30-20:30 人力资源管理（1）',
					subject2: '18:30-20:30 人力资源管理（1）',
					subject3: '18:30-20:30 人力资源管理（1）',
					subject4: '18:30-20:30 人力资源管理（1）',
					subject5: '18:30-20:30 人力资源管理（1）',
					subject6: '18:30-20:30 人力资源管理（1）',
					subject7: '18:30-20:30 人力资源管理（1）',
				},
				{
					subject1: '18:30-20:30 人力资源管理（1）',
					subject2: '18:30-20:30 人力资源管理（1）',
					subject3: '18:30-20:30 人力资源管理（1）',
					subject4: '18:30-20:30 人力资源管理（1）',
					subject5: '18:30-20:30 人力资源管理（1）',
					subject6: '18:30-20:30 人力资源管理（1）',
					subject7: '18:30-20:30 人力资源管理（1）',
				},
				{
					subject1: '18:30-20:30 人力资源管理（1）',
					subject2: '18:30-20:30 人力资源管理（1）',
					subject3: '18:30-20:30 人力资源管理（1）',
					subject4: '18:30-20:30 人力资源管理（1）',
					subject5: '18:30-20:30 人力资源管理（1）',
					subject6: '18:30-20:30 人力资源管理（1）',
					subject7: '18:30-20:30 人力资源管理（1）',
				},
				{
					subject1: '18:30-20:30 人力资源管理（1）',
					subject2: '18:30-20:30 人力资源管理（1）',
					subject3: '18:30-20:30 人力资源管理（1）',
					subject4: '18:30-20:30 人力资源管理（1）',
					subject5: '18:30-20:30 人力资源管理（1）',
					subject6: '18:30-20:30 人力资源管理（1）',
					subject7: '18:30-20:30 人力资源管理（1）',
				},
				{
					subject1: '18:30-20:30 人力资源管理（1）',
					subject2: '18:30-20:30 人力资源管理（1）',
					subject3: '18:30-20:30 人力资源管理（1）',
					subject4: '18:30-20:30 人力资源管理（1）',
					subject5: '18:30-20:30 人力资源管理（1）',
					subject6: '18:30-20:30 人力资源管理（1）',
					subject7: '18:30-20:30 人力资源管理（1）',
				},
				{
					subject1: '18:30-20:30 人力资源管理（1）',
					subject2: '18:30-20:30 人力资源管理（1）',
					subject3: '18:30-20:30 人力资源管理（1）',
					subject4: '18:30-20:30 人力资源管理（1）',
					subject5: '18:30-20:30 人力资源管理（1）',
					subject6: '18:30-20:30 人力资源管理（1）',
					subject7: '18:30-20:30 人力资源管理（1）',
				},
			]
		}
	},
	methods: {
		seeEdit(){

		},
		seeDetails(){
			 this.$router.push({name:'studentNews',params: {id:'1'}}) 
		},
		goLunci(){
			 this.$router.push({name:'initialTurn',params: {id:'1'}}) 
		},
		goDetails(){
			 this.$router.push({name:'connect',params: {id:'1'}}) 
		}
	},
	mounted() {
		
	}
};

</script>

<style lang="scss" scoped>

.details{
	display: flex;
	width: 80%;
	padding: 20px;
	justify-content: space-between;
	background: #edf0f4;
	.box{
		width: 33%;
		min-height: 300px;
		background: #fff;
		.title{
			width: 100%;
			height: 40px;
			text-align: center;
			line-height: 40px;
			color: #fff;
			background: #426CB1;
		}
		.cont{
			box-sizing: border-box;
			padding: 20px;
			line-height: 2;
			.seeBtn{
				margin-top: 20px;
				margin-left: 50%;
				transform: translateX(-50%);
			}
		}
	}
}
.button{
	display: flex;
	width: 80%;
	margin: 10px 20px;
	justify-content: space-between;
	background: #edf0f4;
	.btn{
		width: 49.5%;
		height: 50px;
		text-align: center;
		line-height: 50px;
		color: #fff;
		background: #426CB1;
		cursor: pointer;
	}
}
.tips{
	width: 100%;
	height: 80px;
	text-align: center;
	line-height: 80px;
	font-size: 30px;
	font-weight: 600;
}
.stySum{
	font-size: 14px;
	font-family: '微软雅黑';
	letter-spacing: 1px;
	margin-top: 20px;
}
.sty{
	font-size: 14px;
	font-family: '微软雅黑';
	letter-spacing: 1px;
	margin-top: 5px;
}
</style>
<style lang="scss">
.courseTable {
	.el-table__header th, .el-table__header tr {
		background-color: #17B3A3;
		color: black;
	}
	.el-pager li.active {
		color: #080909;
		cursor: default;
		background-color: #17B3A3;
		border-radius: 2px;
	}
}

</style>
