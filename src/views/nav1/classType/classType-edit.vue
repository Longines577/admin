<template>
	<div class="cont">
        <el-form :model="filters" label-width="80px" :inline="true" ref="filters">
            <el-form-item  v-if="type!=6" label="一级项目"  prop="firstId" :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]">
                <el-select v-model="filters.firstId" placeholder="请选择" clearable  @change="getoption2">
                    <el-option v-for="item in option1" :key="item.value" :label="item.firstName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item  v-if="type!=6"  label="二级项目" prop="secondId" :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]" >
                <el-select v-model="filters.secondId" placeholder="请选择"  @change="getSubject" clearable>
                    <el-option v-for="item in option2" :key="item.value" :label="item.secondName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="type==1||type==2" label="名称" prop="courseName" :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]" >
                <el-input v-model="filters.courseName" placeholder="请输入名称" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="type==3" label="名称" prop="serviceName" :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]" >
                <el-input v-model="filters.serviceName" placeholder="请输入名称" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="type==4" label="名称" prop="dataName" :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]" >
                <el-input v-model="filters.dataName" placeholder="请输入名称" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="type==5" label="名称" prop="bookName" :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]" >
                <el-input v-model="filters.bookName" placeholder="请输入名称" size="small" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="type==6" label="名称" prop="comlabel" :rules="[{ required: true, message: '请填写名称', trigger: 'blur' }]" >
                <el-input v-model="filters.comlabel" placeholder="请输入名称" size="small" clearable></el-input>
            </el-form-item>
            <div style="float: right">
                <el-form-item>
                    <el-button type="primary" @click="seeList">查询</el-button>
                </el-form-item>
            </div>
        </el-form>
        <div class="tips">
            <div class="tap">已选择：</div>
            <el-tag
                v-for="(tag,index) in dynamicTags"
                :key="index"
                closable
                size="medium"
                :disable-transitions="true"
                @close="handleClose(tag,index)">
                {{type==1?tag.courseName:type==2?tag.courseName:type==3?tag.serviceName:type==4?tag.dataName:type==5?tag.bookName:tag.comlabel}}
            </el-tag>
        </div>
        <el-card class="box-card">
			<el-table class="courseTable" ref="multipleTable" :data="list" height="350" border highlight-current-row stripe  @selection-change="selsChange" @select="select">
                <el-table-column  align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" prop="firstName" label="一级项目" v-if="type!=6"></el-table-column>
				<el-table-column align="center" prop="secondName" label="二级项目" v-if="type!=6"></el-table-column>
                <el-table-column align="center" prop="subjectName" label="科目" v-if="type==6"></el-table-column>
				<el-table-column align="center" label="名称">
                    <template slot-scope="scope">
                        <span>{{type==1?scope.row.courseName:type==2?scope.row.courseName:type==3?scope.row.serviceName:type==4?scope.row.dataName:type==5?scope.row.bookName:scope.row.label}}</span>
                    </template>
                </el-table-column>
			</el-table>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button class="btn2" type="primary" @click.native="editSubmit">保存并提交</el-button>
            <el-button class="btn2" @click="$emit('save-fail')">取消</el-button>
        </div>
    </div>
</template>
<script>
import listMixin from '@/api/list'
export default {
    mixins: [listMixin],
	data() {
		return {
            filters: {
                status: 1,
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
            },
            option1: '',
            option1: '',
            apiName: '',
            dynamicTags:[],
            arr:[],
			list: [],
            sels: []
		}
    },
    props:{
        data: {
            type: Array
        },
        isEdit:
        {
            type: Number
        },
        type:
        {
            type: Number
        },
        api:
        {
            type: String
        },
        
    },
	methods: {
		editSubmit(){
            switch (this.type) {
                case 1:
                    this.$store.state.course = this.dynamicTags
                    break;
                case 2:
                    this.$store.state.records = this.dynamicTags
                    break;
                case 3:
                    this.$store.state.services = this.dynamicTags
                    break;
                case 4:
                    this.$store.state.datum = this.dynamicTags
                    break;
                case 5:
                    this.$store.state.textbook = this.dynamicTags
                    break;
                case 6:
                    this.$store.state.merges = this.dynamicTags
                    break;
                default:
                    break;
            }
            this.$emit('save-list',this.type)
        },
        // seeList(){
        //     this.getList()
           
            
        // },
        async seeList() {
            let { data } = await this.$fetch({
                url: this.apiName,
                method: "post",
                data: this.filters,
            }).catch(error => {
                
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.list = data.result
                setTimeout(() => {
                    this.list.forEach((item,i)=> {
                        this.dynamicTags.forEach(val=> {
                            if(val.id == item.id ) {
                                this.$refs.multipleTable.toggleRowSelection(this.list[i],true);
                            }
                        })
                    })
                }, 200);
            } else {
                this.$message.warning(data.message)
            }

        },
        selsChange(sels) {
            // this.dynamicTags = sels
            // var newarr = []
            // this.dynamicTags.forEach((item, index) => {

            //     if (!newarr.includes(item)) {
            //         newarr.push(item)
            //     }
            // });
            // this.dynamicTags = newarr
            // console.log(this.dynamicTags)
        },
        select(sels, row){
            sels.forEach((item, index) => {
                if (item.id == row.id) {
                    this.dynamicTags.push(row)
                }else{
                   this.dynamicTags.forEach((e,i)=>{
                       if(e.id == row.id){
                           this.dynamicTags.splice(i, 1);
                       }
                   }) 
                }
            });
            if(sels.length<1){
                this.dynamicTags.forEach((e,i)=>{
                    if(e.id == row.id){
                        this.dynamicTags.splice(i, 1);
                    }
                }) 
            }
            console.log(sels,row,111111)
        },
        handleClose(tag,index) {
            this.dynamicTags.splice(index, 1);
            this.list.forEach((item,i)=> {
                    if(tag.id == item.id ) {
                        this.$refs.multipleTable.toggleRowSelection(this.list[i],false);
                    }
            })
        }
	},
	mounted() {
        this.api && (this.apiName = this.api)
        this.getList()
        this.getoption1()
        this.data &&(this.dynamicTags = this.data)
        if(this.data){
            setTimeout(() => {
                this.list.forEach((item,i)=> {
                    this.data.forEach(val=> {
                        if(val.id == item.id ) {
                            this.$refs.multipleTable.toggleRowSelection(this.list[i],true);
                        }
                    })
                })
            }, 200);
        }
        
       
        
	}
}

</script>

<style lang="scss" scoped>
.tips{
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    .tips{
        width: 100px;
    }
}
.dialog-footer{
    margin-top: 20px;
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
<style>
 .courseTable th .cell .el-checkbox {
  display:none;
}
</style>