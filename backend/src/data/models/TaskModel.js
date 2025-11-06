export default (sequelize, DataTypes) => {
    return sequelize.define(
        'Task',
        {
          id:{
              type: DataTypes.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          username:{
            type: DataTypes.STRING,
            allowNull: false,
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false
          },
          description: {
            type: DataTypes.STRING,
            allowNull: false
          },
          deadline: {
            type: DataTypes.DATE,
            allowNull: true
          }
        }
    );
}