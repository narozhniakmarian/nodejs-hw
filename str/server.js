import express from 'express';
import cors from 'cors';
import pino from 'pino-http'; import 'dotenv/config';

const app = express();

const PORT = process.env.PORT ?? 3000;
app.use(express.json());
app.use(cors());

app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);


app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd
      ? "Something went wrong. Please try again later."
      : err.message,
  });
});


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world!' });
});





app.get('/notes', (req, res) => {
  res.status(200).json(
    {
      "message": "Retrieved all notes"
    }, [{
      id: 1, tilte: 'lalala1', description: 'opopopopo', auther: 'Alice',
      createdDate: new Date()
    }, {
      id: 2, tilte: 'lalala2', description: 'opopopopo', auther: 'Bob',
      createdDate: new Date()
    }, {
      id: 3, tilte: 'lalala3', description: 'opopopopo', auther: 'Jak',
      createdDate: new Date()
    }, {
      id: 4, tilte: 'lalala4', description: 'opopopopo', auther: 'Tak',
      createdDate: new Date()
    }, {
      id: 1, tilte: 'lalala5', description: 'opopopopo', auther: 'Si',
      createdDate: new Date()
    }, {
      id: 5, tilte: 'lalala6', description: 'opopopopo', auther: 'Stalo',
      createdDate: new Date()
    }, {
      id: 6, tilte: 'lalala6', description: 'opopopopo', auther: 'Ja',
      createdDate: new Date()
    }, {
      id: 7, tilte: 'lalala6', description: 'opopopopo', auther: 'Ne',
      createdDate: new Date()
    }, {
      id: 8, tilte: 'lalala', description: 'opopopopo', auther: 'Znaju',
      createdDate: new Date()
    }]);
});

app.get('/notes/:noteId', (req, res) => {
  const { userId: noteId } = req.params;
  res.status(200).json(
    {
      "message": "Retrieved note with ID: id_param"
    },
    { id: noteId });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.get('/test-error', (req, res) => {
  throw new Error('Something went wrong');
}
);
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
