import { Request, Response } from 'express';
import { unlink } from 'fs';
import { resolve } from 'path';
import { validationResult } from 'express-validator';

import configureSystemService from '../../services/system/configureSystemService';
import { setStatus, statusSystem } from '../../server';

export default async function configureSystemController(req: Request, res: Response){

    if(statusSystem >= 1){
        res.status(307).json({ 'redirect': '/instalacao/admin' });
        return;
    }

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        if(errors.errors[0].msg === 'Falta o nome' && req.file !== undefined){
            unlink(resolve(req.file.path), (err) => {
                if(err) console.log('erro')
            })
        }
        return res.status(400).json({ 'erro': errors.errors[0].msg });
    }

    const name = req.body.name;
    const file = req.file;

    if(file === undefined){
        return res.status(400).json({ 'erro': 'Falta o arquivo' });
    }

    setStatus(1);
    configureSystemService(name, file);

    res.status(307).json({ 'redirect': '/instalacao/admin' });
    return;
}