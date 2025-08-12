import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import Button from '../components/common/Button';

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await authService.register({ name, email, password });
        alert('Usuario registrado correctamente');
        setIsRegistering(false);
      } else {
        const { data } = await authService.login({ email, password });
        localStorage.setItem('token', data.token);
        navigate('/home', { replace: true });
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
      </h2>

      {isRegistering && (
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nombre"
          className="border p-2 w-full dark:bg-gray-800"
          required
        />
      )}

      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 w-full dark:bg-gray-800"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 w-full dark:bg-gray-800"
        required
      />

      <Button type="submit" className="btn-primary">
        {isRegistering ? 'Registrar' : 'Login'}
      </Button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-blue-500 underline"
        >
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </form>
  );
};

export default LoginPage;