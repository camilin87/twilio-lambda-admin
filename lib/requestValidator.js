const rfr = require('rfr')
const settings = rfr('lib/settings')

module.exports = function(settingsReader, requestParser, twilioRequestValidator, phoneNumberValidator){
    return {
        isValid: (request) => {
            var body = requestParser.parseBody(request)

            var msgBody = body.Body || ''
            if (!msgBody) {
                console.log('INFO Received empty message')
                return false;
            }

            var url = requestParser.parseUrl(request)
            var twilioSignature = requestParser.parseTwilioSignature(request)
            var twilioAuthToken = settingsReader.read(settings.TWILIO_AUTH_TOKEN)

            var isValidTwilioRequest = twilioRequestValidator.isValid({
                twilioAuthToken: twilioAuthToken,
                twilioSignature: twilioSignature,
                url: url,
                parsedBody: body
            })

            if (!isValidTwilioRequest){
                console.log('WARN Received non valid twilio request')
                return false
            }

            var phoneNumber = body.From
            var isAllowedPhoneNumber = phoneNumberValidator.isAllowed(phoneNumber)

            if (!isAllowedPhoneNumber){
                console.log('WARN Received unauthorized phone number request; phoneNumber:', phoneNumber)
                return false
            }

            console.log('INFO Received Authorized Request; phoneNumber:', phoneNumber, 'msg:', msgBody)
            return true
        }
    }
}