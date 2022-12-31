import { Request, Response, NextFunction } from 'express';

const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    // create a generic error response object
    const errorResponse = { message: (err && err.message) || 'Something went wrong! Please try again.' };

    return res.status(500).json(errorResponse);
};

export default defaultErrorHandler;