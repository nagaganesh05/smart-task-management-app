// backend/routes/adminRoutes.js
const express = require('express');
const {
    getAllUsers,
    createUserAccount,
    deactivateUserAccount,
    activateUserAccount
} = require('../controllers/adminController');
const {
    protect,
    authorizeRoles
} = require('../middleware/authMiddleware');
const router = express.Router();

// All admin routes should be protected and only accessible by 'admin' role
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.post('/users', protect, authorizeRoles('admin'), createUserAccount);
router.put('/users/deactivate/:id', protect, authorizeRoles('admin'), deactivateUserAccount);
router.put('/users/activate/:id', protect, authorizeRoles('admin'), activateUserAccount);

module.exports = router;