
const models = require('../models');
const Task = models.Task;
const AuditLog = models.AuditLog;
const { Op } = require('sequelize');

const getTasks = async (req, res, next) => {
    const userId = req.user.id;
    const {
        status,
        category,
        dueDate,
        sortBy = 'dueDate',
        sortOrder = 'ASC'
    } = req.query;

    let whereClause = {
        userId
    };

    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (dueDate) {
        whereClause.dueDate = {
            [Op.lte]: new Date(dueDate) 
        };
    }

    try {
        const tasks = await Task.findAll({
            where: whereClause,
            order: [
                [sortBy, sortOrder.toUpperCase()]
            ]
        });
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

const createTask = async (req, res, next) => {
    const userId = req.user.id;
    const {
        name,
        description,
        category,
        dueDate
    } = req.body;

    if (!name) {
        return res.status(400).json({
            message: 'Task name is required'
        });
    }

    try {
        const newTask = await Task.create({
            userId,
            name,
            description,
            category,
            dueDate: dueDate || null,
            status: 'pending'
        });

        await AuditLog.create({
            userId,
            action: 'TASK_CREATED',
            entityType: 'Task',
            entityId: newTask.id,
            newValue: newTask.toJSON()
        });

        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    const userId = req.user.id;
    const taskId = req.params.id;
    const {
        name,
        description,
        category,
        dueDate,
        status
    } = req.body;

    try {
        const task = await Task.findOne({
            where: {
                id: taskId,
                userId
            }
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found or unauthorized'
            });
        }

        const oldValue = task.toJSON();

        task.name = name || task.name;
        task.description = description || task.description;
        task.category = category || task.category;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
        task.status = status || task.status;

        await task.save();

        await AuditLog.create({
            userId,
            action: 'TASK_UPDATED',
            entityType: 'Task',
            entityId: task.id,
            oldValue: oldValue,
            newValue: task.toJSON()
        });

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    const userId = req.user.id;
    const taskId = req.params.id;

    try {
        const task = await Task.findOne({
            where: {
                id: taskId,
                userId
            }
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found or unauthorized'
            });
        }

        const oldValue = task.toJSON();
        await task.destroy();

        await AuditLog.create({
            userId,
            action: 'TASK_DELETED',
            entityType: 'Task',
            entityId: taskId,
            oldValue: oldValue,
            newValue: null
        });

        res.status(200).json({
            message: 'Task removed'
        });
    } catch (error) {
        next(error);
    }
};

const getDashboardData = async (req, res, next) => {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0); 

    try {
        const tasksDueToday = await Task.findAll({
            where: {
                userId,
                dueDate: {
                    [Op.lte]: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999) // End of today
                },
                status: {
                    [Op.ne]: 'completed' 
                }
            },
            order: [
                ['dueDate', 'ASC']
            ]
        });


        const tasksCompletedLast7Days = await Task.findAll({
            where: {
                userId,
                status: 'completed',
                updatedAt: { 
                    [Op.gte]: sevenDaysAgo,
                    [Op.lte]: new Date()
                }
            }
        });

        const upcomingTasks = await Task.findAll({
            where: {
                userId,
                dueDate: {
                    [Op.gt]: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)
                },
                status: {
                    [Op.ne]: 'completed'
                }
            },
            order: [
                ['dueDate', 'ASC']
            ],
            limit: 5 
        });


        const popularCategories = await Task.findAll({
            where: {
                userId,
                category: {
                    [Op.ne]: null
                }
            },
            attributes: [
                'category', [models.sequelize.fn('COUNT', models.sequelize.col('category')), 'count']
            ],
            group: ['category'],
            order: [
                [models.sequelize.literal('count'), 'DESC']
            ],
            limit: 5
        });

        res.status(200).json({
            tasksDueToday,
            tasksCompletedLast7Days,
            upcomingTasks,
            popularCategories
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getDashboardData,
};