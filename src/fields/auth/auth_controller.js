import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../Usuarios/usuarios.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        message: 'No existe usuario con ese correo'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hora

    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

const resetLink = `http://localhost:3006/gestionopinion/v1/auth/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      subject: 'Recuperación de contraseña',
      html: `
        <h2>Restablecer contraseña</h2>
        <p>Haz click en el siguiente enlace:</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });

    res.json({ message: 'Correo de recuperación enviado' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Token inválido o expirado'
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);

    user.password = encryptedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await user.save();

    res.json({ message: 'Contraseña restablecida correctamente' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};