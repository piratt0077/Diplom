const jwt = require('jsonwebtoken');

/**
 * middleware для парсинга JWT из cookie
 * 
 */
const JwtHeaderParser = async (req, res, next) => {
    const accessToken = req.header('Authorization');
    //console.log('hi aUTH '+accessToken)
    if (accessToken != null) {
        try {
            var decode = jwt.verify(accessToken, process.env.SECRET);
            req.user = decode;
            console.log("AUTHORIZED");
        } catch (e) {
            res.set('Authorization', null);
            console.log("unAUTHORIZED");
        }
    }
    next();
}
module.exports = () => JwtHeaderParser;