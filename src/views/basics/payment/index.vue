<template>
  <div>
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>
              <i class="el-icon-tickets"></i> 基础设置
            </el-breadcrumb-item>
            <el-breadcrumb-item> 支付管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-tabs type="border-card" @tab-click="refresh">
      <el-tab-pane label="收款机构">
        <collect-list></collect-list>
      </el-tab-pane>
      <el-tab-pane label="支付方式">
        <payment-list></payment-list>
      </el-tab-pane>
      <!-- <el-tab-pane label="费用类型">
        <type-list></type-list>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import CollectList from './collect-list'
import PaymentList from './payment-list'
import TypeList from './type-list'
export default {
  components: {
    CollectList,
    PaymentList,
    TypeList
  },
  methods: {
    refresh(val) {
      val.$children[0].getList()
    }
  },
  
}
</script>
