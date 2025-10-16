import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();



// Determine if we're in test mode
const isTest = process.env.NODE_ENV === 'test';
const dbName = process.env.DB_NAME

// Create the appropriate Sequelize instance based on the environment
const sequelize = isTest
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:', // Use in-memory SQLite for tests
      logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: `./${dbName}`, // Use file-based SQLite for production
      logging: false
    });

export default sequelize;