const twilioClient = require('twilio')

module.exports = function(){
    return {
        isValid: (requestInfo) => {
            return twilioClient.validateRequest(
                requestInfo.twilioAuthToken,
                requestInfo.twilioSignature,
                requestInfo.url,
                requestInfo.parsedBody
            )
        }
    }
}