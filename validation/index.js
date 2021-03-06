const {constructResponse} = require('../Services/response')
const validate = (schema, from = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[from]);
        const valid = !error;

        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            res.status(422).json(constructResponse(message, { success: false }))
        }
    }
}
module.exports = validate;