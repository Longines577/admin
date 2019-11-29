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
        <el-form-item label="授课方式">
            <el-select v-model="editForm.teachType" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in ['面授','直播']" :key="index" :label="item" :value="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="课程分类">
            <el-select v-model="editForm.courseType" placeholder="请选择" clearable filterable>
                <el-option v-for="(item,index) in ['公开课','精讲课','串讲课','模考课']" :key="index" :label="item"	:value="index"></el-option>
            </el-select>
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
            <el-table-column prop="timeName" label="课次名" align="center">
                 <template slot-scope="scope">
                    <el-input v-model="timesJr[scope.$index].timeName" placeholder="请输入课程名称" size="small" clearable></el-input>
                 </template>
            </el-table-column>
            <el-table-column prop="times" label="预约数" align="center">
                <template slot-scope="scope">
                    <el-input v-model="timesJr[scope.$index].times" placeholder="请输入预约数" size="small" clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="rand" label="随堂考" align="center">
                <template slot-scope="scope">
                    <el-input v-model="timesJr[scope.$index].rand" placeholder="请输入随堂考" size="small" clearable></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="hours" label="小时" align="center">
                <template slot-scope="scope">
                    <el-input v-model="timesJr[scope.$index].hours" placeholder="请输入小时数" size="small" clearable></el-input>
                </template>
            </el-table-column>
             <el-table-column prop="url" label="小程序图片" align="center" width="100">
                 <template slot-scope="scope">
                     <el-dialog :close-on-click-modal='false' title="小程序图片" :visible.sync="dialogVisible" append-to-body>
							<img width="100%" :src="timeImg" alt="">
						</el-dialog>
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
            <el-table-column prop="pcUrl" label="商城图片" align="center" width="100">
                 <template slot-scope="scope">
                     <el-dialog :close-on-click-modal='false' title="商城图片" :visible.sync="pcVisible" append-to-body>
							<img width="100%" :src="pcImg" alt="">
						</el-dialog>
                    <el-upload
                        :action="imgUrl"
                        :http-request="upload" 
                        :on-success="handleAvatarSuccess1"
                        :on-remove="handleRemove1"
                        :multiple="false"
                        :limit="1"
                        >
                        <el-button size="small" type="success" @click="getIndex1(scope.$index)"><i class="el-icon-upload" style="font-size:16px;"></i>
                        <div class="el-upload__text" >点击上传</div></el-button>
                    </el-upload>
                    <el-button size="small" type="primary" style="margin-top:10px" @click="view1(scope.$index)" >查看图片</el-button>
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
            <el-form-item label="课时数" prop="className" >
                <el-input v-model="form.hours" placeholder="请输入课时数" size="small" clearable></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button class="btn2" @click.native="isShowAdd=false">取消</el-button>
            <el-button class="btn2" type="primary" @click.native="add(form.index,form.hours)">确定</el-button>
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
        pcVisible: false,
        pcImg: '',
        indexs: '',
        files: ''
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
    this.data && (this.editForm = this.data)
   
  },
  methods: {
    getIndex(index){
        this.index = index
    },
    handleAvatarSuccess(res, file) {
        this.timesJr[this.index].url = this.files;
    },
    handleRemove(file, fileList) {
        this.timesJr[this.index].url = ''
    },
    view(index) {
        this.timeImg = this.timesJr[index].url
        this.dialogVisible = true;
    },
    getIndex1(index){
        this.indexs = index
    },
    handleAvatarSuccess1(res, file) {
        this.timesJr[this.indexs].pcUrl = this.files;
    },
    handleRemove1(file, fileList) {
        this.timesJr[this.indexs].pcUrl = ''
    },
    view1(index) {
        this.pcImg = this.timesJr[index].pcUrl
        this.pcVisible = true;
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
            url: 'system/api/course/addCourseAndTimes',
            method: "post",
            data: this.editForm,
        }).catch(error => {
            this.$message.error('添加' + "接口出错！");
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
            url: 'system/api/course/updateCourseAndTimes',
            method: "post",
            data: this.editForm,
        }).catch(error => {
            this.$message.error('modify' + "接口出错！");
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
            url: 'system/api/courseTime/queryTimesByCourseId',
            method: "post",
            data: {
                courseId: this.data.id,
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
            },
        }).catch(error => {
            this.$message.error('getTimeJr' + "接口出错！");
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
            times:'',
            rand:'',
            hours: '',
            timeImg:'',
            pcImg:''
        });
    },
    addition(){
        this.isShowAdd = true
        this.form = {}
    },
    add(index,hours){
        this.isShowAdd = false
        for(var i=0;i<index;i++ ){
          this.timesJr.push({
            timeName:'',
            times:'',
            rand:'',
            hours: hours,
            timeImg:'',
            pcImg:''
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
                url: 'system/api/courseTime/delCourseTime',
                method: "post",
                data: {
                    id: row.id
                },
            }).catch(error => {
                that.$message.error('system/api/courseTime/delCourseTime' + "接口出错！");
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