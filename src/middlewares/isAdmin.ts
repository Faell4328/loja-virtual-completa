import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';
import sendResponse from '../controllers/controllerSendPattern';

export default async function isAdmin(req: Request, res: Response, next: NextFunction){
    if(req.cookies['token'] === undefined || req.cookies['token'].length != 128){
        sendResponse(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    let user = await DatabaseManager.validateLoginToken(req.cookies['token'] as string);

    if(!user){
        sendResponse(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }

    const { loginTokenExpirationDate, role } = user;

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        sendResponse(res, '/login', 'Faça login antes de acessar', null, null)
        return;
    }
    else if(role !== 'ADMIN'){
        sendResponse(res, '/', 'Você não tem permissão para acessar essa página', null, null)
        return;
    }

    req.userId = user.id;

    next();
    return;
}