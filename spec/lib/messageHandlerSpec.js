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
                .toBe('HELP blah')
        })

        it('sends empty messages to the help handler', async function() {
            expect(await handler.handle(''))
                .toBe('HELP ')
        })
    })

    describe('when handlers are configured', function() {
        beforeEach(function(){
            serviceHandlers.lambda = {
                handle: async (messageBody) => {
                    return `handledLambda ${messageBody}`
                }
            }

            serviceHandlers.rds = {
                handle: async (messageBody) => {
                    return `handledRds ${messageBody}`
                }
            }
        })

        it('sends messages to the help handle by default', async function() {
            expect(await handler.handle('blah'))
                .toBe('HELP blah')
        })

        })
    })
})