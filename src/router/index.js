import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/organization'
        },
        {
            path: '/',
            component: resolve => require(['@/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [{
                    path: '/homePage',
                    component: resolve => require(['@/views/homePage.vue'], resolve),
                    meta: { title: '首页' }
                },
                // 系统设置--------------------------
                {
                    path: '/userManage',
                    component: resolve => require(['@/views/systems/userManage.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/enterpriseUser',
                    component: resolve => require(['@/views/systems/enterpriseUser.vue'], resolve),
                    meta: { title: '企业用户' }
                },
                {
                    path: '/userClaim',
                    component: resolve => require(['@/views/systems/userClaim.vue'], resolve),
                    meta: { title: '认领用户' }
                },
                {
                    path: '/powerManage',
                    component: resolve => require(['@/views/systems/powerManage.vue'], resolve),
                    meta: { title: '权限管理' }
                },
                {
                    path: '/roleManage',
                    component: resolve => require(['@/views/systems/roleManage.vue'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/organization',
                    component: resolve => require(['@/views/systems/organization/index.vue'], resolve),
                    meta: { title: '组织机构' }
                },
                {
                    path: '/enterprise',
                    component: resolve => require(['@/views/systems/enterprise.vue'], resolve),
                    meta: { title: '企业管理' }
                },
                {
                    path: '/tagManage',
                    component: resolve => require(['@/views/systems/tagManage.vue'], resolve),
                    meta: { title: '标签管理' }
                },
                {
                    path: '/dictionary',
                    component: resolve => require(['@/views/systems/dataDictionary/dataDictionary.vue'], resolve),
                    meta: { title: '数据字典' }
                },
                {
                    path: '/dictionaryType',
                    component: resolve => require(['@/views/systems/dictionaryType/dictionaryType.vue'], resolve),
                    meta: { title: '数据字典类型' }
                },
                // 基础管理--------------------------
                {
                    path: '/project',
                    component: resolve => require(['@/views/basics/project/index.vue'], resolve),
                    meta: { title: '项目管理' }
                },
                {
                    path: '/city',
                    component: resolve => require(['@/views/basics/city.vue'], resolve),
                    meta: { title: '省份管理' }
                },
                {
                    path: '/period',
                    component: resolve => require(['@/views/basics/period.vue'], resolve),
                    meta: { title: '考期管理' }
                },
                {
                    path: '/subject',
                    component: resolve => require(['@/views/basics/subject.vue'], resolve),
                    meta: { title: '科目管理' }
                },
                {
                    path: '/subjectBase',
                    component: resolve => require(['@/views/basics/subjectBase.vue'], resolve),
                    meta: { title: '基础科目' }
                },
                {
                    path: '/payment',
                    component: resolve => require(['@/views/basics/payment/index.vue'], resolve),
                    meta: { title: '支付管理' }
                },
                {
                    path: '/banner',
                    component: resolve => require(['@/views/basics/banner.vue'], resolve),
                    meta: { title: 'banner管理' }
                },
                {
                    path: '/feedback',
                    component: resolve => require(['@/views/basics/feedback.vue'], resolve),
                    meta: { title: '反馈管理' }
                },
                {
                    path: '/examCollege',
                    component: resolve => require(['@/views/basics/examCollege.vue'], resolve),
                    meta: { title: '报考院校' }
                },
                {
                    path: '/contract',
                    component: resolve => require(['@/views/basics/contract.vue'], resolve),
                    meta: { title: '合同管理' }
                },
                {
                    path: '/campus',
                    component: resolve => require(['@/views/basics/campus.vue'], resolve),
                    meta: { title: '报考校区' }
                },
                // 资源管理--------------------------
                {
                    path: '/live',
                    component: resolve => require(['@/views/resources/live.vue'], resolve),
                    meta: { title: '直播间管理' }
                },
                {
                    path: '/eBook',
                    component: resolve => require(['@/views/resources/eBook.vue'], resolve),
                    meta: { title: '资料包管理' }
                },
                {
                    path: '/book',
                    component: resolve => require(['@/views/resources/book.vue'], resolve),
                    meta: { title: '教材管理' }
                },
                {
                    path: '/curriculum',
                    component: resolve => require(['@/views/resources/curriculum/index.vue'], resolve),
                    meta: { title: '课程管理' }
                },
                {
                    path: '/recording',
                    component: resolve => require(['@/views/resources/recording/index.vue'], resolve),
                    meta: { title: '录播管理' }
                },
                {
                    path: '/serverManage',
                    component: resolve => require(['@/views/resources/serverManage.vue'], resolve),
                    meta: { title: '服务管理' }
                },
                // 产品包与排课--------------------------
                {
                    path: '/user',
                    component: resolve => require(['@/views/nav1/user.vue'], resolve),
                    meta: { title: '考试计划管理' }
                },
                {
                    path: '/explorer',
                    component: resolve => require(['@/views/nav1/classType/index.vue'], resolve),
                    meta: { title: '班型管理' }
                },
                {
                    path: '/knowledgeTree',
                    component: resolve => require(['@/views/nav1/knowledgeTree.vue'], resolve),
                    meta: { title: '知识树' }
                },
                {
                    path: '/information',
                    component: resolve => require(['@/views/nav1/information/index.vue'], resolve),
                    meta: { title: '题库管理' }
                },
                {
                    path: '/itemBank',
                    component: resolve => require(['@/views/nav1/information/itemBank.vue'], resolve),
                    meta: { title: '题库' }
                },
                {
                    path: '/product',
                    component: resolve => require(['@/views/nav1/product/product.vue'], resolve),
                    meta: { title: '产品管理' }
                },
                {
                    path: '/logistics',
                    component: resolve => require(['@/views/nav2/logistics/logistics.vue'], resolve),
                    meta: { title: '物流信息' },
                    name: 'logistics'
                },
                {
                    path: '/connect',
                    component: resolve => require(['@/views/nav2/connect/connect.vue'], resolve),
                    meta: { title: '沟通记录' },
                    name: 'connect'
                },
                // {
                //     path: '/product',
                //     component: resolve => require(['@/views/nav1/product.vue'], resolve),
                //     meta: { title: '产品管理' }
                // },
                {
                    path: '/course',
                    component: resolve => require(['@/views/nav1/course/course.vue'], resolve),
                    meta: { title: '排课管理' }
                },
                {
                    path: '/studentAdministration',
                    component: resolve => require(['@/views/nav2/studentsManage.vue'], resolve),
                    meta: { title: '学员管理' },
                    name: 'studentAdministration'
                },
                {
                    path: '/studentsTable',
                    component: resolve => require(['@/views/nav2/studentsTable/students-list.vue'], resolve),
                    meta: { title: '学员大表' },
                    name: 'studentsTable'

                },
                {
                    path: '/examination',
                    component: resolve => require(['@/views/nav2/examination/examination.vue'], resolve),
                    meta: { title: '报考管理' }
                },
                {
                    path: '/order1',
                    component: resolve => require(['@/views/nav2/order/order.vue'], resolve),
                    meta: { title: '订单管理' }
                },
                {
                    path: '/order',
                    component: resolve => require(['@/views/nav2/order1/order.vue'], resolve),
                    meta: { title: '订单管理' }
                },
                {
                    path: '/nps',
                    component: resolve => require(['@/views/nav2/nps/Nps.vue'], resolve),
                    meta: { title: '学员NPS打分' }
                },
                {
                    path: '/attendance',
                    component: resolve => require(['@/views/nav2/attendance/attendance.vue'], resolve),
                    meta: { title: '学员直播出勤' }
                },
                {
                    path: '/initialTurn',
                    component: resolve => require(['@/views/nav2/initialTurn/initialTurn.vue'], resolve),
                    meta: { title: '轮次' },
                    name: 'initialTurn'
                },
                {
                    path: '/score',
                    component: resolve => require(['@/views/nav2/score/score.vue'], resolve),
                    meta: { title: '评分管理' }
                },
                {
                    path: '/studentsDetails',
                    component: resolve => require(['@/views/nav2/studentsDetails.vue'], resolve),
                    meta: { title: '学员详情' },
                    name: 'studentsDetails'
                },
                {
                    path: '/studentNews',
                    component: resolve => require(['@/views/nav2/studentNews.vue'], resolve),
                    meta: { title: '学员信息' },
                    name: 'studentNews'
                },
                {
                    path: '/refund',
                    component: resolve => require(['@/views/nav2/refund/index.vue'], resolve),
                    meta: { title: '退费管理' }
                },
                {
                    path: '/financial',
                    component: resolve => require(['@/views/nav2/financial/index.vue'], resolve),
                    meta: { title: '财务确认' }
                },
                {
                    path: '/orderWork',
                    component: resolve => require(['@/views/nav2/orderWork.vue'], resolve),
                    meta: { title: '工单管理' }
                },
                // 教师工作台--------------------------
                {
                    path: '/workBench',
                    component: resolve => require(['@/views/nav3/workBench.vue'], resolve),
                    meta: { title: '教师工作台' }
                },
                // 分割线--------------------------
                {
                    path: '/404',
                    component: resolve => require(['@/common/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['@/common/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['@/common/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})