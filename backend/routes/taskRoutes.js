// backend/routes/taskRoutes.js
const express = require('express');
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getDashboardData
} = require('../controllers/taskController');
const {
    protect
} = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, getTasks)
    .post(protect, createTask);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

router.get('/dashboard-data', protect, getDashboardData); // Specific route for dashboard metrics

module.exports = router;