<template>
  <div>
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-tickets"></i> 学员大表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-tabs type="border-card" @tab-click="refresh">
      <el-tab-pane label="查询">
        <students-list :type="0"></students-list>
      </el-tab-pane>
      <el-tab-pane label="导出">
        <table-list :type="1"></table-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import StudentsList from './students-list'
import TableList from './table-list'
export default {
  components: {
    StudentsList,
    TableList
  },
  methods: {
    refresh(val) {
      // val.$children[0].getList()
      // val.$children[0].getCountStatic()
    }
  }
}
</script>
