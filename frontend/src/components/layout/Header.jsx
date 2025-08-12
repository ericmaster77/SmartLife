import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';  // Nuevo
import Button from '../common/Button';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="bg-blue-600 dark:bg-blue-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/">Smart Life</Link>
        <div className="space-x-4">
          <Link to="/reportar" className="hover:underline">Reportar</Link>
          <Link to="/seguimiento" className="hover:underline">Seguimiento</Link>
          <Button onClick={toggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;