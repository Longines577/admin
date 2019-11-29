<template>
  <div>
     <el-form :model="editForm" label-width="100px" :inline="true" ref="editForm">
        <el-form-item  label="一级项目" prop="firstName" >
             <el-input v-model="editForm.firstName" disabled size="small"></el-input>
        </el-form-item>
        <el-form-item  label="二级项目" prop="secondName">
           <el-input v-model="editForm.secondName"  disabled size="small"></el-input>
        </el-form-item>
        <el-form-item label="班型类型" prop="courseTypes"  :rules="[{ required: true, message: '请填写班型类型', trigger: 'blur' }]">
            <el-select v-model="editForm.courseTypes" placeholder="请选择" disabled clearable>
                <el-option v-for="(item,index) in ['远程班型','普通班型']" :key="index" :label="item" :value="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="服务期" prop="seviceDate"  :rules="[{ required: true, message: '请填写服务期', trigger: 'blur' }]" >
            <el-input v-model="editForm.seviceDate" placeholder="请输入服务期" size="small" clearable  disabled style="width:215px">
                <template slot="append">天</template>
            </el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName"  :rules="[{ required: true, message: '请填写商品名称', trigger: 'blur' }]" >
            <el-input v-model="editForm.goodsName" placeholder="请输入商品名称"  size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price"  :rules="[{ required: true, message: '请填写价格', trigger: 'blur' }]" >
            <el-input v-model="editForm.price" placeholder="请输入价格" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="最低价格" prop="minPrice"  :rules="[{ required: true, message: '请填写最低价格', trigger: 'blur' }]" >
            <el-input v-model="editForm.minPrice" placeholder="请输入最低价格" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="协议" prop="agreeId"  :rules="[{ required: true, message: '请选择协议', trigger: 'blur' }]">
            <el-select v-model="editForm.agreeId" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in agreeList" :key="index" :label="item.agreeName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="补充协议" prop="mendAgreeId" >
            <el-select v-model="editForm.mendAgreeId" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in mendAgree" :key="index" :label="item.agreeName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="促销价" prop="promotionPrice" >
            <el-input v-model="editForm.promotionPrice" placeholder="请输入促销价" disabled size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="优惠价" prop="favourablePrice" >
            <el-input v-model="editForm.favourablePrice" placeholder="请输入优惠价" disabled size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="承接学院" prop="chargeCollegeId" :rules="[{ required: true, message: '请输入承接学院', trigger: 'blur' }]" >
            <!-- <el-input v-model="editForm.chargeCollegeId" placeholder="请输入承接学院" size="small" clearable></el-input> -->
            <el-cascader
                style="width:350px"
                clearable
                size="small"
                v-model="editForm.chargeCollegeId"
                :props="props"
                change-on-select
                :options="departList1"
                @change="handleChange1">
            </el-cascader>
        </el-form-item>
        <el-form-item label="承接家族" prop="chargeFamilyId">
            <!-- <el-input v-model="editForm.chargeFamilyId" placeholder="请输入承接家族" size="small" clearable></el-input> -->
             <el-cascader
               style="width:350px"
                clearable
                size="small"
                v-model="editForm.chargeFamilyId"
                :props="props"
                change-on-select
                :options="departList2"
                @change="handleChange2">
            </el-cascader>
        </el-form-item>
        <el-form-item label="承接运营组" prop="chargeOperateId">
            <!-- <el-input v-model="editForm.chargeOperateId" placeholder="请输入承接运营组" size="small" clearable></el-input> -->
            <el-cascader
                style="width:350px"
                clearable
                size="small"
                v-model="editForm.chargeOperateId"
                :props="props"
                change-on-select
                :options="departList3"
                @change="handleChange3">
            </el-cascader>
        </el-form-item>
        <el-form-item label="承接人" prop="chargeId" >
            <el-select v-model="editForm.chargeId" placeholder="请输入承接人" clearable>
                <el-option v-for="(item,index) in roleList" :key="index" :label="item.userName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
     
    <div slot="footer" class="dialog-footer"> 
        <el-button class="btn" type="primary" @click="submitCform">保存</el-button>
        <el-button class="btn" @click="$emit('save-ok')">取消</el-button>
      </div>
  </div>
</template>
<script>
import listMixin from '@/api/list'
export default {
    mixins: [listMixin],
  data() {
    return {
      editForm:{},
      updateName: 'system/api/goods/updateGoods',
      rules: {},
      agreeList: [],
      mendAgree: [],
      departList1: [],
      departList2: [],
      departList3: [],
      roleList:[],
      props: {
          value: 'id',
          label: 'label',
          children: 'children',
          // expandTrigger: 'hover'
      },
    }
  },
  props:{
    data: {
      type: Object
    },
    type:
     {
      type: Number
    },
  },
  mounted(){
   this.data && (this.editForm = this.data) 
//    && (this.editForm.chargeId = this.data.chargeName)
    this.getAgree(0)
    this.getAgree(1)
    this.getDepartList()
    this.getDepartList2(this.editForm.chargeCollegeId,1)
    this.getDepartList2(this.editForm.chargeFamilyId,2)
    this.getDepart(this.editForm.chargeOperateId)
  },
  methods: {
    getAgree(index){
      this.$fetch({
        url: 'system/api/agree/queryAgree',
        method: "post",
        data: {
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
          isNormal: index
        }
      }).catch(error => {
        this.$message.error( 'region/queryAllProvince' + "接口出错！");
      }).then(({ data }) => {
        if (data.code == 30000) {
            if(index==1){
                 this.agreeList = data.result
            }
            if(index==0){
                this.mendAgree = data.result
            }
        } else {
          this.$message.warning(data.message)
        }
      })
    },
    async getDepartList() {
        let { data } = await this.$fetch({
            url: 'system/api/departTree',
            method: "post",
            data: {
                subId: JSON.parse(sessionStorage.getItem("userInfo")).uc.subId,
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.departList1 = data.result
        } else {
          this.$message.warning(data.message)
        }
    },
    handleChange1(val){
        this.editForm.chargeCollegeId = val[val.length-1] ? val[val.length-1] : 0
        this.editForm.chargeFamilyId = ''
        this.editForm.chargeOperateId = ''
        this.getDepartList2(this.editForm.chargeCollegeId,1)
    },
    handleChange2(val){
        this.editForm.chargeFamilyId = val[val.length-1] ? val[val.length-1] : 0
        this.editForm.chargeOperateId = ''
        this.getDepartList2(this.editForm.chargeFamilyId,2)
    },
    handleChange3(val){
        this.editForm.chargeOperateId = val[val.length-1] ? val[val.length-1] : 0
        this.getDepart(this.editForm.chargeOperateId)
    },
    async getDepartList2(id,index) {
        let { data } = await this.$fetch({
            url: 'system/api/departTreeByDepartId',
            method: "post",
            data: {
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
                departId: id
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            if(index==1){
                this.departList2 = data.result
            }
            if(index==2){
                this.departList3 = data.result
            }
        } else {
          this.$message.warning(data.message)
        }
    },
    async getDepart(id) {
        let { data } = await this.$fetch({
            url: 'system/api/queryUcByDepart',
            method: "post",
            data: {
                departId: id,
                busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
            },
        }).catch(error => {
            this.$message.error(this.apiName + "接口出错！");
        });
        if (data.code == 30000) {
            this.roleList = data.result
        }
    },
    submitCform() {
      this.update()
    },
    editOk(){
      this.$emit('save-ok')
    }
  },

}
</script>
<style lang="scss" scoped>
.el-radio-button {
  margin: 0 0 20px;
  position: relative;
  margin-left: 10px;
  border: 1px #dcdfe6 solid;
  border-radius: 4px !important;
  display: inline-block;
  outline: 0;
}
</style>
<style scoped>

.dialog-footer{
text-align: center;
    margin-top: 20px;
}
.el-input,.el-select{
    width: 350px !important;
}
.el-textarea{
    display: block;
    width: 800px !important;
}
</style>