
const defaultOptions = {
    pageInfo: null,
    success: true
}

class Response {
    
    static constructResponse(payload, options = {}) {
        const success = options.success !== undefined ? options.success : defaultOptions.success
        let pageInfo = options.pageInfo || defaultOptions.pageInfo
        console.log(success)
        if (!pageInfo) {
            const count = options.count
            if (Array.isArray(payload) && count) {
                pageInfo = Response.constructPageInfo(payload, count)
            }
        }
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

    static constructPageInfo(list, count) {
        let pageInfo = {}
        if (list.length > 0) {
            pageInfo = {
                next: list[list.length - 1].id,
                previous: list[0].id,
                totalCount: count
            }
        } else {
            pageInfo = {
                totalCount: count
            }
        }

        return pageInfo
    }


}

module.exports = Response