<template>
  <div>
     <el-button type="primary" icon="el-icon-download" @click="downExcel" style="margin-bottom:10px;"></el-button>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="studentName" label="学生姓名"></el-table-column>
      <el-table-column prop="score" label="评分"></el-table-column>
      <el-table-column prop="teacherName" label="授课老师" ></el-table-column>
      <el-table-column prop="mobile" label="手机号码"></el-table-column>
      <el-table-column prop="markTime" label="评价时间"></el-table-column>
      <el-table-column prop="comment" label="评价内容"></el-table-column>
    </el-table>
  </div>
</template>
<script>
// import listMixin from "@/api/list";
import Export from "../../components/export/outData";
export default {
  components: {
    Export
  },
  // mixins: [listMixin],
  data() {
    return {
        users: [],
        filters: {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
        apiName:'system/api/courseTurnsTime/queryMarkPerByStudent'
    };
  },
  props:{
    timeIdInfo:Object
  },
  methods: {
     downExcel() {
         window.location.href = "http://192.168.1.129/system/api/courseTurnsTime/expMarkCourseByStudent?busId="+JSON.parse(sessionStorage.getItem("userInfo")).uc.busId+"&timeId="+this.timeIdInfo.timeId
    },
    async getList() {
            this.loading = true
            let { data } = await this.$fetch({
                url: this.apiName,
                method: "post",
                data: this.filters,
            }).catch(error => {
                
                this.$message.error(this.apiName + "接口出错！");
                this.loading = false
            });
            if (data.code == 30000) {
                this.users = data.result.marks
                this.list = data.result
                this.total = data.result.total
                this.loading = false
            } else {
                this.$message.warning(data.message)
                this.loading = false
            }

        },
  },
  mounted() {
    this.filters.timeId = this.timeIdInfo.timeId
    // console.log(this.timeIdInfo,465465)
    this.getList();
  }
};
</script>