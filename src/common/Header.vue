<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <img :src="logo">
        </div>
        <div class="logo">跃迁教务系统</div>
        <div class="btn" v-if="HasPermission('addStudent')" @click="addStudent"><i class="el-icon-circle-plus-outline"></i>新增学员</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!-- <div class="btn-bell">
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div> -->
                <!-- 用户头像 -->
                <div class="user-avator"><img src="../assets/img/img.png"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{userName}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <a href="http://blog.gdfengshuo.com/about/" target="_blank">
                            <el-dropdown-item>关于作者</el-dropdown-item>
                        </a>
                        <a href="https://github.com/lin-xin/vue-manage-system" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
                        </a> -->
                        <el-dropdown-item divided  command="loginEdit">修改密码</el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-dialog :close-on-click-modal='false' title="修改密码" :visible.sync="loginShow" width="450px" center>
      <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
        <el-form-item label="原密码" prop="oldPwd" :rules="[{ required: true, message: '请填写原密码', trigger: 'blur' }]">
            <el-input  v-model="editForm.oldPwd" placeholder="请输入原密码" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password" :rules="[{ required: true, message: '请填写新密码', trigger: 'blur' }]">
            <el-input type="password" v-model="editForm.password" placeholder="请输入新密码" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" :rules="[{ required: true, message: '请填写确认密码', trigger: 'blur' }]">
            <el-input type="password" v-model="editForm.password2" placeholder="请输入确认密码" size="small" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="loginShow=false">取消</el-button>
        <el-button type="primary" @click.native="loginSubmit">确定</el-button>
      </div>
    </el-dialog>
        <el-dialog :close-on-click-modal='false' title="新增学员" :visible.sync="isShowEdit" v-if="isShowEdit" center width="750px">
			<el-form :model="formData" :rules="rules" ref="formData" label-width="100px" :inline="true">
                <el-form-item label="姓名"  prop="userName" :rules="[{ required: true, message: '请填写姓名', trigger: 'blur' }]">
                <el-input placeholder="请输入" v-model="formData.userName" clearable ></el-input>
                </el-form-item>
                <el-form-item label="性别" >
                    <el-select v-model="formData.gender" placeholder="请选择" clearable>
                        <el-option v-for="(item,index) in ['男','女','未知']" :key="index" :label="item"	:value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="民族" >
                <el-input placeholder="请输入" v-model="formData.nation" clearable ></el-input>
                </el-form-item>
                <el-form-item label="上课手机号" prop="classMobile">
                <el-input placeholder="请输入" v-model="formData.classMobile" clearable ></el-input>
                </el-form-item>
                <el-form-item label="电话1" prop="firstMobile">
                <el-input placeholder="请输入" v-model="formData.firstMobile" clearable ></el-input>
                </el-form-item>
                <el-form-item label="电话2" >
                <el-input placeholder="请输入" v-model="formData.secondMobile" clearable ></el-input>
                </el-form-item>
                <el-form-item label="微信" >
                <el-input placeholder="请输入" v-model="formData.wx" clearable ></el-input>
                </el-form-item>
                <el-form-item label="QQ" >
                <el-input placeholder="请输入" v-model="formData.qq" clearable ></el-input>
                </el-form-item>
                <el-form-item label="地域"  prop="provinceId" :rules="[{ required: true, message: '请选择', trigger: 'blur' }]">
                    <el-select v-model="formData.provinceId" placeholder="请选择" @change="getCity" filterable clearable>
                        <el-option v-for="(item,index) in province" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                <el-input placeholder="请输入" v-model="formData.email" clearable ></el-input>
                </el-form-item>
                <el-form-item label="出生日期" >
                    <el-date-picker
                        v-model="formData.birthDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="出生日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="年龄" >
                <el-input placeholder="请输入" v-model="formData.years" clearable ></el-input>
                </el-form-item>
                <el-form-item label="证件类型" prop="certificateType" :rules="[{ required: true, message: '请选择证件类型', trigger: 'blur' }]">
                    <el-select v-model="formData.certificateType" placeholder="请选择" clearable>
                        <el-option v-for="(item,index) in ['身份证']" :key="index" :label="item" :value="index+1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号" prop="certificateCode" >
                    <el-input placeholder="请输入" v-model="formData.certificateCode" clearable ></el-input>
                </el-form-item>
                <el-form-item label="紧急联系人"  prop="emergenContact" :rules="[{ required: true, message: '请输入紧急联系人', trigger: 'blur' }]">
                    <el-input placeholder="请输入" v-model="formData.emergenContact" clearable ></el-input>
                </el-form-item>
                <el-form-item label="联系人号码" prop="emergenMobile" :rules="[{ required: true, message: '请输入紧急联系人号码', trigger: 'blur' }]">
                    <el-input placeholder="请输入" v-model="formData.emergenMobile" clearable ></el-input>
                </el-form-item>
                <el-form-item label="最高学历" >
                    <el-select v-model="formData.education" placeholder="请选择" clearable>
                        <el-option v-for="(item,index) in education" :key="index" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单位名称" >
                <el-input placeholder="请输入" v-model="formData.unitName" clearable ></el-input>
                </el-form-item>
                <el-form-item label="家庭住址" prop="homeAddress">
                    <el-input type="textarea"  :row='2'  v-model="formData.homeAddress" placeholder="请输入家庭住址" clearable></el-input>
                </el-form-item>
            </el-form>
			<div slot="footer" class="dialog-footer">
				<el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
                <el-button class="btn2" type="primary" @click.native="editSubmit(2)">保存</el-button>
				<el-button class="btn2" type="primary" @click.native="editSubmit(1)">确定并报名</el-button>
			</div>
		</el-dialog>
    </div>
</template>
<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                fullscreen: false,
                isShowEdit: false,
                loginShow: false,
                editForm:{},
                education:[],
                province:[],
                rules: {
                    certificateCode:[
                        { required: true, message: '证件号不能为空', trigger: 'blur' },
                        {   
                            pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
                            message: '证件号格式有误！',
                        },
                    ],
                    email:[
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        {   
                            pattern: /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
                            message: '请输入正确邮箱！',
                        },
                    ],
                    classMobile:[
                        { required: true, message: '手机号为空', trigger: 'blur' },
                        {   
                            pattern: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
                            message: '请输入手机号！',
                        },
                    ]
                },
                formData:{},
                name: '',
                message: 2,
                logo:JSON.parse(sessionStorage.getItem("userInfo")).bus.logo
            }
        },
        computed:{
            userName(){
                let userName = sessionStorage.getItem('userName');
                return userName ? userName : this.name;
            }
        },
        methods:{
            HasPermission(name) {
                var result = '';
                var powerList = JSON.parse(sessionStorage.getItem("userInfo")).menuList
                if (powerList.length>0) {
                    powerList.forEach((item, i) => {
                        if (item.url == name) {
                            return result = true
                        }
                    });
                    return result
                } else {
                    return result = false
                }

            },
            addStudent(){
                
                this.getEducation()
                this.getProvince()
                this.isShowEdit = true
                this.formData = {}
            },
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    sessionStorage.clear();
                    this.$router.push('/login');
                }
                if(command == 'loginEdit'){
                    this.editForm = {}
                    this.loginShow = true
                }
            },
            // 侧边栏折叠
            collapseChage(){
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },
            // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            getCity(id){
                this.province.forEach(item=>{
                    if(item.id == id){
                        this.formData.province = item.name
                    }
                })
            },
            loginSubmit(){
                this.editForm.ucId = JSON.parse(sessionStorage.getItem("userInfo")).uc.id
                    this.$refs.editForm.validate((valid) => {
                    if(valid){
                        if(this.editForm.password == this.editForm.password2){
                            this.upDatePwd()
                        }else{
                            this.$message.warning('确认密码与新密码不一致！')
                        }
                    }
                })
            },
            upDatePwd(){
                let form = {
                    ucId:this.editForm.ucId,
                    oldPwd: this.editForm.oldPwd,
                    password: this.editForm.password
                }
                this.$fetch({
                    url: 'system/api/modifyPwdByUc',
                    method: "post",
                    data: form,
                }).catch(error => {
                    this.$message.error('modifyPwdByUc' + "接口出错！");
                }).then(({data})=>{
                    if (data.code == 30000) {
                    this.$message.success('修改成功！')
                    this.loginShow = false
                } else {
                    this.$message.warning(data.message)
                }
                })
                
            },
            editSubmit(index){
                this.formData.busId = JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                this.formData.ownerId = JSON.parse(sessionStorage.getItem("userInfo")).uc.id
                this.formData.ucId = JSON.parse(sessionStorage.getItem("userInfo")).uc.id
                this.formData.subId = JSON.parse(sessionStorage.getItem("userInfo")).uc.subId
                this.formData.departId = JSON.parse(sessionStorage.getItem("userInfo")).uc.departId
                this.$refs.formData.validate((valid) => {
                    if(valid){
                        this.add(index)
                    }
                })
            },
            async add(index) {
                let { data } = await this.$fetch({
                    url: 'system/api/student/addStudent',
                    method: "post",
                    data: this.formData,
                }).catch(error => {
                    this.$message.error('student/addStudent' + "接口出错！");
                });
                if (data.code == 30000) {
                    this.$message.success('保存成功！')
                    if(index==1){
                        this.$router.push({name:'studentNews',query: {id: data.result,show: true}})
                    }
                    this.isShowEdit = false
                } else {
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
                }
            },
        },
        mounted(){
            if(document.body.clientWidth < 1500){
                this.collapseChage();
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        font-size: 20px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        margin-left: 20px;
        cursor: pointer;
    }
    .collapse-btn img{
        height: 50px;
    }
    .header .logo{
        float: left;
        width:250px;
        margin-left: 40px;
        font-size: 16px;
        line-height: 70px;
    }
    .btn{
        position: absolute;
        right: 250px; 
        padding: 5px 15px;
        font-size: 14px;
        font-family: '微软雅黑';
        font-weight: bolder;
        letter-spacing: 1px;
        color: #333;
        background: #fff;
        border-radius: 5px;
        cursor: pointer;
    }
    .btn:hover{
        color: #666;
        background: #f1f1f1;
    }
    .header-right{
        position: absolute;
        right: 0;
        padding-right: 30px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
    .el-textarea{
        display: block;
        width: 550px !important;
    }
</style>
