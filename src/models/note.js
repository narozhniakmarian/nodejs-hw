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
}
);

NoteSchema.index(
  { title: "text", content: "text" },
  {
    name: "NoteSchemaIndex",
    weights: { title: 5, content: 2 },
    default_language: "english",
  });

export const Note = model('Note', NoteSchema);
