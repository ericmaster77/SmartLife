// frontend/src/services/auth.service.js
import axios from 'axios';

const API_URL = '/api/auth'; // Usa proxy del package.json

// Crear instancia de axios con configuración base
const authAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de respuestas
authAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const register = async (userData) => {
  try {
    console.log('Enviando datos de registro:', userData);
    const response = await authAPI.post('/register', userData);
    console.log('Respuesta de registro:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al registrar usuario');
  }
};

const login = async (credentials) => {
  try {
    console.log('Enviando credenciales de login:', { email: credentials.email });
    const response = await authAPI.post('/login', credentials);
    console.log('Respuesta de login:', response.data);
    
    // Verificar que la respuesta tenga el formato esperado
    if (response.data && response.data.token) {
      return response.data;
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (error) {
    console.error('Error en login:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

const logout = () => {
  localStorage.removeItem('token');
  return Promise.resolve();
};

const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // Decodificar token JWT para obtener información del usuario
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Verificar si el token ha expirado
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    
    return payload.user;
  } catch (error) {
    console.error('Error decodificando token:', error);
    localStorage.removeItem('token');
    return null;
  }
};

const isAuthenticated = () => {
  return !!getCurrentUser();
};

// Función para validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para validar contraseña
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  isValidEmail,
  isValidPassword,
};

export default authService;