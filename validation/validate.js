const ExpressError = require('../utils/ExpressError');

const validateSchema = (schema) => {
    return (req, res, next) => {
        const {error} = schema.validate(req.body);
        if(error) {
            console.log(error);
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    }
}

module.exports = validateSchema;