import { Interface } from "readline";
import Seeker from "../models/seeker";
import { Types } from "mongoose";
import { type } from "os";

type SeekerDetails = {
    skills: string[],
    dob: Date,
    mobileNum: string,
}



const newSeeekerRegister = async (userId: Types.ObjectId, details: SeekerDetails) => {
    const skills = details.skills;

    const { _doc: seeker } = await Seeker.create({
        userId,
        skills
    });

    return seeker;
};

const findSeekerByUserId = async (userId: Types.ObjectId) => {
    const details = await Seeker.findOne({ userId });

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
    });

    return updatedSeeker;
};

const deleteSeekerByUserId = async (userId: Types.ObjectId) => {
    const { _doc: deletedSeeker } = await Seeker.findOneAndDelete({ userId });

    return deletedSeeker;
};

export default {
    newSeeekerRegister,
    findSeekerByUserId,
    updateSeekerByUserId,
    deleteSeekerByUserId,
};
