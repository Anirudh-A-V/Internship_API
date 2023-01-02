import express from 'express';

import { seekerRegistrationHandler, seekerEditHandler, resumeUploadHandler, seekerSearchHandler } from '../handlers/seeker-handler.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();



router.post('/register', seekerRegistrationHandler);
router.post('/upload-resume', upload.single('resume'), resumeUploadHandler);
router.post('/edit', seekerEditHandler);
router.post('/search', seekerSearchHandler);

export default router;