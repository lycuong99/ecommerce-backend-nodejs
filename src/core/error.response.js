const { model } = require('mongoose')
const { ReasonPhrase, StatusCode } = require('../constants/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrase.CONFLICT,
        status = StatusCode.CONFLICT
    ) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonPhrase.BAD_REQUEST,
        status = StatusCode.BAD_REQUEST
    ) {
        super(message, status)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
}
