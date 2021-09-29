const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){

    var token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token){
        return res.status(401).send({
            message: 'Token is invalid'
        });
    }
    var decoded = jwt.decode(token, process.env.JWT_SECRET);
    
    if(!decoded){
        return res.status(401).send({
            message: 'Token is invalid'
        });
    }

    req.user = decoded;
    return next();
}

function isAdmin(req, res, next){
    if(req.user.role != 'admin'){
        return res.status(401).send({
            message: 'No estás autorizado para realizar esta acción.'
        });
    }
    return next();
}

// Export middleware
exports.authenticateToken = authenticateToken;
exports.isAdmin = isAdmin;