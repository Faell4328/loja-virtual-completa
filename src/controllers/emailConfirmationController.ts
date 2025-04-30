import { Request, Response } from 'express';

import checkEmailService from '../services/email/checkEmailService';

export default async function emailConfirmationController(req: Request, res: Response){
    const serviceReturn = await checkEmailService(req.params.hash);

    if(typeof(serviceReturn) === 'string'){
        res.send(serviceReturn);
        return;
    }

    // !!Add function for log record, this is error!!
    if(serviceReturn.token == null || serviceReturn.expiration == null){
        res.send(serviceReturn.status);
        return;
    }

    res.cookie('token', serviceReturn.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: serviceReturn.expiration as Date
    });

    res.send(serviceReturn.status);
    return;
}