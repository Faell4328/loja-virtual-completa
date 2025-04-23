import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';

export default async function isLogged(req: Request, res: Response, next: NextFunction){
    let user = await DatabaseManager.validateToken(req.headers['token'] as string);

    if(!user){
        res.status(307).json({ 'redirect': '/' });
        return;
    }

    const { loginToken, loginTokenExpirationDate, role } = user;

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        res.status(307).json({ 'redirect': '/' });
        return;
    }

    next();
    return;
}