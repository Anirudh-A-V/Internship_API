import { Request, Response, NextFunction } from "express";

import Skill from "../models/skill.js";
import logger from "../middleware/winston.js";

const getSkillsHandler = async (req: any, res: Response, next: NextFunction) => {
    try {
        const skills = await Skill.find({}, { __v: 0 }, { sort: { category: 1 } });
        return res.json(skills);
    } catch (error: any) {
        logger.error(error);
        next(error);
    }
}

export { getSkillsHandler };