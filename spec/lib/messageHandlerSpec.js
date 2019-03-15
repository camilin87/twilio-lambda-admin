const rfr = require('rfr')
const messageHandler = rfr('lib/messageHandler')

describe('messageHandler', function(){
    var handler = null
    var settingsReaderMock = null
    var lambdaMock = null

    beforeEach(function() {
        handler = messageHandler(settingsReaderMock, lambdaMock)
    })

    it('returns false by default', async function(){
        const result = await handler.handle('blah')
        expect(result).toBe(false);
    })
})