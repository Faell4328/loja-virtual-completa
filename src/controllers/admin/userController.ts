import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import createrUserAdminService from '../../services/installation/createUserAdminService';
import { setStatus, statusSystem } from '../../tools/status';
import serverSendingPattern from '../serverSendingPattern';
import { listSpecificUserService, listUsersService } from '../../services/admin/userService';

export async function createUserAdminController(req: Request, res: Response){

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

export async function listSpecificUserController(req: Request, res: Response){
    let user;

    if(req.params.id && (req.params.id).length > 10){
        user = await listSpecificUserService(req.params.id);
    }

    if(!user){
        serverSendingPattern(res, null, 'Usuário não encontrado', null, null);
        return;
    }
    
    serverSendingPattern(res, null, null, null, user);
    return;
}

export async function listUsersController(req: Request, res: Response){
    const users = await listUsersService();

    if(users == null){
        serverSendingPattern(res, null, 'Não foi possível listar os usuários', null, null)
        return
    }

    serverSendingPattern(res, null, null, null, users);
    return;
}