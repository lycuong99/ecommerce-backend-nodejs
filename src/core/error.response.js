const { model } = require('mongoose')
const { ReasonPhrases, StatusCode } = require('../constants/httpStatusCode')
const reasonPhrase = require('../constants/reasonPhrase')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.CONFLICT,
        status = StatusCode.CONFLICT
    ) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrases.BAD_REQUEST,
        status = StatusCode.BAD_REQUEST
    ) {
        super(message, status)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
}
