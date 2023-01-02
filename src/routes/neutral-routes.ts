import express from 'express';

import { neutralHandler } from '../handlers/neutral-handler.js';

const router = express.Router();

router.get('/', neutralHandler);

export default router;