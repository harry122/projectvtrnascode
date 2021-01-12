import { EventBus } from '@/event'
export const settings = {
    state: {
        settingList: [],
        baseUrl: 'https://vauth.mobiotics.com/provider/v1/config',
        serviceId: 'VTRANSCODE'
    },
    getters: {
        getSettingData: (state) => {
            return state.settingList
        }
    },
    mutations: {
        setSettingList: (state, val) => {
            state.settingList = val
        }
    },
    actions: {
        actSettingsList(context, data) {
            EventBus.$emit('Loader', true)
                // console.log(data, 'payload')
            return new Promise((resolve, reject) => {
                let myHeaders = new Headers()
                let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''
                myHeaders.append('Authorization', `Bearer ${token}`)
                let requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                }
                fetch(` ${context.state.baseUrl}?serviceid=${context.state.serviceId}&environment=${data.environment}`, requestOptions).then(response => {
                    // console.log(response, 'api')
                    EventBus.$emit('Loader', false)
                    if (response.ok) {
                        resolve(response.json())
                    } else {
                        reject(response)
                    }
                }).catch(error => {
                    EventBus.$emit('Loader', false)
                    console.log(error)
                })
            })
        },
        listSettingList(context, data) {

            console.log("listSettingList", context.getters.getloginUrl)
            let myHeaders = new Headers()
            let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''
            myHeaders.append('Authorization', `Bearer ${token}`)
            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            }
            let environment = data.environment
            let serviceid = 'VTRANSCODE'
            let settingtype = data.settingtype
            let groupid = ''
            if (data.groupid) {
                groupid = data.groupid
            }
            return new Promise((resolve, reject) => {
                fetch(`${context.getters.getloginUrl}/config?environment=${environment}&serviceid=${serviceid}&settingtype=${settingtype}&groupid=${groupid}`, requestOptions)
                    .then((response) => {
                        EventBus.$emit('Loader', false)
                        if (response.ok) {
                            resolve(response.json())
                        } else {
                            resolve(response.json())
                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        },
        listAccessList(context, data) {
            let myHeaders = new Headers()
            let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''
            myHeaders.append('Authorization', `Bearer ${token}`)
            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            }
            let environment = data.environment
            let serviceid = 'VTRANSCODE'
            return new Promise((resolve, reject) => {
                fetch(`${context.getters.getloginUrl}/service/${serviceid}?environment=${environment}`, requestOptions)
                    .then((response) => {
                        EventBus.$emit('Loader', false)
                        if (response.ok) {
                            resolve(response.json())
                        } else {
                            resolve(response.json())
                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        },
        updateProviderList(context, data) {
            let myHeaders = new Headers()
            let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''
            myHeaders.append('Authorization', `Bearer ${token}`)
            myHeaders.append('Content-Type', 'application/json')
            let raw = JSON.stringify(data)
            return new Promise((resolve, reject) => {
                fetch(`${context.getters.getloginUrl}/config`, {
                        method: 'PUT',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    })
                    .then((response) => {
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