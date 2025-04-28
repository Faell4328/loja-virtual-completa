import { Request, Response } from 'express';

import loginService from '../services/system/loginService';
import { validationResult } from 'express-validator';

export default async function loginController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'erro': errors.errors[0].msg });
    }

    const { email, password } = req.body
    
    const retorno: boolean|string = await loginService(email, password);
    if(retorno === false){
        res.status(400).json({ 'erro': 'Email ou senha incorreto' });
        return;
    }
    else if(retorno === true){
        res.status(200).json({ 'ok': 'Login realizado' })
        return;
    }
    else{
        res.status(307).json({ 'redirect': '/confirmacao' });
        return;
    }
}