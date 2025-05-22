import { Request, Response } from 'express';

import listSpecificUserService from '../../services/admin/listSpecificUserService';
import sendResponse from '../controllerSendPattern';

export default async function listSpecificUserController(req: Request, res: Response){
    let user;

    if(req.params.id && (req.params.id).length > 10){
        user = await listSpecificUserService(req.params.id);
    }

    if(!user){
        sendResponse(res, null, 'Usuário não encontrado', null, null);
        return;
    }
    
    sendResponse(res, null, null, null, user);
    return;
}