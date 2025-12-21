const express = require('express');
const cors = require('cors');
console.log('APP INICIADA');

// 🔥 IMPORTAR LA CONEXIÓN A MONGO
require('./database');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rutas
app.use('/api/libros', require('./routes/libros.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Servidor backend corriendo en puerto', PORT);
});
