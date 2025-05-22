import { Request, Response } from 'express';
import listUsersService from '../../services/admin/listUsersService';
import sendResponse from '../controllerSendPattern';

export default async function listUsersController(req: Request, res: Response){
    const users = await listUsersService();

    if(users == null){
        sendResponse(res, null, 'Não foi possível listar os usuários', null, null)
        return
    }

    sendResponse(res, null, null, null, users);
    return;
}