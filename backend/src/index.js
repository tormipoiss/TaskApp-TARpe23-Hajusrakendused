import express from 'express';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' with { type: 'json' };
import  sequelize  from './data/dbConfig.js'; // test
await sequelize.sync(); // test
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const httpServer = http.createServer(app);

app.get('/', (req, res) => {
    res.status(200).type('text/plain').send('Hello, World!');
});

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
    console.log(`Server is running at ${process.env.SERVER_URL}:${PORT}/`);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export { httpServer, app };