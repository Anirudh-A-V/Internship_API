import { NextFunction, Request, Response } from 'express';
import { v2 } from 'cloudinary';
import passport from 'passport';

import User from '../models/user.js';
import { createUser, getFullUserById } from '../services/user-services.js';
import logger from '../middleware/winston.js';

const signinHandler = async (req: Request, res: Response, next: NextFunction) => {
    await passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        return req.logIn(user, async (error) => {
            if (error) {
                return next(info);
            }

            const userDetails = await getFullUserById(user)
            .catch((err) => {
                logger.error(err);
            });
            // Send a redirect message with a status code 307
            if (!userDetails) return res.redirect(307, '/login');

            return res.json(userDetails);
        });
    })(req, res, next);
};

const signupHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userType, email, firstName, lastName } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists!' });
        }

        await createUser(req.body);

        return passport.authenticate('local', (err, user) => {
            if (err) {
                logger.error(err);
                return next(err);
            }

            return req.logIn(user, (error) => {
                if (error) {
                    logger.error(error);
                    return next(error);
                }
                return res.status(200).json({ id: user._id, userType, firstName, lastName });
            });
        })(req, res, next);
    } catch (err: any) {
        logger.error(err);
        next(err);
    }
};

const isAuthenticatedHandler = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = {
            _id: req.user._id,
            userType: req.user.userType,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            image: req.user.image,
        };
        const userDetails = await getFullUserById(user);
        // if (!userDetails) return res.status(401).json({ message: 'Unauthorized' });
        return res.json(userDetails);
    } catch (err: any) {
        logger.error(err);
        next(err);
    }
};

const imageUploadHandler = async (req: any, res: Response, next: NextFunction) => {
    const data = { image: req.file.path };
    try {
        const uploadedImage = await v2.uploader.upload(data.image);
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { image: uploadedImage.url },
          );
          return res.json({ image: uploadedImage.url });
    } catch (err: any) {
        logger.error(err);
        next(err);
    }
};

export {
    signinHandler,
    signupHandler,
    isAuthenticatedHandler,
    imageUploadHandler,
};
