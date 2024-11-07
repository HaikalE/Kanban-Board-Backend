const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (Object.keys(req.body).length) {
        console.log('Request Body:', req.body);
    }
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // console.log(token,"HUHWUHWUW",process.env.JWT_SECRET)
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;  // Menyimpan informasi user di request
        next();
    });
};

module.exports = authMiddleware;
