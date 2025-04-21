import { Request, Response } from 'express';

import loginService from '../services/system/loginService';

export default async function loginController(req: Request, res: Response){
    const { email, password } = req.body;

    if(!email){
        res.status(400).json({ 'erro': 'Falta o email'});
    }
    else if(!password){
        res.status(400).json({ 'erro': 'Falta o password'});
    }
    else{
        const retorno: boolean = await loginService(email, password);
        if(!retorno){
            res.status(400).json({ 'erro': 'Email ou senha incorreto' });
            return;
        }
        
        res.send('Logado');
        return;
    }
}