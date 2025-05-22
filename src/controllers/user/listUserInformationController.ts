import { Request, Response } from 'express';

import listUserInformationService from '../../services/user/listUserInformationService';
import sendResponse from '../controllerSendPattern';

export default async function listUserInformationController(req: Request, res: Response){
    const userInformation = await listUserInformationService(req.userId);

    if(userInformation == null){
        sendResponse(res, null, 'Problema ao listar', null, null);
        return;
    }

    sendResponse(res, null, null, null, userInformation);
    return;
}