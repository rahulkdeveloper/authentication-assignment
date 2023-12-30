const bcrypt = require('bcryptjs');


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
}

module.exports = { hashPassword, comparePassword }
