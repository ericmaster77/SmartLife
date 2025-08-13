// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

// Conectar a MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  } 
});

// Middlewares básicos
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Asegurar carpeta de uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de Multer para uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter,
});

// Middleware para exponer io en req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas principales
const authRoutes = require('./routes/auth.routes');
const incidentRoutes = require('./routes/incident.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/users', userRoutes);

// Ruta de upload genérico
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No se proporcionó archivo válido' 
      });
    }
    
    res.json({ 
      success: true,
      path: `uploads/${req.file.filename}`,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error procesando archivo' 
    });
  }
});

// Servir archivos estáticos de uploads
app.use('/uploads', express.static(uploadDir));

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Smart Life API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware de manejo de errores de Multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        error: 'El archivo es demasiado grande. Máximo 5MB.' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        success: false,
        error: 'Solo se permite un archivo por vez.' 
      });
    }
    return res.status(400).json({ 
      success: false,
      error: `Error de archivo: ${err.message}` 
    });
  }
  
  if (err.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
  
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    success: false,
    error: 'Error interno del servidor' 
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: `Ruta ${req.originalUrl} no encontrada` 
  });
});

// Socket.io eventos
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Usuario ${socket.id} se unió a la sala ${room}`);
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`Usuario ${socket.id} desconectado: ${reason}`);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor Smart Life iniciado en puerto ${PORT}`);
  console.log(`📊 MongoDB: ${process.env.MONGO_URI ? 'Conectado' : 'No configurado'}`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
});