/*
Usage: npm start "LAMBDA ENABLE function1"
*/

const rfr = require('rfr')
const lambdaHelper = require('aws-automation-utils').lambda
const settingsReader = rfr('lib/settingsReader')
const messageHandler = rfr('lib/messageHandler')
const messageHandlerHelp = rfr('lib/messageHandlers/help')
const messageHandlerLambda = rfr('lib/messageHandlers/lambda')

const main = async function(){
    try{
        const args = process.argv
        console.log('ARGS', args)

        process.env.TARGET_REGION = 'us-east-2'

        const handler = messageHandler({
            help: messageHandlerHelp(),
            lambda: messageHandlerLambda(settingsReader(), lambdaHelper)
        })

        const messageBody = args[2]
        console.log('Running Command:', messageBody)

        const result = await handler.handle(messageBody)

        console.log('Ending; result: ', result);
        process.exit(0)
    } catch(err){
        console.log('ERROR', err);
        process.exit(1)
    }
}

main()
