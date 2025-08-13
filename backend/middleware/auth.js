// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    let token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No hay token, acceso denegado' 
      });
    }

    // Remover "Bearer " del token si está presente
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Obtener usuario del token
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido - usuario no encontrado' 
      });
    }

    // Agregar usuario a la request
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Error en middleware de autenticación:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expirado' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error del servidor en autenticación' 
    });
  }
};

// Middleware opcional - no requiere autenticación pero agrega usuario si está presente
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    
    if (token) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user.id).select('-password');
      
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // En optionalAuth, continuamos sin usuario si hay error
    console.warn('Token opcional inválido:', error.message);
    next();
  }
};

module.exports = { auth, optionalAuth };