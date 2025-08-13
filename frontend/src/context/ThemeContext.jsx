import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Obtener tema inicial del localStorage o usar 'light' por defecto
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      
      // Detectar preferencia del sistema
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clase anterior
    root.classList.remove('light', 'dark');
    
    // Agregar nueva clase
    root.classList.add(theme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
    
    // También establecer data-theme para compatibilidad adicional
    root.setAttribute('data-theme', theme);
    
    console.log('Tema aplicado:', theme); // Para debug
  }, [theme]);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Solo cambiar automáticamente si no hay preferencia guardada
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};