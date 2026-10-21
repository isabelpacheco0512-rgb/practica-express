import express from 'express';
import pedidosRouter from './routes/pedidos.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/pedidos', pedidosRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});