<template>
  <div>
    <div class="content">
        <div class="back">
        <el-button class="backTop" @click="backtop">返回上一层</el-button>
        </div>
      <el-card class="box-card">
        <!-- <div v-for="o in 4" :key="o" class="text item">{{'列表内容 ' + o }}</div> -->
       <span class="logisticsCompany">快递公司：{{company}}</span>
       <span class="orderNumber">订单编号：{{order}}</span>
       <div class="logtsInfo">
          <span class="logInfo">物流信息</span>
          <el-timeline class="cont" >
            <el-timeline-item 
            v-for="(item, index) in list" :key="index" 
            :type="item.type"
            :color="item.color" 
            :timestamp="item.time" 
            placement="top">
              <el-card>
                <p>{{item.data}}</p>
              </el-card>
            </el-timeline-item>
        </el-timeline>
       </div>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            company:'韵达快递',
            order:'3424221356478',
            list:[
              {
                time: '2019-6-10 09:25:40',
                data:'【上海市】已离开上海分拨中心;发往安徽合肥分拨中心',
                type: 'success',
                color: '#0bbd87'
              },
              {
                time: '2019-6-11 03:25:40',
                data:'【合肥市】已离开合肥分拨中心;发往肥东县',
                type: 'success',
                color: '#0bbd87'
              },
              {
                time: '2019-6-12 11:25:40',
                data:'【肥东县】已离开肥东县;由xxx配送中',
                type: 'success',
                color: '#0bbd87'
              },
              {
                time: '2019-6-12 16:30:40',
                data:'已到达菜鸟驿站，请凭取件码及时领取您的包裹',
                type: 'success',
                color: '#f00'
              },
              
            ],
           
        }
    },
    methods:{
        backtop(){
            this.$router.push({name:'studentAdministration', params:{userId: '123'}})
        }
    },
    mounted(){

    }
};
</script>
<style scoped>
.conetnt {
  width: 70% !important;
  margin-top: 20px;
  margin-left: 20px;
  background: white;
}
.box {
  width: 50%;
  height: 100%;
  background: white;
}
 .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }
  .logisticsCompany{
      font-size: 14px;
      font-family: '微软雅黑';
      letter-spacing: 1px;
      margin-left: 160px;
      margin-top: 20px;
  }
  .orderNumber{
      font-size: 14px;
      font-family: '微软雅黑';
      letter-spacing: 1px;
      margin-left: 60px;
      margin-top: 20px;
  }
  .logtsInfo{
    position: relative;
    width: 600px;
    border: solid 1px black;
    margin-left: 300px;
    margin-top: 50px;
  }
  .back{
      display: flex;
      justify-content: flex-end;
  }
  .backTop{
      margin-bottom: 10px;
  }
  .logInfo{
     font-size: 14px;
      font-family: '微软雅黑';
      margin-left: 15px;
      background: white;
      position: absolute;
      top: -10px;
  }
  .cont{
    box-sizing: border-box;
    padding: 20px;
  }
</style>

