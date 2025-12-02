import express from 'express';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' with { type: 'json' };
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import shareRoutes from './routes/shareRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


taskRoutes(app);
userRoutes(app);
shareRoutes(app);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.static(path.join(__dirname, '../../frontend/dist')));


app.get('*path', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Server running at ${process.env.SERVER_URL || 'http://localhost'}:${PORT}`);
});

export { httpServer, app };