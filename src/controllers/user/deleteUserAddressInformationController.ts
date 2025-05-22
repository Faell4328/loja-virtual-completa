import { Request, Response } from 'express';

import deleteUserAddressInformationService from '../../services/user/deleteUserAddressInformationService';
import sendResponse from '../controllerSendPattern';

export default async function deleteUserAddressInformationController(req: Request, res: Response){
    const statusAddress = await deleteUserAddressInformationService(req.userId);
    if(statusAddress == false){
        sendResponse(res, null, 'Você não possui endereço cadastrado', null, null);
        return;
    }

    sendResponse(res, null, null, 'Endereço deletado', null);
    return;
}