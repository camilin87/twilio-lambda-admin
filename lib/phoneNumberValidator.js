const rfr = require('rfr')
const settings = rfr('lib/settings')

module.exports = function(settingsReader) {
    return {
        isAllowed: (phoneNumber) => {
            phoneNumber = phoneNumber || ''

            if (!phoneNumber){
                return false
            }

            for (var i = 0; i < 100; i++){
                var settingName = `${settings.ALLOWED_PHONE_PREFIX}${i}`
                var settingValue = settingsReader.read(settingName)

                if (!settingValue){
                    return false;
                }

                if (settingValue === phoneNumber){
                    return true;
                }
            }

            return false
        }
    }
}