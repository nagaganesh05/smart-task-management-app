
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


router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.post('/users', protect, authorizeRoles('admin'), createUserAccount);
router.put('/users/deactivate/:id', protect, authorizeRoles('admin'), deactivateUserAccount);
router.put('/users/activate/:id', protect, authorizeRoles('admin'), activateUserAccount);

module.exports = router;