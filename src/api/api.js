import axios from '../api/request'
import Qs from 'qs'
import { BASEURL } from './config';
let qs = require('querystring')
    // let BASEURL = 'http://192.168.1.86:9527/system/api/'
export function logined(obj) {
    // let urlParams = {
    //     userName,
    //     password
    // }
    axios.defaults.headers.post['Content-Type'] = 'text/plain'
    console.log(obj)
    let url = BASEURL + 'system/api/adminlogins'
    return axios.post(url, obj, {
        transformRequest: [
            function(data) {
                return JSON.stringify(obj);
            }
        ]
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}
//数据字典类型
export function listDictionary(params) {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    let url = BASEURL + 'system/api/listDictionaryCategory'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//数据字典接口
export function Dictionary(params) {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    let url = BASEURL + 'system/api/listDictionary'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//数据字典添加
export function addDictionary(params) {
    console.log(params)
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    let url = BASEURL + 'system/api/addDictionary'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改数据字典
export function updateDictionary(params) {
    let url = BASEURL + 'system/api/updateDictionary'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//删除数据字典 
export function delDictionary(params) {
    console.log(params)
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    let url = BASEURL + 'system/api/delDictionary'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//添加数据字典类别
export function addDictionaryCategory(params) {
    console.log(params)
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    let url = BASEURL + 'system/api/addDictionaryCategory'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改数据字典类别
export function updateDictionaryCategory(params) {
    let url = BASEURL + 'system/api/updateDictionaryCategory'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//删除数据字典类别
export function delDictionaryCategory(params) {
    let url = BASEURL + 'system/api/delDictionaryCategory'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//轮次预排课

export function createSchedule(params) {
    let url = BASEURL + 'system/api/courseTurns/createSchedule'
    axios.defaults.headers.post['Content-Type'] = 'text/plain'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return JSON.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//轮次管理-修改开课时间
export function modifyOpenDate(params) {
    let url = BASEURL + 'system/api/courseTurns/modifyOpenDate'
        // axios.defaults.headers.post['Content-Type'] = 'text/plain'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                // return  JSON.stringify(params);
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//查询轮次和其对应明细
export function queryCourseTurnsAndDetail(params) {
    let url = BASEURL + 'system/api/courseTurns/queryCourseTurnsAndDetail'
        // axios.defaults.headers.post['Content-Type'] = 'text/plain'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                // return  JSON.stringify(params);
                return Qs.stringify(params);

            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//保存轮次和对应明细集合
export function addCourseTurnsAndDetail(params) {
    let url = BASEURL + 'system/api/courseTurns/addCourseTurnsAndDetail'
    axios.defaults.headers.post['Content-Type'] = 'text/plain'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return JSON.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//删除轮次明细
export function delCourseTurnsTime(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/delCourseTurnsTime'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//新增轮次明细
export function addCourseTurnsTime(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/addCourseTurnsTime'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//推送轮次课次
export function pushCourseTurnsTime(params) {
    let url = BASEURL + 'system/api/student/pushCourseTurnsTime'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//取消推送
export function cancelPushTime(params) {
    let url = BASEURL + 'system/api/student/cancelPushTime'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//查询学生转班
export function queryTransFerByStudent(params) {
    let url = BASEURL + 'system/api/transfer/queryTransFerByStudent'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//课次确认
export function teachConfirm(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/teachConfirm'
    axios.defaults.headers.post['Content-Type'] = 'text/plain'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return JSON.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//课次异动
export function updateTeacherInfoByHt(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/updateTeacherInfoByHt'
    axios.defaults.headers.post['Content-Type'] = 'text/plain'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return JSON.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//学员信息管理-学员nps-学生历史nps评价
export function historyNpsByStudentId(params) {
    let url = BASEURL + 'system/api/nps/historyNpsByStudentId'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//教师工作台 教师直播启动 直播期间
export function teacherByLaunch(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/teacherByLaunch'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//教师工作台-助教直播 进入 直播期间
export function assistantByAccess(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/assistantByAccess'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//教师工作台-教师查看回放
export function teacherByPlayBack(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/teacherByPlayBack'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//教师工作台-助教查看回放
export function assistantByPlayBack(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/assistantByPlayBack'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//教师工作台-学生直播 进入 直播期间
export function studentByAccess(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/studentByAccess'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//教师工作台-学生查看回放
export function studentByPlayBack(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/studentByPlayBack'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//教师工作台 --各个统计 上方
export function workBeachByTeacherReport(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/workBeachByTeacherReport1'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//课次--结课
export function finishCourseTurnsTime(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/finishCourseTurnsTime'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//学生详情 我的课表
export function queryMyCourseByMonth(params) {
    let url = BASEURL + 'system/api/courseTurns/queryMyCourseByMonth'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//查询轮次对应推送的学员
export function queryPushScheduleTime(params) {
    let url = BASEURL + 'system/api/student/queryPushScheduleTime'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
        // axios.defaults.headers.post['Content-Type'] = 'text/plain'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
                // return JSON.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//工作台配置修改
export function updateCourseTurnsTime(params) {
    let url = BASEURL + 'system/api/courseTurnsTime/updateCourseTurnsTime'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改客服通知状态
export function modifyIsContact(params) {
    let url = BASEURL + 'system/api/orderDetail/modifyIsContact'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改轮次名称
export function updateCourseTurns(params) {
    let url = BASEURL + 'system/api/courseTurns/updateCourseTurns'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改订单明细 label/班主任
export function updateOrderDetail(params) {
    let url = BASEURL + 'system/api/orderDetail/updateOrderDetail'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改多个学员班主任
export function modifyTeacher(params) {
    let url = BASEURL + 'system/api/orderDetail/modifyTeacher'
        // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    axios.defaults.headers.post['Content-Type'] = 'text/plain'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                // return Qs.stringify(params);
                return JSON.stringify(params);

            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//学员大表导出
export function exportStudentExcel(params) {
    let url = BASEURL + 'system/api/orderDetail/queryStudentExcel'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

//启用禁用
export function updateStatus(params) {
    let url = BASEURL + 'system/api/firstProject/updateStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//基础科目启用禁用
export function BaseStatus(params) {
    let url = BASEURL + 'system/api/item/updateStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//考期启用禁用
export function ExamStatus(params) {
    let url = BASEURL + 'system/api/exam/updateStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//服务管理启用禁用
export function serviceManage(params) {
    let url = BASEURL + 'system/api/serviceManage/modifyStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//直播间启用禁用
export function modifyStatusliveRoom(params) {
    let url = BASEURL + 'system/api/liveRoom/modifyStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改资料包启用状态
export function modifyStatusDatum(params) {
    let url = BASEURL + 'system/api/datum/modifyStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改教材启用状态
export function modifyStatusTextbook(params) {
    let url = BASEURL + 'system/api/textbook/modifyStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//录播启用禁用
export function modifyStatusRecordedCourse(params) {
    let url = BASEURL + 'system/api/recordedCourse/modifyStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改课程管理启用状态
export function modifyStatusCourse(params) {
    let url = BASEURL + 'system/api/course/modifyStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//保存考期
export function updateOrderDetail1(params) {
    let url = BASEURL + 'system/api/orderDetail/updateOrderDetail'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改轮次发布状态
export function modifyCourseTurnsStatus(params) {
    let url = BASEURL + 'system/api/courseTurns/modifyCourseTurnsStatus'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    return axios.post(url, params, {
        transformRequest: [
            function(data) {
                return Qs.stringify(params);
            }
        ]
    }).then(res => {
        return Promise.resolve(res.data)
    })
}