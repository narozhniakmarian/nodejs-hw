import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';


export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      "string.base": "Title must be a string",
      "string.min": "Title should have at least {#limit} characters",
      "string.max": "Title should have at most {#limit} characters",
      "any.required": "Title is required",
    }),
    content: Joi.string().min(5).max(1000).required().messages({
      "string.base": "Content must be a string",
      "string.min": "Content should have at least {#limit} characters",
      "string.max": "Content should have at most {#limit} characters",
      "any.required": "Content is required",
    }),
    tag: Joi.string().min(2).max(30).messages({
      "string.base": "Tag must be a string",
      "string.min": "Tag must be at least {#limit} characters",
      "string.max": "Tag must be at most {#limit} characters",
    })


  }),
};

export const getNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    title: Joi.string(),
    tag: Joi.string(),
    search: Joi.string().trim().allow('')
  }),
};

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};
// Схема для перевірки параметра noteId
export const noteIdParamSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};


export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(100).messages({
      "string.base": "Title must be a string",
      "string.min": "Title should have at least {#limit} characters",
      "string.max": "Title should have at most {#limit} characters",
    }),
    content: Joi.string().min(5).max(1000).messages({
      "string.base": "Content must be a string",
      "string.min": "Content should have at least {#limit} characters",
      "string.max": "Content should have at most {#limit} characters",
    }),
    tag: Joi.string().valid("Personal", "Work", "Study", "Other").messages({
      "any.only": "Tag must be one of: Personal, Work, Study, Other",
    }),
  }).min(1), //!не дозволяємо порожнє тіло
};
