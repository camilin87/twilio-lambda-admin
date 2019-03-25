const rfr = require('rfr')
const handleCommandController = rfr('lib/handleCommandController')

describe('handleCommandController', () => {
    var controller = null
    var messageHandlerMock = null

    var isValidRequest = null
    var seededValidatorResponse = null

    var parseBodyRequest = null
    var seededBody = null

    var handleRequest = null
    var seededMessageHandlerResponse = null

    beforeEach(() => {
        isValidRequest = null
        seededValidatorResponse = null

        parseBodyRequest = null
        seededBody = null

        handleRequest = null
        seededMessageHandlerResponse = null

        const requestValidatorMock = {
            isValid: (request) => {
                isValidRequest = request
                return seededValidatorResponse
            }
        }

        const requestParserMock = {
            parseBody: (request) => {
                parseBodyRequest = request
                return seededBody
            }
        }

        messageHandlerMock = {
            handle: async(messageBody) => {
                handleRequest = messageBody
                return seededMessageHandlerResponse
            }
        }

        controller = handleCommandController(
            requestValidatorMock,
            requestParserMock,
            messageHandlerMock
        )
    })

    it ('returns 200 when the request is handled', async () => {
        var input = { field1: 'value1' }
        seededValidatorResponse = true
        seededMessageHandlerResponse = 'success'
        seededBody = {
            Body: 'sample message request'
        }

        var actual = await controller.process(input)

        expect(actual).toEqual({
            statusCode: 200,
            body: 'success',
            headers: {
                'Content-type': 'text/plain'
            }
        })
        expect(parseBodyRequest).toBe(input)
        expect(isValidRequest).toBe(input)
        expect(handleRequest).toBe('sample message request')
    })

    it ('returns 400 when request is invalid', async () => {
        seededValidatorResponse = false

        var actual = await controller.process({ field1: 'value1' })

        expect(actual).toEqual({
            statusCode: 400,
            body: '',
            headers: {
                'Content-type': 'text/plain'
            }
        })
    })

    it ('returns 500 on unexpected errors', async () => {
        seededValidatorResponse = true
        messageHandlerMock.handle = async (_) => {
            throw new Error('seeded error');
        }

        var actual = await controller.process({ field1: 'value1' })

        expect(actual).toEqual({
            statusCode: 500,
            body: 'Unexpected error',
            headers: {
                'Content-type': 'text/plain'
            }
        })
    })
})