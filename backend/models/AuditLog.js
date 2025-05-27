// backend/models/AuditLog.js
module.exports = (sequelize, DataTypes) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Can be null if action is system-wide or before login
            references: {
                model: 'users', // Refers to the actual table name
                key: 'id'
            }
        },
        action: {
            type: DataTypes.STRING, // e.g., 'USER_CREATED', 'TASK_UPDATED', 'ACCOUNT_DEACTIVATED'
            allowNull: false
        },
        entityType: {
            type: DataTypes.STRING, // e.g., 'User', 'Task'
            allowNull: false
        },
        entityId: {
            type: DataTypes.INTEGER, // ID of the affected entity
            allowNull: true
        },
        oldValue: {
            type: DataTypes.JSON, // Store old state of the record (JSON string)
            allowNull: true
        },
        newValue: {
            type: DataTypes.JSON, // Store new state of the record (JSON string)
            allowNull: true
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userAgent: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true, // `createdAt` will serve as the timestamp for the log
        updatedAt: false, // Audit logs generally don't get updated
        tableName: 'audit_logs' // Explicitly define table name
    });

    // Define associations for the AuditLog model
    AuditLog.associate = (models) => {
        AuditLog.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user' // Alias for the user who performed the audit action
        });
    };

    return AuditLog;
};
