<template>
	<div class="cont">
		<el-card class="box-card">
			<el-table class="courseTable" :data="refundList" border highlight-current-row stripe style="width: 100%;">
				<el-table-column align="center" prop="name" label="名称"></el-table-column>
				<el-table-column align="center" label="操作" >
					<template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="下载" placement="right">
              <el-button circle type="success" size='medium' @click="download(scope.row)" icon="el-icon-download"></el-button>
            </el-tooltip>
						<el-tooltip class="item" effect="dark" content="删除" placement="right">
							<el-button circle type="danger" size='medium' @click="Del(scope.row)" icon="el-icon-delete"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
		</el-card> 
    <div class="tools">
      <el-button  type="primary" size='mini'  @click="playPay">上传</el-button>
    </div>
    <el-dialog :close-on-click-modal='false' title="上传" :visible.sync="isShowEdit" center  width="680px" append-to-body>
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="名称" prop="name" :rules="[{ required: true, message: '请输入文件名称', trigger: 'blur' }]">
					<el-input v-model="editForm.name" placeholder="请输入文件名称" size="small" clearable></el-input>
				</el-form-item>
			  <el-form-item label="课件上传" prop="type">
        <el-radio-group v-model="editForm.type" size="small">
          <el-radio-button label="0">文件</el-radio-button>
          <el-radio-button label="1">视频</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文件" prop="url"  v-if="editForm.type==0">
					<el-upload
            :action="uploadUrl"
            :http-request="upload" 
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            multiple
            :limit="1"
            :file-list="fileList">
            <el-button size="small" type="success">
            <div class="el-upload__text">点击上传</div></el-button>
          </el-upload>
				</el-form-item>
        <el-form-item label="视频" prop="url" v-if="editForm.type==1">
					<el-upload
            :action="uploadUrl"
            :http-request="upload2" 
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
              multiple
            :limit="1"
            :file-list="fileList">
            <el-button size="small" type="success">
            <div class="el-upload__text">点击上传</div></el-button>
          </el-upload>
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
import listMixin from "@/api/list";
export default {
  mixins: [listMixin],
	data() {
		return {
      refundList:[],
      isShowEdit: false,
      delName: 'system/api/attachment/delAttachment',
      editForm: {},
      fileList:[],
      uploadUrl: $UPLOAD,
		}
	},
	props: {
      id:{
          type: Number
      	},
	  },
	methods: {
     handleAvatarSuccess(res, file) {
      this.editForm.url = this.files;
    },
    	handleRemove(file, fileList) {
      this.editForm.url = ''
    },
		playPay(){
      this.editForm = {}
      this.isShowEdit = true
    },
    editSubmit(){
      this.$refs.editForm.validate((valid) => {
				if(valid){
          this.addAttm()
				}
			})
    },
    addAttm(){
      this.$fetch({
				url: 'system/api/attachment/addAttmentBytime',
				method: "post",
				data: {
          name:this.editForm.name,
          url:this.editForm.url,
          buzId: this.id,
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
				},
			}).catch(error => {
				this.$message.error( 'order/queryOrderAndDetail' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
          this.$message.success(data.message)
          this.getData()
          this.isShowEdit = false
				} else {
					this.$message.warning(data.message)
				}
			})
    },
		getData(){
			this.$fetch({
				url: 'system/api/attachment/findAttchBybuzId',
				method: "post",
				data: {
          buzId: this.id,
					busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
				},
			}).catch(error => {
				this.$message.error( 'findAttchBybuzId' + "接口出错！");
			}).then(({ data }) => {
				if (data.code == 30000) {
					this.refundList = data.result
				} else {
					this.$message.warning(data.message)
				}
			})
    },
    download(row){
			this.$confirm('确定下载文件？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
				window.open(row.url)
			})
    },
		async Del(row) {
        var that = this
        that.$confirm('确定删除所选纪录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            that.$fetch({
                url: 'system/api/attachment/delAttachment',
                method: "post",
                data: {
                    id: row.id
                },
            }).catch(error => {
                that.$message.error('sfindAttchBybuzId' + "接口出错！");
            }).then(({ data }) => {
                if (data.code == 30000) {
                    that.$message.success('删除成功！')
                    this.getData()
                } else {
                    that.$message.warning(data.message)
                }
            })
        });
    },
	},
	mounted() {
		this.getData()
		
	}
};

</script>

<style lang="scss" scoped>

.launch{
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.tools{
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>