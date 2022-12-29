import Provider from "../models/provider";
import { Types } from "mongoose";

type ProviderDetails = {
    mobileNum: string,
    website: string,
    description: string,
    address: string,
}

const newProviderRegister = async (userId: Types.ObjectId, details: ProviderDetails) => {
    const { description, website } = details;

    const { _doc: provider } = await Provider.create({
        userId,
        description,
        website
    });

    return provider;
};

const findProviderByUserId = async (userId: Types.ObjectId) => {
    const details = await Provider.findOne({ userId });
    const provider = details?._doc;
    return provider;
};

const updateProviderByUserId = async (userId: Types.ObjectId, details: ProviderDetails) => {
    const { description, website } = details;

    const { _doc: updatedProvider } = await Provider.findOneAndUpdate({
        userId
    },
    {
        description,
        website,
        updatedAt: Date.now(),
    },
    {
        upsert: false,
        runValidators: true,
        new: true
    });

    return updatedProvider;
};

const deleteProviderByUserId = async (userId: Types.ObjectId) => {
    const { _doc: deletedProvider } = await Provider.findOneAndDelete({ userId });
    return deletedProvider;
};

export {
    newProviderRegister,
    findProviderByUserId,
    updateProviderByUserId,
    deleteProviderByUserId,
};
