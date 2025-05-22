import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import passwordRecoveryService from '../../services/email/passwordRecoveryService';
import sendResponse from '../controllerSendPattern';

export default async function passwordRecoveryController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        sendResponse(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const serviceReturn: string = await passwordRecoveryService(req.body.email);

    if(serviceReturn === 'Esse email não está cadastrado'){
        sendResponse(res, null, serviceReturn, null, null);
        return;
    }

    sendResponse(res, null, null, serviceReturn, null);
    return;
}