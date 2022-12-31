import { Request, Response, NextFunction } from "express";

import Skill from "../models/skill";

const getSkillsHandler = async (req: any, res: Response, next: NextFunction) => {
    try {
        const skills = await Skill.find({}, { __v: 0 }, { sort: { category: 1 } });
        return res.json(skills);
    } catch (err) {
        console.log('file name: skill-handler.ts')
        console.log(err);
        next(err);
    }
}

export { getSkillsHandler };