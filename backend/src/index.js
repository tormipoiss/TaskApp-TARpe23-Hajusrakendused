import express from 'express';
import http from 'http';
import  sequelize  from './data/dbConfig.js'; // test
await sequelize.sync(); // test

const app = express();
const httpServer = http.createServer(app);

app.get('/', (req, res) => {
    res.status(200).type('text/plain').send('Hello, World!');
});

const PORT = 8000;

httpServer.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});

export { httpServer, app };