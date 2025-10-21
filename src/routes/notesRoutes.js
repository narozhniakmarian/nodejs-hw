// src/routes/notesRoutes.js

import { createNote, deleteNote, getNoteById, getNotes, updateNote } from '../controllers/notesController.js';
import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createNoteSchema, getNotesSchema, noteIdParamSchema, updateNoteSchema } from '../validations/noteValidation.js';

const router = Router();

router.get('/notes', celebrate(getNotesSchema), getNotes);
router.get('/notes/:noteId', celebrate(noteIdParamSchema), getNoteById);

router.post('/notes', celebrate(createNoteSchema), createNote);

router.delete('/notes/:noteId', celebrate(noteIdParamSchema), deleteNote);

router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);

export default router;
