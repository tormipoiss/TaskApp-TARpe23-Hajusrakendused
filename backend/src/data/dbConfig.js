import {DataTypes, Sequelize} from 'sequelize';
import TaskModel from "./models/TaskModel.js";
import UserModel from "./models/UserModel.js";
import SharingModel from "./models/SharingModel.js";
import relations from "./models/relations.js";
import seed from "./seed.js";
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

const db = {};
db.Tasks = TaskModel(sequelize, DataTypes);
db.Users = UserModel(sequelize, DataTypes);
db.Shares = SharingModel(sequelize, DataTypes);
relations(db);

const sync = (async () => {
  // await sequelize.query("PRAGMA foreign_keys = OFF")
  await sequelize.sync({ force: true });
  console.log("All models were synchonized.");
})

if (process.env.DB_SYNC === "true") {
    await sync();
}

if (process.env.DB_SEED === "true") {
    try {
      await seed(db);
      console.log("Seeding succeeded!");
    }
    catch (e) {
      console.error("Seeding failed", e.message);
    }
}

export { sequelize, sync, db };