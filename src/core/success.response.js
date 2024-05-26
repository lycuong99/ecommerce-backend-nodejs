const { StatusCode, ReasonPhrase } = require('../constants/httpStatusCode')

class SuccessResponse {
    constructor({
        message,
        metadata = {},
        reasonStatusCode = ReasonPhrase.OK,
        statusCode = StatusCode.OK,
    }) {
        this.message = message ?? reasonStatusCode
        this.metadata = metadata
        this.statusCode = statusCode
    }

    send(res, header = {}) {
        return res.status(this.statusCode).json(this)
    }
}

class Ok extends SuccessResponse {
    constructor({message, metadata}) {
        super({
            message,
            metadata,
        })
    }
}

class Created extends SuccessResponse {
    constructor({message, metadata}) {
        super({
            message,
            metadata,
            statusCode: StatusCode.CREATED,
            reasonStatusCode: ReasonPhrase.CREATED,
        })
    }
}

module.exports = {
  Ok,
  Created,
  SuccessResponse
}