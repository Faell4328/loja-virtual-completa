import { Request, Response } from 'express';

import createUserService from '../../services/user/createUserService';
import { validationResult } from 'express-validator';

export default async function registrerUserController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'erro': errors.errors[0].msg });
    }

    const { name, email, password } = req.body;

    let retorno: boolean|string = await createUserService(name, email, password);
    if(retorno === true){
        res.status(200).json({ 'ok': 'Usuário cadastrado' });
        return;
    }
    else{
        res.status(400).json({ 'erro': retorno});
        return;
    }
}