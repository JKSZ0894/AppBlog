const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// GET /api/blog - Obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error al obtener posts:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// POST /api/blog - Crear un nuevo post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Título y contenido son requeridos' });
    }

    const newPost = new Post({
      title: title.trim(),
      content: content.trim()
    });
    
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Error al crear post:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// PUT /api/blog/:id - Editar un post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.id;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Título y contenido son requeridos' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Actualizar el post
    post.title = title.trim();
    post.content = content.trim();
    
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error('Error al actualizar post:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID de post inválido' });
    }
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// DELETE /api/blog/:id - Eliminar un post
router.delete('/:id', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (err) {
    console.error('Error al eliminar post:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID de post inválido' });
    }
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// GET /api/blog/:id - Obtener un post específico
router.get('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }
    
    res.json(post);
  } catch (err) {
    console.error('Error al obtener post:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID de post inválido' });
    }
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;