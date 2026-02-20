import Publicacion from './publicaciones.model.js';

export const crearPublicacion = async (req, res) => {
  try {
    const { titulo, categoria, contenido } = req.body;

    const nuevaPublicacion = await Publicacion.create({
      titulo,
      categoria,
      contenido,
      autor: req.user.id
    });

    res.status(201).json({
      success: true,
      publicacion: nuevaPublicacion
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;

    const publicacion = await Publicacion.findById(id);

    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (publicacion.autor !== req.user.id) {
      return res.status(403).json({
        message: 'No puedes editar esta publicación'
      });
    }

    await publicacion.updateOne(req.body);

    res.json({
      message: 'Publicación actualizada'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;

    const publicacion = await Publicacion.findById(id);

    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (publicacion.autor !== req.user.id) {
      return res.status(403).json({
        message: 'No puedes eliminar esta publicación'
      });
    }

    await publicacion.deleteOne();

    res.json({
      message: 'Publicación eliminada'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listarPublicaciones = async (req, res) => {
  const publicaciones = await Publicacion.find();
  res.json(publicaciones);
};

export const agregarComentario = async (req, res) => {
  try {
    const { id } = req.params; // id de la publicación
    const { contenido } = req.body;

    const publicacion = await Publicacion.findById(id);

    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    publicacion.comentarios.push({
      contenido,
      autor: req.user.id
    });

    await publicacion.save();

    res.status(201).json({
      message: 'Comentario agregado'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editarComentario = async (req, res) => {
  try {
    const { publicacionId, comentarioId } = req.params;
    const { contenido } = req.body;

    const publicacion = await Publicacion.findById(publicacionId);

    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const comentario = publicacion.comentarios.id(comentarioId);

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (Number(comentario.autor) !== Number(req.user.id)) {
      return res.status(403).json({
        message: 'No puedes editar este comentario'
      });
    }

    comentario.contenido = contenido;

    await publicacion.save();

    res.json({ message: 'Comentario actualizado' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarComentario = async (req, res) => {
  try {
    const { publicacionId, comentarioId } = req.params;

    const publicacion = await Publicacion.findById(publicacionId);

    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const comentario = publicacion.comentarios.id(comentarioId);

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (Number(comentario.autor) !== Number(req.user.id)) {
      return res.status(403).json({
        message: 'No puedes eliminar este comentario'
      });
    }

    comentario.deleteOne();

    await publicacion.save();

    res.json({ message: 'Comentario eliminado' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};