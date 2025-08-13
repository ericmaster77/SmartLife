import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/auth.service';
import Button from '../components/common/Button';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isRegistering && !formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (isRegistering && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (isRegistering && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      if (isRegistering) {
        // Registro
        const response = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        if (response.success && response.token) {
          // Auto-login después del registro
          localStorage.setItem('token', response.token);
          setCurrentUser(response.user);
          alert('¡Registro exitoso! Bienvenido a Smart Life');
          navigate('/', { replace: true });
        } else {
          alert('Registro exitoso. Por favor inicia sesión.');
          setIsRegistering(false);
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        }
      } else {
        // Login
        const response = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          setCurrentUser(response.user);
          alert(`¡Bienvenido, ${response.user.name}!`);
          navigate('/', { replace: true });
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      
      let errorMessage = 'Error de conexión. Intenta de nuevo.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message && error.message !== 'Error de conexión. Intenta de nuevo.') {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <span className="text-2xl">🏛️</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isRegistering ? 'Crear cuenta nueva' : 'Iniciar sesión'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isRegistering 
              ? 'Únete a Smart Life para reportar incidentes' 
              : 'Accede a tu cuenta de Smart Life'
            }
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {isRegistering && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 sm:text-sm`}
                  placeholder="Tu nombre completo"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 sm:text-sm`}
                placeholder="tu@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 sm:text-sm`}
                placeholder="Tu contraseña"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {isRegistering && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                  } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 sm:text-sm`}
                  placeholder="Repite tu contraseña"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  {isRegistering ? 'Registrando...' : 'Iniciando sesión...'}
                </>
              ) : (
                isRegistering ? 'Crear cuenta' : 'Iniciar sesión'
              )}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              {isRegistering 
                ? '¿Ya tienes cuenta? Inicia sesión aquí' 
                : '¿No tienes cuenta? Regístrate aquí'
              }
            </button>
          </div>

          <div className="text-center">
            <Link 
              to="/"
              className="text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
            >
              ← Volver al inicio
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;