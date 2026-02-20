import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../Usuarios/usuarios.model.js';

export const register = async (req, res) => {
  try {
    const { nombre, username, email, password } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      username,
      email,
      password: encryptedPassword
    });

    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Usuario registrado',
      data: user
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        role: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};