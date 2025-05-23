import { Request, Response } from 'express';

import createUserService from '../../services/system/registerService';
import { validationResult } from 'express-validator';
import serverSendingPattern from '../serverSendingPattern';

export default async function registrerUserController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        serverSendingPattern(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { name, email, phone, password } = req.body;

    let retorno: boolean|string = await createUserService(name, email, phone, password);
    if(retorno === true){
        serverSendingPattern(res, '/confirmacao', null, 'Usuário cadastrado', null);
        return;
    }
    else{
        serverSendingPattern(res, null, retorno, null, null);
        return;
    }
}