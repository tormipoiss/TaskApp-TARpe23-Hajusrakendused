import express from 'express';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' with { type: 'json' };
// import  sequelize  from './data/dbConfig.js'; // test
import { sync } from './data/dbConfig.js';
import { taskService } from './data/services/taskServices.js';
import { userService } from './data/services/userServices.js';
// await sequelize.sync(); // test
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const httpServer = http.createServer(app);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', async (req, res) => {
    const user = await userService.getUser("Tiit");
    res.status(200).type('text/plain').send(`Hello, ${user.username}!`);
});

app.get('/api/v1/tasks/:id', async (req, res) => {
    //const user = await userService.getUser("Tiit");
    if (!req.params.id) {
        return res.status(400).send({ error: "URL does not contain ID" });
    }
    const task = await taskService.getTask(req.params.id);
    if (!task) {
        return res.status(404).send({ error: "Task not found" });
    }
    return res.json(task);
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
    // await taskService.createTask("Tiit","Test Task","Test task description")
    // await taskService.createTask("Tiit","Test Task","Test task description")
    console.log(`Server is running at ${process.env.SERVER_URL}:${PORT}/`);
});

export { httpServer, app };