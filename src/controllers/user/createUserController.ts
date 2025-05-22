import { Request, Response } from 'express';

import createUserService from '../../services/user/createUserService';
import { validationResult } from 'express-validator';
import sendResponse from '../controllerSendPattern';

export default async function registrerUserController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        sendResponse(res, null, errors.errors[0].msg, null, null);
        return;
    }

    const { name, email, phone, password } = req.body;

    let retorno: boolean|string = await createUserService(name, email, phone, password);
    if(retorno === true){
        sendResponse(res, '/confirmacao', null, 'Usuário cadastrado', null);
        return;
    }
    else{
        sendResponse(res, null, retorno, null, null);
        return;
    }
}