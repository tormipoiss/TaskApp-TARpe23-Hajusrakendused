import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Determine if we're in test mode
const isTest = process.env.NODE_ENV === 'test';
console.log("isTest:",isTest)

// Create the appropriate Sequelize instance based on the environment
const sequelize = isTest
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:', // Use in-memory SQLite for tests
      logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: `./${process.env.DB_FILE}`, // Use file-based SQLite for production
      logging: false
    });

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established.");
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
})();

const sync = (async () => {
  await sequelize.sync({ alter: true });
  console.log("All models were synchonized.");
})

export { sequelize, sync };