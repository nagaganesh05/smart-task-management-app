
const jwt = require('jsonwebtoken');
const models = require('../models');
const User = models.User;

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findByPk(decoded.id, {
                attributes: {
                    exclude: ['password']
                }
            });

            if (!req.user) {
                return res.status(401).json({
                    message: 'Not authorized, user not found'
                });
            }

            if (!req.user.isActive) {
                return res.status(403).json({
                    message: 'Account is deactivated. Please contact an administrator.'
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        res.status(401).json({
            message: 'Not authorized, no token'
        });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user ? req.user.role : 'not found'} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = {
    protect,
    authorizeRoles
};