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

    return {
        handle: async (messageBody) => {
            const handlerName = extractHandlerName(messageBody)
            const handlerMessageBody = extractHandlerMessageBody(handlerName, messageBody)

            const targetHandler = serviceHandlers[handlerName]
            const result = await targetHandler.handle(handlerMessageBody)
            return result
        }
    }
}