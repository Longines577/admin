# sjr

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

#### 结构：
- build: webpack配置
- config: 项目配置参数
- src
    - common 共用的
        - Sidebar 菜单展示页 ***
    - components:组件
    - assets: 静态资源文件，存放图片啥的 
    - router.js: 路由表 ***
    - vuex: 状态管理 
    - utils: 常用工具类封装
    - views: 视图页面
        - nav1 产品包与排课
            - user 考试计划管理
            - Table 资源管理
            - knowledgeTree 知识树
            - information 题库管理
            - product 产品管理
            - course 排课管理
        - nav2 学员信息管理
            - stndentsManage 学员管理
            - initialTurn 轮次
            - studentsTable 学员大表
            - examination 报考管理
            - order 订单管理
            - Nps 学员NPS打分
            - attendance 学员直播出勤
            - score 评分管理
        - nav3 教师工作台
            - workBench 教师工作台
        - resources 资源管理
            - live 直播间管理
            - eBook 资料包管理
            - book 教材管理
            - curriculum 课程管理
            - recording 录播管理
        - basics 基础管理
            - project 项目管理
            - city 省份管理
            - period 考期管理
            - subject 科目管理
        - systems 系统设置

-  static: 静态文件 存放 favicon.ico 等等