module.exports = (serviceHandlers) => {
    if (!serviceHandlers.help){
        throw new Error('Help handler required')
    }

    return {
        handle: async (messageBody) => {
            const result = await serviceHandlers.help.handle(messageBody)
            return result
        }
    }
}