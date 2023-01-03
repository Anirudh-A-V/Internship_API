import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

import User from '../models/user.js';
import { findSeekerByUserId } from './seeker-services.js';
import { findProviderByUserId } from './provider-services.js';
import logger from '../middleware/winston.js';


const createUser = async (userDetails: any) => {
    const { email, password, firstName, lastName, userType } = userDetails;
    const hashedPassword = bcrypt.hash(password, 12);

    const { _doc: user } = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        userType
    })
        .catch((err) => {
            logger.log('0', 'Error at file name: user-services.ts')
            logger.error(err);
        });

    return user;
};

const updateUserById = async (userId: Types.ObjectId, userDetails: any) => {
    const updatedDetails = { ...userDetails, updatedAt: Date.now() };

    const { _doc: updatedUser } = await User.findOneAndUpdate({
        _id: userId
    },
        updatedDetails,
        {
            upsert: false,
            runValidators: true,
            new: true
        })
        .catch((err) => {
            logger.log('0', 'Error at file name: user-services.ts')
            logger.error(err);
        });

    return updatedUser;
};

const mergeUserDetails = (userOfType: any, user: any) => {
    const { firstName, lastName, userType, image } = user;

    const safeDetails = {
        ...userOfType,
        firstName,
        lastName,
        userType,
        image
    };

    return safeDetails;
};

const mergeAsLoggedUser = (userOfType: any, user: any) => {
    const mergedUser = mergeUserDetails(userOfType, user);

    mergedUser.userTypeId = mergedUser._id;
    mergedUser._id = mergedUser.userId;

    delete mergedUser.userId;

    return mergedUser;
};

const getFullUserById = async (user: any) => {
    const { userType, userId } = user;

    let userOfType;
    if (userType === 'seeker') {
        userOfType = await findSeekerByUserId(userId)
            .catch((err) => {
                logger.log('0', 'Error at file name: user-services.ts')
                logger.error(err);
            });
    }
    else if (userType === 'provider') {
        userOfType = await findProviderByUserId(userId)
            .catch((err) => {
                logger.log('0', 'Error at file name: user-services.ts')
                logger.error(err);
            });
    }

    if (userOfType === null) {
        userOfType = { userId: user._id, userType: user.userType };
    }

    const mergedUser = mergeAsLoggedUser(userOfType, user);

    return mergedUser;
};

export {
    createUser,
    updateUserById,
    getFullUserById,
    mergeAsLoggedUser,
    mergeUserDetails,
};
