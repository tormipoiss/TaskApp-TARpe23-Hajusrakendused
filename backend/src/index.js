import express from 'express';
import http from 'http';
import bcrypt from 'bcrypt';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' with { type: 'json' };
// import  sequelize  from './data/dbConfig.js'; // test
import { sync } from './data/dbConfig.js';
import { taskService } from './data/services/taskServices.js';
import { userService } from './data/services/userServices.js';
// await sequelize.sync(); // test
import dotenv from 'dotenv';
import { error } from 'console';
import { DATE } from 'sequelize';
dotenv.config();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const app = express();
app.use(express.json());
const httpServer = http.createServer(app);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', async (req, res) => {
    const user = await userService.getUser("Tiit");
    res.status(200).type('text/plain').send(`Hello, ${user.username}!`);
});

app.delete('/api/v1/tasks/:id',async (req,res)=>{
    if(!req.params.id){
        return res.status(400).send({error:"URL does not contain ID"})
    }
    const success = await taskService.deleteTask(req.params.id);
    if(!success){
        return res.status(404).send({error:"Task not found"})
    }
    return res.status(204).send()
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
    return res.status(201).json(task)
});

app.put('/api/v1/tasks/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).send({ error: "URL does not contain ID" });
    }
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
    const task = await taskService.updateTask(req.params.id, req.body.username, req.body.title, req.body.description, deadline);
    if (!task) {
        return res.status(404).send({ error: "Task not found" });
    }
    return res.json(task)
});

// users
app.get('/api/v1/users/:username', async (req, res) => {
    if (!req.params.username) {
        return res.status(400).send({ error: "URL does not contain USERNAME" });
    }
    const user = await userService.getUser(req.params.username);
    if (!user) {
        return res.status(404).send({ error: "User not found" });
    }
    // maybe return total tasks if we add a new thing to the user model etc
    return res.json(user);
});

app.post('/api/v1/users', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: "Missing username or password" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await userService.createUser(username, hashedPassword);

    if (!newUser) {
        return res.status(409).send({ error: "Username already exists" });
    }
    return res.status(201).json(newUser);
});

app.put('/api/v1/users/:username/password', async (req, res) => {
    const username = req.params.username;
    const { oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).send({ error: "Missing username, old password, or new password" });
    }
    const user = await userService.getUserWithPassword(username);
    if (!user) {
         return res.status(404).send({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).send({ error: "Invalid credentials" });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const success = await userService.updateUserPassword(username, newHashedPassword);
    if (!success) {
        return res.status(500).send({ error: "Failed to update password" });
    }
    return res.status(201).send();
});

app.delete('/api/v1/users/:username', async (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.status(400).send({ error: "Missing username in URL" });
    }
    const success = await userService.deleteUser(username);
    if (!success) {
        return res.status(404).send({ error: "User not found" });
    }
    return res.status(204).send();
});

const PORT = process.env.PORT;

httpServer.listen(PORT, async () => {
    console.log(`Server is running at ${process.env.SERVER_URL}:${PORT}/`);
});

export { httpServer, app };