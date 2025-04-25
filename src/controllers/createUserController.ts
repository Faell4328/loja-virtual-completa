import { Request, Response } from 'express';

import createUserService from '../services/user/createUserService';

export default async function registrerUserController(req: Request, res: Response){

    if(req.body === undefined){
        res.status(400).json({ 'erro': 'Não foi enviado formulário'});
        return;
    }
    else if(!req.body.name){
        res.status(400).json({ 'erro': 'Falta o nome'});
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
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

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
}