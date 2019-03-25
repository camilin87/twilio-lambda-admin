const rfr = require('rfr')
const requestParser = rfr('lib/requestParser')

describe('requestParser', () => {
    var parser = null

    beforeEach(() => {
        parser = requestParser()
    })

    describe('parseBody', () => {
        it('returns empty object when parsing null', () => {
            expect(parser.parseBody(null)).toEqual({})
            expect(parser.parseBody({})).toEqual({})
            expect(parser.parseBody({ body: null })).toEqual({})
            expect(parser.parseBody({ body: '' })).toEqual({})
        })

        it('decodes an html encoded kvp list', () => {
            var actual = parser.parseBody({
                body: 'ToCity=BIG+PINE+KEY&Body=abc123&From=%2B13053053055&To=%2B17867867866&AccountSid=AAAAAAAAAAAAAAAAAa&ApiVersion=2010-04-01'
            })

            expect(actual).toEqual({
                AccountSid: 'AAAAAAAAAAAAAAAAAa',
                ApiVersion: '2010-04-01',
                Body: 'abc123',
                From: '+13053053055',
                To: '+17867867866',
                ToCity: 'BIG PINE KEY'
            })
        })
    })

    describe('parseUrl', () => {
        it ('returns empty string when request has no context', () => {
            expect(parser.parseUrl({})).toBe('')
        })

        it ('returns empty string when request has no domain', () => {
            expect(parser.parseUrl({
                requestContext: {
                    path: '/dev/v1/method1'
                }
            })).toBe('')
        })

        it ('returns the correct url', () => {
            expect(parser.parseUrl({
                requestContext: {
                    path: '/dev/v1/method1',
                    domainName: 'awsaccountid.useast1.aws.com'
                }
            })).toBe('https://awsaccountid.useast1.aws.com/dev/v1/method1')
        })

        it ('returns the correct url when no path provided', () => {
            expect(parser.parseUrl({
                requestContext: {
                    domainName: 'awsaccountid.useast1.aws.com'
                }
            })).toBe('https://awsaccountid.useast1.aws.com')
        })
    })

    describe('parseTwilioSignature', () => {
        it ('returns empty when no header are passed', () => {
            expect(parser.parseTwilioSignature(null)).toBe('')
            expect(parser.parseTwilioSignature({})).toBe('')
            expect(parser.parseTwilioSignature({ headers: {} })).toBe('')
        })

        it ('parses the twilio signature', () => {
            expect(parser.parseTwilioSignature({
                headers: {
                    'X-Twilio-Signature': 'encoded-string-1'
                }
            })).toBe('encoded-string-1')
        })
    })
})