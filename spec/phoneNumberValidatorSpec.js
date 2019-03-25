const rfr = require('rfr')
const phoneNumberValidator = rfr('lib/phoneNumberValidator')

describe('phoneNumberValidator', () => {
    var validator = null

    beforeEach(function(){
        const seededSettings = {
            'PHONE_0': '3053053055',
            'PHONE_1': '7867867866',
            'PHONE_2': '7877877877',
            'PHONE_3': '8000003333'
        }

        var settingsReaderMock = {
            read: (name) => {
                return seededSettings[name]
            }
        }

        validator = phoneNumberValidator(settingsReaderMock)
    })

    it ('numbers that are not on the environment are not allowed', () => {
        expect(validator.isAllowed(null)).toBe(false)
        expect(validator.isAllowed('')).toBe(false)
        expect(validator.isAllowed('555')).toBe(false)
        expect(validator.isAllowed('5555555555')).toBe(false)
    })

    it ('allows numbers that are on the environment', () => {
        expect(validator.isAllowed('3053053055')).toBe(true)
        expect(validator.isAllowed('7867867866')).toBe(true)
        expect(validator.isAllowed('7877877877')).toBe(true)
        expect(validator.isAllowed('8000003333')).toBe(true)
    })
})