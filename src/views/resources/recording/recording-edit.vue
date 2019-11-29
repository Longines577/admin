<template>
  <div>
    <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
        <el-form-item v-if='!isEdit' label="一级项目" prop="firstId" :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]">
            <el-select v-model="editForm.firstId" placeholder="请选择" clearable  @change="getoption2">
                <el-option v-for="item in option1" :key="item.value" :label="item.firstName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if='isEdit' label="一级项目" >
             <el-input v-model="editForm.firstName" disabled size="small" clearable></el-input>
        </el-form-item>
        <el-form-item v-if='!isEdit'  label="二级项目" prop="secondId" :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]" >
            <el-select v-model="editForm.secondId" placeholder="请选择"  @change="getSubject" clearable>
                <el-option v-for="item in option2" :key="item.value" :label="item.secondName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
         <el-form-item v-if='isEdit' label="二级项目" >
             <el-input v-model="editForm.secondName" disabled size="small" clearable></el-input>
        </el-form-item>
        <el-form-item v-if='!isEdit'  label="科目" prop="subjectId" :rules="[{ required: true, message: '请填写科目', trigger: 'blur' }]" >
            <el-select v-model="editForm.subjectId" placeholder="请选择" clearable filterable>
                <el-option v-for="item in option3" :key="item.value" :label="item.subjectName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName" :rules="[{ required: true, message: '请填写课程名称', trigger: 'blur' }]" >
            <el-input v-model="editForm.courseName" placeholder="请输入课程名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="课程分类" prop="recordType" :rules="[{ required: true, message: '请选择课程分类', trigger: 'blur' }]" >
            <el-select v-model="editForm.recordType" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in ['免费课程','普通课程','精品课程']" :key="index" :label="item" :value="index"></el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="课程图片" prop="url">
			<el-upload
            :action="imgUrl"
            :http-request="upload" 
            :on-success="handleAvatarSuccess1"
            :on-remove="handleRemove1"
            :multiple="false"
            :limit="1">
            <el-button size="small" type="success">
            <div class="el-upload__text">点击上传</div></el-button>
          </el-upload>
		</el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input type="textarea" autosize  v-model="editForm.remark" placeholder="请输入备注" size="small" clearable></el-input>
        </el-form-item>
    </el-form>
    <el-card class="box-card" style="width: 100%">
        <div slot="header" class="clearfix">
            <div>
                <span>课次配置</span>
                <span class="text">总课次：{{timesJr.length}}次</span>
            </div>
            <div>
                <el-button  type="primary" size='mini'  @click="addition">批量添加课次</el-button>
                <el-button  type="primary" size='mini'  @click="addLessons">添加课次</el-button>
            </div>
           
            <!-- <span @click="addLessons" class="selectClass">添加课次</span> -->
        </div>
        
        <el-table :data="timesJr" border highlight-current-row stripe center>
            <el-table-column  align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="timeName" label="课次名称" align="center">
                 <template slot-scope="scope">
                    <el-input v-model="timesJr[scope.$index].timeName" placeholder="请输入课程名称" size="small" clearable></el-input>
                 </template>
            </el-table-column>
            
            <el-table-column prop="dataId" label="视频名称" align="center">
                <template slot-scope="scope">
                    <el-select v-model="timesJr[scope.$index].dataId" placeholder="请选择" filterable>
                    <el-option
                        v-for="item in list"
                        :key="item.value"
                        :label="item.dataName"
                        :value="item.id"
                    ></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="learnNo" label="学习人数" align="center">
                <template slot-scope="scope">
                    <el-input v-model="timesJr[scope.$index].learnNo" placeholder="请输入学习人数" size="small" clearable></el-input>
                </template>
            </el-table-column>
             <el-table-column prop="timeImg" label="课次图片" align="center" width="100">
                 <template slot-scope="scope">
                     <el-dialog :close-on-click-modal='false' title="课次图片" :visible.sync="dialogVisible" append-to-body>
							<img width="100%" :src="timeImg" alt="">
						</el-dialog>
                     <!-- <img :src="timesJr[scope.$index].timeImg" alt="" style="width:150px;"> -->
                     
                    <el-upload
                        :action="imgUrl"
                        :http-request="upload" 
                        :on-success="handleAvatarSuccess"
                        :on-remove="handleRemove"
                        :multiple="false"
                        :limit="1"
                        >
                        <el-button size="small" type="success" @click="getIndex(scope.$index)"><i class="el-icon-upload" style="font-size:16px;"></i>
                        <div class="el-upload__text" >点击上传</div></el-button>
                    </el-upload>
                    <el-button size="small" type="primary" style="margin-top:10px" @click="view(scope.$index)" >查看图片</el-button>
                 </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                <el-button size="mini" @click="del(scope.$index, scope.row)">
                    <i class="el-icon-delete"></i>
                </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    
    <div slot="footer" class="dialog-footer">
        <el-button class="btn2" type="primary" @click.native="editSubmit">保存并提交</el-button>
        <el-button class="btn2" @click="$emit('save-ok')">取消</el-button>
    </div>
    <el-dialog :close-on-click-modal='false' title="批量添加课次" :visible.sync="isShowAdd" width='30%' center append-to-body>
        <el-form :model="form" label-width="80px" ref="editForm">
            <el-form-item label="课次数" prop="className" >
                <el-input v-model="form.index" placeholder="请输入课次数" size="small" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button class="btn2" @click.native="isShowAdd=false">取消</el-button>
            <el-button class="btn2" type="primary" @click.native="add(form.index)">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import listMixin from '@/api/list'
export default {
  mixins: [listMixin],
  data() {
    return {
        editForm:{ },
        timesJr:[],
        filters: {
            busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        },
        apiName: 'system/api/datum/findDatumListByBusId',
        form:{},
        show: false,
        imgUrl: $UPLOAD,
        mianList: [],
        timeImg: '',
        dialogVisible:false,
        isShowAdd: false,
        list: [],
        option1: [],
        option2: [],
        option3: [],
        rules: {},
        index: '',
        files:''
    }
  },
  props:{
    data: {
      type: Object
    },
    isEdit:
     {
      type: Number
    },
  },
  mounted(){
      if(this.isEdit==1){
          this.getTimeJr()
      }
       if(this.isEdit!=1){
          this.getoption1()
      }
    this.getList()
    this.data && (this.editForm = this.data)
   
  },
  methods: {
    getIndex(index){
        this.index = index
    },
    handleAvatarSuccess(res, file) {
        this.timesJr[this.index].timeImg = this.files;
    },
    handleRemove(file, fileList) {
        this.timesJr[this.index].timeImg = ''
    },
    handleAvatarSuccess1(res, file) {
      this.editForm.url = this.files;
    },
    handleRemove1(file, fileList) {
        this.editForm.url = ''
    },
    view(index) {
        this.timeImg = this.timesJr[index].timeImg
        this.dialogVisible = true;
    },
    editSubmit(){
        this.editForm.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        this.$refs.editForm.validate((valid) => {
            if(valid){
                if(this.isEdit){
                    this.modify()
                }else{
                    this.dataAdd()
                }
            }
        })
    },
    async dataAdd(){
        this.editForm.timesJr = this.timesJr
        let { data } = await this.$http({
            url: 'system/api/recordedCourse/addRerodedAndTimes',
            method: "post",
            data: this.editForm,
        }).catch(error => {
            this.$message.error(this.addName + "接口出错！");
        });
        if (data.code == 30000) {
            this.$message.success('保存成功！')
            this.$emit('save-ok')
        } else {
            this.$message.warning(data.message)
        }
    },
    async modify(){
        this.editForm.timesJr = this.timesJr
        let { data } = await this.$http({
            url: 'system/api/recordedCourse/updateRerodedAndTimes',
            method: "post",
            data: this.editForm,
        }).catch(error => {
            this.$message.error(this.addName + "接口出错！");
        });
        if (data.code == 30000) {
            this.$message.success('保存成功！')
            this.$emit('save-ok')
        } else {
            this.$message.warning(data.message)
        }
    },
    async getTimeJr(){
        let { data } = await this.$fetch({
            url: 'system/api/recordedCourse/queryTimesByRecordId',
            method: "post",
            data: {
                recordId: this.data.id,
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
            },
        }).catch(error => {
            this.$message.error(this.addName + "接口出错！");
        });
        if (data.code == 30000) {
            this.timesJr = data.result
        } else {
            this.$message.warning(data.message)
        }
    },
    addLessons(){
        this.timesJr.push({
            timeName:'',
            dataId:'',
            learnNo:'',
            timeImg:''
        });
    },
    addition(){
        this.isShowAdd = true
        this.form = {}
    },
    add(index){
        this.isShowAdd = false
        for(var i=0;i<index;i++ ){
          this.timesJr.push({
            timeName:'',
            dataId:'',
            learnNo:'',
            timeImg:''
        });  
        }
    },
    del(index,row){
        
        var that = this
        that.$confirm('确定删除所选纪录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if(row.id){
                that.$fetch({
                url: 'system/api/recordTime/delRecordTime',
                method: "post",
                data: {
                    id: row.id
                },
            }).catch(error => {
                that.$message.error('system/api/recordTime/delRecordTime' + "接口出错！");
            }).then(({ data }) => {
                if (data.code == 30000) {
                    that.$message.success('删除成功！')
                    that.getTimeJr()
                } else {
                    that.$message.warning(data.message)
                }
            })
            }else{
                that.timesJr.splice(index,1)
            }
            
        });
    },
  },

}
</script>
<style lang="scss" scoped>
.clearfix{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.dialog-footer{
    margin-top: 20px;
}
.text{
    margin-left: 50px;
}
</style>