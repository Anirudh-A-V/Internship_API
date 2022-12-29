import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

import User from '../models/user';
import { findSeekerByUserId } from './seeker-services';
import { findProviderByUserId } from './provider-services';

type UserLoginDetails = {
    email: string,
    password: string,
}

type UserRegisterDetails = {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    userType: string,
}


const createUser = async (userDetails : UserRegisterDetails) => {
    const { email, password, firstName, lastName, userType } = userDetails;
    const hashedPassword = await bcrypt.hash(password, 12);

    const { _doc: user } = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        userType
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

const mergeAsLoggedUser = async (userOfType: any, user: any) => {
    const mergedUser = await mergeUserDetails(userOfType, user);

    mergedUser.userTypeId = mergedUser._id;
    mergedUser._id = mergedUser.userId;

    delete mergedUser.userId;

    return mergedUser;
};

const getFullUserDetails = async (user: any) => {
    const { userType, userId } = user;

    let userOfType;
    if (userType === 'seeker') {
        userOfType = await findSeekerByUserId(userId);
    }
    else if (userType === 'provider') {
        userOfType = await findProviderByUserId(userId);
    }
    
    if (userOfType === null) {
        userOfType = { userId: user._id, userType: user.userType };
    }

    const mergedUser = await mergeAsLoggedUser(userOfType, user);

    return mergedUser;
};

export {
    createUser,
    updateUserById,
    getFullUserDetails,
};
