import express from 'express';
import multer from 'multer';

import { seekerRegistrationHandler, seekerEditHandler, resumeUploadHandler, seekerSearchHandler } from '../handlers/seeker-handler';

const router = express.Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}`);
    },
});

const upload = multer({ storage });

router.post('/register', seekerRegistrationHandler);
router.post('/upload-resume', upload.single('resume'), resumeUploadHandler);
router.post('/edit', seekerEditHandler);
router.post('/search', seekerSearchHandler);

export default router;