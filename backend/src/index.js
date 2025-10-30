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
import { DATE } from 'sequelize';
dotenv.config();

const app = express();
app.use(express.json());
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

app.post('/api/v1/tasks', async (req, res) => {
    try {
        if (!req.body.title || !req.body.description || !req.body.username) {
            return res.status(400).send({ error: "Missing required fields: title / description / username" });
        }
    } catch (error) {
        return res.status(400).send({ error: "Missing required fields: title / description / username" });
    }
    const deadline = Date.parse(req.body.deadline);
    if (req.body.deadline && isNaN(deadline)) {
        return res.status(400).send({ error: "Empty or malformed date string in field: deadline" });
    }
    const task = await taskService.createTask(req.body.username, req.body.title, req.body.description, deadline);
    return res.json(task)
});

const PORT = process.env.PORT;

httpServer.listen(PORT, async () => {
    await sync()
    await userService.createUser("Tiit", "pass");
    console.log(`Server is running at ${process.env.SERVER_URL}:${PORT}/`);
});

export { httpServer, app };