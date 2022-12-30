import { NextFunction, Request, Response } from 'express';
import { pick } from 'lodash-es';

import User from '../models/user';
import Provider from '../models/provider';
import { newProviderRegister, updateProviderByUserId } from '../services/provider-services';
import { updateUserById, mergeAsLoggedUser, getFullUserById } from '../services/user-services';


const providerRegistrationHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;

        const details = pick(req.body, [
            'mobileNum',
            'website',
            'description',
            'address',
        ]);

        const newProvider = await newProviderRegister(userId, details);
        const updatedUser = await updateUserById(userId, details);

        const providerDetails = mergeAsLoggedUser(newProvider, updatedUser);

        return res.json(providerDetails);
    } catch (err) {
        console.log('file name: provider-handler.ts')
        console.log(err);
        next(err);
    }
}

const providerEditHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;

        const details = pick(req.body, [
            'firstName',
            'lastName',
            'mobileNum',
            'website',
            'description',
            'address',
        ]);

        const updatedProvider = await updateProviderByUserId(userId, details);
        const updatedUser = await updateUserById(userId, details);

        const providerDetails = mergeAsLoggedUser(updatedProvider, updatedUser);

        return res.json(providerDetails);
    } catch (err) {
        console.log('file name: provider-handler.ts')
        console.log(err);
        next(err);
    }
}

const fetchProvidersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const providers = await Provider.find();
        const providerDetails = await Promise.all(providers.map(async (provider) => {
            const user = await User.findById(provider.userId);
            return getFullUserById(user);
        }));
        return res.json(providerDetails);
    } catch (err) {
        console.log('file name: provider-handler.ts')
        console.log(err);
        next(err);
    }
}

const getSeekerResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.download(req.body.resume);
    } catch (err) {
        console.log('file name: provider-handler.ts')
        console.log(err);
        next(err);
    }
}

export {
    providerRegistrationHandler,
    providerEditHandler,
    fetchProvidersHandler,
    getSeekerResume,
};
