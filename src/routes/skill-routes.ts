import express from 'express';

import { getSkillsHandler } from '../handlers/skill-handler.js';

const router = express.Router();

router.get('/', getSkillsHandler);

export default router;