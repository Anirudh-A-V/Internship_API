import Seeker from "../models/seeker.js";
import { Types } from "mongoose";

type SeekerDetails = {
    skills: string[],
    dob: Date,
    mobileNum: string,
}



const newSeekerRegister = async (userId: Types.ObjectId, details: SeekerDetails) => {
    const skills = details.skills;

    const { _doc: seeker } = await Seeker.create({
        userId,
        skills
    })
        .catch((err) => {
            console.log('file name: seeker-services.ts')
            console.log(err);
        });

    return seeker;
};

const findSeekerByUserId = async (userId: Types.ObjectId) => {
    const details = await Seeker.findOne({ userId })
        .catch((err) => {
            console.log('file name: seeker-services.ts')
            console.log(err);
        });

    const seeker = details?._doc;

    return seeker;
};

const updateSeekerByUserId = async (userId: Types.ObjectId, details: SeekerDetails) => {
    const skills = details.skills;

    const { _doc: updatedSeeker } = await Seeker.findOneAndUpdate({
        userId
    },
    {
        skills,
        updatedAt: Date.now(),
    },
    {
        upsert: false,
        runValidators: true,
        new: true
    })
        .catch((err) => {
            console.log('file name: seeker-services.ts')
            console.log(err);
        });

    return updatedSeeker;
};

const deleteSeekerByUserId = async (userId: Types.ObjectId) => {
    const { _doc: deletedSeeker } = await Seeker.findOneAndDelete({ userId })
        .catch((err) => {
            console.log('file name: seeker-services.ts')
            console.log(err);
        });

    return deletedSeeker;
};

export {
    newSeekerRegister,
    findSeekerByUserId,
    updateSeekerByUserId,
    deleteSeekerByUserId,
};
