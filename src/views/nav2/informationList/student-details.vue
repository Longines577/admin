<template>
	<div>
		<el-card class="box-card">
			<div class="box">
				<el-button v-if="!edit" class="editBtn" type="text" icon="el-icon-edit" @click="editBtn"></el-button>
				<el-button  v-if="edit" class="editBtn" type="text" icon="el-icon-star-off" @click="saveBtn"></el-button>
				<div>姓名：<span v-if="!edit">{{formData.userName}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.userName" clearable style="width:200px;"></el-input>
				</div>
				<div>性别：<span v-if="!edit">{{formData.gender==0?'男':'女'}}</span>
					<el-select v-if="edit" v-model="formData.gender" placeholder="请选择" clearable style="width:200px;">
						<el-option v-for="(item,index) in ['男','女','未知']" :key="index" :label="item"	:value="index"></el-option>
					</el-select>
				</div>
				<div>民族：<span v-if="!edit">{{formData.nation}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.nation" clearable style="width:200px;"></el-input>
				</div>
				<div>上课手机号：<span v-if="!edit">{{formData.classMobile}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.classMobile" clearable style="width:200px;"></el-input>
				</div>
				<div>电话1：<span v-if="!edit">{{formData.firstMobile}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.firstMobile" clearable style="width:200px;"></el-input>
				</div>
				<div>电话2：<span v-if="!edit">{{formData.secondMobile}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.secondMobile" clearable style="width:200px;"></el-input>
				</div>
				<div>微信：<span v-if="!edit">{{formData.wx}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.wx" clearable style="width:200px;"></el-input>
				</div>
				<div>QQ：<span v-if="!edit">{{formData.qq}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.qq" clearable style="width:200px;"></el-input>
				</div>
				<div>地域：<span v-if="!edit">{{formData.province}}</span>
					<el-select v-if="edit" v-model="formData.province" placeholder="请选择" filterable clearable style="width:200px;">
						<el-option v-for="(item,index) in province" :key="index" :label="item.name" :value="item.name"></el-option>
					</el-select>
					<!-- <el-input v-if="edit" placeholder="请输入" v-model="formData.province" clearable ></el-input> -->
				</div>
				<!-- <div>来源：<span v-if="!edit">{{formData.source}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.source" clearable style="width:200px;"></el-input>
				</div> -->
				<div>邮箱：<span v-if="!edit">{{formData.email}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.email" clearable style="width:200px;"></el-input>
				</div>
				<div>出生日期：<span v-if="!edit">{{formData.birthDate1}}</span>
					<el-date-picker
						v-if="edit"
						v-model="formData.birthDate"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="出生日期"
						 clearable style="width:200px;">
					</el-date-picker>
				</div>
				<div>年龄：<span v-if="!edit">{{formData.years}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.years" clearable style="width:200px;"></el-input>
				</div>
				<div>最高学历：<span v-if="!edit">{{formData.education==0?'高中':formData.education==1?'大专':formData.education==2?'本科':formData.education==3?'硕士':formData.education==4?'博士':''}}</span>
					<el-select v-if="edit" v-model="formData.education" placeholder="请选择" clearable  style="width:200px;">
						<el-option v-for="(item,index) in education" :key="index" :label="item.name" :value="item.value"></el-option>
					</el-select>
					<!-- <el-input v-if="edit" placeholder="请输入" v-model="formData.education" clearable style="width:200px;"></el-input> -->
				</div>
				<div>证件类型：<span v-if="!edit">{{formData.certificateType==1?'身份证':'其他证件'}}</span>
					<el-select v-if="edit" v-model="formData.certificateType" placeholder="请选择" clearable style="width:200px;">
						<el-option v-for="(item,index) in ['身份证']" :key="index" :label="item" :value="index+1"></el-option>
					</el-select>
					<!-- <el-input v-if="edit" placeholder="请输入" v-model="formData.cardType" clearable style="width:200px;"></el-input> -->
				</div>
				<div>证件号码：<span v-if="!edit">{{formData.certificateCode}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.certificateCode" clearable style="width:200px;"></el-input>
				</div>
				<!-- <div>工作状态：<span v-if="!edit">{{formData.workType}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.workType" clearable style="width:200px;"></el-input>
				</div> -->
				<div>紧急联系人：<span v-if="!edit">{{formData.emergenContact}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.emergenContact" clearable style="width:200px;"></el-input>
				</div>
				<div>紧急联系号码：<span v-if="!edit">{{formData.emergenMobile}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.emergenMobile" clearable style="width:200px;"></el-input>
				</div>
				<div>单位名称：<span v-if="!edit">{{formData.unitName}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.unitName" clearable style="width:200px;"></el-input>
				</div>
				<div>家庭住址：<span v-if="!edit">{{formData.homeAddress}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.homeAddress" clearable style="width:200px;"></el-input>
				</div>
				<!-- <div>婚姻状态：<span v-if="!edit">{{formData.marriage}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.marriage" clearable style="width:200px;"></el-input>
				</div>
				<div>课程基础：<span v-if="!edit">{{formData.basics}}</span>
					<el-input v-if="edit" placeholder="请输入" v-model="formData.basics" clearable style="width:200px;"></el-input>
				</div> -->
			</div>
			<!-- <div class="addressList">
				<el-button type="text" class="addBtn" icon="el-icon-circle-plus-outline" @click="add()"></el-button>
				<div class="address" v-for="(item, index) in dataList" :key="index">
					<div v-if="!item.addressEdit"><span class="name">{{item.name}}  </span><span v-if="index==0">(默认地址)</span>
						<el-button class="addressBtn" type="text" icon="el-icon-edit" @click="editAddress(index)"></el-button>
						<el-button type="text" icon="el-icon-delete" @click="del(index)"></el-button>
					</div>
					<div v-if="item.addressEdit">
						<el-input placeholder="请输入" v-model="item.name" clearable style="width:200px;"></el-input>
						<el-button class="addressBtn" type="text" icon="el-icon-star-off" @click="saveAddress(index)"></el-button>
						<el-button type="text" icon="el-icon-delete" @click="del(index)"></el-button>
					</div>
					<div>联系方式：<span v-if="!item.addressEdit">{{item.tel}}</span>
						<el-input v-if="item.addressEdit" placeholder="请输入" v-model="item.tel" clearable style="width:200px;"></el-input>
					</div>
					<div>邮编：<span v-if="!item.addressEdit">{{item.zipCode}}</span>
						<el-input v-if="item.addressEdit" placeholder="请输入" v-model="item.zipCode" clearable style="width:200px;"></el-input>
					</div>
					<div>住址：<span v-if="!item.addressEdit">{{item.adress}}</span>
						<el-input v-if="item.addressEdit" placeholder="请输入" v-model="item.adress" clearable style="width:200px;"></el-input>
					</div>
				</div>
			</div> -->
		</el-card>
	</div>
</template>
<script>
export default {
	data() {
		return {
			edit: false,
			formData:{},
			province:[],
			education:[],
			dataList: [
				{
					addressEdit: false,
					name: '小明',
					tel: 18112345678,
					zipCode: 246500,
					adress: '某小区',	
				},
				{
					addressEdit: false,
					name: '小明',
					tel: 18112345678,
					zipCode: 246500,
					adress: '某小区',	
				}
			]
		}
	},
	mounted() {
		this.getData()
		this.getEducation()
    	this.getProvince()
	},
	methods: {
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
				this.formData.education = data.result.education.toString()
            }else {
				this.$message.warning(data.message)
			}
		},
		 async getEducation() { 
			let { data } = await this.$fetch({
				url: 'system/api/queryDictionaryByCode',
				method: "post",
				data: {
					categoryCode: 'education'
				},
			}).catch(error => {
				this.$message.error(this.apiName + "接口出错！");
			});
			if (data.code == 30000) {
				this.education = data.result
			} else {
			this.$message.warning(data.message)
		}
		},
		async getProvince () { 
			let { data } = await this.$fetch({
				url: 'system/api/region/queryAllProvince',
				method: "post",
			}).catch(error => {
				this.$message.error(this.apiName + "接口出错！");
			});
			if (data.code == 30000) {
				this.province = data.result
			} else {
			this.$message.warning(data.message)
		}
		},
		editBtn(){
			this.edit = true
		},
		saveBtn(){
			let params = {
				id: this.formData.id,
				userName: this.formData.userName,
				gender: this.formData.gender,
				nation: this.formData.nation,
				classMobile: this.formData.classMobile,
				firstMobile: this.formData.firstMobile,
				secondMobile: this.formData.secondMobile,
				wx: this.formData.wx,
				qq: this.formData.qq,
				province: this.formData.province,
				email: this.formData.email,
				birthDate: this.formData.birthDate,
				years: this.formData.years,
				certificateType: this.formData.certificateType,
				certificateCode: this.formData.certificateCode,
				emergenContact: this.formData.emergenContact,
				emergenMobile: this.formData.emergenMobile,
				education: this.formData.education,
				unitName: this.formData.unitName,
				homeAddress: this.formData.homeAddress,
			}
			this.$fetch({
				url: 'system/api/student/updateStudent',
				method: "post",
				data: params,
			}).catch(error => {
				this.$message.error(this.updateName + "接口出错！");
			}).then(({data})=>{
				if (data.code == 30000) {
				this.$message.success('保存成功！')
				this.edit = false
				this.getData()
				this.$emit('close-ok')
				} else {
					this.$message.warning(data.message)
				}
			})
		},
		editAddress(index){
			this.dataList[index].addressEdit = true
		},
		saveAddress(index){
			this.dataList[index].addressEdit = false
		},
		add(){
			this.dataList.push({
				addressEdit: true,
				name: '',
				tel: '',
				zipCode: '',
				adress: '',
			});
		},
		del(index){
			if(this.dataList.length > 1){
				this.dataList.splice(index,1);
				}else{
				this.$message({
						type: 'error',
						message: '不可删除'
				})
			}
		},
	},
	
};

</script>

<style lang="scss" scoped>

.box{
	position: relative;
	margin-top: 40px;
	width: 88%;
	display: flex;
	flex-wrap: wrap;
	div{
		width: 33%;
		line-height: 2.5;
	}
	.editBtn{
		position: absolute;
		right: -30px;
		font-size: 24px;
	}
}
.addressList{
	position: relative;
	margin-top: 40px;
	margin-left: 84px;
	width: 88%;
	display: flex;
	flex-wrap: wrap;
	.addBtn{
		position: absolute;
		right: -30px;
		font-size: 24px; 
	}
	.address{
		width: 25%;
		box-sizing: border-box;
		padding-left: 20px;
		margin-top: 40px;
		line-height: 2.5;
		.addressBtn{
			font-size: 16px;
			margin-left: 30px;
		}
	}
}
.name{
	font-weight:bolder;
	font-family: '微软雅黑'
}
</style>
