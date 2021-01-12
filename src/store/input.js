import { EventBus } from '@/event'

export const input = {
    state: {
        token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
        listAllJobTranscode: [],
        listFilteredJobTranscode: [],
        isTrancodeEnable: false,
        transcodeProcessName: '',
        allProfileList: []
    },
    getters: {
        getListAllJobTranscode: (state) => {
            return state.listAllJobTranscode;
        },
        getListFilteredJobTranscode: (state) => {
            return state.listFilteredJobTranscode;
        },
        getIsTrancodeEnable: (state) => {
            return state.isTrancodeEnable
        },
        getTranscodeProcessName: (state) => {
            return state.transcodeProcess
        },
        getAllProfileList: (state) => {
            return state.allProfileList;
        }
    },
    mutations: {
        setListAllJobTranscode: (state, data) => {
            state.listAllJobTranscode = data
        },
        setListFilteredJobTranscode: (state, data) => {
            state.listFilteredJobTranscode = (data)
        },
        setIsTrancodeEnable: (state, val) => {
            state.isTrancodeEnable = val
        },
        setTranscodeProcessName: (state, val) => {
            state.transcodeProcess = val
        },
        setAllProfileList: (state, val) => {
            state.allProfileList = val
        }
    },
    actions: {
        actTranscodeData(context, data) {
            EventBus.$emit('Loader', true)
            if (!data) {
                data = ''
            }
            var myHeaders = new Headers();
            myHeaders.append("authorization", 'Bearer' + ' ' + localStorage.getItem('token'))
            let requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            return new Promise((resolve, reject) => {
                fetch(`${context.getters.getbaseUrl}provider/v1/preprocess?preprocessstatus=SUCCESS&${data}`, requestOptions)
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.data) {
                            resolve(response)
                            EventBus.$emit('Loader', false)
                        } else {
                            reject(response)
                            EventBus.$emit('Loader', false)

                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        },
        actUpdateTranscodeData(context, data) {
            EventBus.$emit('Loader', true)

            var myHeaders = new Headers();
            myHeaders.append("authorization", 'Bearer' + ' ' + localStorage.getItem('token'))
            let requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(data.payload)
            };
            return new Promise((resolve, reject) => {
                fetch(`${context.getters.getbaseUrl}provider/v1/preprocess/${data.id}`, requestOptions)
                    .then((response) => {
                        if (response.ok) {
                            resolve(response.json())
                            EventBus.$emit('Loader', false)
                        } else {
                            reject(response)
                            EventBus.$emit('Loader', false)

                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        },
        actInititedTranscode(context, data) {
            EventBus.$emit('Loader', true)
            var myHeaders = new Headers();
            myHeaders.append("authorization", 'Bearer' + ' ' + localStorage.getItem('token'))
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: data
            };
            return new Promise((resolve, reject) => {
                fetch(`${context.getters.getbaseUrl}transcoder/v1/jobs.php`, requestOptions)
                    .then((response) => {
                        if (response.ok) {
                            resolve(response.json())
                            EventBus.$emit('Loader', false)
                        } else {
                            reject(response)
                            EventBus.$emit('Loader', false)
                        }
                    }).catch(error => {
                        EventBus.$emit('Loader', false)
                        reject(error)
                    })
            })
        }
    }
}