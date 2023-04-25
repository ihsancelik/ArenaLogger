const jwt = require('jsonwebtoken');
const config = require('./config.json');
const privateKey = config.jwt['secret-key'];

const jwtAuth = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error: invalid token'))
        }
        socket.decoded = decoded;
        next();
    });
};

module.exports = jwtAuth;