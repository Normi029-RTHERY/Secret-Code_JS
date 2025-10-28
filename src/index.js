import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const clients = [];

const scores = [
    { score: 100 },
    { score: 200 },
    { score: 300 }
];

app.get('/api/scores/stream', cors(), (req, res) => {
    console.log('Client connected to /api/scores/stream');
    res.setHeader('Content-Type', 'text/event-stream');

    clients.push(res);

    res.write(`data: ${JSON.stringify(scores)}\n\n`);

    res.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
        res.end();
    });
});

app.post('/api/scores/', cors(), (req, res) => {
    scores.push(req.body);
    res.status(201).send('Score added');

    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(scores)}\n\n`);
    });
});