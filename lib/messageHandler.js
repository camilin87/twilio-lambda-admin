const rfr = require('rfr')
const errorCodes = rfr('lib/errorCodes')

module.exports = (serviceHandlers) => {
    const DEFAULT_HANDLER_NAME = 'help'

    if (!serviceHandlers[DEFAULT_HANDLER_NAME]){
        throw new Error('Help handler required')
    }

    function extractHandlerName(messageBody){
        const result = ((messageBody || '').split(' ')[0] || '').toLowerCase()

        if (!result){
            return DEFAULT_HANDLER_NAME
        }

        if (!serviceHandlers[result]){
            return DEFAULT_HANDLER_NAME
        }

        return result
    }

    function extractHandlerMessageBody(handlerName, messageBody){
        if (handlerName === DEFAULT_HANDLER_NAME){
            return messageBody
        }

        return messageBody.substring(handlerName.length + 1)
    }

    async function routeMessage(handlerName, messageBody){
        return await serviceHandlers[handlerName].handle(messageBody)
    }

    return {
        handle: async (messageBody) => {
            try{
                const handlerName = extractHandlerName(messageBody)
                const handlerMessageBody = extractHandlerMessageBody(handlerName, messageBody)

                const result = await routeMessage(handlerName, handlerMessageBody)

                if (result === errorCodes.INVALID_PARAMETERS){
                    const helpResult = await routeMessage(DEFAULT_HANDLER_NAME, '')
                    return helpResult
                }

                console.log(`INFO Message Handler Completed; input: ${messageBody}; result: ${result}`)
                return result
            } catch(e) {
                console.log(`ERROR Unexpected handler problem; input: ${messageBody}; error:`, e)
                return `ERROR ${e.message}`
            }
        }
    }
}