const rfr = require('rfr')
const requestValidator = rfr('lib/requestValidator')

describe('requestValidator', () => {
    var validator = null

    var parseBodyRequest = null
    var seededParseBody = null

    var parseUrlRequest = null
    var seededParseUrl = null

    var parseTwilioSignatureRequest = null
    var seededParseTwilioSignature = null

    var isValidRequestInfo = null
    var seededIsValid = null

    beforeEach(() => {
        seededParseBody = null
        parseBodyRequest = null

        parseUrlRequest = null
        seededParseUrl = null

        parseTwilioSignatureRequest = null
        seededParseTwilioSignature = null

        isValidRequestInfo = null
        seededIsValid = null

        var settingsReaderMock = {
            read: (name) => `${name}=valueENV`
        }

        var requestParserMock = {
            parseBody: (request) => {
                parseBodyRequest = request
                return seededParseBody
            },
            parseUrl: (request) => {
                parseUrlRequest = request
                return seededParseUrl
            },
            parseTwilioSignature: (request) => {
                parseTwilioSignatureRequest = request
                return seededParseTwilioSignature
            },
        }

        var twilioRequestValidatorMock = {
            isValid: (requestInfo) => {
                isValidRequestInfo = requestInfo
                return seededIsValid
            }
        }

        var phoneNumberValidatorMock = {
            isAllowed: (phoneNumber) => {
                return phoneNumber === '+15555555555'
            }
        }

        validator = requestValidator(
            settingsReaderMock,
            requestParserMock,
            twilioRequestValidatorMock,
            phoneNumberValidatorMock
        )
    })

    it ('returns true when the phone number is allowed and the twilio validator allows the request', function(){
        var input = { field1: 'value1' }
        seededIsValid = true
        seededParseBody = { To: 'pepe', From: '+15555555555', Body: 'test' }
        seededParseUrl = 'mydomain.com'
        seededParseTwilioSignature = 'supersecret'

        var actual = validator.isValid(input)

        expect(actual).toBe(true)
        expect(parseBodyRequest).toBe(input)
        expect(parseUrlRequest).toBe(input)
        expect(parseTwilioSignatureRequest).toBe(input)
        expect(isValidRequestInfo).toEqual({
            twilioAuthToken: 'TWILIO_AUTH_TOKEN=valueENV',
            twilioSignature: 'supersecret',
            url: 'mydomain.com',
            parsedBody: { To: 'pepe', From: '+15555555555', Body: 'test' }
        })
    })

    it ('returns false when the twilio request is not valid', function(){
        var input = { field1: 'value1' }
        seededIsValid = false
        seededParseBody = { To: 'pepe', From: '+15555555555', Body: 'test' }

        var actual = validator.isValid(input)

        expect(actual).toBe(false)
    })

    it ('returns false the phone number is not allowed', function(){
        var input = { field1: 'value1' }
        seededIsValid = true
        seededParseBody = { To: 'pepe', From: '+13053053055', Body: 'test' }

        var actual = validator.isValid(input)

        expect(actual).toBe(false)
    })

    it ('returns false the message body is empty', function(){
        var input = { field1: 'value1' }
        seededIsValid = true
        seededParseBody = { To: 'pepe', From: '+15555555555', Body: '' }

        var actual = validator.isValid(input)

        expect(actual).toBe(false)
    })
})
