// backend/server.js
require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');


// Carga .env y conecta a MongoDB
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Asegura carpeta de uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Config de Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Solo se permiten imágenes'), false);
};
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// Middleware para exponer io en req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Mount de tus rutas de incidentes
const incidentRoutes = require('./routes/incident.routes');
app.use('/api/incidents', incidentRoutes);

// Ruta de upload genérico (si lo usas aparte)
app.post('/upload', upload.single('evidence'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Archivo no válido o demasiado grande' });
  res.json({ path: `uploads/${req.file.filename}` });
});

// Servir estáticos de uploads
app.use('/uploads', express.static(uploadDir));

// Captura errores de Multer (y otros)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'Archivo demasiado grande' });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.on('disconnect', () => console.log('Usuario desconectado'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));