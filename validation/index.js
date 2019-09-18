const {constructResponse} = require('../Services/response')
const validate = (schema, from = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[from]);
        const valid = error == null;

        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');

            console.log("error", message);
            res.status(422).json(constructResponse(message, false))
        }
    }
}
module.exports = validate;