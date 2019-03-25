function httpResponse(statusCode, body){
    return {
        statusCode: statusCode,
        body: body,
        headers: {
            'Content-type': 'text/plain'
        }
    }
}

module.exports = function(requestValidator, requestParser, messageHandler){
    return {
        process: async (request) => {
            try{
                var isValidRequest = requestValidator.isValid(request)

                if (!isValidRequest){
                    return httpResponse(400, '')
                }

                var body = requestParser.parseBody(request) || {}
                var commandText = body.Body || ''

                var response = await messageHandler.handle(body.Body)

                return httpResponse(200, response)
            }
            catch(e){
                console.log('ERROR HandlerCommandController; Unexpected Error; error:', e)
                return httpResponse(500, 'Unexpected error')
            }
        }
    }
}