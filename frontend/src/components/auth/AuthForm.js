import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../../config/apiConfig';

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' o 'error'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const url = isRegister
      ? `${API_URL}/auth/register`
      : `${API_URL}/auth/login`;
  
    const dataToSend = isRegister
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      : {
          email: formData.email,
          password: formData.password
        };

    try {
      const response = await axios.post(url, dataToSend);

      if (!isRegister && response.data.token) {
        // Login exitoso
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('logueado', 'true');
        window.location.reload();
      } else {
        // Registro exitoso
        setMessage(response.data.message || 'Operación exitosa');
        setMessageType('success');
        if (isRegister) {
          // Cambiar a login después de registro exitoso
          setTimeout(() => {
            setIsRegister(false);
            setFormData({ name: '', email: formData.email, password: '' });
            setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
            setMessageType('success');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMessage(
        error.response?.data?.message || 
        'Error en el servidor. Por favor, intente más tarde.'
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setMessage('');
    setMessageType('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">
          {isRegister ? '👋 Únete al Blog' : '🔐 Bienvenida de vuelta'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              disabled={loading}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Tu contraseña segura"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
            disabled={loading}
            minLength="6"
          />

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading"></span> 
                {isRegister ? ' Registrando...' : ' Iniciando sesión...'}
              </>
            ) : (
              <>
                {isRegister ? '🚀 Crear cuenta' : '✨ Entrar al blog'}
              </>
            )}
          </button>
        </form>

        {message && (
          <div className={`auth-message ${messageType}`}>
            {messageType === 'success' ? '✅' : '❌'} {message}
          </div>
        )}

        <button
          onClick={switchMode}
          className="btn auth-switch"
          disabled={loading}
        >
          {isRegister 
            ? '🔄 ¿Ya tienes cuenta? Inicia sesión' 
            : '🆕 ¿Eres nueva? Crea tu cuenta'
          }
        </button>
      </div>
    </div>
  );
};

export default AuthForm;