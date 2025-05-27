// backend/controllers/adminController.js
const models = require('../models');
const User = models.User;
const AuditLog = models.AuditLog;
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenUtils');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const createUserAccount = async (req, res, next) => {
    const { username, email, password, role, isActive } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    try {
        let userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User with that email already exists' });
        }

        userExists = await User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ message: 'User with that username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
            isActive: isActive !== undefined ? isActive : true
        });

        // Log audit
        await AuditLog.create({
            userId: req.user.id, // Admin performing the action
            action: 'ADMIN_USER_CREATED',
            entityType: 'User',
            entityId: newUser.id,
            newValue: { username: newUser.username, email: newUser.email, role: newUser.role, isActive: newUser.isActive }
        });

        res.status(201).json({
            message: 'User account created successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                isActive: newUser.isActive,
                token: generateToken(newUser.id, newUser.role) // Optionally generate token for the new user
            }
        });

    } catch (error) {
        next(error);
    }
};

const deactivateUserAccount = async (req, res, next) => {
    const userIdToDeactivate = req.params.id;

    // Prevent an admin from deactivating themselves
    if (req.user.id == userIdToDeactivate) {
        return res.status(403).json({ message: 'You cannot deactivate your own account.' });
    }

    try {
        const user = await User.findByPk(userIdToDeactivate);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const oldValue = user.toJSON();
        user.isActive = false;
        await user.save();

        // Log audit
        await AuditLog.create({
            userId: req.user.id, // Admin performing the action
            action: 'ADMIN_USER_DEACTIVATED',
            entityType: 'User',
            entityId: user.id,
            oldValue: { isActive: oldValue.isActive },
            newValue: { isActive: user.isActive }
        });

        res.status(200).json({ message: `User ${user.username} deactivated successfully`, user });
    } catch (error) {
        next(error);
    }
};

const activateUserAccount = async (req, res, next) => {
    const userIdToActivate = req.params.id;

    try {
        const user = await User.findByPk(userIdToActivate);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const oldValue = user.toJSON();
        user.isActive = true;
        await user.save();

        // Log audit
        await AuditLog.create({
            userId: req.user.id, // Admin performing the action
            action: 'ADMIN_USER_ACTIVATED',
            entityType: 'User',
            entityId: user.id,
            oldValue: { isActive: oldValue.isActive },
            newValue: { isActive: user.isActive }
        });

        res.status(200).json({ message: `User ${user.username} activated successfully`, user });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getAllUsers,
    createUserAccount,
    deactivateUserAccount,
    activateUserAccount,
};