import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { validationResult } from 'express-validator';

import createrUserAdminService from '../services/admin/createUserAdminService';

export default async function createUserAdminController(req: Request, res: Response){

    if(!existsSync(resolve(__dirname, '..', '..', 'config.json'))){
        res.status(307).json({ 'redirect': '/instalacao/config' });
        return;
    }

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'erro': errors.errors[0].msg });
    }

    const { name, email, password } = req.body;
    
    await createrUserAdminService(name, email, password);

    res.status(307).json({ 'redirect': '/confirmacao' });
    //setTimeout( () => process.exit(0), 5000);
    return;
}