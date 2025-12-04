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
                unique: false, // Explicitly ensure this is false
            },
            UserUsername: { 
                type: DataTypes.STRING,
                allowNull: false,
                unique: false, // Explicitly ensure this is false
            },
            sharedUser: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: false, // Explicitly ensure this is false
            },
        },
        {
            tableName: 'Shares', 
            indexes: [
                {
                    unique: true,
                    fields: ['TaskId', 'sharedUser'], // <--- THIS IS THE ONLY UNIQUE THING YOU WANT
                    name: 'task_recipient_unique'
                }
            ]
        }
    );
    return Share;
}