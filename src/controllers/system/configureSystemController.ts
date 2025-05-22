import { Request, Response } from 'express';
import { unlink } from 'fs';
import { resolve } from 'path';
import { validationResult } from 'express-validator';

import configureSystemService from '../../services/system/configureSystemService';
import { setStatus, statusSystem } from '../../tools/status';
import sendResponse from '../controllerSendPattern';

export default async function configureSystemController(req: Request, res: Response){

    if(statusSystem >= 1){
        sendResponse(res, '/instalacao/admin', 'Você já adicionou informações sobre sua loja, você poderá altera-las depois', null, null)
        return;
    }

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        if(errors.errors[0].msg === 'Falta o nome' && req.file !== undefined){
            unlink(resolve(req.file.path), (err) => {
                if(err) console.log('error')
            })
        }
        sendResponse(res, null, errors.errors[0].msg, null, null)
        return;
    }

    const name = req.body.name;
    const file = req.file;

    if(file === undefined){
        sendResponse(res, null, 'Falta o arquivo', null, null);
        return;
    }

    setStatus(1);
    configureSystemService(name, file);

    sendResponse(res, '/instalacao/admin', null, 'Sistema configurado com sucesso', null);
    return;
}