import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';

export default async function isLogged(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined){
        res.send('Não autorizado');
        return;
    }

    let user = await DatabaseManager.validateToken(req.cookies['token']);

    if(!user){
        res.status(307).json({ 'redirect': '/' });
        return;
    }

    const { loginTokenExpirationDate } = user;

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        res.status(307).json({ 'redirect': '/' });
        return;
    }

    next();
    return;
}