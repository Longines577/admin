<template>
  <div class="table">
 
    <div>
      
    </div>
     <div class="title">
         欢迎进入跃迁系统
     </div>
       
  </div>
</template>
<script>
import listMixin from '@/api/list'
export default {
 mixins: [listMixin],
 
  data() {
    return {

    };
  },
  methods: {
	 
  },
  mounted() {
  
  }
};
</script>

<style scoped>
.content{
  background: #fff;
}
.title{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  font-size: 30px;
  font-weight: 600;
  color: #409EFF;
}
</style>