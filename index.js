import express from 'express';
import cors from 'cors';
import { query } from './src/query.js';
import { embeddings } from './src/embeddings.js';

const app = express();
const port = 3000;

app.use(express.json());

// CORS
app.use(cors());

app.post('/query', query);
app.get('/aleatories', embeddings);

app.listen(port, () => {
  console.log(`AI Virtual assistant corriendo en puerto ${port}`);
});
