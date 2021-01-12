export const mVMixin = {
  methods: {
    formatDate (timeStr) {
      let temp = new Date(timeStr)
      let newFormat = ''
      if (temp instanceof Date && !isNaN(temp)) {
        let monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        let date = temp.getDate()
        let month = monthNames[temp.getMonth()]
        let year = temp.getFullYear()
        if (date < 10) {
          date = '0' + '' + date
        }
        newFormat = date + '-' + month + '-' + year
      } else {
        temp = timeStr.split(/(\s+)/)[0].split('-').reverse()
        let month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        temp[1] = month[parseInt(temp[1]) - 1]
        newFormat = temp.join('-')
        if (newFormat.charAt(0) === '0') {
          newFormat = newFormat.slice(1)
        }
      }
      return newFormat
    },
    formatTime (timeStr) {
      let temp = new Date(timeStr)
      let timeFormat = ''
      if (temp instanceof Date && !isNaN(temp)) {
        let temp1 = ''
        if (timeStr.split(' ')[1]) {
          temp1 = timeStr.split(' ')[1]
        } else if (timeStr.split('T')[1]) {
          temp1 = timeStr.split('T')[1]
          temp1 = temp1.split('.')[0]
        }
        timeFormat = temp1
      } else {
        let temp1 = ''
        if (timeStr.split(/(\s+)/)[2]) {
          temp1 = timeStr.split(/(\s+)/)[2]
        }
        timeFormat = temp1
      }
      return timeFormat
    },
    apiDateFormat (timeStr) {
      let temp = new Date(timeStr)
      let newFormat = ''
      if (temp instanceof Date && !isNaN(temp)) {
        let date = temp.getDate()
        let month = temp.getMonth() + 1
        let year = temp.getFullYear()
        if (date < 10) {
          date = '0' + '' + date
        }
        if (month < 10) {
          month = '0' + '' + month
        }
        newFormat = year + '-' + month + '-' + date
      }
      return newFormat
    },
    convertDate (val) {
      if (val) {
        var event = new Date(val)
        let date = JSON.stringify(event)
        date = date.slice(1, 11)
        return date
      } else {
        return ''
      }
    },
    actMakeObjectToParams (obj) {
      var str = "";
      for (var key in obj) {
          if (str != "") {
              str += "&";
          }
          str += key + "=" + obj[key];
      }
      return str;
    },
    actMakeSizeConversion (arr) {

     return arr.map((item) => {
        if (item.size)
          item.size = (parseInt(item.size) / (1024 * 1024)).toFixed(2);
           item.size = item.size + ' ' + 'MB'
          if (item.size > 1024) {
            item.size = item.size + ' ' + 'GB'
          }
          return item; 
      })

    }
  }
}
