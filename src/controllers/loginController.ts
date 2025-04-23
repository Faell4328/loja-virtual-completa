import { Request, Response } from 'express';

import loginService from '../services/system/loginService';

export default async function loginController(req: Request, res: Response){

    if(req.body === undefined){
        res.status(400).json({ 'erro': 'Não foi enviado formulário'});
        return;
    }
    else if(!req.body.email){
        res.status(400).json({ 'erro': 'Falta o email'});
        return;
    }
    else if(!req.body.password){
        res.status(400).json({ 'erro': 'Falta a senha'});
        return;
    }
    else{
        const { email, password } = req.body;
        
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
}