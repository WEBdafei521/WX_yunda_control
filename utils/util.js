const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const routers = function(urls){
  let that = this
    if (!this.data.hasTap) {
      that.setData({
        hasTap: true
      }, () => {
        wx.navigateTo({
          url: urls,
          success: function () {
            that.setData({
              hasTap: true
            })
          }
        })
      })
    } else {
      return
    }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  routers
}
