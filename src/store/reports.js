import { EventBus } from '@/event'
export const reports = {
    state: {
        baseUrl: 'https://vtranscodestaging.mobiotics.com/provider/v1/report',
        auth: `Bearer ${localStorage.getItem('token')}`
    },
    getters: {},
    mutations: {},
    actions: {
        actGetReport(context, data) {
            EventBus.$emit('Loader', true)
            console.log('paload', JSON.stringify(data.filter))
            let queryParams = ""
            if (data.reportid === "unprocess") {
                let { filename = "", filetype = "" } = data.filter
                queryParams = `filename=${filename}&filetype=${filetype}`
            } else if (data.reportid === "job" || data.reportid === "transcode") {
                let intitiatedBy = [{ 'name': 'initiatedby', 'value': context.getters.getReportInitiatedBy }]
                let concatedData = intitiatedBy.concat(data.filter)
                queryParams = `filter=${JSON.stringify(concatedData)}`
            } else {
                queryParams = `filter=${JSON.stringify(data.filter)}`
            }

            return new Promise((resolve, reject) => {
                console.log("queryparams", queryParams)
                fetch(`${context.state.baseUrl}/${data.reportid}?fromdate=${data.fromdate}&todate=${data.todate}&pagesize=${data.pagesize}&page=${data.page}&${queryParams}&interval=${context.getters.getReportInterval}`, {
                    headers: { 'Authorization': context.state.auth }
                }).then(Response => {
                    EventBus.$emit('Loader', false)
                    if (Response.ok) {
                        resolve(Response.json())
                    } else {
                        reject(Response)
                    }
                }).catch(error => {
                    EventBus.$emit('Loader', false)
                    console.log(error)
                    reject(error)
                })
            })
        },
        actReportDownload(context, data) {
            // let getterData = context.getters.getReportData
            EventBus.$emit('Loader', true)
            let { id, dates } = data;
            console.log(data, "data")
            console.log(dates, "data")
            return new Promise((resolve, reject) => {
                fetch(`${context.state.baseUrl}/${id}/download?todate=${dates.toDate}&fromdate=${dates.fromDate}`, {
                    headers: { 'Authorization': context.state.auth }
                }).then(Response => {
                    console.log(Response, 'response')
                    EventBus.$emit('Loader', false)
                    if (Response.ok) {
                        resolve(Response.text())
                    } else {
                        resolve(Response.json())
                    }
                }).catch(error => {
                    EventBus.$emit('Loader', false)
                    console.log(error)
                    reject(error)
                })
            })
        }
    }
}