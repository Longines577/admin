<template>
  <div>
    <el-card class="box-card">
      <el-button type="primary" @click="handleAdd">新增工单</el-button>
      <ul class="Tul">
        <li class="resetClassmaster" v-for="(item, index) in dataDetails" :key="index" >
          <span class="reset">&nbsp;&nbsp;&nbsp;&nbsp;{{item.createTime}} &nbsp;&nbsp;</span>
          <p class="oper">操作人：{{item.createBy}}</p>
          <p  class="txt">工作内容：{{item.title}}</p>
          <p class="txt">备注：{{item.remark}}</p>
        </li>
      </ul>
      <p class="more" v-if="more==1" @click="getMore">点击加载更多</p>
      <p class="more" v-if="more==2">加载中...</p>
      <p class="more" v-if="more==3">没有更多了</p>
    </el-card>
    <el-dialog :close-on-click-modal='false' title="新增工单" :visible.sync="isShowEdit" center width="680px">
			<el-form :model="editForm" label-width="80px" ref="editForm">
        <el-form-item label="工作内容" prop="title" :rules="[{ required: true, message: '请填写工作内容', trigger: 'blur' }]" >
					<el-input  type="textarea" :rows="2" v-model="editForm.title" placeholder="请输入工作内容" size="small" clearable></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark" :rules="[{ required: true, message: '请填写备注', trigger: 'blur' }]" >
					<el-input  type="textarea" :rows="2" v-model="editForm.remark" placeholder="请输入备注" size="small" clearable></el-input>
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
      editForm:{},
      pageSize: 5,
      curPage: 1,
      dataDetails:[],
      isShowEdit: false,
      more: 1,
    };
  },
  methods: {
    handleAdd(){
      this.editForm = {}
      this.isShowEdit = true
    },
    editSubmit(){
      this.editForm.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      this.editForm.createId = JSON.parse(sessionStorage.getItem("userInfo")).uc.id
      this.editForm.createBy = JSON.parse(sessionStorage.getItem("userInfo")).user.userName
      this.editForm.studentId = this.$route.query.id
      this.$refs.editForm.validate((valid) => {
					this.addOrder()
			})
    },
    addOrder(){
      this.$fetch({
          url: 'system/api/workOrder/addWorkOrder',
          method: "post",
          data: this.editForm,
      }).catch(error => {
          this.$message.error('student/detailStudent' + "接口出错！");
      }).then(({data})=>{
        if (data.code == 30000) {
          this.editOk()
				  this.$message.success(data.message)
        }else {
          this.$message.warning(data.message)
        }
      })
      
    },
    editOk(){
      this.isShowEdit = false
      this.getData()
    },
    getMore(){
      this.curPage++
      this.more = 2
      setTimeout(() => {
        this.getData()
      }, 100);
      
    },
		async getData() { 
      let { data } = await this.$fetch({
          url: 'system/api/workOrder/listWorkOrder',
          method: "post",
          data: {
              studentId: this.$route.query.id,
              pageSize: this.pageSize,
              curPage: this.curPage,
              busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
          },
      }).catch(error => {
          this.$message.error('student/detailStudent' + "接口出错！");
      });
      if (data.code == 30000) {
        if(this.curPage==1){
          	this.dataDetails = data.result.content
        }else{
          this.dataDetails = this.dataDetails.concat(data.result.content)
        }
        if(data.result.content.length>0){
          this.more = 1
        }else{
          this.more = 3
        }
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
<style scoped>
.text {
  font-size: 14px;
}
.oper {
  padding-top: 25px;
  margin: 0 0 15px 25px;
  font-size: 14px;
  font-family: "微软雅黑";
}
.txt {
  padding-bottom: 15px;
  margin-left: 25px;
  font-size: 14px;
  font-family: "微软雅黑";
}
.item {
  padding: 18px 0;
}
.Tul {
  margin-left: 60px;
  margin-top: 20px;
  list-style-type: none;
}
.resetClassmaster {
  width: 80%;
  /* height: 100px; */
  /* padding-top: 20px; */
  border: solid 1px #808080;
  margin-top: 40px;
  position: relative;
}
.reset {
  font-size: 14px;
  font-family: "微软雅黑";
  margin-left: 15px;
  font-weight: bolder;

  background: white;
  position: absolute;
  top: -10px;
}
.more{
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  text-align: center;
  color: #222;
  background: rgba(187, 255, 255, 0.5);
  cursor: pointer;
  user-select: none;
}
</style>


