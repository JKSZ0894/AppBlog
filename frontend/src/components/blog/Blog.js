import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/apiConfig';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerPosts();
  }, []);

  const obtenerPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/blog`); // ← Cambio: /posts por /blog
      setPosts(res.data);
    } catch (err) {
      console.error('Error al obtener posts:', err);
      setMensaje('❌ Error al cargar los posts');
      setPosts([]); // ← Importante: asegurar que posts sea un array
    }
  };

  const crearPost = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMensaje('❌ Debes iniciar sesión para publicar');
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/blog`, // ← Cambio: /posts por /blog
        {
          title: titulo,
          content: contenido,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitulo('');
      setContenido('');
      setMensaje('✅ Publicado con éxito');
      obtenerPosts();
    } catch (err) {
      console.error('Error al crear post:', err);
      setMensaje('❌ Error al publicar');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: '600px', margin: 'auto' }}>
      <h2>Crear nuevo post</h2>
      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <textarea
        placeholder="Contenido"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        style={{ width: '100%', height: 100, marginBottom: 10 }}
      />
      <button onClick={crearPost} style={{ width: '100%' }}>Publicar</button>

      <p>{mensaje}</p>

      <h2>Posts del blog</h2>
      {posts.length === 0 ? (
        <p>No hay publicaciones aún.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} style={{ marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Blog;