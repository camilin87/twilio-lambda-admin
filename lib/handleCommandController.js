module.exports = function(requestValidator, requestParser, messageHandler){
    return {
        process: async (request) => {
            try{
                var isValidRequest = requestValidator.isValid(request)

                if (!isValidRequest){
                    return { statusCode: 400, body: '' }
                }

                var body = requestParser.parseBody(request) || {}
                var commandText = body.Body || ''

                var response = await messageHandler.handle(body.Body)

                return { statusCode: 200, body: response }
            }
            catch(e){
                console.log('ERROR HandlerCommandController; Unexpected Error; error:', e)
                return { statusCode: 500, body: 'Unexpected error' }
            }
        }
    }
}