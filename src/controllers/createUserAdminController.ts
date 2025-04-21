import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { resolve } from 'path';

import createrUserAdminService from '../services/admin/createUserAdminService';

export default async function createUserAdmin(req: Request, res: Response){
    if(!existsSync(resolve(__dirname, '..', '..', 'config.json'))){
        res.status(307).json({ 'redirect': '/instalacao/config' });
        return;
    }

    const { name, email, password } = req.body;

    if(!name){
        res.status(400).json({ 'erro': 'Falta o nome'});
    }
    else if(!email){
        res.status(400).json({ 'erro': 'Falta o email'});
    }
    else if(!password){
        res.status(400).json({ 'erro': 'Falta a senha'});
    }

    await createrUserAdminService(name, email, password);

    res.status(307).json({ 'redirect': '/confirmacao' });
    setTimeout( () => process.exit(0), 5000);
    return;
}