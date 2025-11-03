import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const tagValidator = Joi.string().valid(...TAGS).messages({
  "any.only": `Tag must be one of: ${TAGS.join(', ')}`,
});

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(100).required().messages({
      "string.base": "Title must be a string",
      "string.min": "Title should have at least {#limit} characters",
      "string.max": "Title should have at most {#limit} characters",
      "any.required": "Title is required",
    }),
    content: Joi.string().allow('').max(1000).required().messages({
      "string.base": "Content must be a string",
      "string.min": "Content should have at least {#limit} characters",
      "string.max": "Content should have at most {#limit} characters",
      "any.required": "Content is required",
    }),
    tag: tagValidator
  }),
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    title: Joi.string().optional(),
    tag: tagValidator.optional(),
    search: Joi.string().trim().allow('').optional(),
    sortBy: Joi.string().valid("_id", "title", "content").insensitive().default("_id"),
    sortOrder: Joi.string().valid("asc", "desc").insensitive().default("asc"),
  }),
};

// Кастомний валідатор для ObjectId
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};
// Схема для перевірки параметра noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};


export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(100).messages({
      "string.base": "Title must be a string",
      "string.min": "Title should have at least {#limit} characters",
      "string.max": "Title should have at most {#limit} characters",
    }),
    content: Joi.string().allow('').max(1000).messages({
      "string.base": "Content must be a string",
      "string.min": "Content should have at least {#limit} characters",
      "string.max": "Content should have at most {#limit} characters",
    }),
    tag: tagValidator
  }).min(1),
};
