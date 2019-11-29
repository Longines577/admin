<template>
  <div>
    <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
        <el-form-item label="班型名称" prop="className" :rules="[{ required: true, message: '请填写班型名称', trigger: 'blur' }]" >
            <el-input v-model="editForm.className" placeholder="请输入班型名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item v-if='!isEdit' label="一级项目" prop="firstId" :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]">
            <el-select v-model="editForm.firstId" placeholder="请选择" clearable  @change="getoption2">
                <el-option v-for="item in option1" :key="item.value" :label="item.firstName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if='!isEdit'  label="二级项目" prop="secondId" :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]" >
            <el-select v-model="editForm.secondId" placeholder="请选择" clearable>
                <el-option v-for="item in option2" :key="item.value" :label="item.secondName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if='isEdit' label="一级项目" >
             <el-input v-model="editForm.firstName" disabled size="small" clearable></el-input>
        </el-form-item>
         <el-form-item v-if='isEdit' label="二级项目" >
             <el-input v-model="editForm.secondName" disabled size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="分校" prop="subId" :rules="[{ required: true, message: '请选择分校', trigger: 'blur' }]" >
            <el-select v-model="editForm.subId" placeholder="请选择" :disabled='isEdit?true:false'  clearable>
                <el-option v-for="(item,index) in option12" :key="index" :label="item.aliasName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <!-- <el-form-item v-if='!isEdit'  label="科目" prop="subjectId" :rules="[{ required: true, message: '请填写科目', trigger: 'blur' }]" >
            <el-select v-model="editForm.subjectId" placeholder="请选择" clearable>
                <el-option v-for="item in option3" :key="item.value" :label="item.subjectName" :value="item.id"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="班型类型" prop="type" :rules="[{ required: true, message: '请填写班型类型', trigger: 'blur' }]">
            <el-select v-model="editForm.type" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in ['远程班型','普通班型']" :key="index" :label="item" :value="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="结算方式" prop="countType" :rules="[{ required: true, message: '请填写结算方式', trigger: 'blur' }]" >
            <el-select v-model="editForm.countType" placeholder="请选择" clearable>
             <el-option v-for="item in countList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="结算值" prop="count" :rules="[{ required: true, message: '请填写结算值', trigger: 'blur' }]" >
            <el-input v-model="editForm.count" placeholder="请输入结算值" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="成本价" prop="primeCost" :rules="[{ required: true, message: '请填写成本价', trigger: 'blur' }]" >
            <el-input v-model="editForm.primeCost" placeholder="请输入成本价" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务期" prop="seviceDate" :rules="[{ required: true, message: '请填写服务期', trigger: 'blur' }]" >
            <el-input v-model="editForm.seviceDate" placeholder="请输入服务期" size="small" clearable style="width:215px">
                <template slot="append">天</template>
            </el-input>
        </el-form-item>
        <el-form-item label="班型描述" prop="des">
            <el-input type="textarea" autosize  v-model="editForm.des" placeholder="请输入班型描述" size="small" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="班型协议" prop="remark">
            <el-input type="textarea" autosize  v-model="editForm.remark" placeholder="请输入班型描述" size="small" clearable></el-input>
        </el-form-item> -->
    </el-form>
    <el-card class="box-card" style="width: 100%">
        <div slot="header" class="clearfix">
           班型配置
        </div>
        <div class="table">
            <div class="text">
                <div class="p1">课程配置</div>
                <div class="p2">
                    <el-tag
                        v-for="(tag,index) in editForm.course"
                        :key="index"
                        closable
                        size="medium"
                        :disable-transitions="true"
                        @close="handleClose(index,1)">
                        {{tag.courseName}}
                    </el-tag>
                </div>
                <div class="p3">
                    <el-button  @click="view(1)">选择</el-button>
                </div>
            </div>
            <div class="text">
                <div class="p1">录播配置</div>
                <div class="p2">
                    <el-tag
                        v-for="(tag,index) in editForm.records"
                        :key="index"
                        closable
                        size="medium"
                        :disable-transitions="true"
                        @close="handleClose(index,2)">
                        {{tag.courseName}}
                    </el-tag>
                </div>
                <div class="p3">
                    <el-button  @click="view(2)">选择</el-button>
                </div>
            </div>
            <div class="text">
                <div class="p1">服务配置</div>
                <div class="p2">
                    <el-tag
                        v-for="(tag,index) in editForm.services"
                        :key="index"
                        closable
                        size="medium"
                        :disable-transitions="true"
                        @close="handleClose(index,3)">
                        {{tag.serviceName}}
                    </el-tag>
                </div>
                <div class="p3">
                    <el-button  @click="view(3)">选择</el-button>
                </div>
            </div>
            <div class="text">
                <div class="p1">资料包配置</div>
                <div class="p2">
                    <el-tag
                        v-for="(tag,index) in editForm.datum"
                        :key="index"
                        closable
                        size="medium"
                        :disable-transitions="true"
                        @close="handleClose(index,4)">
                        {{tag.dataName}}
                    </el-tag>
                </div>
                <div class="p3">
                    <el-button  @click="view(4)">选择</el-button>
                </div>
            </div>
            <div class="text">
                <div class="p1">教材配置</div>
                <div class="p2">
                    <el-tag
                        v-for="(tag,index) in editForm.textbook"
                        :key="index"
                        closable
                        size="medium"
                        :disable-transitions="true"
                        @close="handleClose(index,5)">
                        {{tag.bookName}}
                    </el-tag>
                </div>
                <div class="p3">
                    <el-button  @click="view(5)">选择</el-button>
                </div>
            </div>
            <div class="text">
                <div class="p1">题库配置</div>
                <div class="p2">
                    <el-tag
                        v-for="(tag,index) in editForm.merges"
                        :key="index"
                        closable
                        size="medium"
                        :disable-transitions="true"
                        @close="handleClose(index,6)">
                        {{tag.comlabel}}
                    </el-tag>
                </div>
                <div class="p3">
                    <el-button  @click="view(6)">选择</el-button>
                </div>
            </div>
        </div>
    </el-card>
    <div slot="footer" class="dialog-footer">
        <el-button class="btn2" type="primary" @click.native="editSubmit">保存并提交</el-button>
        <el-button class="btn2" @click="$emit('save-ok')">取消</el-button>
    </div>
    <el-dialog :close-on-click-modal='false' append-to-body :title=" isEdit ? '修改配置' : '新增配置'" :visible.sync="isShow" v-if="isShow" center width='780px'>
        <classType-edit @save-list="classOk" @save-fail="classFail" :data="dataList" :isEdit="isEdit" :type="type" :api="apiName"></classType-edit>
    </el-dialog>
  </div>
</template>
<script>
import listMixin from '@/api/list'
import classTypeEdit from "./classType-edit";
export default {
    mixins: [listMixin],
    components:{
        classTypeEdit
    },
  data() {
    return {
        editForm:{
            course: this.$store.state.course,
            records: this.$store.state.records,
            textbook: this.$store.state.textbook,
            datum: this.$store.state.datum,
            services: this.$store.state.services,
            merges: this.$store.state.merges
        },
        addName: 'system/api/classType/saveTypeAndConfig',
        updateName: 'system/api/classType/saveTypeAndConfig',
        // dynamicTags: this.$store.state.course||[],
        filters: {
            busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        },
        list: [],
        dataList:[],
        option1: [],
        option2: [],
        option3: [],
        option12: [],
        countList:[],
        rules: {},
        isShow: false,
        apiName: '',
        type: ''
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
     this.getCountType()
     this.getBusList()
    if(this.isEdit!=1){
        this.getoption1()
    }else{
    this.data && (this.editForm = this.data) && (this.editForm.countType = this.data.countType.toString())
    }
  },
  methods: {
      async getCountType() { //字典类别查询试题类型
        let { data } = await this.$fetch({
            url: 'system/api/queryDictionaryByCode',
            method: "post",
            data: {
                categoryCode: 'js_type'
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.countList = data.result
        }
    },
    async getBusList() {
        let { data } = await this.$fetch({
            url: 'system/api/bus/queryAllBusMy',
            method: "post",
            data: {
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.option12 = data.result
        }
    },
    handleClose(index,key) {
        this.$confirm('确定删除所选配置？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            switch (key) {
                case 1:
                      this.editForm.course.splice(index, 1);
                    break;
                case 2:
                      this.editForm.records.splice(index, 1);
                    break;
                case 3:
                      this.editForm.services.splice(index, 1);
                    break;
                case 4:
                      this.editForm.datum.splice(index, 1);
                    break;
                case 5:
                      this.editForm.textbook.splice(index, 1);
                    break;
                case 6:
                      this.editForm.merges.splice(index, 1);
                    break;
                default:
                    break;
            }
            this.$message.success('删除成功！')
        })
    },
    view(index) {
        this.isShow = true
        switch (index) {
            case 1:
                this.type = index
                this.dataList = this.editForm.course
                this.apiName = 'system/api/course/queryCourse'
                break;
            case 2:
                this.type = index
                this.dataList = this.editForm.records
                this.apiName = 'system/api/recordedCourse/queryRecordedCourse'
                break;
            case 3:
                this.type = index
                this.dataList = this.editForm.services
                this.apiName = 'system/api/serviceManage/queryServiceManage'
                break;
            case 4:
                this.type = index
                this.dataList = this.editForm.datum
                this.apiName = 'system/api/datum/queryDatum'
                break;
            case 5:
                this.type = index
                this.dataList = this.editForm.textbook
                this.apiName = 'system/api/textbook/queryTextbook'
                break;
            case 6:
                this.type = index
                this.dataList = this.editForm.merges
                this.apiName = 'system/api/provinceMerge/queryProvinceMerge'
                break;
            default:
                break;
        }
    },
    classFail(){
        this.isShow = false
    },
    classOk(key) {
        setTimeout(() => {
             this.isShow = false
        }, 100);
       switch (key) {
            case 1:
               this.editForm.course = this.$store.state.course
               break;
            case 2:
                this.editForm.records = this.$store.state.records
               break;
            case 3:
               this.editForm.services = this.$store.state.services
               break;
            case 4:
               this.editForm.datum = this.$store.state.datum
               break;
            case 5:
               this.editForm.textbook = this.$store.state.textbook
               break;   
            case 6:
               this.editForm.merges = this.$store.state.merges
               break;
           default:
               break;
       }
        
    },
    editSubmit(){
        this.editForm.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        var arr1 = [],arr2 = [],arr3 = [],arr4 = [],arr5 = [],arr6 = []
        this.editForm.course.forEach((item,i)=> {
             return arr1.push({id:item.id,courseName:item.courseName})
         })
        this.editForm.course = arr1

        this.editForm.records.forEach((item,i)=> {
            return arr2.push({id:item.id,courseName:item.courseName})
        })
        this.editForm.records = arr2

        this.editForm.services.forEach((item,i)=> {
            return arr3.push({id:item.id,serviceName:item.serviceName})
        })
        this.editForm.services = arr3
        
        this.editForm.datum.forEach((item,i)=> {
            return arr4.push({id:item.id,dataName:item.dataName})
        })
        this.editForm.datum = arr4

        this.editForm.textbook.forEach((item,i)=> {
            return arr5.push({id:item.id,bookName:item.bookName})
        })
        this.editForm.textbook = arr5

         this.editForm.merges.forEach((item,i)=> {
            return arr6.push({id:item.id,comlabel:item.comlabel,subjectId:item.subjectId,subjectName:item.subjectName})
        })
        this.editForm.merges = arr6
        this.$refs.editForm.validate((valid) => {
            if(valid){
                if(this.isEdit){
                    this.update1()
                }else{
                    this.add1()
                }
                setTimeout(() => {
                     this.$emit('save-ok')
                }, 200);
            }
        })
    },

  },

}
</script>
<style lang="scss" scoped>
.el-textarea{
    display: block;
    width: 800px !important;
}
.dialog-footer{
    margin-top: 20px;
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
            border-right: 1px solid #ccc;
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
        .p3{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    
}
.el-tag {
    margin-bottom: 10px;
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>