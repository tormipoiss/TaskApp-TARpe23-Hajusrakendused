import express from 'express';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' with { type: 'json' };
// import  sequelize  from './data/dbConfig.js'; // test
import { sync } from './data/dbConfig.js';
import { taskService, userService } from './data/dataServices.js';
// await sequelize.sync(); // test
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const httpServer = http.createServer(app);

app.get('/', async (req, res) => {
    const user = await userService.getUser("Tiit");
    res.status(200).type('text/plain').send(`Hello, ${user.username}!`);
});

app.get('/api/v1/tasks', async (req, res) => {
    //const user = await userService.getUser("Tiit");
    const tasks = await taskService.getAllTasks("Tiit");
    res.status(200).type('text/plain').send(tasks);
});

const PORT = process.env.PORT;

httpServer.listen(PORT, async () => {
    await sync()
    await userService.createUser("Tiit", "pass");
    await taskService.createTask("Tiit","Test Task","Test task description")
    await taskService.createTask("Tiit","Test Task","Test task description")
    console.log(`Server is running at ${process.env.SERVER_URL}:${PORT}/`);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export { httpServer, app };