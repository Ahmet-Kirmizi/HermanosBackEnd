const jwt = require('jsonwebtoken')
require('dotenv').config()


// authentication for token
const tokenAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const bearerHeader = authHeader.split(' ')[1];
    if (authHeader) {
        jwt.verify(bearerHeader, process.env.TOKEN_SECRET, (err, signInTokenData) => {
            if (err) {
                console.log(err)
                return res.status(403).json()
            }
            req.body.bearerHeader = bearerHeader;
            req.body.signInTokenData = signInTokenData;
            next();
        });

    } else {
        return res.sendStatus(401);

    }
}


module.exports = { tokenAuthenticator: tokenAuth }
