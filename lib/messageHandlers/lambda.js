const rfr = require('rfr')
const errorCodes = rfr('lib/errorCodes')
const settings = rfr('lib/settings')

module.exports = function(settingsReader, lambdaHelper){

    function extractCommandName(messageBody){
        return ((messageBody || '').split(' ')[0] || '').toLowerCase()
    }

    function createConfig(){
        return {
            region: settingsReader.read(settings.TARGET_REGION)
        }
    }

    function readStringArgument(messageBody, index, defaultValue=''){
        const commandPieces = messageBody.split(' ')
        return commandPieces[index] || defaultValue
    }

    function readIntArgument(messageBody, index) {
        const argString = readStringArgument(messageBody, index, '0')
        return parseInt(argString)
    }

    async function concurrencyCommand(messageBody){
        const config = createConfig()

        config.functionName = readStringArgument(messageBody, 1)
        if (!config.functionName){
            return errorCodes.INVALID_PARAMETERS
        }

        const concurrency = readIntArgument(messageBody, 2)
        if (concurrency){
            config.concurrency = concurrency
        }

        return await lambdaHelper.updateConcurrency(config)
    }

    async function commandEnv(messageBody){
        const config = createConfig()

        config.functionName = readStringArgument(messageBody, 1)
        if (!config.functionName){
            return errorCodes.INVALID_PARAMETERS
        }

        config.key = readStringArgument(messageBody, 2)
        if (!config.key){
            return errorCodes.INVALID_PARAMETERS
        }

        const commandPieces = messageBody.split(' ')
        if (commandPieces.length < 3){
            return errorCodes.INVALID_PARAMETERS
        }
        const envValuePieces = commandPieces.slice(3)
        config.value = envValuePieces.join(' ')
        if (!config.value){
            return errorCodes.INVALID_PARAMETERS
        }

        return await lambdaHelper.updateEnvironment(config)
    }

    async function commandUpdateFunctionStatus(messageBody, enabled){
        const config = createConfig()
        config.enabled = enabled

        config.functionName = readStringArgument(messageBody, 1)
        if (!config.functionName){
            return errorCodes.INVALID_PARAMETERS
        }

        return await lambdaHelper.updateStatus(config)
    }

    async function commandEnable(messageBody){
        return commandUpdateFunctionStatus(messageBody, true)
    }

    async function commandDisable(messageBody){
        return commandUpdateFunctionStatus(messageBody, false)
    }

    const commands = {
        concurrency: concurrencyCommand,
        env: commandEnv,
        enable: commandEnable,
        disable: commandDisable
    }

    return {
        handle: async (messageBody) => {
            const commandName = extractCommandName(messageBody)

            if (!commands[commandName]){
                return errorCodes.INVALID_PARAMETERS
            }

            return await commands[commandName](messageBody)
        }
    }
}