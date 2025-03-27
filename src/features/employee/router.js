import { Router } from 'express';
import { middleware } from 'querymen';
import { controller } from './controller.js';
import { query } from './query.js';

export const router = Router();
router.get('/', middleware(query.index), controller.index);
router.get('/:id', controller.show);
