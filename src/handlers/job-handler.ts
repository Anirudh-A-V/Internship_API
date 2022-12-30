import { NextFunction, Request, Response } from 'express';
import Job from '../models/jobs';
import { applyJob, createJob, fetchApplicantDetailsService, findRecentJobs, getAppliedJobs, hireApplicantService, selectApplicantService } from '../services/job-services.js';
import { findProviderByUserId } from '../services/provider-services.js';
import { findSeekerByUserId } from '../services/seeker-services.js';
import { getFullUserById } from '../services/user-services.js';

const createJobHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;
        const provider = await findProviderByUserId(userId);

        if (provider === null) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        const newJob = await createJob(provider._id, req.body);
    } catch (err) {
        console.log('file name: job-handler.ts')
        console.log(err);
        return next(err);
    }
};

const applyJobHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;
        const seeker = await findSeekerByUserId(userId);

        if (seeker === null) {
            return res.status(404).json({ message: 'Seeker not found' });
        }

        const job = await applyJob(seeker._id, req.body.jobId);
    } catch (err) {
        console.log('file name: job-handler.ts')
        console.log(err);
        return next(err);
    }
}

const providedJobsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;
        const provider = await findProviderByUserId(userId);

        const jobs = await Job.find({ providerId: provider._id });

        return res.json(jobs);
    } catch (err) {
        console.log('file name: job-handler.ts')
        console.log(err);
        return next(err);
    }
}

const appliedJobsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;
        const seeker = await findSeekerByUserId(userId);

        const jobs = await getAppliedJobs(seeker._id);

        return res.json(jobs);
    } catch (err) {
        console.log('file name: job-handler.ts')
        console.log(err);
        return next(err);
    }
}

const recentJobsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobs = await findRecentJobs();

        return res.json(jobs);
    } catch (err) {
        console.log('file name: job-handler.ts')
        console.log(err);
        return next(err);
    }
}

const selectApplicantHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seekerId, jobId } = req.body;
        const updatedJob = await selectApplicantService(seekerId, jobId);
        return res.json(updatedJob);
    } catch (err) {
        console.log('file name: job-handler.ts')
        console.log(err);
        return next(err);
    }
}

const hireApplicantHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seekerId, jobId } = req.body;
        const updatedJob = await hireApplicantService(seekerId, jobId);
        return res.json(updatedJob);
    } catch (err) {
        console.log('file name: job-handler.ts')
        console.log(err);
        return next(err);
    }
}

const fetchApplicantDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appliedUsers = req.body;
        const userDetails = await fetchApplicantDetailsService(appliedUsers);

        return res.json(userDetails);
    } catch (err) {
        console.log('file name: job-handler.ts')
        console.log(err);
        return next(err);
    }
}

export {
    createJobHandler,
    applyJobHandler,
    providedJobsHandler,
    appliedJobsHandler,
    recentJobsHandler,
    selectApplicantHandler,
    hireApplicantHandler,
    fetchApplicantDetailsHandler
}

