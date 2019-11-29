<template>
  <el-button type="primary" plain @click="outData" class="el-icon-download">导出</el-button>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {};
  },
  methods: {
    outData() {
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let name = year + "" + month + "" + day;
      var wb = XLSX.utils.table_to_book(document.querySelector(".table"));
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        //  name+'.xlsx'表示导出的excel表格名字
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          name + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  },
  mounted() {}
};
</script>
<style scoped>
 .el-button{
   color: #999999;
   border: solid 1px #6699FF!important;
 }
</style>


