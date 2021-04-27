const jwt = require('jsonwebtoken');

/**
 * middleware для парсинга JWT из cookie
 * 
 */
const JwtHeaderParser = (req, res, next) => {
    const accessToken = req.header('Authorization');
    console.log('hi aUTH')
    if (accessToken != null) {
        try {
            const decode = jwt.verify(accessToken, process.env.SECRET);
            req.user = decode.user;
        } catch (e) {
            res.set('Authorization', null);
        }
        console.log('authorization RESULTS: '+decode);
    }
    next();
}
module.exports = () => JwtHeaderParser;