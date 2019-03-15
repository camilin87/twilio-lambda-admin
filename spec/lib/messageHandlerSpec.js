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
        expect(() => { messageHandler({}) }).toThrow(new Error('Help handler required'))
    })

    it('sends messages to the help handle by default', async function(){
        const result = await handler.handle('blah')
        expect(result).toBe('HELP blah');
    })
})