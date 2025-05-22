import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import passwordConfirmationService from '../../services/email/passwordConfirmationService';
import sendResponse from '../controllerSendPattern';

export default async function passwordConfirmationController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        sendResponse(res, null, errors.errors[0].msg, null, null);
        return
    }

    const { password1, password2 } = req.body;

    if(password1 != password2){
        sendResponse(res, null, 'As senhas estão diferentes', null, null);
        return;
    }

    const serviceReturn = await passwordConfirmationService(req.params.hash, password1);

    if(serviceReturn == 'Token expirado, foi enviado para seu email um novo link'){
        sendResponse(res, null, serviceReturn, null, null);
        return;
    }

    sendResponse(res, null, null, serviceReturn, null);
    return;
}