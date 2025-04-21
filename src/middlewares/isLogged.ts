import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';

export default async function isLogged(req: Request, res: Response, next: NextFunction){
    let user = await DatabaseManager.validateToken(req.headers['token'] as string);

    if(user.length == 0){
        res.status(307).json({ 'redirect': '/' });
        return;
    }

    const { loginToken, loginTokenExpirationDate, role } = user[0];

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        res.status(307).json({ 'redirect': '/' });
    }

    next();
    return;
}