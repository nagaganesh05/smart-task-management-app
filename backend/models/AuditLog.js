
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
            allowNull: true, 
            references: {
                model: 'users',
                key: 'id'
            }
        },
        action: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        entityType: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        entityId: {
            type: DataTypes.INTEGER, 
            allowNull: true
        },
        oldValue: {
            type: DataTypes.JSON, 
            allowNull: true
        },
        newValue: {
            type: DataTypes.JSON, 
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
        timestamps: true,
        updatedAt: false, 
        tableName: 'audit_logs' 
    });


    AuditLog.associate = (models) => {
        AuditLog.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user' 
        });
    };

    return AuditLog;
};