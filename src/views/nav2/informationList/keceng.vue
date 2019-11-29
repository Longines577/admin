<template>
	<div class="cont">
        <el-card class="box-card" v-for="(item, index) in formData" :key="index">
			<div class="clearfix">
				<div class="tips">班型名称:{{item.className}}</div>
				<div class="tips">班型类型:{{item.type==0?'远程班型':'普通班型'}}</div>
				<div class="tips">服务到期时间:{{item.serviceEndDate}}</div>
				<div class="tips">订单状态:{{item.orderStatus == 0 ? "待支付": item.orderStatus == 1 ? "已完成": item.orderStatus == 2? "已转": item.orderStatus == 3? "已作废" : "已冻结"}}</div>
				 <el-button type="primary" v-if="item.orderStatus==1" @click="showService(item.orderDetailId)">延长服务期</el-button>
			</div>
			<div class="table">
				<div class="text">
					<div class="p1">课程</div>
					<div class="p2">
						<el-tag
							v-for="(tag,index) in JSON.parse(item.course)"
							:key="index"
							size="medium"
							:disable-transitions="true"
							@close="handleClose(index,1)">
							{{tag.courseName}}
						</el-tag>
					</div>
					<!-- <div class="p3">
						<el-button  @click="view(1)">选择</el-button>
					</div> -->
				</div>
				<div class="text">
					<div class="p1">录播</div>
					<div class="p2">
						<el-tag
							v-for="(tag,index) in JSON.parse(item.records)"
							:key="index"
							size="medium"
							:disable-transitions="true"
							@close="handleClose(index,2)">
							{{tag.courseName}}
						</el-tag>
					</div>
					<!-- <div class="p3">
						<el-button  @click="view(2)">选择</el-button>
					</div> -->
				</div>
				<div class="text">
					<div class="p1">服务</div>
					<div class="p2">
						<el-tag
							v-for="(tag,index) in JSON.parse(item.services)"
							:key="index"
							size="medium"
							:disable-transitions="true"
							@close="handleClose(index,3)">
							{{tag.serviceName}}
						</el-tag>
					</div>
					<!-- <div class="p3">
						<el-button  @click="view(3)">选择</el-button>
					</div> -->
				</div>
				<div class="text">
					<div class="p1">资料包</div>
					<div class="p2">
						<el-tag
							v-for="(tag,index) in JSON.parse(item.datum)"
							:key="index"
							size="medium"
							:disable-transitions="true"
							@close="handleClose(index,4)">
							{{tag.dataName}}
						</el-tag>
					</div>
					<!-- <div class="p3">
						<el-button  @click="view(4)">选择</el-button>
					</div> -->
				</div>
				<div class="text">
					<div class="p1">教材</div>
					<div class="p2">
						<el-tag
							v-for="(tag,index) in JSON.parse(item.textbook)"
							:key="index"
							size="medium"
							:disable-transitions="true"
							@close="handleClose(index,5)">
							{{tag.bookName}}
						</el-tag>
					</div>
					<!-- <div class="p3">
						<el-button  @click="view(5)">选择</el-button>
					</div> -->
				</div>
				<div class="text">
					<div class="p1">题库</div>
					<div class="p2">
						<el-tag
							v-for="(tag,index) in JSON.parse(item.merges)"
							:key="index"
							size="medium"
							:disable-transitions="true"
							@close="handleClose(index,6)">
							{{tag.comlabel}}
						</el-tag>
					</div>
					<!-- <div class="p3">
						<el-button  @click="view(6)">选择</el-button>
					</div> -->
				</div>
			</div>
        </el-card>
		<el-dialog :close-on-click-modal='false' title="延长服务期" :visible.sync="isShowEdit" center width='500px'>
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="延期天数" prop="days" :rules="[{ required: true, message: '请填写延期天数', trigger: 'blur' }]">
					<el-input v-model="editForm.days" placeholder="请输入延期天数" size="small" clearable></el-input>
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
export default {
	data() {
		return {
			item:{},
			formData:[],
			editForm:{},
			isShowEdit: false,
		}
	},
	methods: {
		async getData() { 
            let { data } = await this.$fetch({
                url: 'system/api/classType/queryClassByStudent',
                method: "post",
                data: {
                    studentId: this.$route.query.id
                },
            }).catch(error => {
                this.$message.error('student/detailStudent' + "接口出错！");
            });
            if (data.code == 30000) {
				this.formData = data.result
				// this.formData.education = data.result.education.toString()
            }else {
				this.$message.warning(data.message)
			}
		},
		setService(){
			this.$fetch({
                url: 'system/api/orderDetail/modifyServiceDate',
                method: "post",
                data: this.editForm,
            }).catch(error => {
                this.$message.error('student/detailStudent' + "接口出错！");
            }).then(({data})=>{
				if (data.code == 30000) {
					this.isShowEdit = false
					this.$message.success(data.message)
					this.getData()
				}else {
					this.$message.warning(data.message)
				}
			})
            
		},
		showService(id){
			this.editForm = {}
			this.editForm.orderDetailId = id
			this.isShowEdit = true
		},
		editSubmit(){
			this.$refs.editForm.validate((valid) => {
				if(valid){
					this.setService()
				}
			})
			
		},
	},
	mounted() {
		this.getData()
	}
};

</script>

<style lang="scss" scoped>
.box-card{
	margin-top: 10px;
}
.clearfix{
	display: flex;
	padding: 10px 0;
	flex-wrap: wrap;
	.tips{
		margin-right: 20px;
	}
}
.stySum{
	font-size: 14px;
	font-family: '微软雅黑';
	letter-spacing: 1px;
	margin: 20px 0;
}
.table{
    width: 100%;
    border: 1px #ccc solid;
     border-bottom: 0;
    .text{
        display: flex;
        border-bottom: 1px solid #ccc;
        .p2{
            flex: 1;
            padding: 10px;
			line-height: 2;
        }
        .p1{
           
            border-right: 1px solid #ccc;
        }
        .p1,.p3{
            width: 100px;
            padding: 10px 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
       
    }
    
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
//   .button-new-tag {
//     margin-left: 10px;
//     height: 32px;
//     line-height: 30px;
//     padding-top: 0;
//     padding-bottom: 0;
//   }
//   .input-new-tag {
//     width: 90px;
//     margin-left: 10px;
//     vertical-align: bottom;
//   }
</style>