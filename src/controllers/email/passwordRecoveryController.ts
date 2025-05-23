import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import passwordRecoveryService from '../../services/email/passwordRecoveryService';
import serverSendingPattern from '../serverSendingPattern';
import passwordConfirmationService from '../../services/email/passwordConfirmationService';

export async function passwordRecoveryController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const serviceReturn: string = await passwordRecoveryService(req.body.email);

    if(serviceReturn === 'Esse email não está cadastrado'){
        serverSendingPattern(res, null, serviceReturn, null, null);
        return;
    }

    serverSendingPattern(res, null, null, serviceReturn, null);
    return;
}

export async function passwordRecoveryConfirmationController(req: Request, res: Response){
    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return
    }

    const { password1, password2 } = req.body;

    if(password1 != password2){
        serverSendingPattern(res, null, 'As senhas estão diferentes', null, null);
        return;
    }

    const serviceReturn = await passwordConfirmationService(req.params.hash, password1);

    if(serviceReturn == 'Token expirado, foi enviado para seu email um novo link'){
        serverSendingPattern(res, null, serviceReturn, null, null);
        return;
    }

    serverSendingPattern(res, null, null, serviceReturn, null);
    return;
}