
const bcrypt = require('bcryptjs');
const models = require('../models');
const User = models.User;
const AuditLog = models.AuditLog;
const { generateToken } = require('../utils/tokenUtils'); 

const registerUser = async (req, res, next) => {
    const {
        username,
        email,
        password
    } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Please enter all fields'
        });
    }

    try {
        let userExists = await User.findOne({
            where: { email }
        });
        if (userExists) {
            return res.status(400).json({
                message: 'User with that email already exists'
            });
        }

        userExists = await User.findOne({
            where: { username }
        });
        if (userExists) {
            return res.status(400).json({
                message: 'User with that username already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user',
            isActive: true
        });

        if (newUser) {
            await AuditLog.create({
                userId: newUser.id,
                action: 'USER_REGISTERED',
                entityType: 'User',
                entityId: newUser.id,
                newValue: { username: newUser.username, email: newUser.email, role: newUser.role }
            });

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                    isActive: newUser.isActive,
                    token: generateToken(newUser.id, newUser.role)
                }
            });
        } else {
            res.status(400).json({
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Please enter username and password'
        });
    }

    try {
        const user = await User.findOne({
            where: { username }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: 'Account is deactivated. Please contact an administrator.'
            });
        }

        await AuditLog.create({
            userId: user.id,
            action: 'USER_LOGIN',
            entityType: 'User',
            entityId: user.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({
            message: 'Logged in successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                token: generateToken(user.id, user.role)
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerUser,
    loginUser,
};

