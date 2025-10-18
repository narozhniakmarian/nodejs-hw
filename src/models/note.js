// src/models/note.js
import { Schema, model } from 'mongoose';

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  tag: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export const Note = model('Note', NoteSchema);
