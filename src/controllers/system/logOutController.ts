import { Request, Response } from 'express';

import serverSendingPattern from '../serverSendingPattern';
import logOutService from '../../services/system/logOutService';

export default function logOutController(req: Request, res: Response){
    if(req.userId != undefined && req.userId != null){
        const returnService = logOutService(req.userId);
        if(returnService == 'ok'){
            serverSendingPattern(res, null, null, 'Deslogado com sucesso', null);
        }
        else{
            serverSendingPattern(res, null, 'Você não está logado', null, null);
        }
    }    
    else{
        serverSendingPattern(res, null, 'Você não está logado', null, null);
    }
    return;
}