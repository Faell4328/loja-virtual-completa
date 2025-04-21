import { Request, Response, NextFunction } from 'express';

import DatabaseManager from '../services/databaseManagerService';

export default async function isAdmin(req: Request, res: Response, next: NextFunction){
    let user = await DatabaseManager.validateToken(req.headers['token'] as string);

    if(user.length == 0){
        res.send('Não autorizado');
        return;
    }

    const { loginToken, loginTokenExpirationDate, role } = user[0];

    if(loginTokenExpirationDate === null || loginTokenExpirationDate < new Date()){
        res.send('Token vencido, faça login');
    }
    else if(role !== 'ADMIN'){
        res.send('Você não tem permissão');
    }

    res.send('Liberado');
    console.log(user[0])
    return;
}