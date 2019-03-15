const rfr = require('rfr')
const messageHandler = rfr('lib/messageHandler')

describe('messageHandler', function(){
    var handler = null
    var serviceHandlers = null

    beforeEach(function() {
        serviceHandlers = {
            help: {
                handle: async (messageBody) => {
                    return `HELP ${messageBody}`
                }
            }
        }
        handler = messageHandler(serviceHandlers)
    })

    it ('fails when no help handler is configured', function() {
        expect(() => { messageHandler({})     }).toThrow(new Error('Help handler required'))
    })

    describe('when no handlers are configured', function(){
        it('sends messages to the help handler by default', async function() {
            expect(await handler.handle('blah'))
                .toEqual('HELP blah')
        })

        it('sends empty messages to the help handler', async function() {
            expect(await handler.handle(''))
                .toEqual('HELP ')
        })
    })

    describe('when handlers are configured', function() {
        beforeEach(function(){
            serviceHandlers.lambda = {
                handle: async (messageBody) => {
                    return `handleLambda ${messageBody}`
                }
            }

            serviceHandlers.rds = {
                handle: async (messageBody) => {
                    return `handleRds ${messageBody}`
                }
            }
        })

        it('sends messages to the help handler by default', async function() {
            expect(await handler.handle('blah'))
                .toEqual('HELP blah')
        })

        it('sends help message to the help handler by default', async function() {
            expect(await handler.handle('help whatever'))
                .toEqual('HELP help whatever')
        })

        it('sends gibberish help handler', async function() {
            expect(await handler.handle('lambdablah test'))
                .toEqual('HELP lambdablah test')
        })

        it('sends empty message to the specified lambda', async function(){
            expect(await handler.handle('lambda'))
                .toEqual('handleLambda ')
        })

        it('sends message to the specified lambda', async function(){
            expect(await handler.handle('lambda test1'))
                .toEqual('handleLambda test1')
        })

        it('message handler names are case insensitive', async function(){
            expect(await handler.handle('RDS this is A Sample'))
                .toEqual('handleRds this is A Sample')
        })
    })
})