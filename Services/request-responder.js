// class RequestResponder {
//     static initialize() {
//         return (req, res, next) => {
//             req.responder = new RequestResponder(req, res)
//             next()
//         }
//     }

//     constructor(req, res) {
//         this.req = req
//         this.res = res
//     }

//     notFound(msg = 'Not found') {
//         this.res.status(404).json(constructResponse(msg, { success: false }))
//     }

//     success(payload) {
//         this.res.status(200).json(constructResponse(payload, { success: true }))
//     }

//     updateResponse([rowsAffected, rows]) {
//         if (rowsAffected === 0) {
//             this.notFound()
//         } else {
//             this.success(rows)
//         }
//     }
// }