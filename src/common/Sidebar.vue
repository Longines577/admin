<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" unique-opened :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" router>
            <template v-for="item in menuList">
                <template v-if="item.children&&item.type==0">
                    <el-submenu :index="item.url" :key="item.url">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.children" >
                            <!-- <el-submenu v-if="subItem.children&&subItem.type==0" :index="subItem.url" :key="subItem.url">
                                <template slot="title">{{ subItem.name }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.children" :key="i" :index="threeItem.url" v-if="threeItem.type==0">
                                    {{ threeItem.name }}
                                </el-menu-item>
                            </el-submenu> -->
                            <el-menu-item :index="subItem.url" :key="subItem.url" @click="getPowerList(subItem)">
                                {{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-if="!item.children&&item.type==0">
                    <el-menu-item :index="item.url" :key="item.url" >
                        <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                menuList: JSON.parse(sessionStorage.getItem("userInfo")).menuList
                // items: [
                //     {
                //         icon: 'el-icon-setting',
                //         index: '3',
                //         title: '系统设置',
                //         subs: [
                //             {
                //                 index: 'userManage',
                //                 title: '用户管理',
                //             },
                //             {
                //                 index: 'powerManage',
                //                 title: '权限管理',
                //             },
                //             {
                //                 index: 'roleManage',
                //                 title: '角色管理',
                //             },
                //             {
                //                 index: 'organization',
                //                 title: '组织机构',
                //             },
                //              {
                //                 index: 'enterprise',
                //                 title: '企业管理',
                //             },
                //              {
                //                 index: 'tagManage',
                //                 title: '标签管理',
                //             },
                //         ]
                //     },
                //      {
                //         icon: 'el-icon-reading',
                //         index: '2',
                //         title: '基础管理',
                //         subs: [
                //             {
                //                 index: 'project',
                //                 title: '项目管理',
                //             },
                //              {
                //                 index: 'city',
                //                 title: '省份管理',
                //             },
                //              {
                //                 index: 'period',
                //                 title: '考期管理',
                //             },
                //             {
                //                 index: 'subject',
                //                 title: '科目管理',
                //             },
                //         ]
                //     },
                //      {
                //         icon: 'el-icon-s-order',
                //         index: '1',
                //         title: '资源管理',
                //         subs: [
                //             {
                //                 index: 'live',
                //                 title: '直播间管理',
                //             },
                //             {
                //                 index: 'eBook',
                //                 title: '资料包管理',
                //             },
                //             {
                //                 index: 'book',
                //                 title: '教材管理',
                //             },
                //             {
                //                 index: 'recording',
                //                 title: '录播管理',
                //             },
                //             {
                //                 index: 'curriculum',
                //                 title: '课程管理',
                //             },
                //             {
                //                 index: 'serverManage',
                //                 title: '服务管理',
                //             },
                //         ]
                //     },
                //     {
                //         icon: 'el-icon-s-management',
                //         index: 'user',
                //         title: '产品包与排课',
                //         subs: [
                //             {
                //                 index: 'user',
                //                 title: '考试计划管理',
                //             },
                //             {
                //                 index: 'explorer',
                //                 title: '资源管理',
                //             },
                //              {
                //                 index: 'knowledgeTree',
                //                 title: '知识树',
                //             },
                //             {
                //                 index: 'information',
                //                 title: '题库管理',
                //             },
                //             {
                //                 index: 'product',
                //                 title: '产品管理',
                //             },
                //             {
                //                 index: 'course',
                //                 title: '排课管理',
                //             },
                //              {
                //                 index: 'initialTurn',
                //                 title: '轮次管理',
                //             },
                //         ]
                //     },
                //     {
                //         icon: 'el-icon-user',
                //         index: 'studentAdministration',
                //         title: '学员信息管理',
                //         subs: [
                //             {
                //                 index: 'studentAdministration',
                //                 title: '学员管理',
                //             },
                //             {
                //                 index: 'studentsTable',
                //                 title: '学员大表',
                //             },
                //             {
                //                 index: 'examination',
                //                 title: '报考管理',
                //             },
                //             {
                //                 index: 'order',
                //                 title: '订单管理',
                //             },
                //             {
                //                 index: 'nps',
                //                 title: '学员NPS打分',
                //             },
                //             {
                //                 index: 'attendance',
                //                 title: '学员直播出勤',
                //             },
                //             {
                //                 index: 'score',
                //                 title: '评分管理',
                //             },
                        
                //         ]
                //     },
                //      {
                //         icon: 'el-icon-s-platform',
                //         index: 'workBench',
                //         title: '教师工作台'
                //     },
                  
                // ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
        methods:{
            getPowerList(subItem){
                if(subItem.children){
                    sessionStorage.setItem(subItem.url,JSON.stringify(subItem.children))
                }else{
                     sessionStorage.setItem(subItem.url,'')
                }
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
        user-select:none;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 220px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
<style>
.is-opened .el-submenu__title{
   background: #426cb1 !important;
   color: #fff !important;
}

.is-opened .el-submenu__title i{
   color: #fff !important;
}
</style>
