import { Router } from 'express';
import { controller } from './controller.js';

export const router = Router();
router.get('/', controller.index);
router.get('/:id', controller.show);
