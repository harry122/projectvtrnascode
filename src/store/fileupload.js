export const fileupload = {
  state: {
    fileList: []
  },
  getters: {
    getFileData: (state) => {
      return state.fileList
    }
  },
  mutations: {
    setFileList: (state, val) => {
      state.fileList = val
    }
  },
  actions: {
    listFileList (context, fileInput) {
      let formdata = new FormData()
      formdata.append('filename', fileInput, fileInput.name)
      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
      }
      return new Promise((resolve, reject) => {
        fetch(`${context.getters.getuploadUrl}/upload`, requestOptions)
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
    }
  }
}
