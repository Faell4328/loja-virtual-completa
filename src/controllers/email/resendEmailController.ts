import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import resendEmailService from '../../services/email/resendEmailService';

export default async function resendEmailController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'erro': errors.errors[0].msg });
    }

    const serviceReturn: string = await resendEmailService(req.body.email);

    if(serviceReturn === 'Esse email não está cadastrado' || serviceReturn == 'Email já validado'){
        res.status(400).json({ 'erro': serviceReturn });
        return;
    }


    res.status(200).json({ 'ok': serviceReturn });
    return;
}