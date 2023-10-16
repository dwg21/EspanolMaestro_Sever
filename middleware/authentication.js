const CustomErr = require('../errors');
const {isTokenValid} = require('../utils');


// Checks user exists
const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;
    
    if (!token) {
        throw new CustomErr.UnauthenticatedError('Authentication invalid')
    }
    try {
        const payload = isTokenValid({token});
        req.user = {name: payload.name, userId:payload.userId, role:payload.role}
        next();

    } catch (error) {
        throw new CustomErr.UnauthenticatedError('Authentication invalid')

    }
}

const authorisePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role) ) {
            throw new CustomErr.UnauthorisedError(
                'Unauthorised to access this route'
                );
        }
        next()
        
    }
    
};


module.exports = {
    authenticateUser,
    authorisePermissions
}