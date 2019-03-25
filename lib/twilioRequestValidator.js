const twilioClient = require('twilio')

module.exports = function(){
    return {
        isValid: (requestInfo) => {
            return client.validateRequest(
                requestInfo.twilioAuthToken,
                requestInfo.twilioSignature,
                requestInfo.url,
                requestInfo.parsedBody
            )
        }
    }
}