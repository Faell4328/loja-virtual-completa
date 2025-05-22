import { Request, Response } from 'express';

import checkEmailService from '../../services/email/checkEmailService';
import Cookie from '../../services/cookie';
import sendResponse from '../controllerSendPattern';

interface serviceReturnProps{
    status: string;
    token: string | null;
    expiration: Date | null
}

export default async function emailConfirmationController(req: Request, res: Response){
    const serviceReturn:string | serviceReturnProps = await checkEmailService(req.params.hash);

    if(typeof(serviceReturn) === 'string'){
        sendResponse(res, null, serviceReturn, null, null);
        return;
    }

    // !!Add function for log record, this is error!!
    if(serviceReturn.token == null || serviceReturn.expiration == null){
        sendResponse(res, null, serviceReturn.status, null, null);
        return;
    }

    Cookie.setCookie(res, serviceReturn.token, serviceReturn.expiration);
    sendResponse(res, '/', null, serviceReturn.status, null);
    return;
}