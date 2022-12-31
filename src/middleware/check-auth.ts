import { Request, Response, NextFunction } from 'express';

const checkAuthentication = (req: Request, res: Response, next: NextFunction) => {
    // req.isAuthenticated() will return true if user is logged in
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        error: true,
        reason: 'You are not authorized to make this request',
      });
    }
    return next();
  };
  
  export default checkAuthentication;
  