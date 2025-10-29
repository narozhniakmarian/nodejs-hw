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


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world!' });
});

app.get('/notes', (req, res) => {
  res.status(200).json(
    {
      message: "Retrieved all notes",
      notes: [
        {
          id: 1, title: 'lalala1', description: 'opopopopo', author: 'Alice',
          createdDate: new Date()
        },
        {
          id: 2, title: 'lalala2', description: 'opopopopo', author: 'Bob',
          createdDate: new Date()
        },
        {
          id: 3, title: 'lalala3', description: 'opopopopo', author: 'Jak',
          createdDate: new Date()
        },
        {
          id: 4, title: 'lalala4', description: 'opopopopo', author: 'Tak',
          createdDate: new Date()
        },
        {
          id: 9, title: 'lalala5', description: 'opopopopo', author: 'Si',
          createdDate: new Date()
        },
        {
          id: 5, title: 'lalala6', description: 'opopopopo', author: 'Stalo',
          createdDate: new Date()
        },
        {
          id: 6, title: 'lalala6', description: 'opopopopo', author: 'Ja',
          createdDate: new Date()
        },
        {
          id: 7, title: 'lalala6', description: 'opopopopo', author: 'Ne',
          createdDate: new Date()
        },
        {
          id: 8, title: 'lalala', description: 'opopopopo', author: 'Znaju',
          createdDate: new Date()
        }
      ]
    });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json(
    { message: `Retrieved note with ID: ${noteId}` });
});


app.get('/test-error', (req, res) => {
  throw new Error('Something went wrong');
}
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




app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
