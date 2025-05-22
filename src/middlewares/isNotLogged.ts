import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';
import sendResponse from '../controllers/controllerSendPattern';

export default async function isNotLogged(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined || req.cookies['token'].length != 128){
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

    sendResponse(res, '/', 'Essa rota é apenas para pessoas não logadas', null, null)
    return;
}