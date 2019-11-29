<template>
  <div>
    <el-card class="box-card">
      <ul class="Tul">
        <li class="resetClassmaster" v-for="(item, index) in dataDetails" :key="index" >
          <span class="reset">&nbsp;&nbsp;&nbsp;&nbsp;{{item.createTime}} &nbsp;&nbsp;{{item.title}}</span>
          <p class="oper">操作人：{{item.createBy}}</p>
          <!-- <p  class="txt">工作内容：</p> -->
          <p class="txt">备注：{{item.remark}}</p>
          <p style="margin-left:20px;padding-bottom:20px" v-if="item.fileUrl">
            <audio controls>
              <source :src="item.fileUrl" type="audio/ogg">
            </audio>
          </p>
        </li>
      </ul>
      <p class="more" v-if="more==1" @click="getMore">点击加载更多</p>
      <p class="more" v-if="more==2">加载中...</p>
      <p class="more" v-if="more==3">没有更多了</p>
    </el-card>
    <!-- <el-card class="box-card">
      <ul class="Tul">
        <li class="resetClassmaster">
          <span class="reset">2019-04-5 10:00:01 &nbsp;&nbsp;&nbsp; 修改班主任所属&nbsp;&nbsp;&nbsp;</span>
          <p class="oper">操作人：{{name}}</p>
          <span class="txt">备注：班主任归属由：{{name}}修改为：{{name}}</span>
        </li>
        <li class="resetClassmaster">
          <span class="reset1">2019-04-5 10:00:01 &nbsp;&nbsp;&nbsp;消费记录&nbsp;&nbsp;&nbsp;</span>
          <p class="oper">操作人：{{name}}</p>
          <span
            class="txt"
          >备注：报名商品：{{goods}}，报名应缴金额：{{money}}，本次实缴金额：{{paid}}，(需要财务确认)，备注信息为：首付已交，分期已办，财务确认</span>
        </li>
        <li class="resetClassmaster">
          <span class="reset2">2019-04-5 10:00:01 &nbsp;&nbsp;&nbsp;咨询记录&nbsp;&nbsp;&nbsp;</span>
          <p class="oper">操作人：{{name}}</p>
          <span class="txt">备注：回访备注：学院要求看君子签合同，人力资源精品班</span>
        </li>
        <li class="resetClassmaster">
          <span class="reset3">2019-04-5 10:00:01 &nbsp;&nbsp;&nbsp;新增预约&nbsp;&nbsp;&nbsp;</span>
          <p class="oper">操作人：{{name}}</p>
          <span
            class="txt"
          >备注：预约客户：预约时间：{{bookingTime}}，预约分校：{{bookingSchool}}，预约项目：{{bookingitem}}，预约备注：首付已交，分期已办，财务确认</span>
        </li>
        <li class="exhalation">
          <span class="reset4">2019-04-5 10:00:01 &nbsp;&nbsp;&nbsp;呼出&nbsp;&nbsp;&nbsp;</span>
          <p class="oper">操作人：{{name}}</p>
          <span class="txt1">备注：电话沟通记录：</span>
          <p style="margin-left:20px;padding-bottom:20px">
            <audio controls>
              <source src="http://www.w3school.com.cn/i/horse.ogg" type="audio/ogg">
            </audio>
          </p>
        </li>
      </ul>
    </el-card> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      editForm:{},
      pageSize: 5,
      curPage: 1,
      dataDetails:[],
      isShowEdit: false,
      more: 1,
    };
  },
  methods:{
    getMore(){
      this.curPage++
      this.more = 2
      setTimeout(() => {
        this.getData()
      }, 100);
      
    },
		async getData() { 
      let { data } = await this.$fetch({
          url: 'system/api/consult/listConsult',
          method: "post",
          data: {
              studentId: this.$route.query.id,
              pageSize: this.pageSize,
              curPage: this.curPage,
          },
      }).catch(error => {
          this.$message.error('student/detailStudent' + "接口出错！");
      });
      if (data.code == 30000) {
        if(this.curPage==1){
          	this.dataDetails = data.result.content
        }else{
          this.dataDetails = this.dataDetails.concat(data.result.content)
        }
        if(data.result.content.length>0){
          this.more = 1
        }else{
          this.more = 3
        }
      }else {
				this.$message.warning(data.message)
			}
    },
  },
  mounted() {
		this.getData()
	}
};
</script>
<style scoped>
.text {
  font-size: 14px;
}
.oper {
  padding-top: 25px;
  margin: 0 0 15px 25px;
  font-size: 14px;
  font-family: "微软雅黑";
}
.txt {
  padding-bottom: 15px;
  margin-left: 25px;
  font-size: 14px;
  font-family: "微软雅黑";
}
.item {
  padding: 18px 0;
}
.Tul {
  margin-left: 60px;
  margin-top: 20px;
  list-style-type: none;
}
.resetClassmaster {
  width: 80%;
  /* height: 100px; */
  /* padding-top: 20px; */
  border: solid 1px #808080;
  margin-top: 40px;
  position: relative;
}
.reset {
  font-size: 14px;
  font-family: "微软雅黑";
  margin-left: 15px;
  font-weight: bolder;

  background: white;
  position: absolute;
  top: -10px;
}
.more{
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  text-align: center;
  color: #222;
  background: rgba(187, 255, 255, 0.5);
  cursor: pointer;
  user-select: none;
}
</style>