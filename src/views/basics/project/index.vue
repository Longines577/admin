<template>
  <div>
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <i class="el-icon-tickets"></i> 基础设置
            </el-breadcrumb-item>
            <el-breadcrumb-item> 项目管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-tabs type="border-card" @tab-click="refresh">
      <el-tab-pane label="一级项目">
        <project-list :type="0"></project-list>
      </el-tab-pane>
      <el-tab-pane label="二级项目">
        <project-list :type="1"></project-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ProjectList from './project-list'
export default {
  components: {
    ProjectList
  },
  methods: {
    refresh(val) {
      val.$children[0].getList()
      val.$children[0].getoption1()
    }
  },
  
}
</script>
