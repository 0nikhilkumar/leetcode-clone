const jwt = require('jsonwebtoken');

const generateAccessToken = ({ _id, name, email, role }) => {
    return jwt.sign({ _id, name, email, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (_id) => {
    return jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

module.exports = { generateAccessToken, generateRefreshToken };