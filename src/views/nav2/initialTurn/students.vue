<template>
  <div>
    <el-form :inline="true" :model="form" style="width:100%;" class="form">
      <el-form-item label="姓名" class="box">
        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="filtrate">
        <el-button type="primary">查询</el-button>
        <el-button type="primary">重置</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="状态" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="phoneNumber" label="联系方式"></el-table-column>
        <el-table-column prop="classType" label="班型"></el-table-column>
        <el-table-column prop="examination" label="考期"></el-table-column>
        <el-table-column prop="registration" label="报名时间"></el-table-column>
        <el-table-column prop="expirationTime" label="到期时间"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        name: "",
        phone: ""
      },
      value1: "",
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          expirationTime: "2019-01-12",
          registration: "2018-12-01",
          examination: "2018-12-15",
          classType: "政策专享班",
          phoneNumber: "1546566464"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          expirationTime: "2019-01-12",
          registration: "2018-12-01",
          examination: "2018-12-15",
          classType: "政策专享班",
          phoneNumber: "1546566464"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          expirationTime: "2019-01-12",
          registration: "2018-12-01",
          examination: "2018-12-15",
          classType: "政策专享班",
          phoneNumber: "1546566464"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          expirationTime: "2019-01-12",
          registration: "2018-12-01",
          examination: "2018-12-15",
          classType: "政策专享班",
          phoneNumber: "1546566464"
        }
      ]
    };
  },
  methods: {}
};
</script>
<style scoped>
.form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  background: white;
  margin-bottom: 20px;
  padding-top: 10px;
}
.filtrate{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 10px;
}
</style>

