import Vue from 'vue'
import Vuex from 'vuex'
import { dashboard } from '@/store/dashboard'
import { profiles } from '@/store/profile'
import { output } from '@/store/output'
import { settings } from '@/store/settings.js'
import { process } from '@/store/process'
import { input } from '@/store/input'
import { fileupload } from '@/store/fileupload'
import { reports } from '@/store/reports'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        baseUrl: 'https://vtranscodestaging.mobiotics.com/',
        importFiles: "",
        baseUrl: 'https://vtranscodestaging.mobiotics.com/',
        loginUrl: 'https://vtranscodestaging.mobiotics.com/',
        uploadUrl: 'https://vtranscodestaging.mobiotics.com/',
        reportData: "",
        reportInterval: "",
        reportInitiateBy: ""
    },
    getters: {
        getbaseUrl: (state) => {
            return state.baseUrl
        },
        getImportFiles: (state) => {
            return state.importFiles
        },
        getuploadUrl: (state) => {
            return state.uploadUrl
        },
        getloginUrl: (state) => {
            return state.loginUrl
        },
        getReportData: (state) => {
            return state.reportData
        },
        getReportInterval: (state) => {
            return state.reportInterval
        },
        getReportInitiatedBy: (state) => {
            return state.reportInitiateBy
        }
    },
    mutations: {
        setImportFiles: (state, data) => {
            state.importFiles = data
        },
        getuploadUrl: (state) => {
            return state.uploadUrl
        },
        setReportData: (state, data) => {
            state.reportData = data
        },
        setReportInterval: (state, data) => {
            state.reportInterval = data
        },
        setReportInitiateBy: (state, data) => {
            state.reportInitiateBy = data
        }
    },
    modules: {
        dashboard,
        profiles,
        process,
        output,
        input,
        settings,
        fileupload,
        reports
    }
})

export default store