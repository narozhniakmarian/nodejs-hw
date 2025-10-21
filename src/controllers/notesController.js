//src/controllers/noteController.js

import createHttpError from 'http-errors';
import { Note } from '../models/note.js';


export const getNotes = async (req, res, next) => {
  try {
    const { page = 1, prePage: perPage = 10, tag, search } = req.query;
    const skip = (page - 1) * perPage;
    const filter = {};
    if (search) {
      filter.$text = { $search: search };
    }

    if (tag) filter.tag = { $regex: `^${tag}$`, $options: 'i' };

    const [notes, totalItems] = await Promise.all([
      Note.find(filter, search ? { score: { $meta: "textScore" } } : {})
        .sort(search ? { score: { $meta: "textScore" } } : {})
        .skip(skip)
        .limit(perPage),
      Note.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      page, prePage: perPage, totalItems, totalPages, data: notes
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    next(createHttpError('note not found'));
  }
  res.status(200).json(note);
};


export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });

  if (!note) {
    next(createHttpError(404, "note not found"));
    return;
  }
  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId
    },
    req.body,
    { new: true },
  );

  if (!note) {
    next(createHttpError(404, 'note not found'));
    return;
  }
  res.status(200).json(note);
};

