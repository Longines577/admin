<template>
  <div>
    <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-tickets"></i> 产品包与排课
          </el-breadcrumb-item>
            <el-breadcrumb-item>题库管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-tabs type="border-card" @tab-click="refresh">
      <el-tab-pane label="试题管理">
        <inform-manage :type="0"></inform-manage>
      </el-tab-pane>
      <el-tab-pane label="试题上传">
        <inform-upload :type="1"></inform-upload>
      </el-tab-pane>
      <el-tab-pane label="试题审核">
        <inform-upload :type="2"></inform-upload>
      </el-tab-pane>
      <el-tab-pane label="试卷管理">
        <inform-list :type="3"></inform-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import InformList from './inform-list'
import InformManage from './inform-manage'
import InformUpload from './inform-upload'
// import InformExamine from './inform-examine'
export default {
  components: {
    InformList,
    InformManage,
    InformUpload,
    // InformExamine
  },
  methods: {
    refresh(val) {
      val.$children[0].getList()
      val.$children[0].getItem()
      val.$children[0].getExamType()
      // val.$children[0].getCountStatic()
    }
  }
}
</script>
<style>
.el-tabs--border-card{
  background: #f1f1f1 !important;
}
</style>

