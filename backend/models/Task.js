// backend/models/Task.js
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Refers to the actual table name
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'overdue'),
            allowNull: false,
            defaultValue: 'pending'
        }
    }, {
        timestamps: true,
        tableName: 'tasks' // Explicitly define table name
    });

    // Define associations for the Task model
    Task.associate = (models) => {
        Task.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user' // Alias for the user who owns this task
        });
    };

    return Task;
};
