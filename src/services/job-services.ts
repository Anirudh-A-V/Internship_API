import { pick } from 'lodash-es';

import Job from '../models/jobs.js';
import Seeker from '../models/seeker.js';
import User from '../models/user.js';
import Stats from '../models/stats.js';
import Provider from '../models/provider.js';
import { getFullUserById } from './user-services.js';
import { Types } from 'mongoose';

const createJob = async (_id: Types.ObjectId, details: any) => {
    const jobDetails = pick(details, [
        'description',
        'salary',
        'requiredSkills',
        'designation',
        'location',
        'type',
        'experience',
    ]);

    const { _doc: job } = await Job.create({
        ...jobDetails,
        providerId: _id,
    }).catch((err) => {
        console.log('file name: job-services.ts')
        console.log(err);
    });

    return job;
};

const applyJob = async (userId: Types.ObjectId, jobId: Types.ObjectId) => {
    const updatedSeeker = await Seeker.findOneAndUpdate(
        { userId },
        { $push: { jobs: jobId } },
        { upsert: false, runValidators: true, new: true }
    ).catch((err) => {
        console.log('file name: job-services.ts')
        console.log(err);
    });

    await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { applicants: { $each: [`${updatedSeeker._id}`] } } },
        { upsert: false, runValidators: true, new: true }
    ).catch((err) => {
        console.log('file name: job-services.ts')
        console.log(err);
    });

    return updatedSeeker;
};

const getAppliedJobs = async (jobs: string[]) => {
    const appliedJobs = await Promise.all(jobs.map((element) => {
        Job.findById({ _id: element });
    })).catch((err) => {
        console.log('file name: job-services.ts')
        console.log(err);
    });

    return appliedJobs;
};

const findRecentJobs = async () => {
    const recentJobs = await Job.find({}).sort({ _id: -1 }).limit(10)
        .catch((err) => {
            console.log('file name: job-services.ts')
            console.log(err);
        });
    return recentJobs;
};

const selectApplicantService = async (seekerId: Types.ObjectId, jobId: Types.ObjectId) => {
    let updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $pull: { applicants: { $in: [`${seekerId}`] } } },
        { upsert: false, runValidators: true, new: true },
    ).catch((err) => {
        console.log('file name: job-services.ts')
        console.log(err);
    });

    updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { selected: { $each: [`${seekerId}`] } } },
        { upsert: false, runValidators: true, new: true },
    ).catch((err) => {
        console.log('file name: job-services.ts')
        console.log(err);
    });

    return updatedJob;
};

const hireApplicantService = async (seekerId: Types.ObjectId, jobId: Types.ObjectId) => {
    let updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $pull: { selected: { $in: [`${seekerId}`] } } },
        { upsert: false, runValidators: true, new: true },
    ).catch((err) => {
        console.log('file name: job-services.ts')
        console.log(err);
    });

    updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $addToSet: { hired: { $each: [`${seekerId}`] } } },
        { upsert: false, runValidators: true, new: true },
    ).catch((err) => {
        console.log('file name: job-services.ts')
        console.log(err);
    });

    const { providerId } = updatedJob;

    const user = await Provider.findById(providerId);
    const providerDetails = await User.findById({ _id: user.userId });

    await Stats.findOneAndUpdate(
        { providerId: updatedJob.providerId },
        {
            providerId,
            image: providerDetails.image,
            firstName: providerDetails.firstName,
            lastName: providerDetails.lastName,
            $inc: { recruits: 1 },
        },
        { upsert: true, new: true, runValidators: true },
    )
        .catch((err) => {
            console.log('file name: job-services.ts')
            console.log(err);
        });

    return updatedJob;
};

const fetchApplicantDetailsService = async (appliedUsers: any) => {
    const userDetails = await Promise.all(appliedUsers.map(async (users: any) => {
        const seekerDetails = await Seeker.findById(users);
        const user = await User.findById(seekerDetails.userId)
            .catch((err) => {
                console.log('file name: job-services.ts')
                console.log(err);
            });
        return getFullUserById(user);
    })).catch((err) => {
        console.log('file name: job-services.ts')
        console.log(err);
    });

    return userDetails;
};

const searchJobs = async (providerId: Types.ObjectId, skillCode: string) => {
    let jobDetails: void | any[] = [];

    if (providerId && !skillCode) {
        jobDetails = await Job.find({ providerId })
            .catch((err) => {
                console.log('file name: job-services.ts')
                console.log(err);
            });
    } else if (!providerId && skillCode) {
        jobDetails = await Job.find({ requiredSkills: { $in: [skillCode] } })
            .catch((err) => {
                console.log('file name: job-services.ts')
                console.log(err);
            });
    } else {
        const providerMatch = await Job.find({ providerId })
            .catch((err) => {
                console.log('file name: job-services.ts')
                console.log(err);
            });

        providerMatch?.map((job: any) => {
            if (job.requiredSkills.includes(skillCode)) {
                jobDetails?.push(job);
            }
            return null;
        });
    }

    return jobDetails;
};

export {
    createJob,
    applyJob,
    getAppliedJobs,
    findRecentJobs,
    selectApplicantService,
    hireApplicantService,
    fetchApplicantDetailsService,
    searchJobs,
};
