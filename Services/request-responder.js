const { constructResponse } = require('../Services/response');


class RequestResponder {
    static initialize() {
        return (req, res, next) => {
            req.responder = new RequestResponder(req, res)
            next()
        }
    }

    constructor(req, res) {
        this.req = req
        this.res = res
    }

    notFound(msg = 'Not found') {
        this.res.status(404).json(constructResponse(msg, { success: false }))
    }

    created(payload) {
        this.res.status(201).json(constructResponse(payload))
    }

    success(payload, count) {
        if (payload) {
            this.res.status(200).json(constructResponse(payload, { count: parseInt(count) }))
        } else {
            this.notFound()
        }
    }

    unAuthorized(msg = 'unAuthorized') {
        this.res.status(403).json(msg)
    }

    updateResponse([rowsAffected, rows]) {
        if (rowsAffected === 0) {
            this.notFound()
        } else {
            this.success(rows)
        }
    }
}


module.exports = RequestResponder