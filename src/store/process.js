import { EventBus } from '@/event'

export const process = {
    state: {
        auth: `Bearer ${localStorage.getItem('token')}`
    },
    actions: {
        listPreProcessJobs(context, data) {
            EventBus.$emit('Loader', true)

            return new Promise((resolve, reject) => {
                fetch(`${context.getters.getbaseUrl}provider/v1/preprocess?originalfilename=${data.originalfilename}&filetype=${data.filetype}&contenttype=${data.contenttype}&preprocessstatus=${data.preprocessstatus}&deficient=${data.deficient}&mimetype=${data.mimetype}&preprocessid=${data.preprocessid}&quality=${data.quality}&jobid=${data.jobid}&fromdate=${data.fromdate}&todate=${data.todate}&page=${data.page}&pagesize=${data.pagesize}`, {
                        headers: {
                            'Authorization': context.state.auth
                        }
                    })
                    .then((response) => {
                        EventBus.$emit('Loader', false)
                        if (response.ok) {
                            console.log(response)
                            resolve(response.json())
                        } else {
                            reject(response)
                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        },
        updatePreProcessFiles(context, data) {
            EventBus.$emit('Loader', true)
            return new Promise((resolve, reject) => {
                fetch(`${context.getters.getbaseUrl}provider/v1/preprocess/${data.preprocessid}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': context.state.auth
                        },
                        method: 'PUT',
                        body: JSON.stringify(data.formdata)
                    })
                    .then(response => {
                        EventBus.$emit('Loader', false)
                        if (response.ok) {
                            // console.log('inapiedit', response.json())
                            resolve(response)
                        } else {
                            reject(response)
                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        },
        getUnprocessedList(context, data) {

            EventBus.$emit('Loader', true)
            return new Promise(function(resolve, reject) {
                fetch(`${context.getters.getbaseUrl}/provider/v1/preprocess/unprocessed?originalfilename=${data.originalfilename}&filetype=${data.filetype}&contenttype=${data.contenttype}&created=${data.created}&page=${data.page}&pagesize=${data.pagesize}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': context.state.auth,
                        },
                    })
                    .then(response => {
                        EventBus.$emit('Loader', false)
                        if (response.ok) {
                            resolve(response.json())
                        } else {
                            reject(response)
                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        },
        preprocessFiles(context, data) {

            EventBus.$emit('Loader', true)
            return new Promise(function(resolve, reject) {
                fetch(`${context.getters.getbaseUrl}/provider/v1/preprocess`, {
                        headers: {
                            'Authorization': context.state.auth,
                        },
                        method: 'POST',
                        body: data
                    })
                    .then(response => {
                        EventBus.$emit('Loader', false)
                        if (response.ok) {
                            resolve(response.json())
                        } else {
                            reject(response)
                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        },
    }
}