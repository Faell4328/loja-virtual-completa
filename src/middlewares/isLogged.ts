import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';

export default async function isLogged(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined || req.cookies['token'].length != 128){
        res.status(307).json({ 'redirect': '/login' });
        return;
    }

    let user = await DatabaseManager.validateLoginToken(req.cookies['token']);

    if(!user){
        res.status(307).json({ 'redirect': '/login' });
        return;
    }

    const { loginTokenExpirationDate } = user;

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        res.status(307).json({ 'redirect': '/login' });
        return;
    }

    req.userId = user.id;

    next();
    return;
}