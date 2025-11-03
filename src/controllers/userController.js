// src/controllers/userController.js

import createHttpError from "http-errors";
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { Session } from "../models/session.js";
import path from 'path';
import fs from 'fs/promises';
import handlebars from 'handlebars';
import { sendEmail } from '../utils/sendEmail.js';


export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    next(createHttpError(400, "No file"));
    return;
  }

  const result = await saveFileToCloudinary(req.file.buffer);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: result.secure_url },
    { new: true },
  );


  res.status(200).json({ url: user.avatar });
};


export const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};



export const updateUserProfile = async (req, res, next) => {
  const { email, username } = req.body;

  const updates = {};
  if (email && email !== req.user.email) {
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== req.user._id.toString()) {
      return next(createHttpError(400, 'Email already in use'));
    }
    updates.email = email;
  }
  if (username) updates.username = username;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true });


  if (updates.email) {
    const templatePath = path.resolve('src/templates/email-changed.html');
    const source = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(source);
    const html = template({ name: updatedUser.username, email: updatedUser.email });

    try {
      await sendEmail({
        from: process.env.SMTP_FROM,
        to: updatedUser.email,
        subject: 'Ваш email було змінено',
        html,
      });
    } catch {
      next(createHttpError(500, '⚠️ Не вдалося надіслати лист про зміну email'));
    }
  }

  res.status(200).json(updatedUser);
};


export const updateUserPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return next(createHttpError(401, 'Incorrect current password'));
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({ message: 'Password updated successfully' });
};
