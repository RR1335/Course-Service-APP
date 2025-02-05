/**
 * 400 错误
 */
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
    }
}

/**
 * 401 错误
 */
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

/**
 * 404 错误
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}


module.exports = {
    BadRequestError,
    UnauthorizedError,
    NotFoundError
}
