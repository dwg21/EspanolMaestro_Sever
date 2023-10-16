const jwt = require('jsonwebtoken');
require('dotenv').config();


const createJWT = ({payload}) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
    return token
};

const isTokenValid = ({token}) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({res, user}) => {
    const token = createJWT({payload:user});

    const hour = 1000 * 60 * 60  ;

    //res.cookie(name, value, {options})
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + hour),
        sameSite: "None",
        secure: true,
        signed: true,
    });




}


module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse
}