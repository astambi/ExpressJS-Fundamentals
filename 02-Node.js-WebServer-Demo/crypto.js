const crypto = require('crypto');

const salt = generateSalt();
const password = 'test123';
const hash = generateHash(salt, password);

console.log(hash);

function generateSalt() {
    return crypto.randomBytes(128).toString('base64');
}

function generateHash(salt, password) {
    return crypto
        .createHmac('sha256', salt)
        .update(password)
        .digest('hex');
}
