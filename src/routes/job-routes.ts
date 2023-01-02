import express from 'express';

import { appliedJobsHandler, applyJobHandler, createJobHandler, fetchApplicantDetailsHandler, hireApplicantHandler, providedJobsHandler, recentJobsHandler, selectApplicantHandler } from '../handlers/job-handler.js';

const router = express.Router();

router.post('/create-job', createJobHandler);
router.post('/apply-job', applyJobHandler);
router.post('/select-applicant', selectApplicantHandler);
router.post('/hire-applicant', hireApplicantHandler);
router.post('/fetch-applicants', fetchApplicantDetailsHandler);
router.get('/jobs-provided', providedJobsHandler);
router.get('/jobs-applied', appliedJobsHandler);
router.get('/recent-jobs', recentJobsHandler);

export default router;