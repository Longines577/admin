import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    index: 1,
    course: [],
    question: {},
    children: [],
}

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    SETINDEX(state, index) {
        state.index = index;
    },
    COURSE(state, course) {
        state.course = course;
    },
    RECORDS(state, records) {
        state.records = records;
    },
    DATUM(state, datum) {
        state.datum = datum;
    },
    TEXTBOOK(state, textbook) {
        state.textbook = textbook;
    },
    SERVICES(state, services) {
        state.services = services;
    },
    MERGES(state, merges) {
        state.merges = merges;
    },
    QUESTION(state, question) {
        state.question = question;
    },
    CHILDREN(state, children) {
        state.children = children;
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})