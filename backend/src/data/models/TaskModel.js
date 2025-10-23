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
    }
  },
);

console.log("SYNC", process.env.DB_SYNC === "true")
console.log("SEED", process.env.DB_SEED === "true")
if (process.env.DB_SYNC === "true") {
  await sequelize.sync();
  if (process.env.DB_SEED === "true") {
    await Tasks.findOrCreate ({
      where: { username: "Tiit" },
      defaults: { username: "Tiit", title:"asdas", description:"asdsadasasdasdas" },
    });
  }
}

export default Tasks;