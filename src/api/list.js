import axios from 'axios'

export default {
    data() {
        return {
            powerList: sessionStorage.getItem(this.$route.path.replace(/\//g, '')) ? JSON.parse(sessionStorage.getItem(this.$route.path.replace(/\//g, ''))) : '',
            viewerId: null,
            users: [],
            list: [],
            total: '',
            loading: false,
            page: 1,
            pageSize: 10,
            multipleSelection: [],
            option2: [],
            countStaticAll: {},
            javaMiddle: 'pc/role/'
        }
    },
    methods: {
        HasPermission(name) {
            var result = '';
            if (this.powerList) {
                this.powerList.forEach((item, i) => {
                    if (item.url == name) {
                        return result = true
                    }
                });
                return result
            } else {
                return result = false
            }

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
                this.users = data.result.content
                this.list = data.result
                this.total = data.result.total
                this.loading = false
            } else {
                this.$message.warning(data.message)
                this.loading = false
            }

        },
        async getList1() {
            this.loading = false
            let { data } = await this.$http({
                url: this.queryTimesByCourseId,
                method: "post",
                data: this.filter,
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
                this.loading = false
            });
            if (data.code == 30000) {
                this.tableData1 = data.result

                this.list = data.result
                this.total = data.result.total
                this.loading = false
            } else {
                this.$message.warning(data.message)
                this.loading = false
            }

        },
        async add() {

            let { data } = await this.$fetch({
                url: this.addName,
                method: "post",
                data: this.editForm,
            }).catch(error => {
                this.$message.error(this.addName + "接口出错！");
                this.loading = false
            });
            if (data.code == 30000) {
                this.$message.success('保存成功！')
                this.editOk()
                this.loading = false
            } else {
                this.$message.warning(data.message)
                this.loading = false
            }
        },
        async add1() {

            let { data } = await this.$http({
                url: this.addName,
                method: "post",
                data: this.editForm,
            }).catch(error => {
                this.$message.error(this.addName + "接口出错！");
                this.loading = false
            });
            if (data.code == 30000) {
                this.$message.success('保存成功！')
                this.loading = false
                    // this.editOk()
            } else {
                this.$message.warning(data.message)
                this.loading = false
            }
        },
        async update() {
            let { data } = await this.$fetch({
                url: this.updateName,
                method: "post",
                data: this.editForm,
            }).catch(error => {
                this.$message.error(this.updateName + "接口出错！");
            });
            if (data.code == 30000) {
                this.$message.success('保存成功！')
                this.editOk()
            } else {
                this.$message.warning(data.message)
            }
        },
        async update1() {
            let { data } = await this.$http({
                url: this.updateName,
                method: "post",
                data: this.editForm,
            }).catch(error => {
                this.$message.error(this.updateName + "接口出错！");
            });
            if (data.code == 30000) {
                this.$message.success('保存成功！')
                    // this.editOk()
            } else {
                this.$message.warning(data.message)
            }
        },
        async handleDel(row) {
            var that = this
            that.$confirm('确定删除所选纪录？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$fetch({
                    url: this.delName,
                    method: "post",
                    data: {
                        id: row.id
                    },
                }).catch(error => {
                    that.$message.error(this.delName + "接口出错！");
                }).then(({ data }) => {
                    if (data.code == 30000) {
                        that.$message.success('删除成功！')
                        that.getList()
                    } else {
                        that.$message.warning(data.message)
                    }
                })
            });
        },
        // async handleDele(row) {
        //     var that = this
        //     that.$confirm('确定删除所选纪录？', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //     }).then(() => {
        //         that.$fetch({
        //             url: this.delcourseName,
        //             method: "post",
        //             data: {
        //                 id: row.id
        //             },
        //         }).catch(error => {
        //             that.$message.error(this.delName + "接口出错！");
        //         }).then(({ data }) => {
        //             if (data.code == 30000) {
        //                 that.$message.success('删除成功！')
        //                 that.getList()
        //             } else {
        //                 that.$message.warning(data.message)
        //             }
        //         })
        //     });
        // },
        async getProvince() { //获取一级项目下拉
            let { data } = await this.$fetch({
                url: 'system/api/region/queryAllProvince',
                method: "post",
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option3 = data.result
            }
        },

        async getoption1() { //获取一级项目下拉
            let { data } = await this.$fetch({
                url: 'system/api/firstProject/queryAllFirstProject',
                method: "post",
                data: {
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option1 = data.result
            }
        },
        async getoption2(id) { //获取一级项目下关联的二级项目下拉
            let { data } = await this.$fetch({
                url: 'system/api/secondProject/findAllSecond',
                method: "post",
                data: {
                    firstId: id,
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option2 = data.result
                    // this.selectArr
            }
        },
        async getGoods(id) { //获取二级项目下关联的商品下拉
            console.log(id)
                // this.idxk = id
            let { data } = await this.$fetch({
                url: 'system/api/goods/queryGoods',
                method: "post",
                data: {
                    secondId: id,
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option15 = data.result
            }
        },

        async getoption6() { //获取一级项目下拉
            let { data } = await this.$fetch({
                url: 'system/api/firstProject/queryAllFirstProject',
                method: "post",
                data: {
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option6 = data.result
            }
        },
        async getoption7(id) { //获取一级项目下关联的二级项目下拉
            let { data } = await this.$fetch({
                url: 'system/api/secondProject/findAllSecond',
                method: "post",
                data: {
                    firstId: id,
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option7 = data.result
            }
        },
        async getdepartTree() { //获取组合机构下拉
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
                this.option12 = data.result
            }
        },
        async getdepartTreeByDepartId(id) { //获取组合机构下关联的部门树结构
            let { data } = await this.$fetch({
                url: 'system/api/departTreeByDepartId',
                method: "post",
                data: {
                    departId: id,
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option13 = data.result
            }
        },

        async getSubject(id) { //获取一二级项目下关联的科目下拉
            var firstId = ''
            this.option2.map(item => {
                if (id == item.id) {
                    return firstId = item.firstId
                }
            })
            let { data } = await this.$fetch({
                url: 'system/api/subject/querySubByFirstAndSecond',
                method: "post",
                data: {
                    firstId: firstId,
                    secondId: id,
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option3 = data.result
            }

        },
        async getItem() { //获取所有科目下拉
            let { data } = await this.$fetch({
                url: 'system/api/item/queryAllItem',
                method: "post",
                data: {
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option3 = data.result
            }
        },
        async getCourse(id) { //获取课程下拉
            let { data } = await this.$fetch({
                url: 'system/api/course/queryCourseBySubject',
                method: "post",
                data: {
                    subjectId: id
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option4 = data.result
            }
        },
        async getExamType() { //字典类别查询试题类型
            let { data } = await this.$fetch({
                url: 'system/api/queryDictionaryByCode',
                method: "post",
                data: {
                    categoryCode: 'exam_type'
                },
            }).catch(error => {
                this.$message.error(this.apiName + "接口出错！");
            });
            if (data.code == 30000) {
                this.examType = data.result
            }
        },
        async upload(fileobj) {
            const loading = this.$loading({
                lock: true,
                text: '上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let param = new FormData()
            param.append('file', fileobj.file)
            param.append('type', 0)
            let { data } = await axios({
                timeout: 1000 * 60 * 2,
                url: $UPLOAD,
                method: "post",
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: param
            }).catch(error => {
                this.$message.error('上传接口出错！');
                loading.close();
            });

            if (data.code == 30000) {
                this.$message.success('上传成功！')
                this.files = data.result.url
                loading.close();
            }
        },
        async upload2(fileobj) {
            const loading = this.$loading({
                lock: true,
                text: '上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let param = new FormData()
            param.append('file', fileobj.file)
            param.append('type', 1)
            let { data } = await axios({
                timeout: 1000 * 60 * 100,
                url: $UPLOAD,
                method: "post",
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: param
            }).catch(error => {
                this.$message.error('上传接口出错！');
                this.$message.error(error);
                loading.close();
            });

            if (data.code == 30000) {
                this.$message.success('上传成功！')
                this.files = data.result.url
                if (data.result.viewImg) {
                    this.img = data.result.viewImg
                }
                loading.close();
            }
        },

        async getCode() { //授课老师下拉
            let { data } = await this.$fetch({
                url: 'system/api/queryUcByRoleCode',
                method: "post",
                data: {
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
                    code: 'lecturer'
                },
            }).catch(error => {
                this.$message.error(this.apiCodeName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option5 = data.result
            }
        },
        async getAssidtant() { //助教老师下拉
            let { data } = await this.$fetch({
                url: 'system/api/queryUcByRoleCode',
                method: "post",
                data: {
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
                    code: 'assistant'
                },
            }).catch(error => {
                this.$message.error(this.apiCodeName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option6 = data.result
            }
        },
        async getLiveRoom() { //直播间下拉
            let { data } = await this.$fetch({
                url: 'system/api/liveRoom/queryLiveRoomByBusId',
                method: "post",
                data: {
                    busId: JSON.parse(sessionStorage.getItem("userInfo")).uc.busId,
                },
            }).catch(error => {
                this.$message.error(this.apiLiveRoomName + "接口出错！");
            });
            if (data.code == 30000) {
                this.option7 = data.result
            }
        },
    }
}