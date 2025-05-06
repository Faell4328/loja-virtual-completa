import { Request, Response } from 'express';

import checkEmailService from '../../services/email/checkEmailService';
import Cookie from '../../services/cookie';

interface serviceReturnProps{
    status: string;
    token: string | null;
    expiration: Date | null
}

export default async function emailConfirmationController(req: Request, res: Response){
    const serviceReturn:string | serviceReturnProps = await checkEmailService(req.params.hash);

    if(typeof(serviceReturn) === 'string'){
        res.send(serviceReturn);
        return;
    }

    // !!Add function for log record, this is error!!
    if(serviceReturn.token == null || serviceReturn.expiration == null){
        res.send(serviceReturn.status);
        return;
    }

    Cookie.setCookie(res, serviceReturn.token, serviceReturn.expiration);
    res.send(serviceReturn.status);
    return;
}