<template>
  <div class="content">
    <span class="pay">应补缴：{{pay}}元</span>
    <span class="dated">支付明细：支付时间：{{date}}</span>
    <span class="type">
      费用类型：
      <template>
        <el-select v-model="value3" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
    </span>
    <span class="payType">
      支付方式：
      <template>
        <el-select v-model="value1" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
    </span>
    <span class="receipt">
      小票单号：
      <template>
        <el-select v-model="value2" placeholder="请输入小票单号">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>
    </span>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="收据号" class="acquittance">
        <el-input v-model="form.name" placeholder="请输入收据号"></el-input>
      </el-form-item>
      <el-form-item label="备注" class="remarks">
        <el-input
          type="textarea"
          :rows="7"
          :maxlength="200"
          @input="descInput"
          v-model="form.desc"
          placeholder="请输入备注信息"
          style="width:850px;"
        ></el-input>
        <span class="textLeft">{{remnant}}/200</span>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      remnant: 200,
      pay: "1000",
      date: "2019-6-23",
      // input: "10",
      value3: "10",
      value1: "10",
      value2: "10",
      options: [],
      form: {
        name: null,
        desc: null
      },
      obj:{}
    };
  },
  methods: {
    descInput() {
      var txtVal = this.form.desc.length;
      this.remnant = 200 - txtVal;
    },
    getList() {
      // console.log(1111111);
      this.obj = {
        // input1: this.input,
        value3: this.value3,
        value1: this.value1,
        value2: this.value2,
        form: {
          name: this.form.name,
          desc: this.form.desc
        }
      };
      // console.log(this.obj)
      this.$emit("childByValue", this.obj);
    }
  }
};
</script>
<style scoped>
.content {
  height: 500px;
  position: relative;
}
.content .pay {
  position: absolute;
  top: 30px;
  left: 300px;
}
.dated {
  position: absolute;
  top: 80px;
  left: 300px;
}
.type {
  position: absolute;
  top: 130px;
  left: 300px;
}
.payType {
  position: absolute;
  top: 130px;
  left: 608px;
}
.receipt {
  position: absolute;
  top: 130px;
  left: 915px;
}
.acquittance {
  position: absolute;
  top: 180px;
  left: 280px;
}
.remarks {
  position: absolute;
  top: 240px;
  left: 270px;
}
.textLeft{
  position: absolute;
  top: 120px;
  left: 790px;
  font-weight: bolder;
  }
</style>


