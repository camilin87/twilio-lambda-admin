module.exports = function(){
    return {
      read: function(settingName) {
        return process.env[settingName] || ''
      }
    }
}