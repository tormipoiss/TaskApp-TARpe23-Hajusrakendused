import express from 'express';
import http from 'http';
import bcrypt from 'bcrypt';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' with { type: 'json' };
import taskRoutes from './routes/taskRoutes.js';
import { userService } from './data/services/userServices.js';
import dotenv from 'dotenv';
dotenv.config();
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const app = express();
app.use(express.json());
const httpServer = http.createServer(app);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', async (req, res) => {
    res.status(200).type('text/html').send(`<a href="/docs">swagger</a>`);
});

taskRoutes(app);

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
    const user = await userService.getUser(username);
    if (!user) {
         return res.status(404).send({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).send({ error: "Invalid credentials" });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const success = await userService.updateUser(username, newHashedPassword);
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