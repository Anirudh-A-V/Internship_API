import { Request, Response, NextFunction } from 'express';
import { v2 } from 'cloudinary';
import { pick } from 'lodash-es';
import Seeker from '../models/seeker.js';

import { newSeekerRegister, updateSeekerByUserId } from '../services/seeker-services.js';
import { updateUserById, mergeAsLoggedUser } from '../services/user-services.js';
import { searchJobs } from '../services/job-services.js';
import logger from '../middleware/winston.js';

const seekerRegistrationHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;

        const details = pick(req.body, [
            'skills',
            'dob',
            'mobileNum',
        ]);

        const newSeeker = await newSeekerRegister(userId, details);
        const updatedUser = await updateUserById(userId, details);

        const seekerDetails = mergeAsLoggedUser(newSeeker, updatedUser);

        return res.json(seekerDetails);
    } catch (err: any) {
        logger.error(err);
        next(err);
    }
}

const seekerEditHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;

        const details = pick(req.body, [
            'firstName',
            'lastName',
            'skills',
            'dob',
            'mobileNum',
        ]);

        const updatedSeeker = await updateSeekerByUserId(userId, details);
        const updatedUser = await updateUserById(userId, details);

        const seekerDetails = mergeAsLoggedUser(updatedSeeker, updatedUser);

        return res.json(seekerDetails);
    } catch (err: any) {
        logger.error(err);
        next(err);
    }
}

const resumeUploadHandler = async (req: any, res: Response, next: NextFunction) => {
    const data = { resume: req.file.path };
    try {
        console.log(req.user);
        console.log(data.resume);
        const uploadedResume = await v2.uploader.upload(data.resume);
        console.log(req.user);
        console.log(uploadedResume);
        await Seeker.findOneAndUpdate(
            { userId: req.body._id },
            { resume: uploadedResume.url },
        );
        return res.json({ resume: uploadedResume.url });
    } catch (err: any) {
        logger.error(err);
        next(err);
    }
}

const seekerSearchHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { providerId, skillCode } = req.body;
        const searchResults = await searchJobs(providerId, skillCode);

        return res.json(searchResults);
    } catch (err: any) {
        logger.error(err);
        next(err);
    }
}

export {
    seekerRegistrationHandler,
    seekerEditHandler,
    resumeUploadHandler,
    seekerSearchHandler,
};
