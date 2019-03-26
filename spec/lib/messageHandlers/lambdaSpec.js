const rfr = require('rfr')
const lambdaHandler = rfr('lib/messageHandlers/lambda')
const errorCodes = rfr('lib/errorCodes')
const settings = rfr('lib/settings')

describe('lambda', function(){
    var handler = null
    var settingsReaderMock = null
    var lambdaHelperMock = null

    beforeEach(function(){
        settingsReaderMock = {
            read: function(settingName){
                if (settingName === settings.TARGET_REGION){
                    return 'my-region-1'
                }

                return `Read Setting ${settingName}`
            }
        }
        lambdaHelperMock = {
            updateEnvironment: async (config) => {
                config.zType='updateEnvironment'
                return JSON.stringify(config)
            },
            updateStatus: async (config) => {
                config.zType='updateStatus'
                return JSON.stringify(config)
            },
            updateConcurrency: async (config) => {
                config.zType='updateConcurrency'
                return JSON.stringify(config)
            }
        }
        handler = lambdaHandler(settingsReaderMock, lambdaHelperMock)
    })

    it ('returns INVALID_PARAMETERS on unrecognized command', async function(){
        expect(await handler.handle('grow magically'))
            .toEqual(errorCodes.INVALID_PARAMETERS)
    })

    describe('concurrency', function(){
        it ('returns INVALID_PARAMETERS when no function is specified', async function(){
            expect(await handler.handle('concurrency'))
                .toEqual(errorCodes.INVALID_PARAMETERS)
        })

        it ('disables the concurrency limit of the specified function', async function(){
            expect(await handler.handle('concurrency function1'))
                .toEqual('{"region":"my-region-1","functionName":"function1","zType":"updateConcurrency"}')
        })

        it ('configures the concurrency limit of the specified function', async function(){
            expect(await handler.handle('concurrency function1 25'))
                .toEqual('{"region":"my-region-1","functionName":"function1","concurrency":25,"zType":"updateConcurrency"}')
        })
    })

    describe('env', function(){
        it ('returns INVALID_PARAMETERS when no function is specified', async function(){
            expect(await handler.handle('env'))
                .toEqual(errorCodes.INVALID_PARAMETERS)
        })

        it ('returns INVALID_PARAMETERS when no key is specified', async function(){
            expect(await handler.handle('env function1'))
                .toEqual(errorCodes.INVALID_PARAMETERS)
        })

        it ('returns INVALID_PARAMETERS when no value is specified', async function(){
            expect(await handler.handle('env function1 RUN_FAST'))
                .toEqual(errorCodes.INVALID_PARAMETERS)
        })

        it ('configures the environment value', async function(){
            expect(await handler.handle('env function1 RUN_FAST true'))
                .toEqual('{"region":"my-region-1","functionName":"function1","key":"RUN_FAST","value":"true","zType":"updateEnvironment"}')
        })

        it ('configures environment values with spaces', async function(){
            expect(await handler.handle('env function1 RUN_FAST true or maybe not'))
                .toEqual('{"region":"my-region-1","functionName":"function1","key":"RUN_FAST","value":"true or maybe not","zType":"updateEnvironment"}')
        })
    })

    describe('enable', function(){
        it ('returns INVALID_PARAMETERS when no function is specified', async function(){
            expect(await handler.handle('enable'))
                .toEqual(errorCodes.INVALID_PARAMETERS)
        })

        it ('enables the function', async function(){
            expect(await handler.handle('enable function1'))
                .toEqual('{"region":"my-region-1","enabled":true,"functionName":"function1","zType":"updateStatus"}')
        })
    })

    describe('disable', function(){
        it ('returns INVALID_PARAMETERS when no function is specified', async function(){
            expect(await handler.handle('disable'))
                .toEqual(errorCodes.INVALID_PARAMETERS)
        })

        it ('enables the function', async function(){
            expect(await handler.handle('disable function1'))
                .toEqual('{"region":"my-region-1","enabled":false,"functionName":"function1","zType":"updateStatus"}')
        })
    })
})