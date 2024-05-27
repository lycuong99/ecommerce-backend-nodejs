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

class AuthFailError extends ErrorResponse {
    constructor(
        message = ReasonPhrase.UNAUTHORIZED,
        status = StatusCode.UNAUTHORIZED
    ) {
        super(message, status)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(
        message = ReasonPhrase.NOT_FOUND,
        status = StatusCode.NOT_FOUND
    ) {
        super(message, status)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailError,
    NotFoundError
}
