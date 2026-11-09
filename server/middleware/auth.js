const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    let token = req.header('Authorization') || req.header('x-auth-token');
    
    // Remove 'Bearer ' prefix if present
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    console.log("Auth middleware - Token received:", token ? "Yes" : "No");

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Auth middleware - Decoded user:", decoded);
        
        // Handle different token structures
        req.user = decoded.user || decoded;
        next();
    } catch (err) {
        console.error("Auth middleware - Token verification failed:", err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};