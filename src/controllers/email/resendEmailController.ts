import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import resendEmailService from '../../services/email/resendEmailService';
import sendResponse from '../controllerSendPattern';

export default async function resendEmailController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        sendResponse(res, null, errors.errors[0].msg, null, null);
        return
    }

    const serviceReturn: string = await resendEmailService(req.body.email);

    if(serviceReturn === 'Esse email não está cadastrado' || serviceReturn == 'Email já validado'){
        sendResponse(res, null, serviceReturn, null, null);
        return
    }


    sendResponse(res, null, null, serviceReturn, null);
    return;
}