
const defaultOptions = {
    pageInfo: null,
    success: true
}

class Response {
    static constructResponse(payload, options) {
        const success = options.success || defaultOptions.success
        const pageInfo = options.pageInfo || defaultOptions.pageInfo
        const response = { success }
        if (!success) {
            response.message = payload
        } else {
            delete payload.password
            response.payload = payload
            if (pageInfo) {
                response.pageInfo = pageInfo
            }
        }

        return response
    }
}

module.exports = Response