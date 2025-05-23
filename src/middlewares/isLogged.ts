import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/system/databaseManagerService';
import serverSendingPattern from '../controllers/serverSendingPattern';

export default async function isLogged(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined || req.cookies['token'].length != 128){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    let user = await DatabaseManager.validateLoginToken(req.cookies['token']);

    if(!user){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    const { loginTokenExpirationDate } = user;

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        serverSendingPattern(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    req.userId = user.id;

    next();
    return;
}