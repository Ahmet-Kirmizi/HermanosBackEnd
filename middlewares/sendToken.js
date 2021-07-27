
const sendToken = (req, res, next) => {
        const authHeader = req.headers.authorization;
        const bearerHeader = authHeader.split(' ')[1];
        req.body.bearerHeader = bearerHeader;
    next()
}


module.exports = {token : sendToken}