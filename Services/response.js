

class Response {

    static constructResponse(payload, success = true) {

        if(!success){
            return {
                success,
                message: payload
            }
        }
        delete payload.password
        return {
            success,
            payload
        }
    }
}

module.exports = Response