import { sequelize } from '../dbConfig.js';
import { DataTypes } from 'sequelize';

const Tasks = sequelize.define(
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
    }
  },
);

export default Tasks;