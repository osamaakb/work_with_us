

class Response {

    static constructResponse(payload, success = true) {

        delete payload.password
        if(!success){
            return {
                success,
                message: payload
            }
        }
        return {
            success,
            payload
        }
    }
}

module.exports = Response