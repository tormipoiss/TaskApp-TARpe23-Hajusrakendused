import { sequelize } from '../dbConfig.js';
import { DataTypes } from 'sequelize';

const Users = sequelize.define(
  'User',
  {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
);

export default Users;