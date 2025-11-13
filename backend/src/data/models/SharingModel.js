export default (sequelize, DataTypes) => {
    const Share = sequelize.define(
        "Share",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            TaskId: { 
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            UserUsername: { 
                type: DataTypes.STRING,
                allowNull: false,
            },
            sharedUser: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            tableName: 'Shares', 
            indexes: [
                {
                    unique: true,
                    fields: ['TaskId', 'sharedUser'],
                    name: 'task_recipient_unique'
                }
            ]
        }
    );
    return Share;
}