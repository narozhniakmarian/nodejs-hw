//src/controllers/noteController.js

import createHttpError from 'http-errors';
import { Note } from '../models/note.js';


export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const skip = (page - 1) * perPage;
    const filter = { userId: req.user._id };

    if (search) {
      filter.$text = { $search: search };
    }

    if (tag) {
      filter.tag = tag;
    }

    const sort = search
      ? { score: { $meta: "textScore" } }
      : { createdAt: -1 };

    const projection = search ? { score: { $meta: "textScore" } } : {};

    const [notes, totalNotes] = await Promise.all([
      Note.find(filter, projection)
        .sort(sort)
        .skip(skip)
        .limit(perPage),
      Note.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });
  if (!note) {
    next(createHttpError(404, 'note not found'));
    return;
  }
  res.status(200).json(note);
};


export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
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
      _id: noteId,
      userId: req.user._id,
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

