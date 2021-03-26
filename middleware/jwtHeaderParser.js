const jwt = require('jsonwebtoken');

/**
 * middleware для парсинга JWT из cookie
 * 
 */
const JwtHeaderParser = (req, res, next) => {
    const accesstoken = req.header('Authorization') || req.body.token || req.query.token;
    if (accesstoken != null) {
        try {
            const decode = jwt.verify(accesstoken, process.env.SECRET);
            req.user = decode.user;
            req.tokenId = decode.tokenId;
        } catch (e) {
            res.set('Authorization', null);
        }
    }
    next();
}
module.exports = () => JwtHeaderParser;