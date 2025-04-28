import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';

export default async function isAdmin(req: Request, res: Response, next: NextFunction){
    if(req.headers['token'] === undefined){
        res.send('Não autorizado');
        return;
    }

    let user = await DatabaseManager.validateToken(req.headers['token'] as string);

    if(!user){
        res.send('Não autorizado');
        return;
    }

    const { loginTokenExpirationDate, role } = user;

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        res.send('Token vencido, faça login');
        return;
    }
    else if(role !== 'ADMIN'){
        res.send('Você não tem permissão');
        return;
    }

    next();
    return;
}