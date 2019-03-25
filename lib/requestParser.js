const { parse } = require('querystring')

module.exports = function(){
    return {
        parseBody: (request) => {
            request = request || {}

            var bodyString = request.body || ''
            return parse(bodyString)
        },
        parseUrl: (request) => {
            request = request || {}

            var context = request.requestContext || {}
            context.domainName = context.domainName || ''
            context.path = context.path || ''

            if (!context.domainName){
                return ''
            }

            return `https://${context.domainName}${context.path}`
        },
        parseTwilioSignature: (request) => {
            request = request || {}

            var headers = request.headers || {}

            return headers['X-Twilio-Signature'] || ''
        }
    }
}