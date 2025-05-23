import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import createrUserAdminService from '../../services/installation/createUserAdminService';
import { setStatus, statusSystem } from '../../tools/status';
import serverSendingPattern from '../serverSendingPattern';

export default async function createUserAdminController(req: Request, res: Response){

    if(statusSystem < 1){
        serverSendingPattern(res, '/instalacao/config', 'Faça a configuração do sistema primeiro', null, null);
        return;
    }

    const errors:any = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ 'error': errors.errors[0].msg });
    }

    const { name, email, phone, password } = req.body;
    
    setStatus(2);
    await createrUserAdminService(name, email, phone, password);

    serverSendingPattern(res, '/confirmacao', null, 'Usuário administrador criado', null)
    return;
}