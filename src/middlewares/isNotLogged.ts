import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';

export default async function isNotLogged(req: Request, res: Response, next: NextFunction){
    if(req.headers['token'] === undefined){
        next();
        return;
    }

    let user = await DatabaseManager.validateToken(req.headers['token'] as string);

    if(user.length === 0){
        next();
        return
    }

    const { loginToken, loginTokenExpirationDate, role } = user[0];

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        next();
        return
    }

    res.status(307).json({ 'redirect': '/' });
    console.log(user[0])
    return;
}