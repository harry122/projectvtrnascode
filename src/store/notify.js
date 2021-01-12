export const notify = {
  state: {
    notifyList: []
  },
  getters: {
    getNotifyData: (state) => {
      return state.notifyList
    }
  },
  mutations: {
    setNotifyList: (state, val) => {
      state.notifyList = val
    }
  },
  actions: {
    listNotifyList (context, data) {
      return new Promise((resolve, reject) => {
        fetch(`${context.getters.getbaseUrl}/notify?title=${data.title}&channel=${data.channel}&channeltype=${data.channeltype}&mode=${data.mode}&notifystatus=${data.notifystatus}&pagesize=${data.pagesize}&page=${data.page}&fromdate=${data.fromdate}&todate=${data.todate}`)
          .then((response) => {
            if (response.ok) {
              resolve(response.json())
            } else {
              reject(response)
            }
          }).catch(error => {
            reject(error)
          })
      })
    }
  }
}
