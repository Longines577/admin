<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 资源设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>资料包管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!--工具条-->
      <el-form :inline="true" :model="filters">
        <el-form-item label="资料包名称">
          <el-input v-model="filters.dataName" placeholder="请输入资料包名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="一级项目">
          <el-select v-model="filters.firstId" placeholder="请选择" clearable @change="getoption2">
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.firstName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级项目">
          <el-select v-model="filters.secondId" placeholder="请选择" clearable @change="getSubject">
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="!isEdit"
          label="科目"
          prop="subjectId"
        >
          <el-select v-model="filters.subjectId" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in option3"
              :key="item.value"
              :label="item.subjectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="类型">
          <el-select v-model="filters.item3" placeholder="请选择" clearable>
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <div style="float: right">
          <el-form-item>
            <el-button type="primary" @click="getData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clear">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div style="margin: 20px 0;border-top: 1px #ccc solid;"></div>
      <div style="margin: 10px 0;height: 40px;">
        <el-checkbox v-model="checked">只显示启用项目</el-checkbox>
        <el-button type="primary" v-if="HasPermission('add')" @click="showEdit(0)">新增</el-button>
      </div>
      <!--列表-->
      <el-table
        :data="users"
        border
        highlight-current-row
        stripe
        v-loading="loading"
        style="width: 100%;"
      >
        <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
        <el-table-column align="center"   label="状态">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="start(scope.row,scope.$index)"
              v-if="scope.row.status ==0"
            >已禁用</el-button>
            <el-button
              type="text"
              @click="forbidden(scope.row,scope.$index)"
              v-if="scope.row.status ==1"
            >已启用</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="dataName" label="资料包名称"></el-table-column>
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column  align="center" prop="secondName" label="二级项目" ></el-table-column>
        <el-table-column align="center" prop="type" :formatter="formatType" label="类型"></el-table-column>
        <el-table-column align="center" prop="remark" label="描述"></el-table-column>
        <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <!-- <el-button>修改</el-button> -->
            <el-tooltip class="item" effect="dark" content="修改" placement="left">
              <el-button circle type="primary" size='medium' v-if="HasPermission('update')" @click="handleEdit(scope.row,1)" icon="el-icon-li-xiugai1"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下载" placement="right">
              <el-button circle type="success" size='medium' v-if="scope.row.type==0&&HasPermission('play')" @click="download(scope.row)" icon="el-icon-download"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="播放" placement="right">
               <el-button circle type="success" v-if="scope.row.type==1&&HasPermission('play')" @click="playVideo(scope.row)" ref="btn" size="medium" icon="el-icon-video-camera"></el-button>
            </el-tooltip>
            <!-- <el-button type="primary" v-if="scope.row.type==1" @click="playVideo(scope.row)" ref="btn" size="mini">播 放</el-button> -->

            <!-- <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          :current-page="filters.curPage"
          :page-size="filters.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog :close-on-click-modal='false' :title=" isEdit ? '编辑' : '添加'" :visible.sync="isShowEdit" center>
      <el-form :model="editForm" label-width="80px" ref="editForm">
        <el-form-item
          v-if="!isEdit"
          label="一级项目"
          prop="firstId"
          :rules="[{ required: true, message: '请填写一级项目', trigger: 'blur' }]"
        >
          <el-select v-model="editForm.firstId" placeholder="请选择" clearable @change="getoption2">
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.firstName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="!isEdit"
          label="二级项目"
          prop="secondId"
          :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]"
        >
          <el-select v-model="editForm.secondId" placeholder="请选择" @change="getSubject" clearable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="!isEdit"
          label="科目"
          prop="subjectId"
          :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]"
        >
          <el-select v-model="editForm.subjectId" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in option3"
              :key="item.value"
              :label="item.subjectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="文件名"
          prop="dataName"
          :rules="[{ required: true, message: '请填写文件名', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.dataName" placeholder="请输入文件名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
          :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]"
        >
          <el-radio-group v-model="editForm.type" size="small">
            <el-radio-button label="0">文件</el-radio-button>
            <el-radio-button label="1">视频</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文件" prop="url"  v-if="editForm.type==0">
					<el-upload
            :action="uploadUrl"
            :http-request="upload" 
            :on-success="handleAvatarSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :multiple="false"
            :limit="1"
            :file-list="fileList">
            <el-button size="small" type="success"><i class="el-icon-upload" style="font-size:24px;"></i>
            <div class="el-upload__text">点击上传</div></el-button>
            <div slot="tip" class="el-upload__tip">上传文件，且不超过10M</div>
          </el-upload>
				</el-form-item>
        <el-form-item label="视频" prop="url" v-if="editForm.type==1">
					<el-upload
            :action="uploadUrl"
            :http-request="upload2" 
            :on-success="handleAvatarSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :multiple="false"
            :limit="1"
            :file-list="fileList">
            <el-button size="small" type="success"><i class="el-icon-upload" style="font-size:24px;"></i>
            <div class="el-upload__text">点击上传</div></el-button>
            <div slot="tip" class="el-upload__tip">上传视频，且不超过500M</div>
          </el-upload>
				</el-form-item>
        <el-form-item label="备注" prop="remark">
					<el-input type="textarea" :rows="2"  v-model="editForm.remark" placeholder="请输入备注" size="small" clearable></el-input>
				</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
        <el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog  :visible.sync="dialogPlay" :title="title" width="80%" center @close="closeDialog">
         <video :src="videoUrl" controls autoplay class="video" ref="dialogVideo" width="100%"></video>
      </el-dialog>
  </div>
</template>
<script>
import listMixin from "@/api/list";
import oss from '@/utils/aliOss'
import {modifyStatusDatum} from '../../api/api'
export default {
  mixins: [listMixin],
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      uploadUrl: $UPLOAD,
      apiName: "system/api/datum/listDatum",
      addName: "system/api/datum/addDatum",
      updateName: "system/api/datum/updateDatum",
      delName: "system/api/datum/delDatum",
      editForm: {},
      option1: [],
      option2: [],
      option3: [],
      fileList:[],
      loading: false,
      users: [],
      total: 0,
      page: 1,
      isShowEdit: false,
      isEdit: 0,
      files:'',
      title: '视频',
      videoUrl: '',
      dialogPlay: false,
      checked:false,
    };
  },
   watch: {
    
    checked(oldVal, newVal) {
      console.log(oldVal);
      if (oldVal === true) {
        this.filters.status = 1;
        this.getList();
      } else {
        this.filters = {
          curPage: 1,
          pageSize: 10,
          busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
        };
        this.getList();
      }
    }
  },
  methods: {
      async fnUploadRequest (option) {
        oss.ossUploadFile(option)
      },
     getData(){
			this.filters.curPage = 1
			this.getList()
		},
     forbidden(row, index) {
      let params = {
        id: row.id,
        status: 0
      };
      modifyStatusDatum(params).then(res => {
        if (res.code === 30000) {
          this.$message({
            showClose: true,
            message: "已禁用",
            type: "success"
          });
          this.getList();
        } else {
           this.$message({
          showClose: true,
          message:'system/api/datum/modifyStatus'+'出错',
          type: "warning"
        });
        }
      });
    },
    start(row, index) {
      let params = {
        id: row.id,
        status: 1
      };
      modifyStatusDatum(params).then(res => {
        if (res.code === 30000) {
          this.$message({
            showClose: true,
            message: "已启用",
            type: "success"
          });
          this.getList();
        } else {
          this.$message({
          showClose: true,
          message:'system/api/datum/modifyStatus'+'出错',
          type: "warning"
        });
        }
      });
    },
    download(row){
			this.$confirm('确定下载文件？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
				window.open(row.url)
			})
    },
     playVideo(row) {
      this.dialogPlay = true;
      this.videoUrl = row.url;
      this.title = row.dataName
    },
    closeDialog() {
        this.videoUrl = "";
    },
    handleAvatarSuccess(res, file) {
      this.editForm.url = this.files;
      this.editForm.viewImg = this.img;
		},
		handleRemove(file, fileList) {
      this.editForm.url = ''
      this.editForm.viewImg = ''
		},
    handlePreview(file) {
      console.log(file);
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
    },
    formatType(row, column){
			return row.type == 1 ? "视频" : row.type == 0 ? "文件" : "";
    },
    formatStatus(row, column){
			return row.status == 1 ? "启用" : row.status == 0 ? "停用" : "";
		},
    handleSizeChange(val) {
      this.filters.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.filters.curPage = val;
      this.getList();
    },
    showEdit(isEdit) {
      this.isEdit = isEdit;
      this.isShowEdit = true;
      this.editForm = {};
    },
    handleEdit(row, isEdit) {
      this.isEdit = isEdit;
      this.isShowEdit = true;
      this.fileList = [{name: row.dataName,url:row.url}]
      this.editForm = {
        id: row.id,
        dataName: row.dataName,
        type: row.type,
        url: row.url,
        remark:row.remark
      };
    },
    editSubmit() {
      this.editForm.busId = JSON.parse(
        sessionStorage.getItem("userInfo")
      ).user.busId;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.update();
          } else {
            this.add();
          }
        }
      });
    },
    editOk() {
      this.isShowEdit = false;
      this.getList();
    }
  },
  mounted() {
    this.getList();
    this.getoption1();
  }
};
</script>

<style scoped>
.btn {
  position: absolute;
  right: 70px;
}
.btn2 {
  width: 30%;
}
</style>