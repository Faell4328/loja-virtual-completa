import { Request, Response } from 'express';

import loginService from '../services/system/loginService';

export default async function loginController(req: Request, res: Response){
    const { email, password } = req.body;

    if(!email){
        res.status(400).json({ 'erro': 'Falta o email'});
    }
    else if(!password){
        res.status(400).json({ 'erro': 'Falta a senha'});
    }
    else{
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
        
        return;
    }
}