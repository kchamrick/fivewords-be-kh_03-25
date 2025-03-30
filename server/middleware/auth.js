// server/middleware/auth.js

const jwt = require('jsonwebtoken');

const auth = (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');

        if(!token) {
            return res.status(401).json({message: 'No authentication token, authorization denied'});
        }

const verified = jwt.verify(token, process.env.JWT);
req.user = verified;
next();
    } catch (error) {
        res.status(401).json({message: 'Token is not valid'});
    }
};

module.exports = auth;