import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';

export default async function isNotLogged(req: Request, res: Response, next: NextFunction){

    if(req.cookies['token'] === undefined){
        next();
        return;
    }

    let user = await DatabaseManager.validateLoginToken(req.cookies['token']);

    if(!user){
        next();
        return;
    }

    const { loginTokenExpirationDate } = user;

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        next();
        return;
    }

    res.status(307).json({ 'redirect': '/' });
    return;
}