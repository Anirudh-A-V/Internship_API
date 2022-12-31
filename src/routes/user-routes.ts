import express from 'express';

import { signupHandler, signinHandler, isAuthenticatedHandler, imageUploadHandler } from '../handlers/user-handler';
import { upload } from '../utils/Upload';

const router = express.Router();

router.get('/isAuthenticated', isAuthenticatedHandler);
router.post('/signup', signupHandler);
router.post('/signin', signinHandler);
router.post('/upload-image', upload.single('image'), imageUploadHandler);

export default router;
