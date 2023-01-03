import { NextFunction, Request, Response } from 'express';
import Job from '../models/jobs.js';
import { applyJob, createJob, fetchApplicantDetailsService, findRecentJobs, getAppliedJobs, hireApplicantService, selectApplicantService } from '../services/job-services.js';
import { findProviderByUserId } from '../services/provider-services.js';
import { findSeekerByUserId } from '../services/seeker-services.js';
import { getFullUserById } from '../services/user-services.js';
import logger from '../middleware/winston.js';

const createJobHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;
        const provider = await findProviderByUserId(userId);

        const newJob = await createJob(provider._id, req.body);
        return res.json(newJob);
    } catch (err) {
        logger.error(err);
        return next(err);
    }
};

const applyJobHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;
        await applyJob(userId, req.body.jobId);
        const updatedSeeker = await getFullUserById(req.user);

        return res.json(updatedSeeker);
    } catch (err: any) {
        logger.error(err);
        return next(err);
    }
}

const providedJobsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;
        const provider = await findProviderByUserId(userId);

        const jobs = await Job.find({ providerId: provider._id });

        return res.json(jobs);
    } catch (err: any) {
        logger.error(err);
        return next(err);
    }
}

const appliedJobsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body._id;
        const seeker = await findSeekerByUserId(userId);

        const jobs = await getAppliedJobs(seeker._id);

        return res.json(jobs);
    } catch (err: any) {
        logger.error(err);
        return next(err);
    }
}

const recentJobsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobs = await findRecentJobs();

        return res.json(jobs);
    } catch (err: any) {
        logger.error(err);
        return next(err);
    }
}

const selectApplicantHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seekerId, jobId } = req.body;
        const updatedJob = await selectApplicantService(seekerId, jobId);
        return res.json(updatedJob);
    } catch (err: any) {
        logger.error(err);
        return next(err);
    }
}

const hireApplicantHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seekerId, jobId } = req.body;
        const updatedJob = await hireApplicantService(seekerId, jobId);
        return res.json(updatedJob);
    } catch (err: any) {
        logger.error(err);
        return next(err);
    }
}

const fetchApplicantDetailsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const appliedUsers = req.body;
        const userDetails = await fetchApplicantDetailsService(appliedUsers);

        return res.json(userDetails);
    } catch (err: any) {
        logger.error(err);
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

