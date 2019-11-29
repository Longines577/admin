<template>
  <div>
      <div class="crumbs">
          <el-breadcrumb separator="/">
              <el-breadcrumb-item><i class="el-icon-tickets"></i> 沟通记录</el-breadcrumb-item>
          <el-button style="float:right;" type="primary" size="mini" @click="$router.go(-1)">返回上一层</el-button>
          </el-breadcrumb>
      </div>
    <el-card class="box-card">
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
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "某人",
      goods: "人力资源管理精品班",
      money: 6666, //应缴费用
      paid: 5555, //实际支付
      bookingTime: "【2019-01-10】", //预约时间
      bookingSchool: "【成都分校】", //预约分校
      bookingitem: "自考" //预约项目
    };
  }
};
</script>
<style scoped>
.text {
  font-size: 14px;
}
.oper {
  padding-top: 25px;
  margin-left: 25px;
  font-size: 14px;
  font-family: "微软雅黑";
}
.txt {
  display: inline-block;
  padding-bottom: 25px;
  margin-left: 25px;
  font-size: 14px;
  font-family: "微软雅黑";
}
.txt1 {
  display: inline-block;
  /* padding-bottom: 25px; */
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
.exhalation {
  width: 80%;
  /* height: 200px; */
  border: solid 1px #808080;
  margin-top: 40px;
  position: relative;
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
.reset1 {
  font-size: 14px;
  font-family: "微软雅黑";
  margin-left: 15px;
  font-weight: bolder;

  background: white;
  position: absolute;
  top: -10px;
}
.reset2 {
  font-size: 14px;
  font-family: "微软雅黑";
  margin-left: 15px;
  font-weight: bolder;

  background: white;
  position: absolute;
  top: -10px;
}
.reset3 {
  font-size: 14px;
  font-family: "微软雅黑";
  margin-left: 15px;
  font-weight: bolder;
  background: white;
  position: absolute;
  top: -10px;
}
.reset4 {
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: bolder;
  margin-left: 15px;
  background: white;
  position: absolute;
  top: -10px;
}
</style>


