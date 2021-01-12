export const profiles = {
  state: {
    profileList: []
  },
  getters: {
    getProfileData: (state) => {
      return state.profileList
    }
  },
  mutations: {
    setProfileList: (state, val) => {
      state.profileList = val
    }
  },
  actions: {
    listProfileList (context, data) {
      let myHeaders = new Headers()
      let logininfo = localStorage.getItem('token') ? localStorage.getItem('token') : ''
      myHeaders.append('Authorization', `Bearer ${logininfo}`)
      let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      }
      return new Promise((resolve, reject) => {
        fetch(`${context.getters.getbaseUrl}provider/v1/transcodeprofile.php?profiletype=${data.profiletype}&profilestatus=${data.profilestatus}&profileid=${data.profileid}&pagesize=${data.pagesize}&page=${data.page}`, requestOptions)
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
    addProfileList (context, data) {
      let myHeaders = new Headers()
      let logininfo = localStorage.getItem('token') ? localStorage.getItem('token') : ''
      myHeaders.append('Authorization', `Bearer ${logininfo}`)
      let formdata = new FormData()
      formdata.append('profileid', data.profileid)
      if (data.profiletype) {
        formdata.append("profiletype", data.profiletype)
      }
      formdata.append('encoding', JSON.stringify(data.encoding))
      if (data.watermarkdetails) {
        formdata.append('watermarkdetails', JSON.stringify(data.watermarkdetails))
      }
      if (data.trailerdetails) {
        formdata.append('trailerdetails', JSON.stringify(data.trailerdetails))
      }
      if (data.posterdetails) {
        formdata.append('posterdetails', JSON.stringify(data.posterdetails))
      }
      return new Promise((resolve, reject) => {
        fetch(`${context.getters.getbaseUrl}provider/v1/transcodeprofile.php`, {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
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
    updateProfileList (context, data) {
      let myHeaders = new Headers()
      let logininfo = localStorage.getItem('token') ? localStorage.getItem('token') : ''
      myHeaders.append('Authorization', `Bearer ${logininfo}`)
      myHeaders.append('Content-Type', 'application/json')
      let raw = JSON.stringify(data.bodyData)
      console.log(raw)
      return new Promise((resolve, reject) => {
        fetch(`${context.getters.getbaseUrl}provider/v1/transcodeprofile.php/${data.id}`, {
          method: 'PUT',
          headers: myHeaders,
          body: raw,
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
    }
  }
}
