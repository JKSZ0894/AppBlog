import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthForm from './components/auth/AuthForm';
import API_URL from './config/apiConfig';
import './App.css'; // Importar los estilos

const App = () => {
  const [logueado, setLogueado] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [editPost, setEditPost] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const estaLogueado = localStorage.getItem('logueado') === 'true';
    setLogueado(estaLogueado);
    if (estaLogueado) {
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/blog`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error al obtener posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditPost({ ...editPost, [e.target.name]: e.target.value });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/blog`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (err) {
      console.error('Error al crear post:', err);
      alert('Error al crear el post. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post._id);
    setEditPost({ title: post.title, content: post.content });
  };

  const handleUpdatePost = async (postId) => {
    if (!editPost.title.trim() || !editPost.content.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/blog/${postId}`, editPost, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEditingPost(null);
      setEditPost({ title: '', content: '' });
      fetchPosts();
    } catch (err) {
      console.error('Error al actualizar post:', err);
      alert('Error al actualizar el post. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('¿Estás segura de que quieres eliminar este post?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/blog/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchPosts();
    } catch (err) {
      console.error('Error al eliminar post:', err);
      alert('Error al eliminar el post. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás segura de que quieres cerrar sesión?')) {
      localStorage.removeItem('logueado');
      localStorage.removeItem('token');
      setLogueado(false);
      setPosts([]);
      setNewPost({ title: '', content: '' });
      setEditingPost(null);
    }
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditPost({ title: '', content: '' });
  };

  if (!logueado) {
    return <AuthForm />;
  }

  return (
    <div className="blog-container">
      {/* Header */}
      <div className="blog-header">
        <h1 className="blog-title">Mi Blog Personal</h1>
        <p className="blog-subtitle">Comparte tus pensamientos con el mundo ✨</p>
      </div>

      {/* Formulario para crear posts */}
      <div className="create-post-form">
        <h2 className="form-title">✍️ Crear nuevo post</h2>
        <form onSubmit={handlePostSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Título de tu post..."
            value={newPost.title}
            onChange={handlePostChange}
            required
            className="form-input"
            disabled={loading}
          />
          <textarea
            name="content"
            placeholder="¿Qué quieres compartir hoy?"
            value={newPost.content}
            onChange={handlePostChange}
            required
            className="form-textarea"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="loading"></span> : '🚀 Publicar'}
          </button>
        </form>
      </div>

      {/* Sección de posts */}
      <div className="posts-section">
        <h3 className="posts-title">📚 Mis publicaciones</h3>
        
        {loading && posts.length === 0 ? (
          <div className="empty-message">
            <span className="loading"></span> Cargando posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-message">
            ¡No hay posts aún! ¡Crea tu primer post arriba! 🎉
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              {editingPost === post._id ? (
                // Modo edición
                <div>
                  <input
                    type="text"
                    name="title"
                    value={editPost.title}
                    onChange={handleEditChange}
                    className="form-input"
                    disabled={loading}
                  />
                  <textarea
                    name="content"
                    value={editPost.content}
                    onChange={handleEditChange}
                    className="form-textarea"
                    disabled={loading}
                  />
                  <div className="post-actions">
                    <button 
                      onClick={() => handleUpdatePost(post._id)}
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? <span className="loading"></span> : '💾 Guardar'}
                    </button>
                    <button 
                      onClick={cancelEdit}
                      className="btn btn-secondary"
                      disabled={loading}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo vista
                <div>
                  <h4 className="post-title">{post.title}</h4>
                  <p className="post-content">{post.content}</p>
                  <div className="post-actions">
                    <button 
                      onClick={() => handleEditPost(post)}
                      className="btn btn-secondary"
                      disabled={loading}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post._id)}
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      {loading ? <span className="loading"></span> : '🗑️ Eliminar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Botón de cerrar sesión */}
      <button 
        onClick={handleLogout} 
        className="btn btn-logout"
        disabled={loading}
      >
        👋 Cerrar sesión
      </button>
    </div>
  );
};

export default App;