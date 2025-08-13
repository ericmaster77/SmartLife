import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = () => {
  const { theme, toggleTheme, isDark } = useContext(ThemeContext);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-600 dark:bg-blue-800 text-white shadow-lg transition-colors duration-200">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo y título */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold hover:text-blue-200 transition-colors"
          >
            <span className="text-2xl">🏛️</span>
            <span>Smart Life</span>
          </Link>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Inicio
            </Link>
            <Link 
              to="/reportar" 
              className="hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Reportar
            </Link>
            <Link 
              to="/seguimiento" 
              className="hover:text-blue-200 transition-colors duration-200 font-medium"
            >
              Seguimiento
            </Link>
            
            {/* Botón de tema */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-blue-700 dark:bg-blue-900 hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors duration-200"
              aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
              title={`Modo ${isDark ? 'claro' : 'oscuro'}`}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Autenticación */}
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm">
                  Hola, {currentUser.name}
                </span>
                <Button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors duration-200"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Botón hamburguesa móvil */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-blue-200 transition-colors duration-200 py-2"
              >
                Inicio
              </Link>
              <Link 
                to="/reportar" 
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-blue-200 transition-colors duration-200 py-2"
              >
                Reportar
              </Link>
              <Link 
                to="/seguimiento" 
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-blue-200 transition-colors duration-200 py-2"
              >
                Seguimiento
              </Link>
              
              <div className="flex items-center justify-between py-2">
                <span>Tema:</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition-colors"
                >
                  {isDark ? '☀️ Claro' : '🌙 Oscuro'}
                </button>
              </div>

              {currentUser ? (
                <div className="py-2 space-y-2">
                  <p className="text-sm">Hola, {currentUser.name}</p>
                  <Button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 text-sm w-full"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors duration-200 text-center block"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;