import { Request, Response, NextFunction } from "express";

import Stats from "../models/stats.js";
import logger from "../middleware/winston.js";

const neutralHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const statData = await Stats.find();
        let totalRecruits = 0;
        statData.map((stat) => {
          totalRecruits += stat.recruits;
          return null;
        });
        statData.sort((a, b) => ((a.recruits > b.recruits) ? -1 : 1));
        return res.json({ totalRecruits, statData });
    } catch (err: any) {
        logger.error(err);
        next(err);
    }
}

export { neutralHandler };