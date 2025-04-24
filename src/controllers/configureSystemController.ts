import { Request, Response } from 'express';
import { unlink } from 'fs';
import { resolve } from 'path';

import configureSystemService from '../services/system/configureSystemService';
import sanitize from '../security/sanitizeHTML';

export default async function configureSystemController(req: Request, res: Response){

    if(req.body === undefined){
        res.status(400).json({ 'erro': 'Não foi enviado nada na requisição' });
        return;
    }

    if(req.file === undefined){
        res.status(400).json({ 'erro': 'Falta o arquivo' });
        return;
    }
    else if(!req.body.name){
        unlink(resolve(req.file.path), (err) => {
            if(err) console.log('erro')
        })
        res.status(400).json({ 'erro': 'Falta o nome' });
        return;
    }

    const name = sanitize(req.body.name);
    const file = req.file;

    const status:boolean = await configureSystemService(name, file);

    if(status){
        res.status(307).json({ 'redirect': '/instalacao/admin' });
        return;
    }
}