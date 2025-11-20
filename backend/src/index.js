import express from 'express';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' with { type: 'json' };
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
import shareRoutes from './routes/shareRoutes.js';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', async (req, res) => {
    res.status(200).type('text/html').send(`<a href="/docs">swagger</a>`);
});

taskRoutes(app);

userRoutes(app)

shareRoutes(app)

const PORT = process.env.PORT;

httpServer.listen(PORT, async () => {
    console.log(`Server is running at ${process.env.SERVER_URL}:${PORT}/`);
});

export { httpServer, app };