import { EventBus } from '@/event'

export const dashboard = {
    state: {
        baseUrl: 'https://infinitheismtestadmin.mobiotics.com/admin/v1'
    },
    actions: {
        getDashbaordAPI(context, value) {
            EventBus.$emit('Loader', true)
            return new Promise(function(resolve, reject) {
                fetch(`${context.state.baseUrl}/subscription`)
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