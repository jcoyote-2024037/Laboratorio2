import { Router } from 'express'
import {
    login, register, requestPasswordReset,
    resetPassword
} from './auth_controller.js'

const router = Router()

router.post('/login', login);
    router.post('/register', register);
router.post('/request-reset', requestPasswordReset);

router.get('/reset-password', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  res.json({
    success: true,
    message: 'Token recibido correctamente',
    token
  });
});

router.post('/reset-password', resetPassword);


export default router
