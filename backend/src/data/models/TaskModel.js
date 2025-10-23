import { sequelize } from '../dbConfig.js';
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();


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
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
);

if (process.env.DB_SYNC === "true") {
  await sequelize.sync();
  if (process.env.DB_SEED === "true") {
    await Tasks.findOrCreate ({
      where: { username: "Tiit" },
      defaults: { 
        username: "Tiit",
        title:"asdas",
        description:"asdsadasasdasdas",
        deadline: new Date("2025-11-18T00:00:00.000Z"),
      },
    });
  }
}

export default Tasks;