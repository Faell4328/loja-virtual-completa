import { Request, Response } from 'express';

import loginService from '../services/system/loginService';
import { validationResult } from 'express-validator';

interface serviceReturnProps{
    status: boolean;
    token: string | null;
    expiration: Date | null
}

export default async function loginController(req: Request, res: Response){

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'erro': errors.errors[0].msg });
    }

    const { email, password } = req.body
    
    const serviceReturn: boolean|string|serviceReturnProps = await loginService(email, password);

    if(serviceReturn === false){
        res.status(400).json({ 'erro': 'Email ou senha incorreto' });
        return;
    }
    else if(typeof(serviceReturn) == 'object'){

        // !!Add function for log record, this is error!!
        if(serviceReturn.token == null || serviceReturn.expiration == null){
            res.status(200).json({ 'ok': 'Login realizado' });
            return;
        }

        res.cookie('token', serviceReturn.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: serviceReturn.expiration
        })

        res.status(200).json({ 'ok': 'Login realizado' });
        return;
    }
    else{
        res.status(307).json({ 'redirect': '/confirmacao' });
        return;
    }
}