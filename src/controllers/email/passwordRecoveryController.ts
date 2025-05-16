import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import passwordRecoveryService from '../../services/email/passwordRecoveryService';

export default async function passwordRecoveryController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'error': errors.errors[0].msg });
    }

    const serviceReturn: string = await passwordRecoveryService(req.body.email);

    if(serviceReturn === 'Esse email não está cadastrado'){
        res.status(400).json({ 'error': serviceReturn });
        return;
    }


    res.status(200).json({ 'ok': serviceReturn });
    return;
}