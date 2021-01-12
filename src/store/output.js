/* eslint-disable */
import { EventBus } from '@/event'
export const output = {
    state: {
        baseUrl: 'https://vtranscodestaging.mobiotics.com/transcoder/v1',
        auth: `Bearer ${localStorage.getItem('token')}`
    },
    actions: {
        getTranscodJobById(context, jobId) {
            EventBus.$emit('Loader', true)
            return new Promise(function(resolve, reject) {
                fetch(`${context.state.baseUrl}/jobs/${jobId}`, {
                        headers: {
                            'Authorization': context.state.auth,
                        }
                    })
                    .then(response => {
                        EventBus.$emit('Loader', false)
                        if (response.ok) {
                            resolve(response.json())
                        } else {
                            reject(response.json())
                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        },
        getTranscodedList(context, data) {
            EventBus.$emit('Loader', true)
            return new Promise(function(resolve, reject) {
                fetch(`${context.state.baseUrl}/jobs?status=${data.status}&contentid=${data.contentid}&jobid=${data.jobid}&pagesize=${data.pagesize}&page=${data.page}&starttime=${data.starttime}&created=${data.created}&endtime=${data.endtime}`, {
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

        actDeleteTranscoder(context, jobId) {
            EventBus.$emit('Loader', true)
            return new Promise((resolve, reject) => {
                fetch(`${context.state.baseUrl}/jobs/${jobId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': context.state.auth,

                    },
                    method: 'DELETE'
                }).then(response => {
                    EventBus.$emit('Loader', false)
                    if (response.ok) {
                        resolve(response.json())
                    } else {
                        reject(response)
                    }
                }).catch(error => {
                    console.log(error)
                })
            })
        },


        reInitiateTranscoding(context, data) {
            EventBus.$emit('Loader', true)
            return new Promise(function(resolve, reject) {
                fetch(`${context.state.baseUrl}/jobs/${data.jobId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': context.state.auth,
                        },
                        method: 'PUT',
                        body: JSON.stringify(data.content)
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
        }
    }
}