import  User  from '../Usuarios/usuarios.model.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);

  user.password = undefined;

  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { nombre, username } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  await user.update({
    nombre: nombre ?? user.nombre,
    username: username ?? user.username
  });

  res.json({
    message: 'Perfil actualizado',
    user
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.id);

  const validPassword = await bcrypt.compare(currentPassword, user.password);

  if (!validPassword) {
    return res.status(400).json({
      message: 'La contraseña actual es incorrecta'
    });
  }

  const encryptedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({ password: encryptedPassword });

  res.json({
    message: 'Contraseña actualizada correctamente'
  });
};