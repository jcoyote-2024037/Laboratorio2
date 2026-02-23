import { Router } from 'express';
import {
  crearPublicacion,
  editarPublicacion,
  eliminarPublicacion,
  listarPublicaciones,
   agregarComentario,
  editarComentario,
  eliminarComentario
} from './publicaciones.controller.js';
import { validateJWT } from '../../../middlewares/validate_jwt.js';

const router = Router();

router.post('/', validateJWT, crearPublicacion);
router.get('/', listarPublicaciones);
router.put('/:id', validateJWT, editarPublicacion);
router.delete('/:id', validateJWT, eliminarPublicacion);

router.post('/:id/comentarios', validateJWT, agregarComentario);

router.put('/:publicacionId/comentarios/:comentarioId',
  validateJWT,
  editarComentario
);

router.delete('/:publicacionId/comentarios/:comentarioId',
  validateJWT,
  eliminarComentario
);

export default router;