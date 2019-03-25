const rfr = require('rfr')
const handleCommandControllerFn = rfr('lib/handleCommandController')
const requestValidatorFn = rfr('lib/requestValidator')
const requestParserFn = rfr('lib/requestParser')
const messageHandlerFn = rfr('lib/messageHandler')
const messageHandlerHelpFn = rfr('lib/messageHandlers/help') 
const messageHandlerLambdaFn = rfr('lib/messageHandlers/lambda')
const settingsReaderFn = rfr('lib/settingsReader')
const twilioRequestValidatorFn = rfr('lib/twilioRequestValidator')
const phoneNumberValidatorFn = rfr('lib/phoneNumberValidator')
const lambdaHelper = require('aws-automation-utils').lambda

function createController(){
    const requestParser = requestParserFn()
    const settingsReader = settingsReaderFn()
    const twilioRequestValidator = twilioRequestValidatorFn()
    const phoneNumberValidator = phoneNumberValidatorFn(settingsReader)

    const requestValidator = requestValidatorFn(
        settingsReader, requestParser, twilioRequestValidator, phoneNumberValidator
    )

    const messageHandler = messageHandlerFn({
        help: messageHandlerHelpFn(),
        lambda: messageHandlerLambdaFn(settingsReader, lambdaHelper)
    })
    return handleCommandControllerFn(
        requestValidator, requestParser, messageHandler
    )
}

module.exports.process = async (request) => {
    console.log('DEBUG HandlerCommand; request:', request)
    const controller = createController()

    var result = await controller.process(request)

    console.log('INFO HandlerCommand; result:', result)

    return result;
}