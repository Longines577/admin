<template>
  <div>
    <AddDataDictionary></AddDataDictionary>
    <!-- <NewContent v-if="type == 'create'" />
    <Reset v-if="type == 'update'"></Reset>
    <Log v-if="type== 'log'" />
    <Replace v-if="type == 'replace'" />
    <Config v-if="type == 'config'" />
    <ClassTransfer v-if="type == 'classTransfer'" /> -->
  </div>
</template>
<script>
import NewContent from "../components/DialogContent/newContent.vue";
import Reset from "../components/DialogContent/Reset.vue";
import Log from "../components/DialogContent/log";
import Replace from "../components/DialogContent/replace";
import Config from "../components/DialogContent/config";
export default {
  components: {
    NewContent,
    Reset,
    Replace,
    Config,
 
  },
  data() {
    return {
      list: ""
    };
  },
  props: {
    // data1:Object,
    type: String,
    replace: String,
    config: String,
    classTransfer: String,
    addDataDictionary: String,
    addDataDictionaryType:String
  },
  methods: {},
  mounted() {
    console.log(111111111)
    console.log(this.addDataDictionaryType);
    this.list = this.data1;
  }
};
</script>

