export const coupons = {
  state: {
    couponList: []
  },
  getters: {
    getCouponData: (state) => {
      return state.couponList
    }
  },
  mutations: {
    setCouponList: (state, val) => {
      state.couponList = val
    }
  },
  actions: {
    listCouponList (context, data) {
      let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      }
      return new Promise((resolve, reject) => {
        fetch(`${context.getters.getbaseUrl}/coupon?couponid=${data.couponid}&couponstatus=${data.couponstatus}&country=${data.country}&duration=${data.duration}&pagesize=${data.pagesize}&page=${data.page}&fromdate=${data.fromdate}&todate=${data.todate}`, requestOptions)
          .then((response) => {
            if (response.ok) {
              resolve(response.json())
            } else {
              resolve(response.json())
            }
          }).catch(error => {
            reject(error)
          })
      })
    },
    createCouponList (context, data) {
      console.log(data)
      let myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')
      return new Promise((resolve, reject) => {
        fetch(`${context.getters.getbaseUrl}/coupon`, {
          method: 'POST',
          headers: myHeaders,
          body: data,
          redirect: 'follow'
        })
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
    },
    getCouponList (context, id) {
      console.log(id)
      return new Promise((resolve, reject) => {
        fetch(`${context.getters.getbaseUrl}/coupon/${id}`)
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
