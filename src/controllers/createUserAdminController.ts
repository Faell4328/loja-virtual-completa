import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { resolve } from 'path';

import createrUserAdminService from '../services/admin/createUserAdminService';

export default async function createUserAdminController(req: Request, res: Response){
    if(!existsSync(resolve(__dirname, '..', '..', 'config.json'))){
        res.status(307).json({ 'redirect': '/instalacao/config' });
        return;
    }

    if(req.body == undefined){
        res.status(400).json({ 'erro': 'Não foi enviado nada na requisição' });
        return;
    }

    if(req.body.name === undefined){
        res.status(400).json({ 'erro': 'Falta o nome'});
        return
    }
    else if(req.body.email === undefined){
        res.status(400).json({ 'erro': 'Falta o email'});
        return;
    }
    else if(req.body.password === undefined){
        res.status(400).json({ 'erro': 'Falta a senha'});
        return;
    }
    
    const { name, email, password } = req.body;

    await createrUserAdminService(name, email, password);

    res.status(307).json({ 'redirect': '/confirmacao' });
    setTimeout( () => process.exit(0), 5000);
    return;
}