const jwt = require('jsonwebtoken');
const config = require('./config.json');

const secretKey = config.jwt['secret-key'];
const expiresIn = config.jwt['expires-in'];

function generateToken(identity, application, version, tag) {
    const token = jwt.sign({
        identity: identity,
        application: application,
        version: version,
        tag: tag
    }, secretKey, { expiresIn: expiresIn });
    return token;
}

module.exports = {
    generateToken
}