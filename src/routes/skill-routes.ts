import express from 'express';

import { getSkillsHandler } from '../handlers/skill-handler';

const router = express.Router();

router.get('/', getSkillsHandler);

export default router;