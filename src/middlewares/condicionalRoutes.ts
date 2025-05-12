import { Request, Response, NextFunction } from 'express';
import { statusSystem } from '../server';

export function regularlCondicionalRoutes(req: Request, res: Response, next: NextFunction){
    if(statusSystem < 2){
        if(statusSystem == 1){
            res.status(307).json({ 'redirect': '/instalacao/admin' });
            return;
        }
        else{
            res.status(307).json({ 'redirect': '/instalacao/config' });
            return;
        }
    }
    next();
}

export function conditionalInstalationRoutes(req: Request, res: Response, next: NextFunction){
    if(statusSystem >= 2){
        res.status(404).json({"error": "not found"});
        return;
    }
    next();
}