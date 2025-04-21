import { Request, Response } from 'express';

import createUserService from '../services/user/createUserService';

export default async function registrerUserController(req: Request, res: Response){

    const { name, email, password} = req.body;

    if(!name){
        res.status(400).json({ 'erro': 'Falta o nome'});
    }
    else if(!email){
        res.status(400).json({ 'erro': 'Falta o email'});
    }
    else if(!password){
        res.status(400).json({ 'erro': 'Falta o password'});
    }
    else{
        let retorno: boolean|string = await createUserService(name, email, password);
        if(retorno === true){
            res.status(200).json({ 'ok': 'Usuário cadastrado' });
        }
        else{
            res.status(500).json({ 'erro': retorno});
        }
    }
}