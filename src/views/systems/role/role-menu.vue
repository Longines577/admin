<template>
  <div>
    <el-form :model="formData" ref="ruleForm" label-width="100px">
      <el-tree
        :data="menuList"
        show-checkbox
        node-key="id"
        ref="tree"
        check-strictly
        :default-checked-keys="userMenuList"
        :props="defaultProps">
      </el-tree>
      <el-form-item>
        <el-button type="primary" @click="submitAuth">保存</el-button>
        <el-button @click="resetAuth">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {},
      menuList: [],
      defaultProps: {
        value: 'id',
        children: 'children',
        label: 'name'
      },
      userMenuList: []
    }
  },
  props: {
    id: {
      type: Number
    }
  },
  watch: {
    userMenuList(val) {
      console.log(val)
    }
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    resetAuth() {
      this.$refs.tree.setCheckedKeys([])
    },
    async getMenuList() {
      let { data } = await this.$fetch({
        url: 'system/api/listPermissonTreeAll',
        method: 'post'
      }).catch(error => {
        this.loading = false
        this.$message.error('getAllModuleList接口出错！')
      })
      this.loading = false
      if(data.code === 30000){
        this.menuList = data.result
        this.getMenuByUser()
      }else {
        this.$message.error(data.message)
      }
      
    },
    async getMenuByUser() {
      let { data } = await this.$fetch({
        url: 'system/api/rp/'+this.id,
        method: 'post',
      })
      if (data.code == 30000) {
        this.userMenuList = data.result.map(item => {
          return item.pid
        })
      }
    },
    async submitAuth() {
      var arr = [...this.$refs.tree.getHalfCheckedKeys(),...this.$refs.tree.getCheckedKeys(),]
      let {data} = await this.$fetch({
        method: 'post',
        url: 'system/api/configPermission',
        data: {
          roleId: this.id,
          pId: arr
        }
      })
      if (data.code == 30000) {
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.$emit('editOk')
      } else {
        this.$message.error(data.message)
      }
    }
  }
}
</script>
