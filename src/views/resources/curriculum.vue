<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-tickets"></i> 资源设置
        </el-breadcrumb-item>
        <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!--工具条-->
      <el-form :inline="true" :model="filters">
        <el-form-item label="一级项目">
          <el-select v-model="filters.firstId" placeholder="请选择" clearable @change="getoption2">
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.firstName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级项目">
          <el-select v-model="filters.secondId" placeholder="请选择" clearable>
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.secondName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input v-model="filters.courseName" placeholder="请输入课程名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="授课方式">
          <el-select v-model="filters.item3" placeholder="请选择" clearable>
            <el-option v-for="item in ['面授','直播']" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程分类">
          <el-select v-model="filters.item4" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in ['公开课','精讲课','串讲课','模考课']"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程状态">
          <el-select v-model="filters.item5" placeholder="请选择" clearable>
            <el-option v-for="item in ['已发布','未发布']" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left:60px;">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 20px 0;border-top: 1px #ccc solid;"></div>
      <div style="margin: 10px 0;height: 40px;">
        <el-checkbox v-model="checked">只显示启用项目</el-checkbox>
        <el-button type="primary" @click="showEdit(0)">新增</el-button>
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
        <el-table-column align="center"  label="状态">
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
        <el-table-column align="center" prop="firstName" label="一级项目"></el-table-column>
        <el-table-column align="center" prop="secondName" label="二级项目"></el-table-column>
        <el-table-column align="center" prop="courseName" label="课程名称"></el-table-column>
        <el-table-column align="center" prop="teachType" :formatter="formatType" label="授课方式"></el-table-column>
        <el-table-column align="center" prop="courseType" :formatter="formatTyped" label="课程分类"></el-table-column>
        <el-table-column align="center" prop="totalHour" label="课时"></el-table-column>
        <el-table-column align="center" prop="totalNo" label="课次"></el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row,1)">修改</el-button>
            <el-button @click="handleUpdate(scope.row,scope.$index)">配置</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row)">删除</el-button>
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
      <el-form :model="editForm" label-width="80px" :inline="true" ref="editForm">
        <el-form-item
          label="一级项目"
          prop="firstId"
          :rules="[{ required: true, message: '请选择一级项目', trigger: 'blur' }]"
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
          label="二级项目"
          prop="secondId"
          :rules="[{ required: true, message: '请选择二级项目', trigger: 'blur' }]"
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
          label="科目"
          prop="subjectId"
          :rules="[{ required: true, message: '请填写二级项目', trigger: 'blur' }]"
        >
          <el-select v-model="editForm.subjectId" placeholder="请选择" clearable>
            <el-option
              v-for="item in option3"
              :key="item.value"
              :label="item.subjectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="课程名称"
          prop="courseName"
          :rules="[{ required: true, message: '请填写课程名称', trigger: 'blur' }]"
        >
          <el-input v-model="editForm.courseName" placeholder="请输入课程名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="授课方式"
          prop="teachType"
          :rules="[{ required: true, message: '请选择授课方式', trigger: 'blur' }]"
        >
          <el-select v-model="editForm.teachType" placeholder="请选择" clearable>
            <el-option
              v-for="item in option5"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="课程分类"
          prop="courseType"
          :rules="[{ required: true, message: '请选择课程分类', trigger: 'blur' }]"
          style="display:block;"
        >
          <el-select v-model="editForm.courseType" placeholder="请选择" clearable>
            <el-option
              v-for="item in option4"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="item4">
          <el-input
            type="textarea"
            maxlength="30"
            autosize
            placeholder="请输入内容"
            v-model="editForm.remark"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button class="btn2" @click.native="isShowEdit=false">取消</el-button>
        <el-button class="btn2" type="primary" @click.native="editSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 配置弹窗 -->
    <template>
      <el-dialog :close-on-click-modal='false' title="配置课程" width="60%" :visible.sync="outerVisible">
        <div>
          <!-- <el-button type="primary" @click="innerVisible = true">新增模块</el-button>  -->
          <span class="classTime">课时：{{classTime}}</span>
          <span class="allClassTime">总课时：{{allClassTime}}</span>
          <el-button type="primary">批量添加课次</el-button>
          <el-button type="primary">添加课次</el-button>
        </div>
        <div style="margin-top:10px;">
          <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                模块名称：{{moduleName}}
                <i class="header-icon el-icon-info"></i>
                <el-button type="primary" icon="el-icon-edit" class="edit" @click="edit"></el-button>
                <el-button type="primary" icon="el-icon-delete" class="delete" @click="remove"></el-button>
              </template>
              <div class="class">
                <span style="margin-left:20px;">课程配置</span>
              </div>
              <div>
                <el-table :data="tableData1" border center>
                  <el-table-column type="index" width="50"></el-table-column>
                  <el-table-column label="课次名称" width="100">
                    <template slot-scope="scope">
                      <el-input v-model="tableData1[scope.$index].timeName" size="small" clearable></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="课时" width="80">
                    <template slot-scope="scope">
                      <el-input v-model="tableData1[scope.$index].hours" size="small" clearable></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="预约数">
                    <template slot-scope="scope">
                      <el-input v-model="tableData1[scope.$index].times" size="small" clearable></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="随堂考">
                    <template slot-scope="scope">
                      <el-input v-model="tableData1[scope.$index].rand" size="small" clearable></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="url" label="小程序(120*120)">
                    <template slot-scope="scope">
                      <el-dialog title="课次图片" :visible.sync="dialogVisible" append-to-body>
                        <img width="100%" :src="url" alt />
                      </el-dialog>
                      <el-upload
                        :action="uploadUrl"
                        :on-progress="getIndex(scope.$index)"
                        :on-success="handleAvatarSuccess"
                        :on-remove="handleRemove"
                        :multiple="false"
                        :limit="1"
                      >
                        <el-button size="small" type="success">
                          <i class="el-icon-upload" style="font-size:16px;"></i>
                          <div class="el-upload__text">点击上传</div>
                        </el-button>
                      </el-upload>
                      <el-button
                        size="small"
                        type="primary"
                        style="margin-top:10px"
                        @click="view(scope.$index)"
                      >查看图片</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="pcUrl" label="PC商城(620*360)">
                    <template slot-scope="scope">
                     <el-dialog :close-on-click-modal='false' title="课次图片" :visible.sync="dialogVisible" append-to-body>
                      <img width="100%" :src="url" alt="">
                    </el-dialog>
                     
                    <el-upload
                        :action="uploadUrl"
                        :on-progress="getIndex(scope.$index)"
                        :on-success="handleAvatarSuccess"
                        :on-remove="handleRemove"
                        :multiple="false"
                        :limit="1"
                      >
                        <el-button size="small" type="success">
                          <i class="el-icon-upload" style="font-size:16px;"></i>
                          <div class="el-upload__text">点击上传</div>
                        </el-button>
                      </el-upload>
                      <el-button
                        size="small"
                        type="primary"
                        style="margin-top:10px"
                        @click="view(scope.$index)"
                      >查看图片</el-button>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="danger" size="small" @click="handleDele(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <!-- <el-dialog :close-on-click-modal='false' width="50%" title="新增模块" :visible.sync="innerVisible" append-to-body>
          <template>
            <div class="Obox">
              <div class="nameBox">
                <span>模块名称:</span>
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </template>
        </el-dialog>-->
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import listMixin from "@/api/list";
import {modifyStatusCourse} from '../../api/api'
export default {
  mixins: [listMixin],
  data() {
    return {
      filters: {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      },
      filter: {
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
        courseId: ""
      },
      tableData1: [
        {
          rand: "",
          timeName: "",
          times: "",
          pcUrl: "",
          url: "",
          hours: ""
        }
      ],
      uploadUrl: $UPLOAD,
      apiName: "system/api/course/listCourse",
      addName: "system/api/course/addCourseAndTimes",
      updateName: "system/api/course/updateCourseAndTimes",
      delName: "system/api/course/delCourse",
      delcourseName: "system/api/courseTime/delCourseTime",
      queryTimesByCourseId: "system/api/courseTime/queryTimesByCourseId",
      fileList: "",
      tableData: [],
      option5: [
        {
          value: 0,
          label: "面授"
        },
        {
          value: 1,
          label: "直播"
        }
      ],
      option4: [
        {
          value: 0,
          label: "公开课"
        },
        { value: 1, label: "精讲" },
        { value: 2, label: "串讲" },
        { value: 3, label: "模考" }
      ],
      classTime: "12", //课时
      allClassTime: "45", //总课时
      moduleName: "红烧鸡",
      url: "",
      textarea: "",
      outerVisible: false,
      innerVisible: false,
      editForm: {},
      option1: [],
      option2: [],
      options: [],
      loading: false,
      users: [],
      total: 0,
      page: 1,
      isShowEdit: false,
      isEdit: 0,
      index: "",
      dialogVisible: false,
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
    getData(){
			this.filters.curPage = 1
			this.getList()
		},
     forbidden(row, index) {
      let params = {
        id: row.id,
        status: 0
      };
      modifyStatusCourse(params).then(res => {
        if (res.code === 30000) {
          this.$message({
            showClose: true,
            message: "已禁用",
            type: "success"
          });
          this.getList();
        } else {
          
        }
      });
    },
    start(row, index) {
      let params = {
        id: row.id,
        status: 1
      };
      modifyStatusCourse(params).then(res => {
        if (res.code === 30000) {
          this.$message({
            showClose: true,
            message: "已启用",
            type: "success"
          });
          this.getList();
        } else {

        }
      });
    },
    getIndex(index) {
      this.index = index;
    },
    handleAvatarSuccess(res, file) {
      this.tableData1[this.index].url = file.response.result;
    },
    handleRemove(file, fileList) {
      this.tableData1[this.index].url = "";
    },
    view(index) {
      this.url = this.tableData1[index].url;
      this.dialogVisible = true;
    },
    formatType(row, column) {
      return row.courseType == 1
        ? "公开课"
        : row.type == 0
        ? "精讲"
        : row.type == 2
        ? "串讲"
        : "模考";
    },
    formatTyped(row, column) {
      return row.teachType == 1 ? "直播" : "面授";
    },
    addClass() {
      this.tableData.push({
        data: "",
        name: "",
        address: "",
        file: ""
      });
    },
    handleClick(rows, index) {
      this.tableData.splice(index, 1);
    },
    clear() {
      this.filters = {
        curPage: 1,
        pageSize: 10,
        busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
      };
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
      this.editForm = {
        id: row.id,
        firstId: row.firstId,
        secondId: row.secondId,
        // subjectName: row.subjectName,
        subjectId: row.subjectId,
        remark: row.remark,
        courseType: row.courseType,
        teachType: row.teachType,
        courseName: row.courseName
      };
    },
    handleUpdate(rows, index) {
      console.log(this.users[index].totalHour);
      this.outerVisible = true;
      this.classTime = this.users[index].totalNo;
      this.allClassTime = this.users[index].totalHour;
      this.filter.courseId = rows.id;
      this.getList1();
    },
    editSubmit() {
      this.editForm.timesJr = [];
      this.editForm.busId = JSON.parse(
        sessionStorage.getItem("userInfo")
      ).user.busId;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            this.update1();
          } else {
            this.add1();
          }
        }
      });
    },
    //获取用户列表
    // getList: function() {
    //   this.users = [
    //     // {
    //     //   item1: "资格证",
    //     //   item2: "心理咨询师",
    //     //   score: "已发布",
    //     //   item3: "直播",
    //     //   item4: "精讲课",
    //     //   name: "职场必修心理学",
    //     //   num: 20
    //     // }
    //   ];
    //   this.total = 1;
    // },
    editOk() {
      this.isShowEdit = false;
      this.getList();
    },
    edit() {},
    remove() {}
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
.classTime {
  margin-left: 60px;
}
.allClassTime {
  margin-left: 60px;
}
.edit {
  margin-left: 75%;
}
.delete {
}
.class {
  /* height: 30px; */
  border: solid 1px white;
  background: #eee;
  color: gray;
  font-size: 16px;
  /* margin-left: 20px; */
}
.Obox {
  border: solid 1px gray;
  border-radius: 5px;
}
.nameBox {
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
}
.content {
  /* margin-top: 15px; */
  padding-top: 20px;
  border-top: solid 1px gray;
  /* background: black; */
  /* text-align: center; */
}
</style>