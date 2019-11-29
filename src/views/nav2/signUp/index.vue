<template>
  <div>
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="基本信息"></el-step>
      <el-step title="报名信息"></el-step>
      <el-step title="支付信息"></el-step>
    </el-steps>
      <inform-base v-if="active==1" :data="data"></inform-base>
      <inform-sign v-if="active==2" @next-ok="next" :id="data.id"></inform-sign>
      <inform-pay v-if="active==3&&show==1" @close-ok="close" :data="orderData"></inform-pay>
      <inform-stages v-if="active==3&&show==2" @close-ok="close" :data="orderData"></inform-stages>
    <div class="Box">
      <el-button round @click="back" v-if="active > 1">上一步</el-button>
      <el-button round @click="nextPage" v-if="active < 2">下一步</el-button>
    </div>
  </div>
</template>
<script>
import informBase from "./inform-base";
import informSign from "./inform-sign";
import informPay from './inform-pay';
import informStages from './inform-stages'
export default {
  components: {
    informBase,
    informSign,
    informPay,
    informStages
  },
  data() {
    return {
      active: 1,
      orderData:{},
      show: ''
    };
  },
  props:{
		data:{
			type: Object
    },
    type: {
      type: Number
    }
  },
  mounted(){
    this.type&&(this.active=this.type)
  },
  methods: {
    next(data,index) {
      this.orderData = data
      this.show = index
      this.active = 3
    },
    nextPage(){
      this.active = 2
    },
    back() {
      this.active--;
    },
    close(){
      this.$emit('close-ok')
    },
    // submit() {
    //   this.$refs.child.getList();
      
    // },
  }
};
</script>
<style lang="scss" scoped>
.Box{
  margin-top: 20px;
}
</style>



